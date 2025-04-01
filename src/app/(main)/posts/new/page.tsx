'use client';

import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ResponsiveContainer } from '@/components/layout/responsive-container';
import { PostForm } from '@/components/forms/post-form/post-form';
import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import { BackButton } from '@/components/ui/back-button'; // 新しいコンポーネントをインポート

export default function NewPostPage() {
  const router = useRouter();
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.push('/login?redirect=/posts/new');
      } else {
        setIsAuthenticated(true);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [router, supabase]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 py-8">
          <ResponsiveContainer>
            <div className="flex justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-t-2 border-primary-500"></div>
            </div>
          </ResponsiveContainer>
        </main>
        <Footer />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // リダイレクト中なので表示しない
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1 py-8">
        <ResponsiveContainer>
          <div className="mx-auto max-w-3xl">
            <div className="mb-8 flex items-center">
              {/* ここを変更: onClick を使った button から BackButton コンポーネントに変更 */}
              <BackButton className="mr-4" />
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">新規投稿作成</h1>
            </div>
            
            <div className="rounded-lg border bg-white p-6 shadow">
              <PostForm />
            </div>

            <div className="mt-8 rounded-lg border bg-blue-50 p-4 text-sm text-blue-700">
              <p className="font-semibold">投稿時の注意事項：</p>
              <ul className="mt-2 list-inside list-disc space-y-1">
                <li>具体的な待ち合わせ場所は、マッチング成立後に相手と直接共有してください。</li>
                <li>募集内容は明確に記載し、参加条件があれば詳細説明に明記してください。</li>
                <li>不適切な内容や個人情報を含む投稿は削除される場合があります。</li>
                <li>お互いを尊重し、安全なオフラインミーティングを心がけましょう。</li>
              </ul>
            </div>
          </div>
        </ResponsiveContainer>
      </main>

      <Footer />
    </div>
  );
}