import { useState, useEffect } from 'react';
import { useProducts } from '../../hooks/useProducts';
import { Database } from '../../types/supabase';
import { supabase } from '../../lib/supabase';
import FileUpload from './FileUpload';
import RichTextEditor from './RichTextEditor';

type Product = Database['public']['Tables']['products']['Row'];
type Category = Database['public']['Tables']['categories']['Row'];

interface ProductFormProps {
  initialData?: Partial<Product>;
  onSuccess?: (product: Product) => void;
  onCancel?: () => void;
}

export default function ProductForm({
  initialData,
  onSuccess,
  onCancel,
}: ProductFormProps) {
  const { createProduct, updateProduct, loading, error } = useProducts();
  const [categories, setCategories] = useState<Category[]>([]);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  
  const [form, setForm] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    price: initialData?.price || '',
    category_id: initialData?.category_id || '',
    sku: initialData?.sku || '',
    stock: initialData?.stock || 0,
    images: initialData?.images || [],
  });

  useEffect(() => {
    async function fetchCategories() {
      const { data } = await supabase
        .from('categories')
        .select('id, name')
        .eq('status', 'active')
        .order('name');
      
      if (data) {
        setCategories(data);
      }
    }

    fetchCategories();
  }, []);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!form.name.trim()) {
      errors.name = 'Product name is required';
    }

    if (!form.description.trim()) {
      errors.description = 'Product description is required';
    }

    if (!form.price || Number(form.price) <= 0) {
      errors.price = 'Price must be greater than 0';
    }

    if (!form.sku.trim()) {
      errors.sku = 'SKU is required';
    } else if (!/^[A-Za-z0-9-]+$/.test(form.sku)) {
      errors.sku = 'SKU can only contain letters, numbers, and hyphens';
    }

    if (form.stock < 0) {
      errors.stock = 'Stock cannot be negative';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const productData = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
    };

    const result = initialData?.id
      ? await updateProduct(initialData.id, productData)
      : await createProduct(productData);

    if (result) {
      onSuccess?.(result);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear validation error when field is modified
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: '' }));
    }
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
          Product Name *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={form.name}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-md shadow-sm focus:ring focus:ring-opacity-50 ${
            validationErrors.name
              ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
          }`}
        />
        {validationErrors.name && (
          <p className="mt-1 text-sm text-red-500">{validationErrors.name}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Description *
        </label>
        <RichTextEditor
          value={form.description}
          onChange={(value) => {
            setForm((prev) => ({ ...prev, description: value }));
            if (validationErrors.description) {
              setValidationErrors((prev) => ({ ...prev, description: '' }));
            }
          }}
        />
        {validationErrors.description && (
          <p className="mt-1 text-sm text-red-500">{validationErrors.description}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="price"
            className="block text-sm font-medium text-gray-700"
          >
            Price *
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              type="number"
              id="price"
              name="price"
              value={form.price}
              onChange={handleChange}
              step="0.01"
              min="0"
              className={`pl-7 block w-full rounded-md shadow-sm focus:ring focus:ring-opacity-50 ${
                validationErrors.price
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
              }`}
            />
          </div>
          {validationErrors.price && (
            <p className="mt-1 text-sm text-red-500">{validationErrors.price}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="stock"
            className="block text-sm font-medium text-gray-700"
          >
            Stock Quantity
          </label>
          <input
            type="number"
            id="stock"
            name="stock"
            value={form.stock}
            onChange={handleChange}
            min="0"
            className={`mt-1 block w-full rounded-md shadow-sm focus:ring focus:ring-opacity-50 ${
              validationErrors.stock
                ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
            }`}
          />
          {validationErrors.stock && (
            <p className="mt-1 text-sm text-red-500">{validationErrors.stock}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="category_id"
            className="block text-sm font-medium text-gray-700"
          >
            Category
          </label>
          <select
            id="category_id"
            name="category_id"
            value={form.category_id}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="sku"
            className="block text-sm font-medium text-gray-700"
          >
            SKU/Product Code *
          </label>
          <input
            type="text"
            id="sku"
            name="sku"
            value={form.sku}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md shadow-sm focus:ring focus:ring-opacity-50 ${
              validationErrors.sku
                ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
            }`}
          />
          {validationErrors.sku && (
            <p className="mt-1 text-sm text-red-500">{validationErrors.sku}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Product Images
        </label>
        <FileUpload
          bucket="product-images"
          path="products/"
          accept="image/*"
          multiple={true}
          maxFiles={5}
          value={form.images}
          onChange={(urls) =>
            setForm((prev) => ({ ...prev, images: urls }))
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
            ? 'Update Product'
            : 'Create Product'}
        </button>
      </div>
    </form>
  );
}