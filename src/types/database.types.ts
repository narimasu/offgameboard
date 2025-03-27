export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          username: string
          email: string
          avatar_url: string | null
          bio: string | null
          prefecture: string | null
          city: string | null
          trust_score: number
          created_at: string
        }
        Insert: {
          id: string
          username: string
          email: string
          avatar_url?: string | null
          bio?: string | null
          prefecture?: string | null
          city?: string | null
          trust_score?: number
          created_at?: string
        }
        Update: {
          id?: string
          username?: string
          email?: string
          avatar_url?: string | null
          bio?: string | null
          prefecture?: string | null
          city?: string | null
          trust_score?: number
          created_at?: string
        }
      }
      games: {
        Row: {
          id: string
          title: string
          platform: string
          image_url: string | null
          category: string | null
          release_year: number | null
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          platform: string
          image_url?: string | null
          category?: string | null
          release_year?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          platform?: string
          image_url?: string | null
          category?: string | null
          release_year?: number | null
          created_at?: string
        }
      }
      user_games: {
        Row: {
          id: string
          user_id: string
          game_id: string
          skill_level: number | null
          note: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          game_id: string
          skill_level?: number | null
          note?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          game_id?: string
          skill_level?: number | null
          note?: string | null
          created_at?: string
        }
      }
      posts: {
        Row: {
          id: string
          user_id: string
          game_id: string
          title: string
          play_type: string
          meeting_date: string
          meeting_time: string
          location_type: string
          prefecture: string | null
          city: string | null
          railway: string | null
          station: string | null
          participant_limit: number
          description: string | null
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          game_id: string
          title: string
          play_type: string
          meeting_date: string
          meeting_time: string
          location_type: string
          prefecture?: string | null
          city?: string | null
          railway?: string | null
          station?: string | null
          participant_limit: number
          description?: string | null
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          game_id?: string
          title?: string
          play_type?: string
          meeting_date?: string
          meeting_time?: string
          location_type?: string
          prefecture?: string | null
          city?: string | null
          railway?: string | null
          station?: string | null
          participant_limit?: number
          description?: string | null
          status?: string
          created_at?: string
        }
      }
      applications: {
        Row: {
          id: string
          post_id: string
          user_id: string
          status: string
          message: string | null
          created_at: string
        }
        Insert: {
          id?: string
          post_id: string
          user_id: string
          status?: string
          message?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          post_id?: string
          user_id?: string
          status?: string
          message?: string | null
          created_at?: string
        }
      }
      ratings: {
        Row: {
          id: string
          reviewer_id: string
          reviewee_id: string
          post_id: string
          punctuality_score: number | null
          manner_score: number | null
          skill_score: number | null
          communication_score: number | null
          comment: string | null
          created_at: string
        }
        Insert: {
          id?: string
          reviewer_id: string
          reviewee_id: string
          post_id: string
          punctuality_score?: number | null
          manner_score?: number | null
          skill_score?: number | null
          communication_score?: number | null
          comment?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          reviewer_id?: string
          reviewee_id?: string
          post_id?: string
          punctuality_score?: number | null
          manner_score?: number | null
          skill_score?: number | null
          communication_score?: number | null
          comment?: string | null
          created_at?: string
        }
      }
      message_threads: {
        Row: {
          id: string
          post_id: string
          created_at: string
        }
        Insert: {
          id?: string
          post_id: string
          created_at?: string
        }
        Update: {
          id?: string
          post_id?: string
          created_at?: string
        }
      }
      thread_members: {
        Row: {
          id: string
          thread_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          thread_id: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          thread_id?: string
          user_id?: string
          created_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          thread_id: string
          sender_id: string
          content: string
          read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          thread_id: string
          sender_id: string
          content: string
          read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          thread_id?: string
          sender_id?: string
          content?: string
          read?: boolean
          created_at?: string
        }
      }
      reports: {
        Row: {
          id: string
          reporter_id: string
          reported_id: string
          post_id: string | null
          reason: string
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          reporter_id: string
          reported_id: string
          post_id?: string | null
          reason: string
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          reporter_id?: string
          reported_id?: string
          post_id?: string | null
          reason?: string
          status?: string
          created_at?: string
        }
      }
      blocks: {
        Row: {
          id: string
          blocker_id: string
          blocked_id: string
          created_at: string
        }
        Insert: {
          id?: string
          blocker_id: string
          blocked_id: string
          created_at?: string
        }
        Update: {
          id?: string
          blocker_id?: string
          blocked_id?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}