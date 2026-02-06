import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { DataTable } from '../components/shared/DataTable';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { mockStaff } from '../utils/mockData';
import { Staff } from '../utils/types';
export function TecStaffPage() {
  const navigate = useNavigate();
  const [staff, setStaff] = useState<Staff[]>(mockStaff);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const handleDelete = () => {
    if (deleteId) {
      setStaff(staff.filter(s => s.id !== deleteId));
      setDeleteId(null);
    }
  };
  const columns = [{
    header: 'Name',
    accessorKey: 'name' as keyof Staff
  }, {
    header: 'Email',
    accessorKey: 'email' as keyof Staff
  }, {
    header: 'Department/Area',
    accessorKey: 'area' as keyof Staff
  }, {
    header: 'Designation',
    accessorKey: 'designation' as keyof Staff
  }, {
    header: 'Actions',
    accessorKey: 'id' as keyof Staff,
    cell: (item: Staff) => <div className="flex items-center gap-2">
          <button onClick={() => navigate(`/tec-staff/edit/${item.id}`)} className="p-1 text-slate-400 hover:text-blue-600 transition-colors">
            <Edit2 className="w-4 h-4" />
          </button>
          <button onClick={() => setDeleteId(item.id)} className="p-1 text-slate-400 hover:text-red-600 transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
  }];
  return <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">TEC Staff</h2>
          <p className="text-slate-500">Manage committee members and staff</p>
        </div>
        <Button onClick={() => navigate('/tec-staff/add')} leftIcon={<Plus className="w-4 h-4" />}>
          Add Staff Member
        </Button>
      </div>

      <DataTable data={staff} columns={columns} searchKey="name" searchPlaceholder="Search staff by name..." />

      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Remove Staff Member" footer={<>
            <Button variant="ghost" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Remove
            </Button>
          </>}>
        <p className="text-slate-600">
          Are you sure you want to remove this staff member?
        </p>
      </Modal>
    </div>;
}