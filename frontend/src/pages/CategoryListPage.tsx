import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { DataTable } from '../components/shared/DataTable';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Select } from '../components/ui/Select';
import { mockCategories } from '../utils/mockData';
import { CategoryItem } from '../utils/types';
export function CategoryListPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<CategoryItem[]>(mockCategories);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('All');
  const handleDelete = () => {
    if (deleteId) {
      setCategories(categories.filter(c => c.id !== deleteId));
      setDeleteId(null);
    }
  };
  const filteredCategories = categories.filter(category => {
    return statusFilter === 'All' || category.status === statusFilter;
  });
  const columns = [{
    header: 'Category Name',
    accessorKey: 'name' as keyof CategoryItem
  }, {
    header: 'Description',
    accessorKey: 'description' as keyof CategoryItem,
    cell: (item: CategoryItem) => <span className="block max-w-md truncate" title={item.description}>
          {item.description}
        </span>
  }, {
    header: 'Status',
    accessorKey: 'status' as keyof CategoryItem,
    cell: (item: CategoryItem) => {
      const colors = {
        Active: 'bg-green-100 text-green-800',
        Inactive: 'bg-gray-100 text-gray-800'
      };
      return <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[item.status]}`}>
            {item.status}
          </span>;
    }
  }, {
    header: 'Created Date',
    accessorKey: 'createdDate' as keyof CategoryItem
  }, {
    header: 'Actions',
    accessorKey: 'id' as keyof CategoryItem,
    cell: (item: CategoryItem) => <div className="flex items-center gap-2">
          <button onClick={() => navigate(`/categories/edit/${item.id}`)} className="p-1 text-slate-400 hover:text-blue-600 transition-colors" title="Edit">
            <Edit2 className="w-4 h-4" />
          </button>
          <button onClick={() => setDeleteId(item.id)} className="p-1 text-slate-400 hover:text-red-600 transition-colors" title="Delete">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
  }];
  return <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Category Management
          </h2>
          <p className="text-slate-500">
            Manage tender categories and classifications
          </p>
        </div>
        <Button onClick={() => navigate('/categories/add')} leftIcon={<Plus className="w-4 h-4" />}>
          Add New Category
        </Button>
      </div>

      <DataTable data={filteredCategories} columns={columns} searchKey="name" searchPlaceholder="Search by category name..." filters={<Select className="w-32" options={[{
      value: 'All',
      label: 'All Status'
    }, {
      value: 'Active',
      label: 'Active'
    }, {
      value: 'Inactive',
      label: 'Inactive'
    }]} value={statusFilter} onChange={e => setStatusFilter(e.target.value)} />} />

      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Category" footer={<>
            <Button variant="ghost" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete Category
            </Button>
          </>}>
        <p className="text-slate-600">
          Are you sure you want to delete this category? This action cannot be
          undone.
        </p>
      </Modal>
    </div>;
}