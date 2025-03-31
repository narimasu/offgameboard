import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { sanitizeObject } from '@/lib/utils/sanitize';
import { withRateLimit } from '@/app/api/rate-limiter';
import { postFormSchema } from '@/lib/utils/validators';
import { Database } from '@/types/database.types';

// =====================================================
// GET: 投稿一覧を取得
// =====================================================
export const GET = withRateLimit(async (req: NextRequest) => {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies });
    
    // クエリパラメータを取得
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const playType = searchParams.get('play_type');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '10');
    
    // 最大取得件数を制限（DoS対策）
    const safeLimit = Math.min(limit, 50);
    
    // クエリの構築
    let query = supabase
      .from('posts')
      .select(`
        *,
        game:games(*),
        user:users(id, username, avatar_url, trust_score),
        applications_count:applications(count)
      `)
      .order('created_at', { ascending: false })
      .limit(safeLimit);
      
    // フィルター適用
    if (status) {
      query = query.eq('status', status);
    }
    
    if (playType) {
      query = query.eq('play_type', playType);
    }
    
    // 検索条件
    if (search) {
      // インジェクション防止のためにサニタイズ
      const safeSearch = search.replace(/[%_]/g, '\\$&');
      query = query.or(`title.ilike.%${safeSearch}%,description.ilike.%${safeSearch}%`);
    }
    
    // ゲーム名での検索
    const gameSearch = searchParams.get('game');
    if (gameSearch) {
      const safeGameSearch = gameSearch.replace(/[%_]/g, '\\$&');
      
      // ゲーム名でゲームIDを検索し、そのIDでフィルタリング
      const { data: matchingGames } = await supabase
        .from('games')
        .select('id')
        .or(`title.ilike.%${safeGameSearch}%,platform.ilike.%${safeGameSearch}%`);
      
      if (matchingGames && matchingGames.length > 0) {
        const gameIds = matchingGames.map(game => game.id);
        query = query.in('game_id', gameIds);
      } else {
        // マッチするゲームがなければ空の結果を返す
        return NextResponse.json([], {
          headers: {
            'Cache-Control': 'public, max-age=10, stale-while-revalidate=59',
          },
        });
      }
    }
    
    // クエリ実行
    const { data, error } = await query;
    
    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch posts' },
        { status: 500 }
      );
    }
    
    // レスポンスデータの整形
    const formattedPosts = data.map(post => ({
      ...post,
      applications_count: post.applications_count[0]?.count || 0,
    }));
    
    // レスポンスヘッダーにキャッシュ制御を追加
    return NextResponse.json(formattedPosts, {
      headers: {
        'Cache-Control': 'public, max-age=10, stale-while-revalidate=59',
      },
    });
    
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}, 30, 60000); // 1分間に30リクエストまで

// =====================================================
// POST: 新規投稿の作成
// =====================================================
export const POST = withRateLimit(async (req: NextRequest) => {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies });
    
    // セッションチェック（認証済みユーザーのみ投稿可能）
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // リクエストボディを取得
    const requestData = await req.json();
    
    // ユーザー入力のサニタイズ
    const sanitizedData = sanitizeObject(requestData);
    
    // バリデーション
    const validationResult = postFormSchema.safeParse(sanitizedData);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Validation failed',
          details: validationResult.error.format()
        },
        { status: 400 }
      );
    }
    
    // ゲーム情報の処理
    let gameId = validationResult.data.gameId;

    // gameIdが指定されていない場合は、タイトルとプラットフォームを使用してゲームを検索または作成
    if (!gameId && validationResult.data.gameTitle && validationResult.data.gamePlatform) {
      // 既存のゲームを検索
      const { data: existingGames } = await supabase
        .from('games')
        .select('id')
        .eq('title', validationResult.data.gameTitle)
        .eq('platform', validationResult.data.gamePlatform)
        .limit(1);
      
      if (existingGames && existingGames.length > 0) {
        // 既存のゲームを使用
        gameId = existingGames[0].id;
      } else {
        // 新しいゲームを作成
        const { data: newGame, error: gameCreateError } = await supabase
          .from('games')
          .insert({
            title: validationResult.data.gameTitle,
            platform: validationResult.data.gamePlatform,
            category: null,
            image_url: null,
            release_year: null
          })
          .select('id')
          .single();
        
        if (gameCreateError) {
          return NextResponse.json(
            { error: 'Failed to create game', details: gameCreateError },
            { status: 500 }
          );
        }
        
        gameId = newGame.id;
      }
    }
    
    if (!gameId) {
      return NextResponse.json(
        { error: 'Game information is required' },
        { status: 400 }
      );
    }
    
    const {
      title,
      playType,
      date,
      time,
      locationTab,
      prefecture,
      city,
      railway,
      station,
      participants,
      description
    } = validationResult.data;
    
    // 投稿データを作成
    const postData = {
      user_id: session.user.id,
      game_id: gameId,
      title,
      play_type: playType,
      meeting_date: date,
      meeting_time: time,
      location_type: locationTab,
      prefecture: locationTab === 'address' ? prefecture : null,
      city: locationTab === 'address' ? city : null,
      railway: locationTab === 'station' ? railway : null,
      station: locationTab === 'station' ? station : null,
      participant_limit: parseInt(participants),
      description: description || null,
      status: 'open',
    };
    
    // Supabaseに投稿を保存
    const { data: post, error: insertError } = await supabase
      .from('posts')
      .insert(postData)
      .select()
      .single();
      
    if (insertError) {
      console.error('Database insert error:', insertError);
      return NextResponse.json(
        { error: 'Failed to create post' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(post, { status: 201 });
    
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}, 10, 60000); // 1分間に10回の投稿まで