import { useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function PriceFilter() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');

  useEffect(() => {
    const newParams = new URLSearchParams(searchParams);
    if (minPrice) {
      newParams.set('minPrice', minPrice);
    } else {
      newParams.delete('minPrice');
    }
    if (maxPrice) {
      newParams.set('maxPrice', maxPrice);
    } else {
      newParams.delete('maxPrice');
    }
    setSearchParams(newParams);
  }, [minPrice, maxPrice]);

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-4">Price Range</h3>
      <div className="space-y-4">
        <div>
          <label htmlFor="minPrice" className="block text-sm text-gray-600">
            Min Price
          </label>
          <input
            type="number"
            id="minPrice"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            min="0"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
          />
        </div>
        <div>
          <label htmlFor="maxPrice" className="block text-sm text-gray-600">
            Max Price
          </label>
          <input
            type="number"
            id="maxPrice"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            min="0"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
          />
        </div>
      </div>
    </div>
  );
}