'use client';

import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { postFormSchema } from '@/lib/utils/validators';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { LocationSelector } from './location-selector';
import { StationSelector } from './station-selector';
import { GameSelector } from './game-selector';
import { PLAY_TYPES } from '@/types/post.types';

type PostFormData = {
  gameId: string;
  title: string;
  playType: 'battle' | 'coop' | 'trade' | 'other';
  date: string;
  time: string;
  locationTab: 'address' | 'station';
  prefecture?: string;
  city?: string;
  railway?: string;
  station?: string;
  participants: string;
  description?: string;
};

export function PostForm() {
  const router = useRouter();
  const supabase = createClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [locationTab, setLocationTab] = useState<'address' | 'station'>('address');
  const [error, setError] = useState<string | null>(null);
  
  const methods = useForm<PostFormData>({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      gameId: '',
      title: '',
      playType: 'battle',
      date: '',
      time: '',
      locationTab: 'address',
      prefecture: '',
      city: '',
      railway: '',
      station: '',
      participants: '',
      description: '',
    },
  });

  const onSubmit = async (data: PostFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      // ユーザー取得
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('ログインが必要です');
      }

      // 投稿データの作成
      const postData = {
        user_id: user.id,
        game_id: data.gameId,
        title: data.title,
        play_type: data.playType,
        meeting_date: data.date,
        meeting_time: data.time,
        location_type: data.locationTab,
        prefecture: data.locationTab === 'address' ? data.prefecture : null,
        city: data.locationTab === 'address' ? data.city : null,
        railway: data.locationTab === 'station' ? data.railway : null,
        station: data.locationTab === 'station' ? data.station : null,
        participant_limit: parseInt(data.participants),
        description: data.description || null,
        status: 'open',
      };

      // Supabaseに投稿を保存
      const { data: post, error: insertError } = await supabase
        .from('posts')
        .insert(postData)
        .select()
        .single();

      if (insertError) throw insertError;

      // 詳細ページへリダイレクト
      router.push(`/posts/${post.id}`);
      router.refresh();

    } catch (error: any) {
      console.error('投稿エラー:', error);
      setError(error.message || 'エラーが発生しました。もう一度お試しください。');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <div className="p-3 bg-red-50 text-red-500 text-sm rounded-md">{error}</div>
        )}

        <div>
          <label htmlFor="gameId" className="block text-base font-medium text-gray-700">
            ゲームを選択
          </label>
          <GameSelector />
          {methods.formState.errors.gameId && (
            <p className="mt-1 text-xs text-red-500">{methods.formState.errors.gameId.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="title" className="block text-base font-medium text-gray-700">
            募集タイトル
          </label>
          <Input
            type="text"
            id="title"
            placeholder="例：ポケモン交換会、モンハンG級周回など"
            {...methods.register('title')}
            error={!!methods.formState.errors.title}
            className="mt-1"
          />
          {methods.formState.errors.title && (
            <p className="mt-1 text-xs text-red-500">{methods.formState.errors.title.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="playType" className="block text-base font-medium text-gray-700">
            プレイ形式
          </label>
          <Select
            id="playType"
            {...methods.register('playType')}
            error={!!methods.formState.errors.playType}
            className="mt-1"
          >
            {PLAY_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </Select>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="date" className="block text-base font-medium text-gray-700">
              日付
            </label>
            <Input
              type="date"
              id="date"
              {...methods.register('date')}
              error={!!methods.formState.errors.date}
              className="mt-1"
            />
            {methods.formState.errors.date && (
              <p className="mt-1 text-xs text-red-500">{methods.formState.errors.date.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="time" className="block text-base font-medium text-gray-700">
              時間
            </label>
            <Input
              type="time"
              id="time"
              {...methods.register('time')}
              error={!!methods.formState.errors.time}
              className="mt-1"
            />
            {methods.formState.errors.time && (
              <p className="mt-1 text-xs text-red-500">{methods.formState.errors.time.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-base font-medium text-gray-700">
            場所（以下のどちらかは必須）
          </label>
          <input 
            type="hidden" 
            {...methods.register('locationTab')} 
            value={locationTab} 
          />
          <Tabs
            defaultValue="address"
            onValueChange={(value) => {
              setLocationTab(value as 'address' | 'station');
              methods.setValue('locationTab', value as 'address' | 'station');
            }}
            className="mt-2"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="address">都道府県から選択</TabsTrigger>
              <TabsTrigger value="station">駅から選択</TabsTrigger>
            </TabsList>
            <TabsContent value="address" className="mt-4">
              <LocationSelector />
            </TabsContent>
            <TabsContent value="station" className="mt-4">
              <StationSelector />
            </TabsContent>
          </Tabs>
          {methods.formState.errors.locationTab && (
            <p className="mt-1 text-xs text-red-500">{methods.formState.errors.locationTab.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="participants" className="block text-base font-medium text-gray-700">
            募集人数
          </label>
          <Select
            id="participants"
            {...methods.register('participants')}
            error={!!methods.formState.errors.participants}
            className="mt-1"
          >
            <option value="">選択してください</option>
            <option value="1">1人</option>
            <option value="2">2人</option>
            <option value="3">3人</option>
            <option value="4">4人</option>
            <option value="5">5人</option>
            <option value="6">6人</option>
            <option value="7">7人</option>
            <option value="8">8人</option>
            <option value="9">9人</option>
            <option value="10">10人</option>
          </Select>
          {methods.formState.errors.participants && (
            <p className="mt-1 text-xs text-red-500">{methods.formState.errors.participants.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="description" className="block text-base font-medium text-gray-700">
            詳細説明
          </label>
          <textarea
            id="description"
            {...methods.register('description')}
            rows={4}
            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            placeholder="募集の詳細、参加条件、持ち物、待ち合わせ場所の詳細などを記入してください。"
          />
          {methods.formState.errors.description && (
            <p className="mt-1 text-xs text-red-500">{methods.formState.errors.description.message}</p>
          )}
        </div>

        <div>
          <Button
            type="submit"
            className="w-full rounded-full bg-primary-500 py-3 text-white hover:bg-primary-600"
            disabled={isSubmitting}
          >
            {isSubmitting ? '投稿中...' : '投稿する'}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}