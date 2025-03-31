'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { PostCard } from './post-card';
import { PostWithDetails } from '@/types/post.types';
import { createClient } from '@/lib/supabase/client';
import { Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';

interface PostListProps {
  initialPosts: PostWithDetails[];
  showFilters?: boolean;
  showSearch?: boolean;
}

export function PostList({ initialPosts, showFilters = true, showSearch = true }: PostListProps) {
  const searchParams = useSearchParams();
  const supabase = createClient();
  const [posts, setPosts] = useState<PostWithDetails[]>(initialPosts);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedPlayType, setSelectedPlayType] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('open');
  const [gameSearchTerm, setGameSearchTerm] = useState<string>('');

  // URLパラメータからフィルター設定を取得
  useEffect(() => {
    const play_type = searchParams.get('play_type');
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const game = searchParams.get('game');

    if (play_type) setSelectedPlayType(play_type);
    if (status) setSelectedStatus(status);
    if (search) setSearchTerm(search);
    if (game) setGameSearchTerm(game);
  }, [searchParams]);

  // フィルター変更時に投稿を再取得
  useEffect(() => {
    fetchPosts();
  }, [selectedPlayType, selectedStatus, searchTerm, gameSearchTerm]);

  // 投稿の取得
  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('posts')
        .select(`
          *,
          game:games(*),
          user:users(id, username, avatar_url, trust_score),
          applications_count:applications(count)
        `)
        .order('created_at', { ascending: false });

      // ステータスフィルター
      if (selectedStatus) {
        query = query.eq('status', selectedStatus);
      }

      // プレイ形式フィルター
      if (selectedPlayType) {
        query = query.eq('play_type', selectedPlayType);
      }

      // 投稿内容の検索
      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
      }

      // ゲーム名での検索
      if (gameSearchTerm) {
        // ここでゲーム名での検索を実装
        // まずゲームIDを取得してから、そのIDで投稿をフィルタリングするアプローチ
        const { data: matchingGames } = await supabase
          .from('games')
          .select('id')
          .or(`title.ilike.%${gameSearchTerm}%,platform.ilike.%${gameSearchTerm}%`);
        
        if (matchingGames && matchingGames.length > 0) {
          const gameIds = matchingGames.map(game => game.id);
          query = query.in('game_id', gameIds);
        } else {
          // マッチするゲームがなければ空の結果を返す
          setPosts([]);
          setIsLoading(false);
          return;
        }
      }

      const { data, error } = await query;

      if (error) throw error;

      const formattedPosts = (data as any[]).map(post => ({
        ...post,
        applications_count: post.applications_count[0]?.count || 0,
      }));

      setPosts(formattedPosts);
    } catch (error) {
      console.error('投稿取得エラー:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 検索ハンドラー
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPosts();
  };

  return (
    <div className="space-y-4">
      {/* フィルターと検索 */}
      <div className="space-y-3">
        {showSearch && (
          <form onSubmit={handleSearch} className="space-y-3">
            <div className="flex">
              <Input
                type="text"
                placeholder="タイトルや説明を検索..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 rounded-r-none focus:z-10"
              />
              <Button type="submit" className="rounded-l-none">
                <Search size={18} className="mr-1" />
                <span className="hidden sm:inline">検索</span>
              </Button>
            </div>
            
            <div className="flex">
              <Input
                type="text"
                placeholder="ゲーム名で検索..."
                value={gameSearchTerm}
                onChange={(e) => setGameSearchTerm(e.target.value)}
                className="flex-1 rounded-r-none focus:z-10"
              />
              <Button type="submit" className="rounded-l-none bg-indigo-400 hover:bg-indigo-500">
                <Search size={18} className="mr-1" />
                <span className="hidden sm:inline">ゲーム検索</span>
              </Button>
            </div>
          </form>
        )}

        {showFilters && (
          <div className="flex flex-wrap items-center gap-2">
            <Filter size={16} className="text-gray-500" />
            <div className="flex-1 sm:flex-initial">
              <Select
                value={selectedPlayType}
                onChange={(e) => setSelectedPlayType(e.target.value)}
                className="w-full sm:w-auto"
              >
                <option value="">すべてのプレイ形式</option>
                <option value="battle">対戦</option>
                <option value="coop">協力</option>
                <option value="trade">交換</option>
                <option value="other">その他</option>
              </Select>
            </div>
            <div className="flex-1 sm:flex-initial">
              <Select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full sm:w-auto"
              >
                <option value="open">募集中のみ</option>
                <option value="">すべてのステータス</option>
                <option value="closed">締切</option>
                <option value="canceled">キャンセル</option>
              </Select>
            </div>
          </div>
        )}
      </div>

      {/* 投稿リスト */}
      {isLoading ? (
        <div className="my-8 flex justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-t-2 border-primary-500"></div>
        </div>
      ) : posts.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="my-12 text-center">
          <p className="text-gray-500">条件に一致する投稿が見つかりませんでした</p>
          <p className="mt-2 text-sm text-gray-400">検索条件を変更するか、新しい投稿を作成してください</p>
        </div>
      )}
    </div>
  );
}