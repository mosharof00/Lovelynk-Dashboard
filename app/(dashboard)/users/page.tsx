import Link from 'next/link';
import { Search, ChevronLeft, ChevronRight, UserCheck, Ban } from 'lucide-react';
import { getUsers } from '@/lib/api/users';
import { Badge } from '@/components/ui/Badge';
import { format } from 'date-fns';
import styles from './page.module.scss';

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string; status?: string }>;
}) {
  const resolvedParams = await searchParams;
  const page = parseInt(resolvedParams.page || '1', 10);
  const search = resolvedParams.search || '';
  const status = (resolvedParams.status as any) || 'all';

  const { users, total, totalPages } = await getUsers({
    page,
    limit: 15,
    search,
    status,
  });

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.titleArea}>
          <h2>User Directory</h2>
          <p>Browse registered mobile accounts, partner links, and moderation status.</p>
        </div>
      </div>

      <div className={styles.tableCard}>
        <div className={styles.tableToolbar}>
          <form className={styles.searchBox} method="GET">
            <Search size={15} className={styles.searchIcon} />
            <input
              type="text"
              name="search"
              defaultValue={search}
              placeholder="Search by name or email..."
            />
          </form>

          <span className={styles.stats}>
            Showing <strong>{users.length}</strong> of <strong>{total}</strong> users
          </span>
        </div>

        <div className={styles.tableWrapper}>
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Timezone</th>
                <th>Status</th>
                <th>Registered</th>
                <th>Last Active</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '36px' }}>
                    No users found matching your criteria.
                  </td>
                </tr>
              ) : (
                users.map((user) => {
                  const initial = (user.display_name || user.email || 'U')[0].toUpperCase();
                  const isBanned = !!user.banned_at;

                  return (
                    <tr key={user.id}>
                      <td className={styles.userCol}>
                        <div className={styles.avatar}>{initial}</div>
                        <div className={styles.nameInfo}>
                          <span className={styles.name}>{user.display_name || 'Anonymous User'}</span>
                          <span className={styles.email}>{user.email || 'No email provided'}</span>
                        </div>
                      </td>
                      <td>{user.timezone || 'UTC'}</td>
                      <td>
                        {isBanned ? (
                          <Badge variant="danger">Banned</Badge>
                        ) : user.is_profile_complete ? (
                          <Badge variant="success">Active</Badge>
                        ) : (
                          <Badge variant="warning">Onboarding</Badge>
                        )}
                      </td>
                      <td>
                        {user.created_at
                          ? format(new Date(user.created_at), 'MMM d, yyyy')
                          : '—'}
                      </td>
                      <td>
                        {user.last_active_at
                          ? format(new Date(user.last_active_at), 'MMM d, h:mm a')
                          : 'Never'}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className={styles.pagination}>
            <span>Page {page} of {totalPages}</span>
            <div className={styles.pageButtons}>
              {page > 1 ? (
                <Link href={`/users?page=${page - 1}&search=${encodeURIComponent(search)}`}>
                  <ChevronLeft size={14} style={{ display: 'inline', marginRight: 4 }} />
                  Previous
                </Link>
              ) : (
                <button disabled>Previous</button>
              )}

              {page < totalPages ? (
                <Link href={`/users?page=${page + 1}&search=${encodeURIComponent(search)}`}>
                  Next
                  <ChevronRight size={14} style={{ display: 'inline', marginLeft: 4 }} />
                </Link>
              ) : (
                <button disabled>Next</button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
