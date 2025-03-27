'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { formatDate, formatTime, formatRelativeTime } from '@/lib/utils/date-formatter';
import { PostWithDetails, PLAY_TYPES, POST_STATUSES } from '@/types/post.types';
import { MapPin, Calendar, Users, Clock } from 'lucide-react';

interface PostCardProps {
  post: PostWithDetails;
}

export function PostCard({ post }: PostCardProps) {
  // プレイ形式
  const playType = PLAY_TYPES.find(type => type.value === post.play_type) || PLAY_TYPES[0];
  
  // ステータス
  const status = POST_STATUSES.find(s => s.value === post.status) || POST_STATUSES[0];
  
  // 場所情報
  const locationLabel = post.location_type === 'address' 
    ? `${post.prefecture || ''}${post.city || ''}` 
    : `${post.railway || ''} ${post.station || ''}駅`;

  return (
    <Link href={`/posts/${post.id}`}>
      <Card className="h-full transition-all hover:shadow-md">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            {/* ゲーム画像 */}
            <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded">
              {post.game.image_url ? (
                <Image
                  src={post.game.image_url}
                  alt={post.game.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gray-200 text-xs text-gray-500">
                  画像なし
                </div>
              )}
            </div>
            
            <div className="flex-1 space-y-1">
              {/* ステータスバッジ */}
              <div className="flex justify-between">
                <span className={`inline-block rounded-full px-2 py-1 text-xs ${status.color}`}>
                  {status.label}
                </span>
                <span className="text-xs text-gray-500">
                  {formatRelativeTime(post.created_at)}
                </span>
              </div>
              
              {/* タイトル */}
              <h3 className="font-semibold leading-tight text-gray-900 line-clamp-2">
                {post.title}
              </h3>
              
              {/* ゲーム情報 */}
              <p className="text-xs text-gray-600">
                {post.game.title}（{post.game.platform}）
              </p>
              
              {/* ユーザー情報 */}
              <div className="flex items-center">
                <div className="h-6 w-6 rounded-full bg-gray-200">
                  {post.user.avatar_url ? (
                    <Image
                      src={post.user.avatar_url}
                      alt={post.user.username}
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-gray-500">
                      👤
                    </div>
                  )}
                </div>
                <span className="ml-1 text-xs text-gray-700">
                  @{post.user.username}
                </span>
              </div>
              
              {/* 詳細情報 */}
              <div className="grid grid-cols-2 gap-1 pt-1">
                <div className="flex items-center text-xs text-gray-500">
                  <Calendar size={12} className="mr-1" />
                  {formatDate(post.meeting_date)}
                </div>
                <div className="flex items-center text-xs text-gray-500">
                  <Clock size={12} className="mr-1" />
                  {formatTime(post.meeting_time)}
                </div>
                <div className="flex items-center text-xs text-gray-500">
                  <MapPin size={12} className="mr-1" />
                  {locationLabel}
                </div>
                <div className="flex items-center text-xs text-gray-500">
                  <Users size={12} className="mr-1" />
                  {post.applications_count || 0}/{post.participant_limit}人
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}