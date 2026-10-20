import { Settings, Save, Shield, Globe } from 'lucide-react';
import { getAppSettings } from '@/lib/api/settings';
import { Badge } from '@/components/ui/Badge';
import { format } from 'date-fns';
import styles from '../users/page.module.scss';

export default async function SettingsPage() {
  const settings = await getAppSettings();

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.titleArea}>
          <h2>App Configuration & Legal URLs</h2>
          <p>Global app parameters from `app_settings` consumed by mobile clients & web.</p>
        </div>
      </div>

      <div className={styles.tableCard}>
        <div className={styles.tableToolbar}>
          <span className={styles.stats}>
            Configured Settings: <strong>{settings.length}</strong>
          </span>
        </div>

        <div className={styles.tableWrapper}>
          <table>
            <thead>
              <tr>
                <th>Key</th>
                <th>Value</th>
                <th>Scope</th>
                <th>Description</th>
                <th>Updated</th>
              </tr>
            </thead>
            <tbody>
              {settings.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '36px' }}>
                    No settings configured in app_settings table.
                  </td>
                </tr>
              ) : (
                settings.map((s) => (
                  <tr key={s.key}>
                    <td>
                      <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: 4, color: '#0f172a' }}>
                        {s.key}
                      </code>
                    </td>
                    <td>
                      <span style={{ fontWeight: 600, color: '#0f172a' }}>
                        {typeof s.value === 'object' ? JSON.stringify(s.value) : String(s.value)}
                      </span>
                    </td>
                    <td>
                      <Badge variant={s.is_public ? 'info' : 'neutral'}>
                        {s.is_public ? 'Public Client' : 'Server Only'}
                      </Badge>
                    </td>
                    <td>{s.description || '—'}</td>
                    <td>
                      {s.updated_at
                        ? format(new Date(s.updated_at), 'MMM d, yyyy')
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
