import { LucideIcon } from 'lucide-react';
import styles from './MetricCard.module.scss';

export interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  variant?: 'primary' | 'blue' | 'emerald' | 'amber';
}

export function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = 'primary',
}: MetricCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.topRow}>
        <span className={styles.title}>{title}</span>
        <div className={`${styles.iconBox} ${styles[variant]}`}>
          <Icon size={18} />
        </div>
      </div>

      <div className={styles.content}>
        <span className={styles.value}>{value}</span>
        {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
      </div>
    </div>
  );
}
