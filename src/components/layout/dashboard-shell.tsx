'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from './sidebar';
import { Header } from './header';

interface DashboardShellProps {
  userEmail: string;
  openTicketCount?: number;
  children: React.ReactNode;
}

export function DashboardShell({
  userEmail,
  openTicketCount = 1,
  children,
}: DashboardShellProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile drawer on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  return (
    <div className="flex min-h-screen bg-[#F9F8F4] text-[#1A1530]">
      {/* 1. Desktop Persistent Sidebar */}
      <div className="hidden md:block shrink-0">
        <Sidebar />
      </div>

      {/* 2. Mobile Drawer Slide-in */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex animate-in fade-in duration-200">
          {/* Dimmed backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileOpen(false)}
          />

          {/* Slide-out drawer content */}
          <div className="relative z-50 h-full w-64 max-w-[80vw] shadow-2xl animate-in slide-in-from-left duration-200">
            <Sidebar onClose={() => setIsMobileOpen(false)} />
          </div>
        </div>
      )}

      {/* 3. Main Content View Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          userEmail={userEmail}
          openTicketCount={openTicketCount}
          onMenuClick={() => setIsMobileOpen(true)}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
