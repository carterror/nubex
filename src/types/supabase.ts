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
      categories: {
        Row: {
          id: string
          name: string
          description: string | null
          slug: string
          status: 'active' | 'inactive'
          parent_id: string | null
          position: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          slug: string
          status?: 'active' | 'inactive'
          parent_id?: string | null
          position?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          slug?: string
          status?: 'active' | 'inactive'
          parent_id?: string | null
          position?: number
          created_at?: string
          updated_at?: string
        }
      }
      category_images: {
        Row: {
          id: string
          category_id: string
          url: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          category_id: string
          url: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          category_id?: string
          url?: string
          created_at?: string
          updated_at?: string
        }
      }
      suppliers: {
        Row: {
          id: string
          name: string
          contact_name: string | null
          email: string | null
          phone: string | null
          address: string | null
          status: 'active' | 'inactive'
          tax_id: string | null
          rating: number
          performance_metrics: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          contact_name?: string | null
          email?: string | null
          phone?: string | null
          address?: string | null
          status?: 'active' | 'inactive'
          tax_id?: string | null
          rating?: number
          performance_metrics?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          contact_name?: string | null
          email?: string | null
          phone?: string | null
          address?: string | null
          status?: 'active' | 'inactive'
          tax_id?: string | null
          rating?: number
          performance_metrics?: Json
          created_at?: string
          updated_at?: string
        }
      }
      supplier_documents: {
        Row: {
          id: string
          supplier_id: string
          name: string
          url: string
          type: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          supplier_id: string
          name: string
          url: string
          type: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          supplier_id?: string
          name?: string
          url?: string
          type?: string
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          price: number
          cost: number
          stock: number
          min_stock: number
          sku: string | null
          images: string[]
          related_products: string[]
          category_id: string | null
          supplier_id: string | null
          discount_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          price: number
          cost?: number
          stock?: number
          min_stock?: number
          sku?: string | null
          images?: string[]
          related_products?: string[]
          category_id?: string | null
          supplier_id?: string | null
          discount_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          price?: number
          cost?: number
          stock?: number
          min_stock?: number
          sku?: string | null
          images?: string[]
          related_products?: string[]
          category_id?: string | null
          supplier_id?: string | null
          discount_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      product_variants: {
        Row: {
          id: string
          product_id: string
          name: string
          sku: string | null
          price: number
          stock: number
          attributes: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          product_id: string
          name: string
          sku?: string | null
          price: number
          stock?: number
          attributes?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          name?: string
          sku?: string | null
          price?: number
          stock?: number
          attributes?: Json
          created_at?: string
          updated_at?: string
        }
      }
      product_images: {
        Row: {
          id: string
          product_id: string
          url: string
          position: number
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          url: string
          position?: number
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          url?: string
          position?: number
          created_at?: string
        }
      }
      product_seo: {
        Row: {
          id: string
          product_id: string
          meta_title: string | null
          meta_description: string | null
          meta_keywords: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          product_id: string
          meta_title?: string | null
          meta_description?: string | null
          meta_keywords?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          meta_title?: string | null
          meta_description?: string | null
          meta_keywords?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          customer_name: string
          customer_email: string
          customer_phone: string
          customer_address: string
          total_amount: number
          status: 'pending' | 'processing' | 'completed' | 'cancelled'
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          customer_name: string
          customer_email: string
          customer_phone: string
          customer_address: string
          total_amount: number
          status?: 'pending' | 'processing' | 'completed' | 'cancelled'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          customer_name?: string
          customer_email?: string
          customer_phone?: string
          customer_address?: string
          total_amount?: number
          status?: 'pending' | 'processing' | 'completed' | 'cancelled'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      activity_logs: {
        Row: {
          id: string
          user_id: string
          action: string
          entity_type: string
          entity_id: string
          details: Json
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          action: string
          entity_type: string
          entity_id: string
          details?: Json
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          action?: string
          entity_type?: string
          entity_id?: string
          details?: Json
          created_at?: string
        }
      }
      user_roles: {
        Row: {
          id: string
          user_id: string
          role: 'admin' | 'manager' | 'editor'
          permissions: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          role: 'admin' | 'manager' | 'editor'
          permissions?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          role?: 'admin' | 'manager' | 'editor'
          permissions?: Json
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}