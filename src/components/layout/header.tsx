'use client';

import { Bell, Menu, Heart } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';

interface HeaderProps {
  userEmail?: string;
  onMenuClick?: () => void;
  openTicketCount?: number;
}

export function Header({
  userEmail = 'admin@lovelynk.com',
  onMenuClick,
  openTicketCount = 1,
}: HeaderProps) {
  const today = format(new Date(), 'EEEE, d MMMM yyyy');

  return (
    <header className="h-16 px-4 sm:px-6 lg:px-8 border-b border-[#EFECE6] bg-white/90 backdrop-blur-md flex items-center justify-between sticky top-0 z-20">
      {/* Left Area: Hamburger on mobile, date on desktop */}
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger Menu Button */}
        <button
          type="button"
          onClick={onMenuClick}
          className="md:hidden p-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-[#EFECE6] transition-colors"
          title="Open Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Mobile Logo Brand */}
        <div className="flex items-center gap-2 md:hidden">
          <img
            src="/logo.png"
            alt="LoveLynk Logo"
            className="w-7 h-7 rounded-lg object-cover shadow-xs"
          />
          <span className="font-bold text-sm tracking-tight text-[#1A1530]">LoveLynk</span>
        </div>

        {/* Desktop Date Display */}
        <div className="hidden md:flex items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#6B667A] bg-[#F9F8F4] px-3.5 py-1.5 rounded-full border border-[#EFECE6]">
            {today}
          </span>
        </div>
      </div>

      {/* Right: Notification Bell & Admin Profile */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Support Notification Bell */}
        <Link
          href="/dashboard/support"
          className="relative p-2 rounded-xl text-[#6B667A] hover:text-[#1A1530] hover:bg-[#F9F8F4] border border-[#EFECE6] transition-colors"
          title="Support Inquiries & Tickets"
        >
          <Bell className="w-4 h-4" />
          {openTicketCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-[#FF4FA3] text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs">
              {openTicketCount}
            </span>
          )}
        </Link>

        {/* Admin User Pill */}
        <div className="flex items-center gap-2 pl-2 border-l border-[#EFECE6]">
          <div className="w-8 h-8 rounded-full bg-[#FF4FA3] text-white flex items-center justify-center font-bold text-xs uppercase shadow-xs">
            {userEmail.substring(0, 2)}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-semibold text-[#1A1530] truncate max-w-[150px]">
              {userEmail}
            </p>
            <p className="text-[10px] text-[#6B667A]">Super Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
}
