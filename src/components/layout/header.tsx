'use client';

import { Bell, Sparkles } from 'lucide-react';
import { format } from 'date-fns';

interface HeaderProps {
  userEmail?: string;
}

export function Header({ userEmail = 'admin@lovelynk.io' }: HeaderProps) {
  const today = format(new Date(), 'EEEE, d MMMM yyyy');

  return (
    <header className="h-16 px-8 border-b border-[#EFECE6] bg-[#FFFFFF]/80 backdrop-blur-md flex items-center justify-between sticky top-0 z-20">
      {/* Left: Date Display */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#64748B] bg-[#F9F8F4] px-3 py-1 rounded-full border border-[#EFECE6]">
          {today}
        </span>
      </div>

      {/* Right: Quick Status & Admin Profile */}
      <div className="flex items-center gap-4">
        {/* Environment Badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#EBF8F2] border border-emerald-200 text-emerald-800 text-xs font-medium">
          <Sparkles className="w-3 h-3 text-emerald-600" />
          <span>Production</span>
        </div>

        {/* Notifications Button */}
        <button
          className="relative p-2 rounded-xl text-[#64748B] hover:text-[#1E1E24] hover:bg-[#F9F8F4] border border-[#EFECE6] transition-colors"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#FF4B72]" />
        </button>

        {/* Admin User Pill */}
        <div className="flex items-center gap-2 pl-2 border-l border-[#EFECE6]">
          <div className="w-8 h-8 rounded-full bg-[#1E1E24] text-white flex items-center justify-center font-bold text-xs uppercase shadow-sm">
            {userEmail.substring(0, 2)}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-semibold text-[#1E1E24] truncate max-w-[140px]">
              {userEmail}
            </p>
            <p className="text-[10px] text-[#64748B]">Super Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
}

