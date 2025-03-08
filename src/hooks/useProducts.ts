import { useState } from 'react';
import { useAdminStore } from '../stores/adminStore';
import { Database } from '../types/supabase';
import { generateSlug } from '../lib/utils';

type Product = Database['public']['Tables']['products']['Row'];
type ProductInput = Omit<Product, 'id' | 'created_at' | 'updated_at'>;

export function useProducts() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { createProduct, updateProduct, deleteProduct } = useAdminStore();

  const handleCreate = async (data: Partial<ProductInput>) => {
    setLoading(true);
    setError(null);

    try {
      const product = {
        name: data.name!,
        slug: data.slug || generateSlug(data.name!),
        description: data.description || null,
        price: data.price!,
        cost: data.cost || 0,
        stock: data.stock || 0,
        min_stock: data.min_stock || 0,
        sku: data.sku || null,
        images: data.images || [],
        related_products: data.related_products || [],
        category_id: data.category_id || null,
        supplier_id: data.supplier_id || null,
        discount_id: data.discount_id || null,
      };

      const result = await createProduct(product);
      if (!result) throw new Error('Failed to create product');
      return result;
    } catch (err) {
      const error = err as Error;
      setError(error.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id: string, data: Partial<ProductInput>) => {
    setLoading(true);
    setError(null);

    try {
      if (data.name && !data.slug) {
        data.slug = generateSlug(data.name);
      }

      const result = await updateProduct(id, data);
      if (!result) throw new Error('Failed to update product');
      return result;
    } catch (err) {
      const error = err as Error;
      setError(error.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      await deleteProduct(id);
    } catch (err) {
      const error = err as Error;
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    createProduct: handleCreate,
    updateProduct: handleUpdate,
    deleteProduct: handleDelete,
  };
}