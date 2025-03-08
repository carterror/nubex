import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import AdminHeader from '../../components/admin/AdminHeader';
import DataTable from '../../components/admin/DataTable';
import { Plus } from 'lucide-react';
import { formatPrice } from '../../lib/utils';
import ProductForm from '../../components/admin/ProductForm';
import Modal from '../../components/admin/Modal';

// Add state for modal

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  created_at: string;
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  }

  const columns = [
    { header: 'Name', accessor: 'name' as keyof Product },
    {
      header: 'Price',
      accessor: 'price' as keyof Product,
      render: (value: number) => formatPrice(value),
    },
    {
      header: 'Stock',
      accessor: 'stock' as keyof Product,
      render: (value: number) => (
        <span
          className={`${
            value > 0 ? 'text-green-600' : 'text-red-600'
          } font-medium`}
        >
          {value}
        </span>
      ),
    },
    {
      header: 'Created',
      accessor: 'created_at' as keyof Product,
      render: (value: string) =>
        new Date(value).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        }),
    },
  ];

  return (
    <div>
      <AdminHeader
        title="Products"
        description="Manage your product catalog"
        action={
          <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700" onClick={() => setIsModalOpen(true)}>
            <Plus className="h-5 w-5" />
            <span>Add Product</span>
          </button>
        }
      />

      <div className="bg-white rounded-lg shadow">
        <DataTable
          columns={columns}
          data={products}
          onRowClick={(product) => console.log('Selected product:', product)}
        />
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Product"
      >
        <ProductForm
          onSuccess={(product) => {
            setIsModalOpen(false);
            // Optionally refresh your products list
          }}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
}