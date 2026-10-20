import { LifeBuoy, CheckCircle2, Clock } from 'lucide-react';
import { getSupportTickets } from '@/lib/api/tickets';
import { Badge } from '@/components/ui/Badge';
import { format } from 'date-fns';
import styles from '../users/page.module.scss';

export default async function SupportTicketsPage() {
  const tickets = await getSupportTickets();

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.titleArea}>
          <h2>User Support Tickets</h2>
          <p>Review customer reports, troubleshooting requests, and couple pairing inquiries.</p>
        </div>
      </div>

      <div className={styles.tableCard}>
        <div className={styles.tableToolbar}>
          <span className={styles.stats}>
            Total Tickets: <strong>{tickets.length}</strong>
          </span>
        </div>

        <div className={styles.tableWrapper}>
          <table>
            <thead>
              <tr>
                <th>Subject & User</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {tickets.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: '36px' }}>
                    No support tickets found. Everything is running smoothly!
                  </td>
                </tr>
              ) : (
                tickets.map((t) => (
                  <tr key={t.id}>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <strong style={{ color: '#0f172a' }}>{t.subject}</strong>
                        <span style={{ color: '#64748b', fontSize: 12 }}>
                          From: {t.user?.display_name || t.user?.email || 'User'}
                        </span>
                      </div>
                    </td>
                    <td>
                      <Badge
                        variant={
                          t.priority === 'urgent'
                            ? 'danger'
                            : t.priority === 'high'
                            ? 'warning'
                            : 'neutral'
                        }
                      >
                        {t.priority}
                      </Badge>
                    </td>
                    <td>
                      <Badge
                        variant={
                          t.status === 'resolved' || t.status === 'closed'
                            ? 'success'
                            : t.status === 'in_progress'
                            ? 'info'
                            : 'warning'
                        }
                      >
                        {t.status}
                      </Badge>
                    </td>
                    <td>
                      {t.created_at
                        ? format(new Date(t.created_at), 'MMM d, h:mm a')
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
