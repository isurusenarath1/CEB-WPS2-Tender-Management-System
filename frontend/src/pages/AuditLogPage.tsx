import { useEffect, useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { AuditLog } from '../utils/types';
import { DatePicker } from '../components/ui/DatePicker';

export function AuditLogPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const token = sessionStorage.getItem('authToken') || sessionStorage.getItem('mock-auth-token');
        const res = await fetch('/api/audits', {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined
        });
        if (res.ok) {
          const data = await res.json();
          const mapped = data.map((d: any) => ({
            ...d,
            id: d._id || d.id,
            timestamp: d.createdAt ? new Date(d.createdAt).toLocaleString('en-GB', {
              day: '2-digit', month: 'short', year: 'numeric',
              hour: '2-digit', minute: '2-digit'
            }) : '—'
          }));
          setLogs(mapped);
        }
      } catch (err) {
        console.error('Failed to fetch audit logs', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter(log => {
    const searchMatch = (log.user?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
                      (log.message?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const typeMatch = typeFilter === 'All' || log.type === typeFilter;
    
    let dateMatch = true;
    if (dateFrom || dateTo) {
      // Find original log to get raw createdAt if available, otherwise parse from timestamp
      const rawLog = logs.find(l => l.id === log.id) as any;
      const logDate = rawLog?.createdAt ? new Date(rawLog.createdAt).getTime() : 0;
      
      if (dateFrom) {
        dateMatch = dateMatch && logDate >= new Date(dateFrom).getTime();
      }
      if (dateTo) {
        const toDate = new Date(dateTo);
        toDate.setHours(23, 59, 59, 999);
        dateMatch = dateMatch && logDate <= toDate.getTime();
      }
    }

    return searchMatch && typeMatch && dateMatch;
  });
  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      Login: 'bg-blue-100 text-blue-800',
      Create: 'bg-green-100 text-green-800',
      Update: 'bg-amber-100 text-amber-800',
      Delete: 'bg-red-100 text-red-800',
      Export: 'bg-purple-100 text-purple-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3 bg-white rounded-xl border border-slate-200">
        <Loader2 className="w-8 h-8 text-[#bd5d2a] animate-spin" />
        <p className="text-sm font-medium text-slate-500">Loading audit logs...</p>
      </div>
    );
  }

  return <div className="h-[calc(100vh-140px)] flex flex-col gap-6">
      <div className="flex-shrink-0">
        <h2 className="text-2xl font-bold text-slate-900">Audit Log</h2>
        <p className="text-slate-500">
          Track all system activities and changes
        </p>
      </div>

      {/* Filters */}
      <div className="flex-shrink-0 bg-white rounded-lg shadow-sm border border-slate-200 p-4">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input type="text" placeholder="Search by user or message..." className="w-full h-10 pl-9 rounded-md border border-slate-300 px-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
            <select className="h-10 rounded-md border border-slate-300 px-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none min-w-[150px]" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
              <option value="All">All Types</option>
              <option value="Login">Login</option>
              <option value="Create">Create</option>
              <option value="Update">Update</option>
              <option value="Delete">Delete</option>
              <option value="Export">Export</option>
            </select>
          </div>
          
          <div className="flex flex-col sm:flex-row items-end gap-4 pt-2 border-t border-slate-100">
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <DatePicker 
                label="From Date" 
                value={dateFrom} 
                onChange={(e) => setDateFrom(e.target.value)} 
              />
              <DatePicker 
                label="To Date" 
                value={dateTo} 
                onChange={(e) => setDateTo(e.target.value)} 
              />
            </div>
            <button 
              onClick={() => { setDateFrom(''); setDateTo(''); }}
              className="h-10 px-4 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Clear Dates
            </button>
          </div>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="flex-1 min-h-0 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-auto custom-scrollbar">
          <table className="w-full text-sm text-left border-separate border-spacing-0">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 sticky top-0 z-20">
              <tr>
                <th className="px-6 py-4 font-semibold whitespace-nowrap border-b border-slate-200 bg-slate-50">
                  User
                </th>
                <th className="px-6 py-4 font-semibold whitespace-nowrap border-b border-slate-200 bg-slate-50">
                  Type
                </th>
                <th className="px-6 py-4 font-semibold border-b border-slate-200 bg-slate-50">Message</th>
                <th className="px-6 py-4 font-semibold whitespace-nowrap border-b border-slate-200 bg-slate-50">
                  Time
                </th>
                <th className="px-6 py-4 font-semibold whitespace-nowrap border-b border-slate-200 bg-slate-50">
                  IP Address
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.length > 0 ? filteredLogs.map((log, idx) => <tr key={log.id} className={`hover:bg-slate-50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}`}>
                    <td className="px-6 py-4 font-bold text-slate-900 whitespace-nowrap">
                      {log.user}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${getTypeColor(log.type)}`}>
                        {log.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-700 font-medium">{log.message}</td>
                    <td className="px-6 py-4 text-slate-600 whitespace-nowrap font-medium">
                      {log.timestamp}
                    </td>
                    <td className="px-6 py-4 text-slate-500 whitespace-nowrap font-mono text-xs">
                      {log.ipAddress ? `fo ${log.ipAddress.replace('::ffff:', '')}` : 'fo —'}
                    </td>
                  </tr>) : <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-lg font-medium">No results found</span>
                      <p className="text-sm">Try adjusting your filters or search term</p>
                    </div>
                  </td>
                </tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>;
}