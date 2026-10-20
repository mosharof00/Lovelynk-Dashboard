'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Heart,
  Send,
  LifeBuoy,
  Settings,
  LogOut,
  Sparkles,
} from 'lucide-react';
import styles from './Sidebar.module.scss';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

const NAV_ITEMS = [
  { label: 'Overview', href: '/', icon: LayoutDashboard },
  { label: 'Users', href: '/users', icon: Users },
  { label: 'Couples', href: '/couples', icon: Heart },
  { label: 'Broadcasts', href: '/broadcasts', icon: Send },
  { label: 'Support Tickets', href: '/tickets', icon: LifeBuoy },
  { label: 'App Settings', href: '/settings', icon: Settings },
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
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <div className={styles.logoIcon}>
          <Sparkles size={20} />
        </div>
        <div className={styles.brandInfo}>
          <span className={styles.brandName}>Lovelynk</span>
          <span className={styles.brandTag}>Operations Dashboard</span>
        </div>
      </div>

      <nav className={styles.nav}>
        <span className={styles.navSectionTitle}>Management</span>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === '/'
              ? pathname === '/'
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.navItem} ${isActive ? styles.active : ''}`}
            >
              <Icon className={styles.icon} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className={styles.footer}>
        <div className={styles.adminStatus}>
          <span className={styles.statusDot} />
          <span className={styles.adminEmail}>Admin Session</span>
        </div>
        <button
          onClick={handleSignOut}
          title="Sign out"
          className={styles.logoutButton}
        >
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  );
}
