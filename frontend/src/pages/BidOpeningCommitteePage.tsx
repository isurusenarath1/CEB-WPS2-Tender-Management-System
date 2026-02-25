import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { DataTable } from '../components/shared/DataTable';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Select } from '../components/ui/Select';
import { BidOpeningCommittee } from '../utils/types';
export function BidOpeningCommitteePage() {
  const navigate = useNavigate();
  const [committees, setCommittees] = useState<BidOpeningCommittee[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('All');
  const handleDelete = () => {
    (async () => {
      if (!deleteId) return;
      try {
        const token = sessionStorage.getItem('mock-auth-token') || sessionStorage.getItem('authToken') || sessionStorage.getItem('token');
        const res = await fetch(`/api/committees/${deleteId}`, {
          method: 'DELETE',
          headers: token ? { Authorization: `Bearer ${token}` } : undefined
        });
        if (res.ok) {
          setCommittees(prev => prev.filter(c => c.id !== deleteId));
        } else {
          const err = await res.json().catch(() => ({ message: 'Failed to delete' }));
          alert(err.message || 'Failed to delete committee');
        }
      } catch (err) {
        console.error(err);
        alert('Failed to delete committee');
      } finally {
        setDeleteId(null);
      }
    })();
  };

  useEffect(() => {
    const load = async () => {
      try {
        const token = sessionStorage.getItem('mock-auth-token') || sessionStorage.getItem('authToken') || sessionStorage.getItem('token');
        const res = await fetch('/api/committees', {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined
        });
        if (res.ok) {
          const data = await res.json();
          const mapped = Array.isArray(data) ? data.map((d: any) => ({
            ...d,
            id: d._id || d.id,
            appointedDate: d.appointedDate ? String(d.appointedDate).slice(0, 10) : ''
          })) : [];
          setCommittees(mapped);
          return;
        }
      } catch (err) {
        console.warn('Failed to load committees from API', err);
      }
    };
    load();
  }, []);
  const filteredCommittees = committees.filter(committee => {
    return statusFilter === 'All' || committee.status === statusFilter;
  });
  const columns = [{
    header: 'Committee Number',
    accessorKey: 'committeeNumber' as keyof BidOpeningCommittee
  }, {
    header: 'Member 1',
    accessorKey: 'member1' as keyof BidOpeningCommittee
  }, {
    header: 'Member 2',
    accessorKey: 'member2' as keyof BidOpeningCommittee
  }, {
    header: 'Member 3',
    accessorKey: 'member3' as keyof BidOpeningCommittee
  }, {
    header: 'Additional Members',
    accessorKey: 'additionalMembers' as keyof BidOpeningCommittee,
    cell: (item: BidOpeningCommittee) => <span className="text-slate-700">
          {item.additionalMembers && item.additionalMembers.length > 0 ? `+${item.additionalMembers.length} more` : '-'}
        </span>
  }, {
    header: 'Appointed Date',
    accessorKey: 'appointedDate' as keyof BidOpeningCommittee
  }, {
    header: 'Status',
    accessorKey: 'status' as keyof BidOpeningCommittee,
    cell: (item: BidOpeningCommittee) => {
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
    accessorKey: 'id' as keyof BidOpeningCommittee,
    cell: (item: BidOpeningCommittee) => <div className="flex items-center gap-2">
          <button onClick={() => navigate(`/bid-opening/edit/${item.id}`)} className="p-1 text-slate-400 hover:text-blue-600 transition-colors" title="Edit">
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
            TEC Committee
          </h2>
          <p className="text-slate-500">
            Manage TEC committee members and appointments
          </p>
        </div>
        <Button onClick={() => navigate('/bid-opening/add')} leftIcon={<Plus className="w-4 h-4" />}>
          Add New Committee
        </Button>
      </div>

      <DataTable data={filteredCommittees} columns={columns} searchKey="committeeNumber" searchPlaceholder="Search by committee number..." filters={<Select className="w-32" options={[{
      value: 'All',
      label: 'All Status'
    }, {
      value: 'Active',
      label: 'Active'
    }, {
      value: 'Inactive',
      label: 'Inactive'
    }]} value={statusFilter} onChange={e => setStatusFilter(e.target.value)} />} />

      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Committee" footer={<>
            <Button variant="ghost" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete Committee
            </Button>
          </>}>
        <p className="text-slate-600">
          Are you sure you want to delete this committee? This action cannot be
          undone.
        </p>
      </Modal>
    </div>;
}