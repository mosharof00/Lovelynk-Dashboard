'use client';

import { useRouter } from 'next/navigation';
import { RefreshCw } from 'lucide-react';
import { useState } from 'react';
import styles from './Header.module.scss';

export function Header({ title = 'Overview' }: { title?: string }) {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    router.refresh();
    setTimeout(() => setIsRefreshing(false), 600);
  };

  return (
    <header className={styles.header}>
      <div className={styles.titleArea}>
        <h1 className={styles.title}>{title}</h1>
        <span className={styles.badge}>v1.0 MVP</span>
      </div>

      <div className={styles.actions}>
        <div className={styles.envTag}>
          <span className={styles.envDot} />
          <span>Production (Supabase)</span>
        </div>

        <button
          onClick={handleRefresh}
          className={styles.refreshButton}
          disabled={isRefreshing}
          title="Refresh live data"
        >
          <RefreshCw
            size={14}
            className={isRefreshing ? 'animate-spin' : ''}
            style={{ animation: isRefreshing ? 'spin 1s linear infinite' : 'none' }}
          />
          <span>Refresh</span>
        </button>
      </div>
    </header>
  );
}
