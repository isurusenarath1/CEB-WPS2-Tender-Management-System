import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { mockAuditLogs } from '../utils/mockData';
import { AuditLog } from '../utils/types';
export function AuditLogPage() {
  const [logs] = useState<AuditLog[]>(mockAuditLogs);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const filteredLogs = logs.filter(log => {
    const searchMatch = log.user.toLowerCase().includes(searchTerm.toLowerCase()) || log.message.toLowerCase().includes(searchTerm.toLowerCase());
    const typeMatch = typeFilter === 'All' || log.type === typeFilter;
    return searchMatch && typeMatch;
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
  return <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Audit Log</h2>
        <p className="text-slate-500">
          Track all system activities and changes
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input type="text" placeholder="Search by user or message..." className="w-full h-10 pl-9 rounded-md border border-slate-300 px-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
          <select className="h-10 rounded-md border border-slate-300 px-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
            <option value="All">All Types</option>
            <option value="Login">Login</option>
            <option value="Create">Create</option>
            <option value="Update">Update</option>
            <option value="Delete">Delete</option>
            <option value="Export">Export</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 font-medium whitespace-nowrap">
                  User
                </th>
                <th className="px-6 py-3 font-medium whitespace-nowrap">
                  Type
                </th>
                <th className="px-6 py-3 font-medium">Message</th>
                <th className="px-6 py-3 font-medium whitespace-nowrap">
                  Time
                </th>
                <th className="px-6 py-3 font-medium whitespace-nowrap">
                  IP Address
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length > 0 ? filteredLogs.map((log, idx) => <tr key={log.id} className={`border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                    <td className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap">
                      {log.user}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(log.type)}`}>
                        {log.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-700">{log.message}</td>
                    <td className="px-6 py-4 text-slate-700 whitespace-nowrap">
                      {log.timestamp}
                    </td>
                    <td className="px-6 py-4 text-slate-700 whitespace-nowrap font-mono text-xs">
                      {log.ipAddress}
                    </td>
                  </tr>) : <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                    No audit logs found.
                  </td>
                </tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>;
}