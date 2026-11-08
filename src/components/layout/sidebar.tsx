'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  HeartHandshake,
  Users,
  CreditCard,
  AppWindow,
  LifeBuoy,
  Settings,
  LogOut,
  Heart,
  ShieldCheck,
  X,
  AlertTriangle,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';

const navItems = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Couples',
    href: '/dashboard/couples',
    icon: HeartHandshake,
  },
  {
    name: 'Users',
    href: '/dashboard/users',
    icon: Users,
  },
  {
    name: 'Subscriptions',
    href: '/dashboard/subscriptions',
    icon: CreditCard,
  },
  {
    name: 'Widgets & Events',
    href: '/dashboard/widgets',
    icon: AppWindow,
  },
  {
    name: 'Support & Tickets',
    href: '/dashboard/support',
    icon: LifeBuoy,
  },
  {
    name: 'Settings & Legal',
    href: '/dashboard/settings',
    icon: Settings,
  },
];

interface SidebarProps {
  onClose?: () => void;
}

export function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleConfirmSignOut = async () => {
    setIsSigningOut(true);
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <>
      <aside className="w-64 bg-white border-r border-[#EFECE6] flex flex-col justify-between shrink-0 min-h-screen h-full select-none">
        {/* Top Branding */}
        <div>
          <div className="p-5 sm:p-6 border-b border-[#EFECE6]/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#FFE0EF] border border-[#FF4FA3]/20 flex items-center justify-center text-[#FF4FA3] shadow-xs">
                <Heart className="w-5 h-5 fill-[#FF4FA3]" />
              </div>
              <div>
                <h1 className="font-bold text-[#1A1530] tracking-tight leading-none text-base">LoveLynk</h1>
                <span className="text-[11px] font-medium text-[#6B667A] flex items-center gap-1 mt-1">
                  <ShieldCheck className="w-3 h-3 text-[#FF4FA3]" /> Admin Portal
                </span>
              </div>
            </div>

            {/* Mobile Close Button (shown only when inside mobile drawer) */}
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="md:hidden p-1.5 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                title="Close Navigation"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Navigation Items */}
          <nav className="p-4 space-y-1">
            <p className="px-3 py-2 text-[10px] font-semibold text-[#6B667A] tracking-wider uppercase">
              Menu
            </p>
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
                    isActive
                      ? 'bg-[#FF4FA3] text-white shadow-md shadow-[#FF4FA3]/25 font-semibold'
                      : 'text-[#6B667A] hover:text-[#FF4FA3] hover:bg-[#FFE0EF]/40'
                  )}
                >
                  <item.icon
                    className={cn(
                      'w-4 h-4 shrink-0',
                      isActive ? 'text-white' : 'text-[#6B667A]'
                    )}
                  />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-[#EFECE6] space-y-2">
          <div className="px-3 py-2 rounded-xl bg-[#F9F8F4] border border-[#EFECE6] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs text-[#1A1530] font-medium">Supabase Cloud</span>
            <span className="text-[10px] text-[#6B667A] ml-auto">eu-west-1</span>
          </div>

          <button
            type="button"
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl border border-[var(--color-card-border)] shadow-xl w-full max-w-sm p-6 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-slate-900">
                Sign Out of LoveLynk Admin?
              </h3>
              <p className="text-xs text-slate-500">
                Are you sure you want to log out? You will need to sign in again to access administrative tools.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="py-2.5 px-4 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmSignOut}
                disabled={isSigningOut}
                className="inline-flex items-center justify-center gap-1.5 py-2.5 px-4 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs transition-colors disabled:opacity-60 cursor-pointer"
              >
                {isSigningOut ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Signing Out...</span>
                  </>
                ) : (
                  <span>Yes, Sign Out</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
