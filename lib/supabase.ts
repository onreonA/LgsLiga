import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    flowType: "pkce",
  },
  global: {
    headers: {
      "X-Client-Info": "lgsliga-web",
    },
  },
});

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          role: "student" | "admin";
          volleyball_days: string[] | null;
          grade: number | null;
          target_score: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          role?: "student" | "admin";
          volleyball_days?: string[] | null;
          grade?: number | null;
          target_score?: number | null;
        };
        Update: {
          full_name?: string | null;
          volleyball_days?: string[] | null;
          grade?: number | null;
          target_score?: number | null;
          updated_at?: string;
        };
      };
      subjects: {
        Row: {
          id: string;
          name: string;
          code: string;
          color: string;
          icon: string;
          created_at: string;
        };
      };
      topics: {
        Row: {
          id: string;
          subject_id: string;
          name: string;
          description: string | null;
          difficulty_level: number;
          total_questions: number;
          created_at: string;
        };
      };
      study_sessions: {
        Row: {
          id: string;
          user_id: string;
          subject_id: string;
          topic_id: string | null;
          questions_solved: number;
          correct_answers: number;
          xp_earned: number;
          duration_minutes: number;
          session_type: "practice" | "quest" | "boss" | "exam";
          completed_at: string;
        };
        Insert: {
          user_id: string;
          subject_id: string;
          topic_id?: string | null;
          questions_solved?: number;
          correct_answers?: number;
          xp_earned?: number;
          duration_minutes?: number;
          session_type?: "practice" | "quest" | "boss" | "exam";
        };
      };
      quests: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string | null;
          quest_type: "daily" | "weekly" | "monthly" | "special";
          target_value: number;
          current_progress: number;
          xp_reward: number;
          status: "active" | "completed" | "expired";
          expires_at: string | null;
          completed_at: string | null;
          created_at: string;
        };
        Insert: {
          user_id: string;
          title: string;
          description?: string | null;
          quest_type: "daily" | "weekly" | "monthly" | "special";
          target_value: number;
          xp_reward?: number;
          expires_at?: string | null;
        };
        Update: {
          current_progress?: number;
          status?: "active" | "completed" | "expired";
          completed_at?: string | null;
        };
      };
      achievements: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string | null;
          badge_icon: string | null;
          badge_color: string;
          category: "study" | "boss" | "streak" | "special";
          earned_at: string;
        };
        Insert: {
          user_id: string;
          title: string;
          description?: string | null;
          badge_icon?: string | null;
          badge_color?: string;
          category: "study" | "boss" | "streak" | "special";
        };
      };
      exams: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          exam_type: "practice" | "mock" | "boss_fight";
          total_questions: number;
          correct_answers: number;
          score: number;
          duration_minutes: number | null;
          status: "in_progress" | "completed" | "abandoned";
          started_at: string;
          completed_at: string | null;
        };
        Insert: {
          user_id: string;
          title: string;
          exam_type: "practice" | "mock" | "boss_fight";
          total_questions: number;
          duration_minutes?: number | null;
        };
        Update: {
          correct_answers?: number;
          score?: number;
          status?: "in_progress" | "completed" | "abandoned";
          completed_at?: string | null;
        };
      };
      shop_rewards: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          image_url: string | null;
          coin_price: number;
          category: string;
          is_active: boolean;
          stock_quantity: number;
          created_at: string;
        };
        Insert: {
          title: string;
          description?: string | null;
          image_url?: string | null;
          coin_price?: number;
          category?: string;
          is_active?: boolean;
          stock_quantity?: number;
        };
        Update: {
          title?: string;
          description?: string | null;
          image_url?: string | null;
          coin_price?: number;
          category?: string;
          is_active?: boolean;
          stock_quantity?: number;
        };
      };
      purchase_requests: {
        Row: {
          id: string;
          user_id: string;
          reward_id: string;
          coin_cost: number;
          status: "pending" | "approved" | "rejected";
          admin_notes: string | null;
          requested_at: string;
          processed_at: string | null;
        };
        Insert: {
          user_id: string;
          reward_id: string;
          coin_cost: number;
          status?: "pending" | "approved" | "rejected";
          admin_notes?: string | null;
        };
        Update: {
          status?: "pending" | "approved" | "rejected";
          admin_notes?: string | null;
          processed_at?: string | null;
        };
      };
      user_coins: {
        Row: {
          user_id: string;
          total_coins: number;
          spent_coins: number;
          earned_coins: number;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          total_coins?: number;
          spent_coins?: number;
          earned_coins?: number;
        };
        Update: {
          total_coins?: number;
          spent_coins?: number;
          earned_coins?: number;
          updated_at?: string;
        };
      };
      family_messages: {
        Row: {
          id: string;
          user_id: string;
          sender_name: string;
          message: string;
          message_type: "motivation" | "congratulation" | "reminder";
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          user_id: string;
          sender_name: string;
          message: string;
          message_type?: "motivation" | "congratulation" | "reminder";
          is_active?: boolean;
        };
        Update: {
          sender_name?: string;
          message?: string;
          message_type?: "motivation" | "congratulation" | "reminder";
          is_active?: boolean;
        };
      };
      user_goals: {
        Row: {
          id: string;
          user_id: string;
          goal_text: string;
          goal_type: "daily" | "weekly" | "monthly" | "yearly";
          is_completed: boolean;
          created_at: string;
          completed_at: string | null;
        };
        Insert: {
          user_id: string;
          goal_text: string;
          goal_type?: "daily" | "weekly" | "monthly" | "yearly";
          is_completed?: boolean;
        };
        Update: {
          goal_text?: string;
          goal_type?: "daily" | "weekly" | "monthly" | "yearly";
          is_completed?: boolean;
          completed_at?: string | null;
        };
      };
      weekly_letters: {
        Row: {
          id: string;
          user_id: string;
          letter_content: string;
          week_number: number;
          year: number;
          created_at: string;
        };
        Insert: {
          user_id: string;
          letter_content: string;
          week_number: number;
          year: number;
        };
        Update: {
          letter_content?: string;
          week_number?: number;
          year?: number;
        };
      };
      daily_videos: {
        Row: {
          id: string;
          date: string;
          title: string;
          video_id: string;
          description: string;
          is_active: boolean;
          watch_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          date: string;
          title: string;
          video_id: string;
          description: string;
          is_active?: boolean;
          watch_count?: number;
        };
        Update: {
          date?: string;
          title?: string;
          video_id?: string;
          description?: string;
          is_active?: boolean;
          watch_count?: number;
          updated_at?: string;
        };
      };
    };
  };
};
