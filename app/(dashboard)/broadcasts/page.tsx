import { Send, Bell, Plus, Smartphone } from 'lucide-react';
import { getBroadcasts } from '@/lib/api/broadcasts';
import { Badge } from '@/components/ui/Badge';
import { format } from 'date-fns';
import styles from '../users/page.module.scss';

export default async function BroadcastsPage() {
  const broadcasts = await getBroadcasts();

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.titleArea}>
          <h2>Push Broadcasts & Announcements</h2>
          <p>Deliver in-app notifications and background APNs alerts to Lovelynk couples.</p>
        </div>
      </div>

      <div className={styles.tableCard}>
        <div className={styles.tableToolbar}>
          <span className={styles.stats}>
            Total Broadcasts: <strong>{broadcasts.length}</strong>
          </span>
        </div>

        <div className={styles.tableWrapper}>
          <table>
            <thead>
              <tr>
                <th>Title & Message</th>
                <th>Target Platform</th>
                <th>Status</th>
                <th>Scheduled For</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {broadcasts.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '36px' }}>
                    No broadcasts created yet.
                  </td>
                </tr>
              ) : (
                broadcasts.map((b) => (
                  <tr key={b.id}>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <strong style={{ color: '#0f172a' }}>{b.title}</strong>
                        <span style={{ color: '#64748b', fontSize: 12 }}>{b.body}</span>
                      </div>
                    </td>
                    <td>
                      <span style={{ textTransform: 'uppercase', fontWeight: 600, fontSize: 11 }}>
                        {b.target_platform || 'ALL'}
                      </span>
                    </td>
                    <td>
                      <Badge
                        variant={
                          b.status === 'sent'
                            ? 'success'
                            : b.status === 'scheduled'
                            ? 'warning'
                            : b.status === 'sending'
                            ? 'info'
                            : 'neutral'
                        }
                      >
                        {b.status}
                      </Badge>
                    </td>
                    <td>
                      {b.scheduled_for
                        ? format(new Date(b.scheduled_for), 'MMM d, h:mm a')
                        : 'Immediate'}
                    </td>
                    <td>
                      {b.created_at
                        ? format(new Date(b.created_at), 'MMM d, yyyy')
                        : '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
