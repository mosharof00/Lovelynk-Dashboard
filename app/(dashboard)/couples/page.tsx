import { Heart, Calendar } from 'lucide-react';
import { getCouples } from '@/lib/api/couples';
import { Badge } from '@/components/ui/Badge';
import { format, differenceInDays } from 'date-fns';
import styles from '../users/page.module.scss';

export default async function CouplesPage() {
  const { couples, total } = await getCouples({ limit: 50 });

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.titleArea}>
          <h2>Couples & Pairing Registry</h2>
          <p>Monitor paired couples, relationship anniversaries, and synchronized widgets.</p>
        </div>
      </div>

      <div className={styles.tableCard}>
        <div className={styles.tableToolbar}>
          <span className={styles.stats}>
            Total Paired Couples: <strong>{total}</strong>
          </span>
        </div>

        <div className={styles.tableWrapper}>
          <table>
            <thead>
              <tr>
                <th>Partner A & Partner B</th>
                <th>Status</th>
                <th>Paired Date</th>
                <th>Days Together</th>
                <th>Anniversary</th>
              </tr>
            </thead>
            <tbody>
              {couples.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '36px' }}>
                    No couples registered yet.
                  </td>
                </tr>
              ) : (
                couples.map((c) => {
                  const memberA = c.members[0]?.user;
                  const memberB = c.members[1]?.user;

                  const daysTogether = c.relationship_start_date
                    ? differenceInDays(new Date(), new Date(c.relationship_start_date))
                    : c.created_at
                    ? differenceInDays(new Date(), new Date(c.created_at))
                    : 0;

                  return (
                    <tr key={c.id}>
                      <td style={{ fontWeight: 600, color: '#0f172a' }}>
                        <span style={{ color: '#ff4b72' }}>
                          {memberA?.display_name || memberA?.email?.split('@')[0] || 'Partner A'}
                        </span>
                        {'  ♥  '}
                        <span style={{ color: '#00b4d8' }}>
                          {memberB?.display_name || memberB?.email?.split('@')[0] || (c.status === 'paired' ? 'Partner B' : 'Awaiting Partner')}
                        </span>
                      </td>
                      <td>
                        <Badge
                          variant={
                            c.status === 'paired'
                              ? 'success'
                              : c.status === 'unpaired'
                              ? 'warning'
                              : 'neutral'
                          }
                        >
                          {c.status}
                        </Badge>
                      </td>
                      <td>
                        {c.created_at ? format(new Date(c.created_at), 'MMM d, yyyy') : '—'}
                      </td>
                      <td>
                        <strong>{Math.max(0, daysTogether)}</strong> days
                      </td>
                      <td>
                        {c.wedding_anniversary
                          ? format(new Date(c.wedding_anniversary), 'MMMM d')
                          : 'Not set'}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
