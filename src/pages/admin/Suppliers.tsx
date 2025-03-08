import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import AdminHeader from '../../components/admin/AdminHeader';
import DataTable from '../../components/admin/DataTable';
import { Plus } from 'lucide-react';

interface Supplier {
  id: string;
  name: string;
  contact: string;
  email: string;
  created_at: string;
}

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  async function fetchSuppliers() {
    try {
      const { data, error } = await supabase
        .from('suppliers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setSuppliers(data);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    } finally {
      setLoading(false);
    }
  }

  const columns = [
    { header: 'Name', accessor: 'name' as keyof Supplier },
    { header: 'Contact', accessor: 'contact' as keyof Supplier },
    { header: 'Email', accessor: 'email' as keyof Supplier },
    {
      header: 'Created',
      accessor: 'created_at' as keyof Supplier,
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
        title="Suppliers"
        description="Manage your product suppliers"
        action={
          <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            <Plus className="h-5 w-5" />
            <span>Add Supplier</span>
          </button>
        }
      />

      <div className="bg-white rounded-lg shadow">
        <DataTable
          columns={columns}
          data={suppliers}
          onRowClick={(supplier) => console.log('Selected supplier:', supplier)}
        />
      </div>
    </div>
  );
}