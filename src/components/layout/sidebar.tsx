'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  HeartHandshake,
  Users,
  CreditCard,
  AppWindow,
  Sparkles,
  Settings,
  LogOut,
  Heart,
  ShieldCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

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
    name: 'Testing Sandbox',
    href: '/dashboard/sandbox',
    icon: Sparkles,
  },
  {
    name: 'Settings & Legal',
    href: '/dashboard/settings',
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <aside className="w-64 border-r border-[#EFECE6] bg-[#FFFFFF] flex flex-col justify-between shrink-0 min-h-screen">
      {/* Top Branding */}
      <div>
        <div className="p-6 border-b border-[#EFECE6]/80 flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#FFF0F3] border border-[#FF4B72]/20 flex items-center justify-center text-[#FF4B72] shadow-sm">
            <Heart className="w-5 h-5 fill-[#FF4B72]" />
          </div>
          <div>
            <h1 className="font-bold text-[#1E1E24] tracking-tight leading-none text-base">LoveLynk</h1>
            <span className="text-[11px] font-medium text-[#64748B] flex items-center gap-1 mt-1">
              <ShieldCheck className="w-3 h-3 text-[#FF4B72]" /> Admin Portal
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-1">
          <p className="px-3 py-2 text-[10px] font-semibold text-[#64748B] tracking-wider uppercase">
            Menu
          </p>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
                  isActive
                    ? 'bg-[#1E1E24] text-white shadow-sm font-semibold'
                    : 'text-[#64748B] hover:text-[#1E1E24] hover:bg-[#F9F8F4]'
                )}
              >
                <item.icon
                  className={cn(
                    'w-4 h-4',
                    isActive ? 'text-[#FF4B72]' : 'text-[#64748B]'
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
          <span className="text-xs text-[#1E1E24] font-medium">Supabase Cloud</span>
          <span className="text-[10px] text-[#64748B] ml-auto">eu-west-1</span>
        </div>

        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}

