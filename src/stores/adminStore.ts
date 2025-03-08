import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { Database } from '../types/supabase';

type Category = Database['public']['Tables']['categories']['Row'];
type Supplier = Database['public']['Tables']['suppliers']['Row'];
type Product = Database['public']['Tables']['products']['Row'];
type Order = Database['public']['Tables']['orders']['Row'];

interface AdminStore {
  // Categories
  categories: Category[];
  loadingCategories: boolean;
  fetchCategories: () => Promise<void>;
  createCategory: (category: Partial<Category>) => Promise<Category | null>;
  updateCategory: (id: string, category: Partial<Category>) => Promise<Category | null>;
  deleteCategory: (id: string) => Promise<void>;

  // Suppliers
  suppliers: Supplier[];
  loadingSuppliers: boolean;
  fetchSuppliers: () => Promise<void>;
  createSupplier: (supplier: Partial<Supplier>) => Promise<Supplier | null>;
  updateSupplier: (id: string, supplier: Partial<Supplier>) => Promise<Supplier | null>;
  deleteSupplier: (id: string) => Promise<void>;

  // Products
  products: Product[];
  loadingProducts: boolean;
  fetchProducts: () => Promise<void>;
  createProduct: (product: Partial<Product>) => Promise<Product | null>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<Product | null>;
  deleteProduct: (id: string) => Promise<void>;

  // Orders
  orders: Order[];
  loadingOrders: boolean;
  fetchOrders: () => Promise<void>;
  updateOrderStatus: (id: string, status: Order['status']) => Promise<Order | null>;
}

export const useAdminStore = create<AdminStore>((set, get) => ({
  // Categories
  categories: [],
  loadingCategories: false,
  fetchCategories: async () => {
    set({ loadingCategories: true });
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('position');
      
      if (error) throw error;
      set({ categories: data || [] });
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      set({ loadingCategories: false });
    }
  },
  createCategory: async (category) => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .insert(category)
        .select()
        .single();
      
      if (error) throw error;
      if (data) {
        set((state) => ({ categories: [...state.categories, data] }));
        return data;
      }
      return null;
    } catch (error) {
      console.error('Error creating category:', error);
      return null;
    }
  },
  updateCategory: async (id, category) => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .update(category)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      if (data) {
        set((state) => ({
          categories: state.categories.map((c) => (c.id === id ? data : c)),
        }));
        return data;
      }
      return null;
    } catch (error) {
      console.error('Error updating category:', error);
      return null;
    }
  },
  deleteCategory: async (id) => {
    try {
      const { error } = await supabase.from('categories').delete().eq('id', id);
      if (error) throw error;
      set((state) => ({
        categories: state.categories.filter((c) => c.id !== id),
      }));
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  },

  // Suppliers
  suppliers: [],
  loadingSuppliers: false,
  fetchSuppliers: async () => {
    set({ loadingSuppliers: true });
    try {
      const { data, error } = await supabase
        .from('suppliers')
        .select('*')
        .order('name');
      
      if (error) throw error;
      set({ suppliers: data || [] });
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    } finally {
      set({ loadingSuppliers: false });
    }
  },
  createSupplier: async (supplier) => {
    try {
      const { data, error } = await supabase
        .from('suppliers')
        .insert(supplier)
        .select()
        .single();
      
      if (error) throw error;
      if (data) {
        set((state) => ({ suppliers: [...state.suppliers, data] }));
        return data;
      }
      return null;
    } catch (error) {
      console.error('Error creating supplier:', error);
      return null;
    }
  },
  updateSupplier: async (id, supplier) => {
    try {
      const { data, error } = await supabase
        .from('suppliers')
        .update(supplier)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      if (data) {
        set((state) => ({
          suppliers: state.suppliers.map((s) => (s.id === id ? data : s)),
        }));
        return data;
      }
      return null;
    } catch (error) {
      console.error('Error updating supplier:', error);
      return null;
    }
  },
  deleteSupplier: async (id) => {
    try {
      const { error } = await supabase.from('suppliers').delete().eq('id', id);
      if (error) throw error;
      set((state) => ({
        suppliers: state.suppliers.filter((s) => s.id !== id),
      }));
    } catch (error) {
      console.error('Error deleting supplier:', error);
    }
  },

  // Products
  products: [],
  loadingProducts: false,
  fetchProducts: async () => {
    set({ loadingProducts: true });
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*, category:categories(*), supplier:suppliers(*)')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      set({ products: data || [] });
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      set({ loadingProducts: false });
    }
  },
  createProduct: async (product) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert(product)
        .select('*, category:categories(*), supplier:suppliers(*)')
        .single();
      
      if (error) throw error;
      if (data) {
        set((state) => ({ products: [...state.products, data] }));
        return data;
      }
      return null;
    } catch (error) {
      console.error('Error creating product:', error);
      return null;
    }
  },
  updateProduct: async (id, product) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .update(product)
        .eq('id', id)
        .select('*, category:categories(*), supplier:suppliers(*)')
        .single();
      
      if (error) throw error;
      if (data) {
        set((state) => ({
          products: state.products.map((p) => (p.id === id ? data : p)),
        }));
        return data;
      }
      return null;
    } catch (error) {
      console.error('Error updating product:', error);
      return null;
    }
  },
  deleteProduct: async (id) => {
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      set((state) => ({
        products: state.products.filter((p) => p.id !== id),
      }));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  },

  // Orders
  orders: [],
  loadingOrders: false,
  fetchOrders: async () => {
    set({ loadingOrders: true });
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      set({ orders: data || [] });
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      set({ loadingOrders: false });
    }
  },
  updateOrderStatus: async (id, status) => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      if (data) {
        set((state) => ({
          orders: state.orders.map((o) => (o.id === id ? data : o)),
        }));
        return data;
      }
      return null;
    } catch (error) {
      console.error('Error updating order status:', error);
      return null;
    }
  },
}));