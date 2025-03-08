import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import AdminHeader from '../../components/admin/AdminHeader';
import DataTable from '../../components/admin/DataTable';
import { formatPrice } from '../../lib/utils';

interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  total_amount: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  created_at: string;
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  }

  const columns = [
    { header: 'Customer', accessor: 'customer_name' as keyof Order },
    { header: 'Email', accessor: 'customer_email' as keyof Order },
    {
      header: 'Total',
      accessor: 'total_amount' as keyof Order,
      render: (value: number) => formatPrice(value),
    },
    {
      header: 'Status',
      accessor: 'status' as keyof Order,
      render: (value: Order['status']) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            {
              pending: 'bg-yellow-100 text-yellow-800',
              processing: 'bg-blue-100 text-blue-800',
              completed: 'bg-green-100 text-green-800',
              cancelled: 'bg-red-100 text-red-800',
            }[value]
          }`}
        >
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      ),
    },
    {
      header: 'Date',
      accessor: 'created_at' as keyof Order,
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
        title="Orders"
        description="Manage customer orders"
      />

      <div className="bg-white rounded-lg shadow">
        <DataTable
          columns={columns}
          data={orders}
          onRowClick={(order) => console.log('Selected order:', order)}
        />
      </div>
    </div>
  );
}