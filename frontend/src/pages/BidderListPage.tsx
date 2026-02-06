import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { DataTable } from '../components/shared/DataTable';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { mockBidders } from '../utils/mockData';
import { Bidder } from '../utils/types';
export function BidderListPage() {
  const navigate = useNavigate();
  const [bidders, setBidders] = useState<Bidder[]>(mockBidders);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const handleDelete = () => {
    if (deleteId) {
      setBidders(bidders.filter(b => b.id !== deleteId));
      setDeleteId(null);
    }
  };
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
            Registered Bidders
          </h2>
          <p className="text-slate-500">
            Manage supplier and bidder information
          </p>
        </div>
        <Button onClick={() => navigate('/bidders/add')} leftIcon={<Plus className="w-4 h-4" />}>
          Add Bidder
        </Button>
      </div>

      <DataTable data={bidders} columns={columns} searchKey="name" searchPlaceholder="Search bidders..." />

      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Remove Bidder" footer={<>
            <Button variant="ghost" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Remove
            </Button>
          </>}>
        <p className="text-slate-600">
          Are you sure you want to remove this bidder?
        </p>
      </Modal>
    </div>;
}