import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';
import CategoryFilter from '../components/CategoryFilter';
import PriceFilter from '../components/PriceFilter';
import Pagination from '../components/Pagination';
import LoadingSpinner from '../components/LoadingSpinner';

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  images: string[];
}

export default function Products() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const currentPage = Number(searchParams.get('page')) || 1;
  const category = searchParams.get('category');
  const query = searchParams.get('q');
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      let queryBuilder = supabase
        .from('products')
        .select('*', { count: 'exact' });

      // Apply filters
      if (category) {
        queryBuilder = queryBuilder.eq('category_id', category);
      }
      if (query) {
        queryBuilder = queryBuilder.ilike('name', `%${query}%`);
      }
      if (minPrice) {
        queryBuilder = queryBuilder.gte('price', minPrice);
      }
      if (maxPrice) {
        queryBuilder = queryBuilder.lte('price', maxPrice);
      }

      // Pagination
      const itemsPerPage = 12;
      const from = (currentPage - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;

      const { data, count, error } = await queryBuilder
        .range(from, to)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching products:', error);
        return;
      }

      if (data && count) {
        setProducts(data);
        setTotalPages(Math.ceil(count / itemsPerPage));
      }
      setLoading(false);
    }

    fetchProducts();
  }, [category, query, minPrice, maxPrice, currentPage]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Filters */}
      <div className="space-y-6">
        <div className="lg:hidden">
          <SearchBar />
        </div>
        <CategoryFilter />
        <PriceFilter />
      </div>

      {/* Products Grid */}
      <div className="lg:col-span-3">
        <div className="hidden lg:block mb-8">
          <SearchBar />
        </div>
        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No products found.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => {
                const newParams = new URLSearchParams(searchParams);
                newParams.set('page', page.toString());
                setSearchParams(newParams);
              }}
            />
          </>
        )}
      </div>
    </div>
  );
}