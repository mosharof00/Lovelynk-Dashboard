import { LucideIcon } from 'lucide-react';
import styles from './MetricCard.module.scss';

export interface MetricCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  variant?: 'neutral' | 'amber' | 'blue' | 'rose';
  borderHighlight?: 'amber' | 'rose' | 'blue' | 'none';
}

export function MetricCard({
  label,
  value,
  subtitle,
  icon: Icon,
  variant = 'neutral',
  borderHighlight = 'none',
}: MetricCardProps) {
  const borderClass =
    borderHighlight === 'amber'
      ? styles.borderAmber
      : borderHighlight === 'rose'
      ? styles.borderRose
      : borderHighlight === 'blue'
      ? styles.borderBlue
      : '';

  return (
    <div className={`${styles.card} ${borderClass}`}>
      <div className={styles.topRow}>
        <span className={styles.label}>{label}</span>
        <div className={`${styles.iconCircle} ${styles[variant]}`}>
          <Icon size={16} />
        </div>
      </div>

      <div className={styles.content}>
        <span className={styles.value}>{value}</span>
        {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
      </div>
    </div>
  );
}
