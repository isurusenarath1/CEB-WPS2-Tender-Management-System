import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit2, Trash2, Plus, Eye } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';
import { Modal } from '../components/ui/Modal';
import { Record as TmsRecord } from '../utils/types';

export function RecordsPage() {
  const navigate = useNavigate();
  const [records, setRecords] = useState<TmsRecord[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('none');

  const handleDelete = () => {
    (async () => {
      if (!deleteId) return;
      try {
        const token = sessionStorage.getItem('authToken') || sessionStorage.getItem('mock-auth-token');
        const res = await fetch(`/api/records/${deleteId}`, {
          method: 'DELETE',
          headers: token ? { Authorization: `Bearer ${token}` } : undefined
        });
        if (res.ok) {
          setRecords(prev => prev.filter(r => r.id !== deleteId));
        } else {
          const err = await res.json().catch(() => ({ message: 'Failed to delete' }));
          alert(err.message || 'Failed to delete record');
        }
      } catch (err) {
        console.error(err);
        alert('Failed to delete record');
      } finally {
        setDeleteId(null);
      }
    })();
  };

  useEffect(() => {
    const load = async () => {
      try {
        const token = sessionStorage.getItem('authToken') || sessionStorage.getItem('mock-auth-token');
        const res = await fetch('/api/records', {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined
        });
        if (res.ok) {
          const data = await res.json();
          const mapped = Array.isArray(data) ? data.map((r: any) => ({ ...r, id: r._id || r.id })) : [];
          setRecords(mapped);
        }
      } catch (err) {
        console.error('Failed to load records', err);
      }
    };
    load();
  }, []);

  const filteredRecords = records
    .filter(record => {
      const statusMatch = statusFilter === 'All' || record.status === statusFilter;
      const categoryMatch = categoryFilter === 'All' || record.category === categoryFilter;
      const searchMatch = record.tenderNumber.toLowerCase().includes(searchTerm.toLowerCase());
      return statusMatch && categoryMatch && searchMatch;
    })
    .sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.tenderNumber.localeCompare(b.tenderNumber);
      } else if (sortOrder === 'desc') {
        return b.tenderNumber.localeCompare(a.tenderNumber);
      }
      return 0;
    });

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'Under Evaluation': 'bg-amber-100 text-amber-800',
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
  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return '-';
    try {
      return new Date(dateStr).toISOString().split('T')[0];
    } catch (e) {
      return typeof dateStr === 'string' ? dateStr.slice(0, 10) : '-';
    }
  };
  return <div className="h-[calc(100vh-140px)] flex flex-col gap-6">
      <div className="flex-shrink-0 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
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
      <div className="flex-shrink-0 bg-white rounded-lg shadow-sm border border-slate-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 min-w-[200px]">
            <input 
              type="text" 
              placeholder="Search by Tender Number..." 
              className="w-full h-10 rounded-md border border-slate-300 px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white" 
              value={searchTerm} 
              onChange={e => setSearchTerm(e.target.value)} 
            />
          </div>
          <Select className="w-full sm:w-48" options={[
        //     {
        //   value: 'none',
        //   label: 'Sort By'
        // }, 
        {
          value: 'asc',
          label: 'Tender Number: A-Z'
        }, {
          value: 'desc',
          label: 'Tender Number: Z-A'
        }]} value={sortOrder} onChange={e => setSortOrder(e.target.value)} />
          <Select className="w-full sm:w-48" options={[{
          value: 'All',
          label: 'All Status'
        }, {
          value: 'Awarded',
          label: 'Awarded'
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
          value: 'Retender',
          label: 'Retender'
        }, {
          value: 'Under Evaluation',
          label: 'Under Evaluation'
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

      {/* Table Section */}
      <div className="flex-1 min-h-0 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-auto custom-scrollbar">
          <table className="w-full text-sm text-left min-w-[1800px] border-separate border-spacing-0">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 sticky top-0 z-20">
              <tr>
                <th className="px-6 py-4 font-semibold whitespace-nowrap border-b border-slate-200 bg-slate-50">
                  Tender No
                </th>
                <th className="px-6 py-4 font-semibold whitespace-nowrap border-b border-slate-200 bg-slate-50">
                  Department
                </th>
                <th className="px-6 py-4 font-semibold whitespace-nowrap border-b border-slate-200 bg-slate-50">
                  Category
                </th>
                <th className="px-6 py-4 font-semibold whitespace-nowrap border-b border-slate-200 bg-slate-50">
                  Description
                </th>
                <th className="px-6 py-4 font-semibold whitespace-nowrap border-b border-slate-200 bg-slate-50">
                  Bid Start
                </th>
                <th className="px-6 py-4 font-semibold whitespace-nowrap border-b border-slate-200 bg-slate-50">
                  Bid Open
                </th>
                <th className="px-6 py-4 font-semibold whitespace-nowrap border-b border-slate-200 bg-slate-50">
                  Bid Close
                </th>
                <th className="px-6 py-4 font-semibold whitespace-nowrap border-b border-slate-200 bg-slate-50">
                  File Sent TEC
                </th>
                <th className="px-6 py-4 font-semibold whitespace-nowrap border-b border-slate-200 bg-slate-50">
                  Bond Number
                </th>
                <th className="px-6 py-4 font-semibold whitespace-nowrap border-b border-slate-200 bg-slate-50">
                  Bank/PIV
                </th>
                <th className="px-6 py-4 font-semibold whitespace-nowrap border-b border-slate-200 bg-slate-50">
                  Status
                </th>
                <th className="px-6 py-4 font-semibold whitespace-nowrap border-b border-slate-200 bg-slate-50">
                  TEC Team
                </th>
                <th className="px-6 py-4 font-semibold whitespace-nowrap border-b border-slate-200 bg-slate-50">
                  Awarded To
                </th>
                <th className="px-6 py-4 font-semibold whitespace-nowrap border-b border-slate-200 bg-slate-50">
                  Delay
                </th>
                <th className="px-6 py-4 font-semibold whitespace-nowrap sticky right-0 bg-slate-50 z-30 shadow-[-4px_0_12px_-4px_rgba(0,0,0,0.1)] border-b border-slate-200">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
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
                      {formatDate(record.bidStartDate)}
                    </td>
                    <td className="px-4 py-3 text-slate-700 whitespace-nowrap">
                      {formatDate(record.bidOpenDate)}
                    </td>
                    <td className="px-4 py-3 text-slate-700 whitespace-nowrap">
                      {formatDate(record.bidClosingDate)}
                    </td>
                    <td className="px-4 py-3 text-slate-700 whitespace-nowrap">
                      {formatDate(record.fileSentToTecDate)}
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
                      <div className="flex flex-col">
                        <span className="font-semibold">{record.tecChairman}</span>
                        <span className="text-[10px] text-slate-500 uppercase">
                          + {(record.tecMember1 ? 1 : 0) + (record.tecMember2 ? 1 : 0) + (record.tecAdditionalMembers?.length || 0)} members
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-700 whitespace-nowrap">
                      {record.awardedTo || '-'}
                    </td>
                    <td className="px-4 py-3 text-slate-700 whitespace-nowrap">
                      {record.delay !== undefined ? `${record.delay} days` : '-'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap sticky right-0 z-10 bg-white group-hover:bg-slate-50 shadow-[-4px_0_12px_-4px_rgba(0,0,0,0.1)] transition-colors">
                      <div className="flex items-center gap-2">
                        <button onClick={() => navigate(`/records/view/${record.id}`)} className="p-1 text-slate-400 hover:text-[#bd5d2a] transition-colors" title="View">
                          <Eye className="w-4 h-4" />
                        </button>
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