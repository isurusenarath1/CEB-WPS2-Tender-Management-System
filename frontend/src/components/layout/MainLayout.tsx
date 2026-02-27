import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { IdleTimer } from '../auth/IdleTimer';
import backgr from '../../assets/backgr.png';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({
  children
}: MainLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const isDashboard = location.pathname === '/' || location.pathname === '/dashboard' || location.pathname.startsWith('/dashboard');

  return (
    <IdleTimer timeoutMinutes={15}>
      <div className="flex h-screen bg-slate-50 overflow-hidden">
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Header onMenuClick={() => setIsSidebarOpen(true)} />

          <main className="flex-1 overflow-y-auto relative">
            <div
              className="absolute inset-0 z-0 bg-cover bg-center"
              style={{
                backgroundImage: isDashboard ? undefined : `url(${backgr})`,
                backgroundColor: isDashboard ? '#f8fafc' : undefined
              }}
            />
            {!isDashboard && <div className="absolute inset-0 z-10 bg-gradient-to-b from-white/30 to-white/10 pointer-events-none" />}

            <div className="relative z-20 p-4 lg:p-8">
              <div className="max-w-7xl mx-auto animate-in fade-in duration-300">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </IdleTimer>
  );
}