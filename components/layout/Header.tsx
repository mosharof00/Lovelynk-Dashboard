'use client';

import { Bell, User } from 'lucide-react';
import styles from './Header.module.scss';

export function Header() {
  return (
    <header className={styles.header}>
      {/* Left side: Admin identity as shown in reference */}
      <div className={styles.adminProfile}>
        <span className={styles.adminName}>Admin</span>
        <span className={styles.adminRole}>Administrator</span>
      </div>

      {/* Right side: Notification bell with badge & avatar circle */}
      <div className={styles.rightArea}>
        <button className={styles.notificationButton} title="Notifications">
          <Bell size={19} />
          <span className={styles.badge}>2</span>
        </button>

        <div className={styles.avatarCircle} title="Admin Profile">
          <User size={18} />
        </div>
      </div>
    </header>
  );
}
