'use client';

import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { AuthForm } from '@/components/forms/auth-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer } from '@/components/layout/responsive-container';

export default function SignupPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1 py-12">
        <ResponsiveContainer className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">新規登録</CardTitle>
            </CardHeader>
            <CardContent>
              <AuthForm type="signup" />
              
              <div className="mt-6 text-center text-sm">
                <p>
                  すでにアカウントをお持ちの場合は、
                  <Link href="/login" className="text-primary-500 hover:text-primary-600">
                    ログイン
                  </Link>
                  してください。
                </p>
              </div>
            </CardContent>
          </Card>
        </ResponsiveContainer>
      </main>
      
      <Footer />
    </div>
  );
}