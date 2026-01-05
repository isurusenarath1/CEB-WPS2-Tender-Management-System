import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { DataTable } from '../components/shared/DataTable';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Select } from '../components/ui/Select';
import { mockDepartments } from '../utils/mockData';
import { Department } from '../utils/types';
export function DepartmentListPage() {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState<Department[]>(mockDepartments);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('All');
  const handleDelete = () => {
    if (deleteId) {
      setDepartments(departments.filter(d => d.id !== deleteId));
      setDeleteId(null);
    }
  };
  const filteredDepartments = departments.filter(department => {
    return statusFilter === 'All' || department.status === statusFilter;
  });
  const columns = [{
    header: 'Department Name',
    accessorKey: 'name' as keyof Department
  }, {
    header: 'Code',
    accessorKey: 'code' as keyof Department
  }, {
    header: 'Description',
    accessorKey: 'description' as keyof Department,
    cell: (item: Department) => <span className="block max-w-md truncate" title={item.description}>
          {item.description}
        </span>
  }, {
    header: 'Head of Department',
    accessorKey: 'headOfDepartment' as keyof Department
  }, {
    header: 'Status',
    accessorKey: 'status' as keyof Department,
    cell: (item: Department) => {
      const colors = {
        Active: 'bg-green-100 text-green-800',
        Inactive: 'bg-gray-100 text-gray-800'
      };
      return <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[item.status]}`}>
            {item.status}
          </span>;
    }
  }, {
    header: 'Actions',
    accessorKey: 'id' as keyof Department,
    cell: (item: Department) => <div className="flex items-center gap-2">
          <button onClick={() => navigate(`/departments/edit/${item.id}`)} className="p-1 text-slate-400 hover:text-blue-600 transition-colors" title="Edit">
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
            Department Management
          </h2>
          <p className="text-slate-500">
            Manage organizational departments and units
          </p>
        </div>
        <Button onClick={() => navigate('/departments/add')} leftIcon={<Plus className="w-4 h-4" />}>
          Add New Department
        </Button>
      </div>

      <DataTable data={filteredDepartments} columns={columns} searchKey="name" searchPlaceholder="Search by department name..." filters={<Select className="w-32" options={[{
      value: 'All',
      label: 'All Status'
    }, {
      value: 'Active',
      label: 'Active'
    }, {
      value: 'Inactive',
      label: 'Inactive'
    }]} value={statusFilter} onChange={e => setStatusFilter(e.target.value)} />} />

      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Department" footer={<>
            <Button variant="ghost" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete Department
            </Button>
          </>}>
        <p className="text-slate-600">
          Are you sure you want to delete this department? This action cannot be
          undone.
        </p>
      </Modal>
    </div>;
}