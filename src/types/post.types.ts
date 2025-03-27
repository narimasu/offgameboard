import { Database } from './database.types';

export type Post = Database['public']['Tables']['posts']['Row'];
export type PostInsert = Database['public']['Tables']['posts']['Insert'];
export type PostUpdate = Database['public']['Tables']['posts']['Update'];

export type Game = Database['public']['Tables']['games']['Row'];
export type Application = Database['public']['Tables']['applications']['Row'];

export interface PostWithDetails extends Post {
  game: Game;
  user: {
    id: string;
    username: string;
    avatar_url: string | null;
    trust_score: number;
  };
  applications_count: number;
  is_applied?: boolean;
}

export type PostFormData = {
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

export type PlayTypeInfo = {
  value: 'battle' | 'coop' | 'trade' | 'other';
  label: string;
  icon?: string;
};

export const PLAY_TYPES: PlayTypeInfo[] = [
  { value: 'battle', label: '対戦' },
  { value: 'coop', label: '協力' },
  { value: 'trade', label: '交換' },
  { value: 'other', label: 'その他' },
];

export type PostStatusInfo = {
  value: 'open' | 'closed' | 'canceled';
  label: string;
  color: string;
};

export const POST_STATUSES: PostStatusInfo[] = [
  { value: 'open', label: '募集中', color: 'text-green-500 bg-green-50' },
  { value: 'closed', label: '締切', color: 'text-blue-500 bg-blue-50' },
  { value: 'canceled', label: 'キャンセル', color: 'text-red-500 bg-red-50' },
];