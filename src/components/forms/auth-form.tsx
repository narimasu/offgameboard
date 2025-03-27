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

  const schema = type === 'login' ? signInSchema : signUpSchema;
  type FormData = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setError(null);

    try {
      if (type === 'login') {
        const { error } = await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        });

        if (error) throw error;
        
        router.push('/home');
        router.refresh();
      } else {
        const { error: signUpError, data: authData } = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
          options: {
            data: {
              username: data.username,
            },
          },
        });

        if (signUpError) throw signUpError;

        if (authData.user) {
          // ユーザープロフィールを作成
          const { error: profileError } = await supabase
            .from('users')
            .insert({
              id: authData.user.id,
              username: data.username,
              email: data.email,
              trust_score: 0,
            });

          if (profileError) throw profileError;
        }

        router.push('/home');
        router.refresh();
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      setError(error.message || 'エラーが発生しました。もう一度お試しください。');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {error && (
        <div className="p-3 bg-red-50 text-red-500 text-sm rounded-md">{error}</div>
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