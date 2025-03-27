'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Calendar, Clock, MapPin, Users, MessageCircle, 
  Star, Award, ChevronDown, ChevronUp, Trash, Edit 
} from 'lucide-react';
import { 
  Card, CardHeader, CardTitle, CardContent, CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PostWithDetails, POST_STATUSES, PLAY_TYPES } from '@/types/post.types';
import { formatDate, formatTime, formatRelativeTime } from '@/lib/utils/date-formatter';
import { createClient } from '@/lib/supabase/client';
import { sanitizeText } from '@/lib/utils/sanitize'; // サニタイズユーティリティをインポート

interface PostDetailProps {
  post: PostWithDetails;
  isOwner: boolean;
  isApplied: boolean;
  userId?: string;
}

export function PostDetail({ post, isOwner, isApplied, userId }: PostDetailProps) {
  const router = useRouter();
  const supabase = createClient();
  const [showDescription, setShowDescription] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // プレイ形式
  const playType = PLAY_TYPES.find(type => type.value === post.play_type) || PLAY_TYPES[0];
  
  // ステータス
  const status = POST_STATUSES.find(s => s.value === post.status) || POST_STATUSES[0];
  
  // 場所情報 - サニタイズして表示
  const locationLabel = post.location_type === 'address' 
    ? `${sanitizeText(post.prefecture || '')}${sanitizeText(post.city || '')}` 
    : `${sanitizeText(post.railway || '')} ${sanitizeText(post.station || '')}駅`;

  // 投稿タイトルと説明をサニタイズ
  const safeTitle = sanitizeText(post.title);
  const safeDescription = post.description ? sanitizeText(post.description) : '';

  // 募集に応募
  const handleApply = async () => {
    if (!userId) {
      router.push('/login');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // CSRF対策: リクエストにトークンを含める
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('認証が必要です');
      }

      const { error } = await supabase
        .from('applications')
        .insert({
          post_id: post.id,
          user_id: userId,
          status: 'pending',
          message: null,
        });

      if (error) throw error;

      // 再読み込み
      router.refresh();
    } catch (error: any) {
      console.error('応募エラー:', error);
      setError(error.message || 'エラーが発生しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 募集を削除
  const handleDelete = async () => {
    // 確認ダイアログで誤削除を防止
    if (!confirm('この募集を削除しますか？この操作は元に戻せません。')) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // 所有者チェック（サーバー側でも検証されるが、UIでの早期チェック）
      if (!isOwner) {
        throw new Error('この操作は投稿者のみ可能です');
      }

      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('認証が必要です');
      }

      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', post.id)
        .eq('user_id', session.user.id); // 所有者のみ削除可能

      if (error) throw error;

      // ホームへリダイレクト
      router.push('/home');
      router.refresh();
    } catch (error: any) {
      console.error('削除エラー:', error);
      setError(error.message || 'エラーが発生しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 募集ステータスを変更
  const handleChangeStatus = async (newStatus: string) => {
    // ステータス値のバリデーション
    if (!['open', 'closed', 'canceled'].includes(newStatus)) {
      setError('無効なステータスです');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // 所有者チェック
      if (!isOwner) {
        throw new Error('この操作は投稿者のみ可能です');
      }

      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('認証が必要です');
      }

      const { error } = await supabase
        .from('posts')
        .update({ status: newStatus })
        .eq('id', post.id)
        .eq('user_id', session.user.id); // 所有者のみ更新可能

      if (error) throw error;

      // 再読み込み
      router.refresh();
    } catch (error: any) {
      console.error('ステータス変更エラー:', error);
      setError(error.message || 'エラーが発生しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="flex flex-col">
          <CardTitle className="text-xl font-bold">{safeTitle}</CardTitle>
          <p className="text-sm text-gray-500">
            {sanitizeText(post.game.title)}（{sanitizeText(post.game.platform)}）
          </p>
        </div>
        <span className={`inline-block rounded-full px-3 py-1 text-sm ${status.color}`}>
          {status.label}
        </span>
      </CardHeader>

      <CardContent className="space-y-4 pt-2">
        {error && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-500">
            {error}
          </div>
        )}

        {/* ゲーム情報 */}
        <div className="flex space-x-4">
          <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded">
            {post.game.image_url ? (
              <Image
                src={post.game.image_url}
                alt={sanitizeText(post.game.title)}
                fill
                className="object-cover"
                sizes="96px"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gray-200 text-xs text-gray-500">
                画像なし
              </div>
            )}
          </div>

          <div className="flex flex-col justify-center">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-gray-200">
                {post.user.avatar_url ? (
                  <Image
                    src={post.user.avatar_url}
                    alt={sanitizeText(post.user.username)}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm text-gray-500">
                    👤
                  </div>
                )}
              </div>
              <div>
                <Link href={`/profile/${encodeURIComponent(post.user.username)}`} className="text-sm font-medium hover:underline">
                  @{sanitizeText(post.user.username)}
                </Link>
                <div className="flex items-center text-xs text-gray-500">
                  <Star size={12} className="mr-1 text-amber-400" />
                  <span>信頼度: {post.user.trust_score || 0}</span>
                </div>
              </div>
            </div>

            <div className="mt-2 text-xs text-gray-500">
              投稿日時: {formatRelativeTime(post.created_at)}
            </div>
          </div>
        </div>

        {/* 基本情報 */}
        <div className="grid grid-cols-1 gap-3 rounded-md bg-gray-50 p-3 sm:grid-cols-2">
          <div className="flex items-center">
            <div className="mr-2 rounded-full bg-gray-200 p-2">
              <Calendar size={16} className="text-gray-600" />
            </div>
            <div>
              <div className="text-xs text-gray-500">日付</div>
              <div className="text-sm">{formatDate(post.meeting_date)}</div>
            </div>
          </div>

          <div className="flex items-center">
            <div className="mr-2 rounded-full bg-gray-200 p-2">
              <Clock size={16} className="text-gray-600" />
            </div>
            <div>
              <div className="text-xs text-gray-500">時間</div>
              <div className="text-sm">{formatTime(post.meeting_time)}</div>
            </div>
          </div>

          <div className="flex items-center">
            <div className="mr-2 rounded-full bg-gray-200 p-2">
              <MapPin size={16} className="text-gray-600" />
            </div>
            <div>
              <div className="text-xs text-gray-500">場所</div>
              <div className="text-sm">{locationLabel}</div>
            </div>
          </div>

          <div className="flex items-center">
            <div className="mr-2 rounded-full bg-gray-200 p-2">
              <Users size={16} className="text-gray-600" />
            </div>
            <div>
              <div className="text-xs text-gray-500">募集人数</div>
              <div className="text-sm">{post.applications_count || 0}/{post.participant_limit}人</div>
            </div>
          </div>
        </div>

        {/* 詳細 */}
        <div>
          <button
            onClick={() => setShowDescription(!showDescription)}
            className="flex w-full items-center justify-between rounded-md bg-gray-100 p-2 text-left text-sm font-medium hover:bg-gray-200"
            aria-expanded={showDescription}
            aria-controls="description-content"
          >
            <span>詳細情報</span>
            {showDescription ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {showDescription && (
            <div 
              id="description-content"
              className="mt-2 rounded-md border p-3 text-sm"
            >
              {safeDescription ? (
                <p className="whitespace-pre-wrap">{safeDescription}</p>
              ) : (
                <p className="text-gray-500">詳細情報はありません</p>
              )}
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex flex-col space-y-3">
        {isOwner ? (
          <div className="flex w-full flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push(`/posts/${post.id}/edit`)}
              disabled={isSubmitting}
            >
              <Edit size={16} className="mr-1" />
              編集
            </Button>

            {post.status === 'open' && (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => handleChangeStatus('closed')}
                disabled={isSubmitting}
              >
                募集を締め切る
              </Button>
            )}

            {post.status === 'closed' && (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => handleChangeStatus('open')}
                disabled={isSubmitting}
              >
                募集を再開する
              </Button>
            )}

            <Button
              variant="outline"
              className="w-full text-red-500 hover:bg-red-50 hover:text-red-600"
              onClick={handleDelete}
              disabled={isSubmitting}
            >
              <Trash size={16} className="mr-1" />
              削除
            </Button>
          </div>
        ) : (
          <>
            {post.status === 'open' ? (
              isApplied ? (
                <Button
                  variant="outline"
                  className="w-full"
                  disabled
                >
                  応募済み
                </Button>
              ) : userId ? (
                <Button
                  className="w-full"
                  onClick={handleApply}
                  disabled={isSubmitting}
                >
                  <MessageCircle size={16} className="mr-1" />
                  この募集に応募する
                </Button>
              ) : (
                <Button
                  className="w-full"
                  onClick={() => router.push('/login')}
                >
                  ログインして応募する
                </Button>
              )
            ) : (
              <Button
                variant="outline"
                className="w-full"
                disabled
              >
                {post.status === 'closed' ? '募集は締め切られました' : '募集はキャンセルされました'}
              </Button>
            )}
          </>
        )}
      </CardFooter>
    </Card>
  );
}