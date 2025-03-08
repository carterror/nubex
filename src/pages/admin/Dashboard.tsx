import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import AdminHeader from '../../components/admin/AdminHeader';
import { ShoppingBag, Package, Tags, TrendingUp } from 'lucide-react';
import { formatPrice } from '../../lib/utils';

interface DashboardStats {
  totalOrders: number;
  totalProducts: number;
  totalCategories: number;
  totalRevenue: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalProducts: 0,
    totalCategories: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [
          { count: ordersCount },
          { count: productsCount },
          { count: categoriesCount },
          { data: orders },
        ] = await Promise.all([
          supabase.from('orders').select('*', { count: 'exact' }),
          supabase.from('products').select('*', { count: 'exact' }),
          supabase.from('categories').select('*', { count: 'exact' }),
          supabase.from('orders').select('total_amount'),
        ]);

        const totalRevenue = orders?.reduce(
          (sum, order) => sum + (order.total_amount || 0),
          0
        );

        setStats({
          totalOrders: ordersCount || 0,
          totalProducts: productsCount || 0,
          totalCategories: categoriesCount || 0,
          totalRevenue: totalRevenue || 0,
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingBag,
      color: 'bg-blue-500',
    },
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: Package,
      color: 'bg-green-500',
    },
    {
      title: 'Categories',
      value: stats.totalCategories,
      icon: Tags,
      color: 'bg-purple-500',
    },
    {
      title: 'Total Revenue',
      value: formatPrice(stats.totalRevenue),
      icon: TrendingUp,
      color: 'bg-yellow-500',
    },
  ];

  return (
    <div>
      <AdminHeader
        title="Dashboard"
        description="Overview of your store's performance"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-sm p-6 flex items-center"
          >
            <div
              className={`${stat.color} p-4 rounded-lg text-white mr-4`}
            >
              <stat.icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-600">{stat.title}</p>
              <p className="text-2xl font-semibold">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Add more dashboard sections here */}
    </div>
  );
}