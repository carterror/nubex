import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function CategoryFilter() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState<Category[]>([]);
  const selectedCategory = searchParams.get('category') || '';

  useEffect(() => {
    async function fetchCategories() {
      const { data } = await supabase
        .from('categories')
        .select('id, name, slug')
        .order('name');
      
      if (data) {
        setCategories(data);
      }
    }

    fetchCategories();
  }, []);

  const handleCategoryChange = (slug: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (slug) {
      newParams.set('category', slug);
    } else {
      newParams.delete('category');
    }
    setSearchParams(newParams);
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-4">Categories</h3>
      <div className="space-y-2">
        <label className="flex items-center">
          <input
            type="radio"
            name="category"
            checked={!selectedCategory}
            onChange={() => handleCategoryChange('')}
            className="form-radio text-blue-600"
          />
          <span className="ml-2">All Categories</span>
        </label>
        {categories.map((category) => (
          <label key={category.id} className="flex items-center">
            <input
              type="radio"
              name="category"
              checked={selectedCategory === category.slug}
              onChange={() => handleCategoryChange(category.slug)}
              className="form-radio text-blue-600"
            />
            <span className="ml-2">{category.name}</span>
          </label>
        ))}
      </div>
    </div>
  );
}