import React from 'react';
import styles from './Badge.module.scss';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  showDot?: boolean;
}

export function Badge({ children, variant = 'neutral', showDot = true }: BadgeProps) {
  return (
    <span className={`${styles.badge} ${styles[variant]}`}>
      {showDot && <span className={styles.dot} />}
      {children}
    </span>
  );
}
