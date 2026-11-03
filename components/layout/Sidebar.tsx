'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutGrid,
  Users,
  Heart,
  Send,
  LifeBuoy,
  Settings,
  CreditCard,
  Activity,
  HeartHandshake,
} from 'lucide-react';
import styles from './Sidebar.module.scss';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/', icon: LayoutGrid },
  { label: 'Users', href: '/users', icon: Users },
  { label: 'Couples', href: '/couples', icon: Heart },
  { label: 'Broadcasts', href: '/broadcasts', icon: Send },
  { label: 'Support Tickets', href: '/tickets', icon: LifeBuoy },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className={styles.sidebar}>
      {/* Brand Header matching reference screenshot */}
      <div className={styles.brand}>
        <div className={styles.logoMark}>
          L
        </div>
        <div className={styles.brandInfo}>
          <span className={styles.brandName}>LOVELYNK</span>
          <span className={styles.brandTag}>COUPLES PLATFORM</span>
        </div>
      </div>

      {/* Main Nav Items */}
      <nav className={styles.nav}>
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

      {/* Bottom Settings Link matching reference screenshot */}
      <div className={styles.bottomSection}>
        <Link
          href="/settings"
          className={`${styles.navItem} ${pathname.startsWith('/settings') ? styles.active : ''}`}
        >
          <Settings className={styles.icon} />
          <span>Settings</span>
        </Link>
      </div>
    </aside>
  );
}
