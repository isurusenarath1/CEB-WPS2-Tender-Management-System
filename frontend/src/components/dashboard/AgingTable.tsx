import React from 'react';
interface AgingData {
  range: string;
  count: number;
  color: string;
}
interface AgingTableProps {
  data: AgingData[];
}
export function AgingTable({
  data
}: AgingTableProps) {
  return <div className="overflow-hidden rounded-lg border border-slate-200">
      <table className="w-full text-sm text-left">
        <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
          <tr>
            <th className="px-6 py-3 font-medium">Age Range</th>
            <th className="px-6 py-3 font-medium text-right">Count</th>
            <th className="px-6 py-3 font-medium">Status Level</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {data.map(item => <tr key={item.range} className="hover:bg-slate-50">
              <td className="px-6 py-4 font-medium text-slate-900">
                {item.range} Days
              </td>
              <td className="px-6 py-4 text-right text-slate-600">
                {item.count}
              </td>
              <td className="px-6 py-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.color}`}>
                  {item.count > 0 ? 'Active' : 'Clear'}
                </span>
              </td>
            </tr>)}
        </tbody>
      </table>
    </div>;
}