import { useState } from 'react';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
interface Column<T> {
  header: string;
  accessorKey: keyof T | ((item: T) => React.ReactNode);
  cell?: (item: T) => React.ReactNode;
}
interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchKey?: keyof T;
  searchPlaceholder?: string;
  filters?: React.ReactNode;
  actions?: React.ReactNode;
}
export function DataTable<T extends {
  id: string;
}>({
  data,
  columns,
  searchKey,
  searchPlaceholder = 'Search...',
  filters,
  actions
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 10;
  // Filter data based on search
  const filteredData = data.filter(item => {
    if (!searchKey) return true;
    const value = item[searchKey];
    if (typeof value === 'string') {
      return value.toLowerCase().includes(searchTerm.toLowerCase());
    }
    return true;
  });
  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);
  return <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
      {/* Table Header / Controls */}
      <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-center bg-white">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          {searchKey && <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input type="text" placeholder={searchPlaceholder} className="pl-9 h-9 w-full rounded-md border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" value={searchTerm} onChange={e => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // Reset to first page on search
          }} />
            </div>}
          {filters}
        </div>
        {actions && <div className="w-full sm:w-auto flex justify-end">{actions}</div>}
      </div>

      {/* Table Content */}
      <div className="flex-1 overflow-auto custom-scrollbar min-h-[400px]">
        <table className="w-full text-sm text-left border-separate border-spacing-0">
          <thead className="text-xs text-slate-500 uppercase bg-slate-50 sticky top-0 z-10">
            <tr>
              {columns.map((col, idx) => <th key={idx} className="px-6 py-4 font-semibold whitespace-nowrap border-b border-slate-200 bg-slate-50/90 backdrop-blur-sm">
                  <div className="flex items-center gap-2">{col.header}</div>
                </th>)}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedData.length > 0 ? paginatedData.map((item, rowIdx) => <tr key={item.id} className={`
                    hover:bg-slate-50 transition-colors
                    ${rowIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}
                  `}>
                  {columns.map((col, colIdx) => <td key={colIdx} className="px-6 py-4 text-slate-700 font-medium">
                      {col.cell ? col.cell(item) : typeof col.accessorKey === 'function' ? col.accessorKey(item) : item[col.accessorKey] as React.ReactNode}
                    </td>)}
                </tr>) : <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center text-slate-500">
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-lg font-medium">No results found</span>
                    <p className="text-sm">Try adjusting your filters or search term</p>
                  </div>
                </td>
              </tr>}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-4 py-3 border-t border-slate-200 flex items-center justify-between bg-white">
        <div className="text-sm text-slate-500">
          Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
          <span className="font-medium">
            {Math.min(startIndex + itemsPerPage, filteredData.length)}
          </span>{' '}
          of <span className="font-medium">{filteredData.length}</span> results
        </div>
        <div className="flex gap-2">
          <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 rounded-md border border-slate-300 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages || totalPages === 0} className="p-2 rounded-md border border-slate-300 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>;
}