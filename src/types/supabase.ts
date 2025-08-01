export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          avatar_url: string | null
          role: 'USER' | 'ADMIN' | 'MODERATOR'
          email_verified: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name?: string | null
          avatar_url?: string | null
          role?: 'USER' | 'ADMIN' | 'MODERATOR'
          email_verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          avatar_url?: string | null
          role?: 'USER' | 'ADMIN' | 'MODERATOR'
          email_verified?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      works: {
        Row: {
          id: string
          title: string
          author: string
          coauthor: string | null
          isrc: string | null
          iswc: string | null
          description: string | null
          status: 'PENDING' | 'WAITING_PAYMENT' | 'AUTHORIZED' | 'EXCLUSIVE' | 'REJECTED'
          code: string
          exclusive_code: string | null
          user_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          author: string
          coauthor?: string | null
          isrc?: string | null
          iswc?: string | null
          description?: string | null
          status?: 'PENDING' | 'WAITING_PAYMENT' | 'AUTHORIZED' | 'EXCLUSIVE' | 'REJECTED'
          code: string
          exclusive_code?: string | null
          user_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          author?: string
          coauthor?: string | null
          isrc?: string | null
          iswc?: string | null
          description?: string | null
          status?: 'PENDING' | 'WAITING_PAYMENT' | 'AUTHORIZED' | 'EXCLUSIVE' | 'REJECTED'
          code?: string
          exclusive_code?: string | null
          user_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      work_files: {
        Row: {
          id: string
          name: string
          type: string
          size: number
          url: string
          work_id: string
          uploaded_at: string
        }
        Insert: {
          id?: string
          name: string
          type: string
          size: number
          url: string
          work_id: string
          uploaded_at?: string
        }
        Update: {
          id?: string
          name?: string
          type?: string
          size?: number
          url?: string
          work_id?: string
          uploaded_at?: string
        }
      }
      reports: {
        Row: {
          id: string
          title: string
          description: string
          type: 'PLAGIARISM' | 'INAPPROPRIATE' | 'FALSE_INFO' | 'COPYRIGHT_VIOLATION' | 'OTHER'
          status: 'PENDING' | 'INVESTIGATING' | 'RESOLVED' | 'DISMISSED'
          priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
          work_id: string
          reporter_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          type: 'PLAGIARISM' | 'INAPPROPRIATE' | 'FALSE_INFO' | 'COPYRIGHT_VIOLATION' | 'OTHER'
          status?: 'PENDING' | 'INVESTIGATING' | 'RESOLVED' | 'DISMISSED'
          priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
          work_id: string
          reporter_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          type?: 'PLAGIARISM' | 'INAPPROPRIATE' | 'FALSE_INFO' | 'COPYRIGHT_VIOLATION' | 'OTHER'
          status?: 'PENDING' | 'INVESTIGATING' | 'RESOLVED' | 'DISMISSED'
          priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
          work_id?: string
          reporter_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      author_statistics: {
        Row: {
          id: string
          total_works: number
          authorized_works: number
          pending_works: number
          total_revenue: number
          last_calculated_at: string
          user_id: string
        }
        Insert: {
          id?: string
          total_works?: number
          authorized_works?: number
          pending_works?: number
          total_revenue?: number
          last_calculated_at?: string
          user_id: string
        }
        Update: {
          id?: string
          total_works?: number
          authorized_works?: number
          pending_works?: number
          total_revenue?: number
          last_calculated_at?: string
          user_id?: string
        }
      }
      payments: {
        Row: {
          id: string
          amount: number
          currency: string
          status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'REFUNDED'
          payment_method: string | null
          transaction_id: string | null
          user_id: string
          work_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          amount: number
          currency?: string
          status?: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'REFUNDED'
          payment_method?: string | null
          transaction_id?: string | null
          user_id: string
          work_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          amount?: number
          currency?: string
          status?: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'REFUNDED'
          payment_method?: string | null
          transaction_id?: string | null
          user_id?: string
          work_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      audit_logs: {
        Row: {
          id: string
          action: string
          entity_type: string
          entity_id: string
          old_values: Json | null
          new_values: Json | null
          user_id: string | null
          ip_address: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: {
          id?: string
          action: string
          entity_type: string
          entity_id: string
          old_values?: Json | null
          new_values?: Json | null
          user_id?: string | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          action?: string
          entity_type?: string
          entity_id?: string
          old_values?: Json | null
          new_values?: Json | null
          user_id?: string | null
          ip_address?: string | null
          user_agent?: string | null
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