import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { DataTable } from '../components/shared/DataTable';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Select } from '../components/ui/Select';
import { mockSystemUsers } from '../utils/mockData';
import { SystemUser } from '../utils/types';
export function UserManagementPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<SystemUser[]>(mockSystemUsers);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('All');
  const [roleFilter, setRoleFilter] = useState('All');
  const handleDelete = () => {
    if (deleteId) {
      setUsers(users.filter(u => u.id !== deleteId));
      setDeleteId(null);
    }
  };
  const filteredUsers = users.filter(user => {
    const statusMatch = statusFilter === 'All' || user.status === statusFilter;
    const roleMatch = roleFilter === 'All' || user.role === roleFilter;
    return statusMatch && roleMatch;
  });
  const columns = [{
    header: 'Name',
    accessorKey: 'name' as keyof SystemUser
  }, {
    header: 'Email',
    accessorKey: 'email' as keyof SystemUser
  }, {
    header: 'Role',
    accessorKey: 'role' as keyof SystemUser,
    cell: (item: SystemUser) => <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {item.role}
        </span>
  }, {
    header: 'Status',
    accessorKey: 'status' as keyof SystemUser,
    cell: (item: SystemUser) => {
      const colors = {
        Active: 'bg-green-100 text-green-800',
        Inactive: 'bg-gray-100 text-gray-800'
      };
      return <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[item.status]}`}>
            {item.status}
          </span>;
    }
  }, {
    header: 'Last Login',
    accessorKey: 'lastLogin' as keyof SystemUser
  }, {
    header: 'Actions',
    accessorKey: 'id' as keyof SystemUser,
    cell: (item: SystemUser) => <div className="flex items-center gap-2">
          <button onClick={() => navigate(`/users/edit/${item.id}`)} className="p-1 text-slate-400 hover:text-blue-600 transition-colors" title="Edit">
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
          <h2 className="text-2xl font-bold text-slate-900">User Management</h2>
          <p className="text-slate-500">
            Manage system users and access control
          </p>
        </div>
        <Button onClick={() => navigate('/users/add')} leftIcon={<Plus className="w-4 h-4" />}>
          Add New User
        </Button>
      </div>

      <DataTable data={filteredUsers} columns={columns} searchKey="name" searchPlaceholder="Search by name..." filters={<div className="flex gap-2">
            <Select className="w-32" options={[{
        value: 'All',
        label: 'All Roles'
      }, {
        value: 'Super Admin',
        label: 'Super Admin'
      }, {
        value: 'Admin',
        label: 'Admin'
      }, {
        value: 'Clerk 1',
        label: 'Clerk 1'
      }, {
        value: 'Clerk 2',
        label: 'Clerk 2'
      }, {
        value: 'Clerk 3',
        label: 'Clerk 3'
      }]} value={roleFilter} onChange={e => setRoleFilter(e.target.value)} />
            <Select className="w-32" options={[{
        value: 'All',
        label: 'All Status'
      }, {
        value: 'Active',
        label: 'Active'
      }, {
        value: 'Inactive',
        label: 'Inactive'
      }]} value={statusFilter} onChange={e => setStatusFilter(e.target.value)} />
          </div>} />

      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Delete User" footer={<>
            <Button variant="ghost" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete User
            </Button>
          </>}>
        <p className="text-slate-600">
          Are you sure you want to delete this user? This action cannot be
          undone.
        </p>
      </Modal>
    </div>;
}