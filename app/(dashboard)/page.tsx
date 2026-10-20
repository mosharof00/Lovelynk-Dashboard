import Link from 'next/link';
import {
  Users,
  Heart,
  Activity,
  LifeBuoy,
  Plus,
  Send,
  ArrowUpRight,
  ShieldCheck,
  Bell,
  Clock,
} from 'lucide-react';
import { MetricCard } from '@/components/ui/MetricCard';
import { Badge } from '@/components/ui/Badge';
import { getTodayMetrics } from '@/lib/api/metrics';
import styles from './page.module.scss';

export default async function DashboardOverviewPage() {
  const metrics = await getTodayMetrics();

  return (
    <div className={styles.page}>
      {/* Welcome & Quick Action Header */}
      <section className={styles.welcomeSection}>
        <div className={styles.welcomeText}>
          <h2>Live Overview & Key Performance</h2>
          <p>Real-time telemetry and user operations from Lovelynk Supabase instance.</p>
        </div>

        <div className={styles.quickActions}>
          <Link href="/broadcasts" className={styles.primaryBtn}>
            <Send size={15} />
            <span>Send Broadcast</span>
          </Link>
          <Link href="/users" className={styles.secondaryBtn}>
            <Users size={15} />
            <span>Manage Users</span>
          </Link>
        </div>
      </section>

      {/* 4 Primary Top Metrics */}
      <section className={styles.metricsGrid}>
        <MetricCard
          title="Total Users"
          value={metrics.totalUsers.toLocaleString()}
          subtitle={`+${metrics.newUsersToday} joined today`}
          icon={Users}
          variant="primary"
        />
        <MetricCard
          title="Active Couples"
          value={metrics.activeCouples.toLocaleString()}
          subtitle="Paired and sharing widgets"
          icon={Heart}
          variant="blue"
        />
        <MetricCard
          title="Interactions Today"
          value={metrics.interactionsToday.toLocaleString()}
          subtitle="Heartbeats, kisses, & emojis"
          icon={Activity}
          variant="emerald"
        />
        <MetricCard
          title="Open Tickets"
          value={metrics.openTickets.toLocaleString()}
          subtitle="User inquiries needing reply"
          icon={LifeBuoy}
          variant="amber"
        />
      </section>

      {/* Two Column Section: System Status & Recent Operations */}
      <section className={styles.gridTwoCols}>
        {/* Left: Operations Summary */}
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <h3>Key System Operations</h3>
            <Link href="/settings" className={styles.panelAction}>
              Configure <ArrowUpRight size={13} style={{ display: 'inline' }} />
            </Link>
          </div>

          <div className={styles.statusCardList}>
            <div className={styles.statusCardItem}>
              <div className={styles.info}>
                <span className={styles.itemTitle}>APNs & FCM Push Gateway</span>
                <span className={styles.itemSubtitle}>Firebase APNs dispatch via push-dispatch v6</span>
              </div>
              <Badge variant="success">Active</Badge>
            </div>

            <div className={styles.statusCardItem}>
              <div className={styles.info}>
                <span className={styles.itemTitle}>Widget App Group Sync</span>
                <span className={styles.itemSubtitle}>App group group.com.lovelynk.ios timeline updates</span>
              </div>
              <Badge variant="success">Operational</Badge>
            </div>

            <div className={styles.statusCardItem}>
              <div className={styles.info}>
                <span className={styles.itemTitle}>OpenWeather Cache Throttle</span>
                <span className={styles.itemSubtitle}>60-minute partner weather cache active</span>
              </div>
              <Badge variant="info">Optimized</Badge>
            </div>

            <div className={styles.statusCardItem}>
              <div className={styles.info}>
                <span className={styles.itemTitle}>Active Push Broadcasts</span>
                <span className={styles.itemSubtitle}>{metrics.scheduledBroadcasts} broadcasts currently scheduled</span>
              </div>
              <Badge variant={metrics.scheduledBroadcasts > 0 ? 'warning' : 'neutral'}>
                {metrics.scheduledBroadcasts > 0 ? 'Scheduled' : 'None pending'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Right: Quick Shortcuts & Security Check */}
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <h3>Security & MFA (Phase 10.2)</h3>
            <ShieldCheck size={18} color="#10b981" />
          </div>

          <div className={styles.statusCardList}>
            <div className={styles.statusCardItem}>
              <div className={styles.info}>
                <span className={styles.itemTitle}>Admin Auth MFA Guard</span>
                <span className={styles.itemSubtitle}>private.is_admin() requires aal2 verification</span>
              </div>
              <Badge variant="success">Enforced</Badge>
            </div>

            <div className={styles.statusCardItem}>
              <div className={styles.info}>
                <span className={styles.itemTitle}>Data API Protection</span>
                <span className={styles.itemSubtitle}>private schema isolated from public API</span>
              </div>
              <Badge variant="success">Secured</Badge>
            </div>

            <div className={styles.statusCardItem}>
              <div className={styles.info}>
                <span className={styles.itemTitle}>Support Inquiries</span>
                <span className={styles.itemSubtitle}>{metrics.openTickets} tickets awaiting response</span>
              </div>
              <Link href="/tickets">
                <Badge variant={metrics.openTickets > 0 ? 'warning' : 'neutral'}>
                  {metrics.openTickets > 0 ? 'Action needed' : 'All clear'}
                </Badge>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
