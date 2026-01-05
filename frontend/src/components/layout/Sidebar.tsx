import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, Plus, Users, UserPlus, Building2, Download, LogOut, Menu, FolderOpen, Briefcase, Gavel, Shield, FileSearch } from 'lucide-react';
interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}
export function Sidebar({
  isOpen,
  setIsOpen
}: SidebarProps) {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('mock-auth-token');
    navigate('/login');
  };
  const navItems = [{
    title: 'Dashboard',
    path: '/dashboard',
    icon: <LayoutDashboard className="w-5 h-5" />
  }, {
    title: 'Records',
    path: '/records',
    icon: <FileText className="w-5 h-5" />,
    subItems: [{
      title: 'All Records',
      path: '/records',
      icon: <FileText className="w-4 h-4" />
    }, {
      title: 'Add Record',
      path: '/records/add',
      icon: <Plus className="w-4 h-4" />
    }]
  }, {
    title: 'Categories',
    path: '/categories',
    icon: <FolderOpen className="w-5 h-5" />,
    subItems: [{
      title: 'Category List',
      path: '/categories',
      icon: <FolderOpen className="w-4 h-4" />
    }, {
      title: 'Add Category',
      path: '/categories/add',
      icon: <Plus className="w-4 h-4" />
    }]
  }, {
    title: 'Departments',
    path: '/departments',
    icon: <Briefcase className="w-5 h-5" />,
    subItems: [{
      title: 'Department List',
      path: '/departments',
      icon: <Briefcase className="w-4 h-4" />
    }, {
      title: 'Add Department',
      path: '/departments/add',
      icon: <Plus className="w-4 h-4" />
    }]
  }, {
    title: 'TEC Staff',
    path: '/tec-staff',
    icon: <Users className="w-5 h-5" />,
    subItems: [{
      title: 'Staff List',
      path: '/tec-staff',
      icon: <Users className="w-4 h-4" />
    }, {
      title: 'Add Staff',
      path: '/tec-staff/add',
      icon: <UserPlus className="w-4 h-4" />
    }]
  }, {
    title: 'Bidders',
    path: '/bidders',
    icon: <Building2 className="w-5 h-5" />,
    subItems: [{
      title: 'Bidder List',
      path: '/bidders',
      icon: <Building2 className="w-4 h-4" />
    }, {
      title: 'Add Bidder',
      path: '/bidders/add',
      icon: <Plus className="w-4 h-4" />
    }]
  }, {
    title: 'Bid Opening Committee',
    path: '/bid-opening',
    icon: <Gavel className="w-5 h-5" />,
    subItems: [{
      title: 'View All Committees',
      path: '/bid-opening',
      icon: <Gavel className="w-4 h-4" />
    }, {
      title: 'Add Committee',
      path: '/bid-opening/add',
      icon: <Plus className="w-4 h-4" />
    }]
  }, {
    title: 'User Management',
    path: '/users',
    icon: <Shield className="w-5 h-5" />,
    subItems: [{
      title: 'All Users',
      path: '/users',
      icon: <Shield className="w-4 h-4" />
    }, {
      title: 'Add User',
      path: '/users/add',
      icon: <UserPlus className="w-4 h-4" />
    }]
  }, {
    title: 'Audit Log',
    path: '/audit-log',
    icon: <FileSearch className="w-5 h-5" />
  }, {
    title: 'Export',
    path: '/export',
    icon: <Download className="w-5 h-5" />
  }];
  return <>
      {/* Mobile Overlay */}
      <div className={`fixed inset-0 bg-black/50 z-20 lg:hidden transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsOpen(false)} />

      {/* Sidebar Container */}
      <aside className={`
          fixed top-0 left-0 z-30 h-screen w-64 bg-slate-900 text-white transform transition-transform duration-200 ease-in-out flex flex-col
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static
        `}>
        {/* Logo Area - Fixed at top */}
        <div className="flex items-center justify-between h-16 px-6 bg-slate-950 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">TEC Admin</span>
          </div>
          <button onClick={() => setIsOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation - Scrollable middle section */}
        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          {navItems.map(item => <div key={item.path} className="mb-2">
              {!item.subItems ? <NavLink to={item.path} className={({
            isActive
          }) => `
                    flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                    ${isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}
                  `}>
                  {item.icon}
                  {item.title}
                </NavLink> : <div className="space-y-1">
                  <div className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    {item.title}
                  </div>
                  {item.subItems.map(subItem => <NavLink key={subItem.path} to={subItem.path} end={subItem.path === '/records' || subItem.path === '/tec-staff' || subItem.path === '/bidders' || subItem.path === '/categories' || subItem.path === '/departments' || subItem.path === '/users' || subItem.path === '/bid-opening'} className={({
              isActive
            }) => `
                        flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ml-2
                        ${isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}
                      `}>
                      {subItem.icon}
                      {subItem.title}
                    </NavLink>)}
                </div>}
            </div>)}
        </nav>

        {/* Footer - Fixed at bottom */}
        <div className="flex-shrink-0 border-t border-slate-800">
          {/* Logout Button */}
          <div className="p-4">
            <button onClick={handleLogout} className="flex items-center gap-3 w-full px-3 py-2 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-950/30 rounded-lg transition-colors">
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>

          {/* Version & Copyright */}
          <div className="px-6 pb-4 pt-2 border-t border-slate-800/50">
            <div className="text-xs text-slate-500 space-y-1">
              <p className="font-medium">Version 1.0.0</p>
              <p className="text-slate-600">
                © 2026. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>;
}