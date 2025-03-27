'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, LogOut, User } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { ResponsiveContainer } from './responsive-container';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function getUser() {
      setIsLoading(true);
      try {
        const { data } = await supabase.auth.getUser();
        setUser(data.user);
      } catch (error) {
        console.error('Error getting user:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    getUser();
    
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        setUser(session.user);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  return (
    <header className="bg-primary-500 text-white">
      <ResponsiveContainer>
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold">offgameboard</span>
            </Link>
          </div>

          {/* デスクトップナビゲーション */}
          <nav className="hidden md:flex md:items-center md:space-x-8">
            {!isLoading && (
              <>
                {user ? (
                  <>
                    <Link href="/home" className="hover:text-indigo-100">
                      ホーム
                    </Link>
                    <Link href="/posts/new" className="hover:text-indigo-100">
                      募集する
                    </Link>
                    <Link href="/messages" className="hover:text-indigo-100">
                      メッセージ
                    </Link>
                    <div className="relative ml-3">
                      <Link href="/profile" className="hover:text-indigo-100 flex items-center space-x-1">
                        <User size={18} />
                        <span>マイページ</span>
                      </Link>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-white text-white hover:bg-white/20"
                      onClick={handleSignOut}
                    >
                      <LogOut size={16} className="mr-1" />
                      ログアウト
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="hover:text-indigo-100">
                      ログイン
                    </Link>
                    <Link href="/signup">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-white text-white hover:bg-white/20"
                      >
                        新規登録
                      </Button>
                    </Link>
                  </>
                )}
              </>
            )}
          </nav>

          {/* モバイルメニューボタン */}
          <div className="flex md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md hover:text-indigo-100"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </ResponsiveContainer>

      {/* モバイルナビゲーション */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {!isLoading && (
              <>
                {user ? (
                  <>
                    <Link
                      href="/home"
                      className="block px-3 py-2 rounded-md hover:bg-primary-600"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      ホーム
                    </Link>
                    <Link
                      href="/posts/new"
                      className="block px-3 py-2 rounded-md hover:bg-primary-600"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      募集する
                    </Link>
                    <Link
                      href="/messages"
                      className="block px-3 py-2 rounded-md hover:bg-primary-600"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      メッセージ
                    </Link>
                    <Link
                      href="/profile"
                      className="block px-3 py-2 rounded-md hover:bg-primary-600"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      マイページ
                    </Link>
                    <button
                      onClick={() => {
                        handleSignOut();
                        setIsMenuOpen(false);
                      }}
                      className="block w-full text-left px-3 py-2 rounded-md hover:bg-primary-600"
                    >
                      ログアウト
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="block px-3 py-2 rounded-md hover:bg-primary-600"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      ログイン
                    </Link>
                    <Link
                      href="/signup"
                      className="block px-3 py-2 rounded-md hover:bg-primary-600"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      新規登録
                    </Link>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}