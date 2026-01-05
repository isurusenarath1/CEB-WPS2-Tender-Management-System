import React from 'react';
import { Menu, Bell, User } from 'lucide-react';
import { useLocation } from 'react-router-dom';
interface HeaderProps {
  onMenuClick: () => void;
}
export function Header({
  onMenuClick
}: HeaderProps) {
  const location = useLocation();
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'Dashboard';
    if (path.startsWith('/records')) return 'Records Management';
    if (path.startsWith('/categories')) return 'Category Management';
    if (path.startsWith('/departments')) return 'Department Management';
    if (path.startsWith('/tec-staff')) return 'TEC Staff';
    if (path.startsWith('/bidders')) return 'Bidder Management';
    if (path.startsWith('/bid-opening')) return 'Bid Opening Committee';
    if (path.startsWith('/users')) return 'User Management';
    if (path === '/audit-log') return 'Audit Log';
    if (path === '/export') return 'Export Data';
    return 'TEC Admin';
  };
  return <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg">
          <Menu className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-semibold text-slate-800">
          {getPageTitle()}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-slate-900">Admin User</p>
            <p className="text-xs text-slate-500">admin@tec.gov</p>
          </div>
          <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
            <User className="w-5 h-5" />
          </div>
        </div>
      </div>
    </header>;
}