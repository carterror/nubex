import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import AdminHeader from '../../components/admin/AdminHeader';
import DataTable from '../../components/admin/DataTable';
import { Plus } from 'lucide-react';
import CategoryForm from '../../components/admin/CategoryForm';
import Modal from '../../components/admin/Modal';

interface Category {
  id: string;
  name: string;
  description: string;
  created_at: string;
}

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);



// Add state for modal
const [isModalOpen, setIsModalOpen] = useState(false);

// In your JSX
  
  async function fetchCategories() {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  }

  const columns = [
    { header: 'Name', accessor: 'name' as keyof Category },
    { header: 'Description', accessor: 'description' as keyof Category },
    {
      header: 'Created',
      accessor: 'created_at' as keyof Category,
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
        title="Categories"
        description="Manage your product categories"
        action={
          <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700" onClick={() => setIsModalOpen(true)}>
            <Plus className="h-5 w-5" />
            <span>Add Category</span>
          </button>
        }
      />

      <div className="bg-white rounded-lg shadow">
        <DataTable
          columns={columns}
          data={categories}
          onRowClick={(category) => console.log('Selected category:', category)}
        />
      </div>


      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Category"
      >
        <CategoryForm
          onSuccess={(category) => {
            setIsModalOpen(false);
            // Optionally refresh your categories list
          }}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>

    </div>
  );
}