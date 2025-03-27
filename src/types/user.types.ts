import { Database } from './database.types';

export type User = Database['public']['Tables']['users']['Row'];
export type UserInsert = Database['public']['Tables']['users']['Insert'];
export type UserUpdate = Database['public']['Tables']['users']['Update'];

export type UserGame = Database['public']['Tables']['user_games']['Row'] & {
  game: Database['public']['Tables']['games']['Row'];
};

export type Rating = Database['public']['Tables']['ratings']['Row'];

export interface UserWithDetails extends User {
  games: UserGame[];
  ratings: {
    punctuality_avg: number;
    manner_avg: number;
    skill_avg: number;
    communication_avg: number;
    total_reviews: number;
  };
}

export type UserProfileFormData = {
  username: string;
  bio?: string;
  prefecture?: string;
  city?: string;
};