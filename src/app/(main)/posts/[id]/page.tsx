import { notFound } from 'next/navigation';
import { createServerClient } from '@/lib/supabase/server';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ResponsiveContainer } from '@/components/layout/responsive-container';
import { PostDetail } from '@/components/posts/post-detail';

interface PostPageProps {
  params: {
    id: string;
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const supabase = createServerClient();
  
  // 現在のユーザーを取得
  const { data: { session } } = await supabase.auth.getSession();
  const currentUserId = session?.user?.id;
  
  // 投稿データを取得
  const { data: post, error } = await supabase
    .from('posts')
    .select(`
      *,
      game:games(*),
      user:users(id, username, avatar_url, trust_score),
      applications_count:applications(count)
    `)
    .eq('id', params.id)
    .single();
  
  if (error || !post) {
    notFound();
  }
  
  // 応募状況を確認
  let isApplied = false;
  if (currentUserId) {
    const { data: application } = await supabase
      .from('applications')
      .select('id')
      .eq('post_id', params.id)
      .eq('user_id', currentUserId)
      .maybeSingle();
    
    isApplied = !!application;
  }
  
  // 投稿データを整形
  const postWithDetails = {
    ...post,
    applications_count: post.applications_count[0]?.count || 0,
  };
  
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1 py-8">
        <ResponsiveContainer>
          <div className="mx-auto max-w-3xl">
            <div className="mb-6">
              <a href="#" onClick={() => { history.back(); return false; }} className="text-gray-500 hover:text-gray-700">
                ← 戻る
              </a>
            </div>
            
            <PostDetail 
              post={postWithDetails} 
              isOwner={currentUserId === post.user_id}
              isApplied={isApplied}
              userId={currentUserId || undefined}
            />
            
            {/* 関連投稿や追加セクションを必要に応じて表示 */}
          </div>
        </ResponsiveContainer>
      </main>
      
      <Footer />
    </div>
  );
}