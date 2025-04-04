'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { signInSchema, signUpSchema } from '@/lib/utils/validators';

interface AuthFormProps {
  type: 'login' | 'signup';
}

export function AuthForm({ type }: AuthFormProps) {
  const router = useRouter();
  const supabase = createClient();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showResendButton, setShowResendButton] = useState(false);
  const [emailForResend, setEmailForResend] = useState('');
  const [isResending, setIsResending] = useState(false);

  const schema = type === 'login' ? signInSchema : signUpSchema;
  type FormData = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  // 確認メール再送信関数
  const handleResendConfirmation = async () => {
    if (!emailForResend) return;
    
    setIsResending(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: emailForResend,
      });
      
      if (error) throw error;
      
      setError('確認メールを再送信しました。メールをご確認ください。');
      setShowResendButton(false);
    } catch (error: any) {
      setError(`確認メールの再送信に失敗しました: ${error.message}`);
    } finally {
      setIsResending(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setError(null);
    setShowResendButton(false);

    try {
      if (type === 'login') {
        const { error } = await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        });

        if (error) {
          // メール確認エラーを特定して処理
          if (error.message === 'Email not confirmed') {
            setError('メールアドレスの確認が完了していません。登録時に送信された確認メールをご確認ください。');
            
            // 確認メールの再送信ボタンを表示するためのフラグ
            setShowResendButton(true);
            setEmailForResend(data.email);
          } else {
            throw error;
          }
        } else {
          router.push('/home');
          router.refresh();
        }
      } else {
        console.log('サインアップを開始します...');
        const { error: signUpError, data: authData } = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
          options: {
            data: {
              username: data.username,
            },
          },
        });

        if (signUpError) {
          console.error('サインアップエラー:', signUpError);
          throw signUpError;
        }

        console.log('サインアップ成功');
        
        // 新規登録後の処理
        if (authData.session) {
          // セッションがある場合（メール確認が不要の場合）
          router.push('/home');
          router.refresh();
        } else {
          // メール確認が必要な場合
          router.push('/verify-email');
        }
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      let errorMessage = '認証エラーが発生しました。もう一度お試しください。';
      
      if (error.message) {
        errorMessage = error.message;
      } else if (error.error_description) {
        errorMessage = error.error_description;
      } else if (typeof error === 'object' && Object.keys(error).length > 0) {
        errorMessage = `エラー: ${JSON.stringify(error)}`;
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {error && (
        <div className="p-3 bg-red-50 text-red-500 text-sm rounded-md">{error}</div>
      )}

      {showResendButton && (
        <div className="mt-3 text-center">
          <button
            type="button"
            onClick={handleResendConfirmation}
            className="text-primary-500 hover:text-primary-600 text-sm"
            disabled={isResending}
          >
            {isResending ? '送信中...' : '確認メールを再送信する'}
          </button>
        </div>
      )}

      {type === 'signup' && (
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">
            ユーザー名
          </label>
          <Input
            id="username"
            type="text"
            placeholder="username"
            autoComplete="username"
            {...register('username')}
            error={!!errors.username}
            className="mt-1"
          />
          {errors.username && (
            <p className="mt-1 text-xs text-red-500">{errors.username.message}</p>
          )}
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          メールアドレス
        </label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          {...register('email')}
          error={!!errors.email}
          className="mt-1"
        />
        {errors.email && (
          <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          パスワード
        </label>
        <div className="relative mt-1">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder={type === 'signup' ? '8文字以上、大文字・小文字・数字を含む' : 'パスワード'}
            autoComplete={type === 'signup' ? 'new-password' : 'current-password'}
            {...register('password')}
            error={!!errors.password}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.password && (
          <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
        )}
      </div>

      {type === 'signup' && (
        <div className="flex items-center">
          <input
            id="terms"
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-primary-500 focus:ring-primary-500"
            {...register('terms')}
          />
          <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
            <a href="/terms" className="text-primary-500 hover:text-primary-600" target="_blank">
              利用規約
            </a>
            に同意します
          </label>
          {errors.terms && (
            <p className="mt-1 text-xs text-red-500">{errors.terms.message}</p>
          )}
        </div>
      )}

      <Button
        type="submit"
        variant="default"
        className="w-full"
        disabled={isLoading}
      >
        {isLoading
          ? '処理中...'
          : type === 'login'
          ? 'ログイン'
          : 'アカウント作成'}
      </Button>
    </form>
  );
}