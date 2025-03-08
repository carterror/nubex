import { useState } from 'react';
import { useCategories } from '../../hooks/useCategories';
import { Database } from '../../types/supabase';
import FileUpload from './FileUpload';
import RichTextEditor from './RichTextEditor';

type Category = Database['public']['Tables']['categories']['Row'];

interface CategoryFormProps {
  initialData?: Partial<Category>;
  onSuccess?: (category: Category) => void;
  onCancel?: () => void;
}

export default function CategoryForm({
  initialData,
  onSuccess,
  onCancel,
}: CategoryFormProps) {
  const { createCategory, updateCategory, loading, error } = useCategories();
  const [form, setForm] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    status: initialData?.status || 'active',
    parent_id: initialData?.parent_id || null,
    position: initialData?.position || 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = initialData?.id
      ? await updateCategory(initialData.id, form)
      : await createCategory(form);

    if (result) {
      onSuccess?.(result);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
          {error}
        </div>
      )}

      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Description
        </label>
        <RichTextEditor
          value={form.description || ''}
          onChange={(value) =>
            setForm((prev) => ({ ...prev, description: value }))
          }
        />
      </div>

      <div>
        <label
          htmlFor="status"
          className="block text-sm font-medium text-gray-700"
        >
          Status
        </label>
        <select
          id="status"
          name="status"
          value={form.status}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div>
        <label
          htmlFor="position"
          className="block text-sm font-medium text-gray-700"
        >
          Position
        </label>
        <input
          type="number"
          id="position"
          name="position"
          value={form.position}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Category Image
        </label>
        <FileUpload
          bucket="product-images"
          path="categories/"
          accept="image/*"
          multiple={false}
          maxFiles={1}
          onChange={(urls) =>
            setForm((prev) => ({ ...prev, image: urls[0] }))
          }
        />
      </div>

      <div className="flex justify-end space-x-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading
            ? 'Saving...'
            : initialData?.id
            ? 'Update Category'
            : 'Create Category'}
        </button>
      </div>
    </form>
  );
}