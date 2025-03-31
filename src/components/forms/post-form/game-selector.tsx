'use client';

import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';

export function GameSelector() {
  const { register, setValue, formState: { errors } } = useFormContext();
  
  // ゲームプラットフォームのリスト
  const platforms = [
    { id: 'switch', name: 'Nintendo Switch' },
    { id: '3ds', name: '3DS' },
    { id: 'ds', name: 'DS' },
    { id: 'wii', name: 'Wii' },
    { id: 'wiiu', name: 'Wii U' },
    { id: 'ps5', name: 'PlayStation 5' },
    { id: 'ps4', name: 'PlayStation 4' },
    { id: 'ps3', name: 'PlayStation 3' },
    { id: 'psp', name: 'PSP' },
    { id: 'psvita', name: 'PS Vita' },
    { id: 'xboxs', name: 'Xbox Series X/S' },
    { id: 'xboxone', name: 'Xbox One' },
    { id: 'xbox360', name: 'Xbox 360' },
    { id: 'pc', name: 'PC' },
    { id: 'mobile', name: 'スマートフォン' },
    { id: 'other', name: 'その他' }
  ];

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="gameTitle" className="block text-sm font-medium text-gray-700">
          ゲームタイトル
        </label>
        <Input
          id="gameTitle"
          type="text"
          placeholder="例: モンスターハンター4、ポケットモンスター ハートゴールドなど"
          {...register('gameTitle')}
          error={!!errors.gameTitle}
          className="mt-1"
        />
        {errors.gameTitle && (
          <p className="mt-1 text-xs text-red-500">{errors.gameTitle.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="gamePlatform" className="block text-sm font-medium text-gray-700">
          プラットフォーム
        </label>
        <Select
          id="gamePlatform"
          {...register('gamePlatform')}
          error={!!errors.gamePlatform}
          className="mt-1"
        >
          <option value="">選択してください</option>
          {platforms.map((platform) => (
            <option key={platform.id} value={platform.id}>
              {platform.name}
            </option>
          ))}
        </Select>
        {errors.gamePlatform && (
          <p className="mt-1 text-xs text-red-500">{errors.gamePlatform.message}</p>
        )}
      </div>

      {/* 入力したゲーム情報をgameIdフィールドに保持するための隠しフィールド (既存のレイアウトに変更を最小限にするため) */}
      <input type="hidden" {...register('gameId')} />
    </div>
  );
}