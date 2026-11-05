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
      profiles: {
        Row: {
          id: string
          email: string
          role: 'admin' | 'seller' | 'goldsmith'
          first_name: string | null
          last_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          role?: 'admin' | 'seller' | 'goldsmith'
          first_name?: string | null
          last_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          role?: 'admin' | 'seller' | 'goldsmith'
          first_name?: string | null
          last_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          name: string
          sku: string
          category: string
          metal_type: string | null
          weight_grams: number | null
          cost_price: number
          sale_price: number
          stock_quantity: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          sku: string
          category: string
          metal_type?: string | null
          weight_grams?: number | null
          cost_price: number
          sale_price: number
          stock_quantity?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          sku?: string
          category?: string
          metal_type?: string | null
          weight_grams?: number | null
          cost_price?: number
          sale_price?: number
          stock_quantity?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      workshop_orders: {
        Row: {
          id: string
          order_number: string
          customer_name: string
          customer_phone: string | null
          item_description: string
          service_type: 'repair' | 'custom_fabrication' | 'resizing' | 'engraving' | 'cleaning'
          metal_received_grams: number | null
          assigned_goldsmith_id: string | null
          status: 'pending' | 'in_progress' | 'ready' | 'delivered' | 'cancelled'
          estimated_cost: number
          actual_cost: number | null
          created_at: string
          delivery_date: string | null
        }
        Insert: {
          id?: string
          order_number: string
          customer_name: string
          customer_phone?: string | null
          item_description: string
          service_type: 'repair' | 'custom_fabrication' | 'resizing' | 'engraving' | 'cleaning'
          metal_received_grams?: number | null
          assigned_goldsmith_id?: string | null
          status?: 'pending' | 'in_progress' | 'ready' | 'delivered' | 'cancelled'
          estimated_cost?: number
          actual_cost?: number | null
          created_at?: string
          delivery_date?: string | null
        }
        Update: {
          id?: string
          order_number?: string
          customer_name?: string
          customer_phone?: string | null
          item_description?: string
          service_type?: 'repair' | 'custom_fabrication' | 'resizing' | 'engraving' | 'cleaning'
          metal_received_grams?: number | null
          assigned_goldsmith_id?: string | null
          status?: 'pending' | 'in_progress' | 'ready' | 'delivered' | 'cancelled'
          estimated_cost?: number
          actual_cost?: number | null
          created_at?: string
          delivery_date?: string | null
        }
      }
      sales: {
        Row: {
          id: string
          invoice_number: string
          seller_id: string
          customer_name: string | null
          total_amount: number
          payment_method: 'cash' | 'card' | 'transfer' | 'mixed'
          status: 'completed' | 'cancelled' | 'refunded'
          created_at: string
        }
        Insert: {
          id?: string
          invoice_number: string
          seller_id: string
          customer_name?: string | null
          total_amount: number
          payment_method: 'cash' | 'card' | 'transfer' | 'mixed'
          status?: 'completed' | 'cancelled' | 'refunded'
          created_at?: string
        }
        Update: {
          id?: string
          invoice_number?: string
          seller_id?: string
          customer_name?: string | null
          total_amount?: number
          payment_method?: 'cash' | 'card' | 'transfer' | 'mixed'
          status?: 'completed' | 'cancelled' | 'refunded'
          created_at?: string
        }
      }
      expenses: {
        Row: {
          id: string
          category: string
          description: string
          amount: number
          registered_by: string
          expense_date: string
          created_at: string
        }
        Insert: {
          id?: string
          category: string
          description: string
          amount: number
          registered_by: string
          expense_date?: string
          created_at?: string
        }
        Update: {
          id?: string
          category?: string
          description?: string
          amount?: number
          registered_by?: string
          expense_date?: string
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
      user_role: 'admin' | 'seller' | 'goldsmith'
      order_status: 'pending' | 'in_progress' | 'ready' | 'delivered' | 'cancelled'
    }
  }
}

