import { createAdminClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';
import { Users, Search, Smartphone, Calendar, MapPin, CheckCircle, Clock, ShieldAlert } from 'lucide-react';
import { formatDate, formatDateTime } from '@/lib/utils';

export default async function UsersPage() {
  const supabase = createAdminClient();

  const { data: users, error } = await supabase
    .from('users')
    .select(`
      id,
      email,
      full_name,
      avatar_path,
      auth_provider,
      timezone,
      app_version,
      last_seen_at,
      last_sign_in_at,
      banned_at,
      created_at,
      location_sharing_enabled,
      push_devices (
        id,
        platform,
        fcm_token,
        app_version,
        last_seen_at
      )
    `)
    .order('created_at', { ascending: false })
    .limit(50);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[var(--color-card-border)] shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 bg-[var(--color-brand-pink)] text-[var(--color-brand-rose)] rounded-xl">
              <Users className="w-5 h-5 fill-current" />
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text-main)]">
              Registered Users
            </h1>
          </div>
          <p className="text-sm text-[var(--color-text-muted)]">
            Browse all registered accounts, device push tokens, and activity status.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-[var(--color-brand-pink)] rounded-xl border border-rose-200/60 text-xs font-semibold text-rose-950">
            Total Users: <span className="font-bold text-sm ml-1">{users?.length || 0}</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <p className="font-semibold text-amber-800">Supabase Notice</p>
            <p>{error.message}</p>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-[var(--color-card-border)] shadow-xs overflow-hidden">
        <div className="p-5 border-b border-[var(--color-card-border)] flex items-center justify-between">
          <h2 className="text-base font-semibold text-[var(--color-text-main)]">
            All Users ({users?.length || 0})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-[var(--color-card-border)] bg-[#FAFAF8] text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
                <th className="py-3 px-6">User Details</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6">Timezone & Location</th>
                <th className="py-3 px-6">Push Devices</th>
                <th className="py-3 px-6">App Version</th>
                <th className="py-3 px-6">Registered</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-card-border)]">
              {(!users || users.length === 0) ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-sm text-[var(--color-text-muted)]">
                    <Users className="w-8 h-8 text-rose-300 mx-auto mb-2 opacity-50" />
                    No users found in database.
                  </td>
                </tr>
              ) : (
                users.map((u: any) => {
                  const hasDevices = (u.push_devices || []).length > 0;
                  const isBanned = !!u.banned_at;

                  return (
                    <tr key={u.id} className="hover:bg-[#FAF9F5] transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[var(--color-brand-pink)] text-[var(--color-brand-rose)] flex items-center justify-center font-bold text-xs uppercase border border-rose-200">
                            {(u.full_name || u.email || 'U').substring(0, 2)}
                          </div>
                          <div>
                            <div className="font-semibold text-xs text-slate-900">
                              {u.full_name || 'Anonymous User'}
                            </div>
                            <div className="text-xs text-slate-500">{u.email}</div>
                            <div className="text-[10px] text-gray-400 font-mono mt-0.5">
                              ID: {u.id.substring(0, 14)}...
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            isBanned
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}
                        >
                          {isBanned ? 'Banned' : 'Active'}
                        </span>
                      </td>

                      <td className="py-4 px-6 text-xs text-slate-600">
                        <div className="flex items-center gap-1 font-medium text-slate-800">
                          <MapPin className="w-3.5 h-3.5 text-gray-400" />
                          <span>{u.timezone || 'UTC'}</span>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          Location: {u.location_sharing_enabled ? 'Sharing On' : 'Disabled'}
                        </div>
                      </td>

                      <td className="py-4 px-6 whitespace-nowrap">
                        {hasDevices ? (
                          <div className="flex items-center gap-1.5 text-emerald-700 font-medium text-xs">
                            <Smartphone className="w-3.5 h-3.5" />
                            <span>{u.push_devices.length} registered device{u.push_devices.length > 1 ? 's' : ''}</span>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-xs italic">No active tokens</span>
                        )}
                      </td>

                      <td className="py-4 px-6 whitespace-nowrap text-xs text-slate-600 font-mono">
                        {u.app_version || '1.0.0'}
                      </td>

                      <td className="py-4 px-6 whitespace-nowrap text-xs text-slate-500">
                        <div>{formatDate(u.created_at)}</div>
                        <div className="text-[10px] text-gray-400">
                          {u.last_sign_in_at ? `Signed in ${formatDateTime(u.last_sign_in_at)}` : 'Never signed in'}
                        </div>
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
