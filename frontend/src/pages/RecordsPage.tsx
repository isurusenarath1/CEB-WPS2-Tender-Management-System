import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit2, Trash2, Plus } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';
import { Modal } from '../components/ui/Modal';
import { mockRecords } from '../utils/mockData';
import { Record as TmsRecord } from '../utils/types';
export function RecordsPage() {
  const navigate = useNavigate();
  const [records, setRecords] = useState<TmsRecord[]>(mockRecords);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const handleDelete = () => {
    if (deleteId) {
      setRecords(records.filter(r => r.id !== deleteId));
      setDeleteId(null);
    }
  };
  const filteredRecords = records.filter(record => {
    const statusMatch = statusFilter === 'All' || record.status === statusFilter;
    const categoryMatch = categoryFilter === 'All' || record.category === categoryFilter;
    const searchMatch = record.tenderNumber.toLowerCase().includes(searchTerm.toLowerCase());
    return statusMatch && categoryMatch && searchMatch;
  });
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'Under Evacuation': 'bg-amber-100 text-amber-800',
      'Doc Review': 'bg-blue-100 text-blue-800',
      'Negotiate or Clarification': 'bg-purple-100 text-purple-800',
      'Re-evaluation': 'bg-orange-100 text-orange-800',
      Reject: 'bg-red-100 text-red-800',
      Awarded: 'bg-green-100 text-green-800',
      Cancel: 'bg-gray-100 text-gray-800',
      Close: 'bg-slate-100 text-slate-800',
      Retender: 'bg-yellow-100 text-yellow-800',
      'In PPC': 'bg-indigo-100 text-indigo-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };
  return <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Records Management
          </h2>
          <p className="text-slate-500">Manage and track all tender records</p>
        </div>
        <Button onClick={() => navigate('/records/add')} leftIcon={<Plus className="w-4 h-4" />}>
          Add New Record
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input type="text" placeholder="Search by Tender Number..." className="w-full h-10 rounded-md border border-slate-300 px-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
          <Select className="w-full sm:w-48" options={[{
          value: 'All',
          label: 'All Status'
        }, {
          value: 'Under Evacuation',
          label: 'Under Evacuation'
        }, {
          value: 'Doc Review',
          label: 'Doc Review'
        }, {
          value: 'Negotiate or Clarification',
          label: 'Negotiate or Clarification'
        }, {
          value: 'Re-evaluation',
          label: 'Re-evaluation'
        }, {
          value: 'Reject',
          label: 'Reject'
        }, {
          value: 'Awarded',
          label: 'Awarded'
        }, {
          value: 'Cancel',
          label: 'Cancel'
        }, {
          value: 'Close',
          label: 'Close'
        }, {
          value: 'Retender',
          label: 'Retender'
        }, {
          value: 'In PPC',
          label: 'In PPC'
        }]} value={statusFilter} onChange={e => setStatusFilter(e.target.value)} />
          <Select className="w-full sm:w-48" options={[{
          value: 'All',
          label: 'All Categories'
        }, {
          value: 'Goods',
          label: 'Goods'
        }, {
          value: 'Services',
          label: 'Services'
        }, {
          value: 'Works',
          label: 'Works'
        }, {
          value: 'Consultancy',
          label: 'Consultancy'
        }]} value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} />
        </div>
      </div>

      {/* Table with horizontal and vertical scrolling */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto overflow-y-auto max-h-[600px]">
          <table className="w-full text-sm text-left min-w-[1800px]">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 font-medium whitespace-nowrap">
                  Tender No
                </th>
                <th className="px-4 py-3 font-medium whitespace-nowrap">
                  Department
                </th>
                <th className="px-4 py-3 font-medium whitespace-nowrap">
                  Category
                </th>
                <th className="px-4 py-3 font-medium whitespace-nowrap">
                  Description
                </th>
                <th className="px-4 py-3 font-medium whitespace-nowrap">
                  Bid Start
                </th>
                <th className="px-4 py-3 font-medium whitespace-nowrap">
                  Bid Open
                </th>
                <th className="px-4 py-3 font-medium whitespace-nowrap">
                  Bid Close
                </th>
                <th className="px-4 py-3 font-medium whitespace-nowrap">
                  File Sent TEC
                </th>
                <th className="px-4 py-3 font-medium whitespace-nowrap">
                  Bond Number
                </th>
                <th className="px-4 py-3 font-medium whitespace-nowrap">
                  Bank/PIV
                </th>
                <th className="px-4 py-3 font-medium whitespace-nowrap">
                  Status
                </th>
                <th className="px-4 py-3 font-medium whitespace-nowrap">
                  TEC Chairman
                </th>
                <th className="px-4 py-3 font-medium whitespace-nowrap">
                  Awarded To
                </th>
                <th className="px-4 py-3 font-medium whitespace-nowrap">
                  Delay
                </th>
                <th className="px-4 py-3 font-medium whitespace-nowrap sticky right-0 bg-slate-50">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.length > 0 ? filteredRecords.map((record, idx) => <tr key={record.id} className={`border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                    <td className="px-4 py-3 font-medium text-slate-900 whitespace-nowrap">
                      {record.tenderNumber}
                    </td>
                    <td className="px-4 py-3 text-slate-700 whitespace-nowrap">
                      {record.relevantTo}
                    </td>
                    <td className="px-4 py-3 text-slate-700 whitespace-nowrap">
                      {record.category}
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      <span className="block max-w-xs truncate" title={record.description}>
                        {record.description}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-700 whitespace-nowrap">
                      {record.bidStartDate}
                    </td>
                    <td className="px-4 py-3 text-slate-700 whitespace-nowrap">
                      {record.bidOpenDate}
                    </td>
                    <td className="px-4 py-3 text-slate-700 whitespace-nowrap">
                      {record.bidClosingDate}
                    </td>
                    <td className="px-4 py-3 text-slate-700 whitespace-nowrap">
                      {record.fileSentToTecDate}
                    </td>
                    <td className="px-4 py-3 text-slate-700 whitespace-nowrap">
                      {record.bidBondNumber || '-'}
                    </td>
                    <td className="px-4 py-3 text-slate-700 whitespace-nowrap">
                      {record.bidBondBank || '-'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                        {record.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-700 whitespace-nowrap">
                      {record.tecChairman}
                    </td>
                    <td className="px-4 py-3 text-slate-700 whitespace-nowrap">
                      {record.awardedTo || '-'}
                    </td>
                    <td className="px-4 py-3 text-slate-700 whitespace-nowrap">
                      {record.delay !== undefined ? `${record.delay} days` : '-'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap sticky right-0 bg-inherit">
                      <div className="flex items-center gap-2">
                        <button onClick={() => navigate(`/records/edit/${record.id}`)} className="p-1 text-slate-400 hover:text-blue-600 transition-colors" title="Edit">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => setDeleteId(record.id)} className="p-1 text-slate-400 hover:text-red-600 transition-colors" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>) : <tr>
                  <td colSpan={15} className="px-6 py-8 text-center text-slate-500">
                    No records found.
                  </td>
                </tr>}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Record" footer={<>
            <Button variant="ghost" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete Record
            </Button>
          </>}>
        <p className="text-slate-600">
          Are you sure you want to delete this record? This action cannot be
          undone.
        </p>
      </Modal>
    </div>;
}