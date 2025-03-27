import Link from 'next/link';
import { createServerClient } from '@/lib/supabase/server';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ResponsiveContainer } from '@/components/layout/responsive-container';
import { PostList } from '@/components/posts/post-list';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default async function HomePage() {
  const supabase = createServerClient();
  
  // 投稿を取得
  const { data: posts, error } = await supabase
    .from('posts')
    .select(`
      *,
      game:games(*),
      user:users(id, username, avatar_url, trust_score),
      applications_count:applications(count)
    `)
    .eq('status', 'open')
    .order('created_at', { ascending: false })
    .limit(12);
  
  if (error) {
    console.error('投稿取得エラー:', error);
  }
  
  // 投稿データを整形
  const formattedPosts = (posts || []).map(post => ({
    ...post,
    applications_count: post.applications_count[0]?.count || 0,
  }));

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1 py-8">
        <ResponsiveContainer>
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">募集一覧</h1>
              <p className="mt-2 text-gray-600">
                オフラインでゲームを一緒に遊ぶ仲間を見つけよう
              </p>
            </div>
            <Link href="/posts/new">
              <Button className="flex items-center">
                <Plus size={18} className="mr-1" />
                新規投稿
              </Button>
            </Link>
          </div>
          
          <PostList initialPosts={formattedPosts} />
          
          {formattedPosts.length === 0 && (
            <div className="mt-8 rounded-lg border bg-white p-8 text-center">
              <h2 className="text-xl font-semibold text-gray-700">募集がありません</h2>
              <p className="mt-2 text-gray-500">
                最初の募集を作成しましょう！
              </p>
              <Link href="/posts/new" className="mt-4 inline-block">
                <Button>
                  <Plus size={18} className="mr-1" />
                  募集を作成する
                </Button>
              </Link>
            </div>
          )}
        </ResponsiveContainer>
      </main>
      
      <Footer />
    </div>
  );
}