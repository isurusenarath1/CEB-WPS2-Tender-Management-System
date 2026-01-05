import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
interface MainLayoutProps {
  children: React.ReactNode;
}
export function MainLayout({
  children
}: MainLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header onMenuClick={() => setIsSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto">
          <div className="p-4 lg:p-8">
            <div className="max-w-7xl mx-auto animate-in fade-in duration-300">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>;
}