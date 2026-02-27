import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { DataTable } from '../components/shared/DataTable';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Bidder } from '../utils/types';
export function BidderListPage() {
  const navigate = useNavigate();
  const [bidders, setBidders] = useState<Bidder[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const handleDelete = () => {
    (async () => {
      if (!deleteId) return;
      try {
        const token = sessionStorage.getItem('authToken') || sessionStorage.getItem('mock-auth-token');
        const res = await fetch(`/api/bidders/${deleteId}`, {
          method: 'DELETE',
          headers: token ? { Authorization: `Bearer ${token}` } : undefined
        });
        if (res.ok) {
          setBidders(prev => prev.filter(b => b.id !== deleteId));
        } else {
          const err = await res.json().catch(() => ({ message: 'Failed to delete' }));
          alert(err.message || 'Failed to delete supplier');
        }
      } catch (err) {
        console.error(err);
        alert('Failed to delete supplier');
      } finally {
        setDeleteId(null);
      }
    })();
  };

  useEffect(() => {
    const load = async () => {
      try {
        const token = sessionStorage.getItem('authToken') || sessionStorage.getItem('mock-auth-token');
        const res = await fetch('/api/bidders', {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined
        });
        if (!res.ok) throw new Error('Failed to fetch supplier');
        const data = await res.json();
        const mapped = Array.isArray(data) ? data.map((b: any) => ({ ...b, id: b._id || b.id })) : [];
        setBidders(mapped);
      } catch (err) {
        console.error('Failed to load supplier', err);
        setBidders([]);
      }
    };
    load();
  }, []);
  const columns = [{
    header: 'Company Name',
    accessorKey: 'name' as keyof Bidder
  }, {
    header: 'Email',
    accessorKey: 'email' as keyof Bidder
  }, {
    header: 'Contact No',
    accessorKey: 'contact' as keyof Bidder
  }, {
    header: 'Address',
    accessorKey: 'address' as keyof Bidder
  }, {
    header: 'Actions',
    accessorKey: 'id' as keyof Bidder,
    cell: (item: Bidder) => <div className="flex items-center gap-2">
          <button onClick={() => navigate(`/bidders/edit/${item.id}`)} className="p-1 text-slate-400 hover:text-blue-600 transition-colors">
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
          <h2 className="text-2xl font-bold text-slate-900">
            Registered suppliers (bidder)
          </h2>
          <p className="text-slate-500">
            Manage supplier (bidder) information
          </p>
        </div>
        <Button onClick={() => navigate('/bidders/add')} leftIcon={<Plus className="w-4 h-4" />}>
          Add supplier
        </Button>
      </div>

      <DataTable data={bidders} columns={columns} searchKey="name" searchPlaceholder="Search suppliers..." />

      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Remove Supplier" footer={<>
            <Button variant="ghost" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Remove
            </Button>
          </>}>
        <p className="text-slate-600">
          Are you sure you want to remove this supplier?
        </p>
      </Modal>
    </div>;
}