import { z } from 'zod'

export const postFormSchema = z.object({
  gameTitle: z.string().min(2, 'ゲームタイトルを入力してください').max(100, '100文字以内で入力してください'),
  gamePlatform: z.string().min(1, 'プラットフォームを選択してください'),
  title: z.string().min(3, '3文字以上入力してください').max(100, '100文字以内で入力してください'),
  playType: z.enum(['battle', 'coop', 'trade', 'other'], {
    required_error: 'プレイ形式を選択してください',
  }),
  date: z.string().min(1, '日付を選択してください'),
  time: z.string().min(1, '時間を選択してください'),
  locationTab: z.enum(['address', 'station']),
  prefecture: z.string().optional(),
  city: z.string().optional(),
  railway: z.string().optional(),
  station: z.string().optional(),
  participants: z.string().min(1, '募集人数を選択してください'),
  description: z.string().max(1000, '1000文字以内で入力してください').optional(),
  gameId: z.string().optional(), // 互換性のために残しておく
}).refine(data => {
  // 住所か駅のどちらかが入力されていることを確認
  if (data.locationTab === 'address') {
    return !!data.prefecture && !!data.city;
  } else {
    return !!data.railway && !!data.station;
  }
}, {
  message: "都道府県・市区町村、または路線・駅のどちらかを入力してください",
  path: ["locationTab"],
});

export const userFormSchema = z.object({
  username: z.string()
    .min(3, 'ユーザー名は3文字以上で入力してください')
    .max(20, 'ユーザー名は20文字以内で入力してください')
    .regex(/^[a-zA-Z0-9_-]+$/, 'ユーザー名は英数字、アンダースコア、ハイフンのみ使用できます'),
  bio: z.string().max(200, '自己紹介は200文字以内で入力してください').optional(),
  prefecture: z.string().optional(),
  city: z.string().optional(),
});

export const signUpSchema = z.object({
  email: z.string().email('有効なメールアドレスを入力してください'),
  password: z.string()
    .min(8, 'パスワードは8文字以上で入力してください')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'パスワードは大文字、小文字、数字を含む必要があります'),
  username: z.string()
    .min(3, 'ユーザー名は3文字以上で入力してください')
    .max(20, 'ユーザー名は20文字以内で入力してください')
    .regex(/^[a-zA-Z0-9_-]+$/, 'ユーザー名は英数字、アンダースコア、ハイフンのみ使用できます'),
  terms: z.boolean().refine(val => val === true, {
    message: '利用規約に同意する必要があります',
  }),
});

export const signInSchema = z.object({
  email: z.string().email('有効なメールアドレスを入力してください'),
  password: z.string().min(1, 'パスワードを入力してください'),
});

export const applicationSchema = z.object({
  message: z.string().max(300, 'メッセージは300文字以内で入力してください').optional(),
});

export const ratingSchema = z.object({
  punctuality_score: z.number().min(1).max(5),
  manner_score: z.number().min(1).max(5),
  skill_score: z.number().min(1).max(5),
  communication_score: z.number().min(1).max(5),
  comment: z.string().max(300, 'コメントは300文字以内で入力してください').optional(),
});