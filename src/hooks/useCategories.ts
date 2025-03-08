import { useState } from 'react';
import { useAdminStore } from '../stores/adminStore';
import { Database } from '../types/supabase';
import { generateSlug } from '../lib/utils';

type Category = Database['public']['Tables']['categories']['Row'];
type CategoryInput = Omit<Category, 'id' | 'created_at' | 'updated_at'>;

export function useCategories() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { createCategory, updateCategory, deleteCategory } = useAdminStore();

  const handleCreate = async (data: Partial<CategoryInput>) => {
    setLoading(true);
    setError(null);

    try {
      const category = {
        name: data.name!,
        slug: data.slug || generateSlug(data.name!),
        description: data.description || null,
        status: data.status || 'active',
        parent_id: data.parent_id || null,
        position: data.position || 0,
      };

      const result = await createCategory(category);
      if (!result) throw new Error('Failed to create category');
      return result;
    } catch (err) {
      const error = err as Error;
      setError(error.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id: string, data: Partial<CategoryInput>) => {
    setLoading(true);
    setError(null);

    try {
      if (data.name && !data.slug) {
        data.slug = generateSlug(data.name);
      }

      const result = await updateCategory(id, data);
      if (!result) throw new Error('Failed to update category');
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
      await deleteCategory(id);
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
    createCategory: handleCreate,
    updateCategory: handleUpdate,
    deleteCategory: handleDelete,
  };
}