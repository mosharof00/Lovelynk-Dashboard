import { createAdminClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';
import { Users, Search, Smartphone, Calendar, MapPin, CheckCircle, Clock } from 'lucide-react';
import { formatDate, formatDateTime } from '@/lib/utils';

export default async function UsersPage() {
  const supabase = createAdminClient();

  const { data: users, error } = await supabase
    .from('users')
      .select(`
        id,
        email,
        full_name,
        role,
        is_active,
        timezone,
        location_sharing_enabled,
        created_at,
        last_sign_in_at,
        push_devices (
          platform,
          token,
          updated_at
        )
      `)
      .order('created_at', { ascending: false })
      .limit(50);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-[#1E1E24]">Registered Users</h2>
          <p className="text-sm text-[#64748B] mt-1">
            Browse all registered accounts, device push tokens, and activity status.
          </p>
        </div>
      </div>

      <div className="bg-[#FFFFFF] rounded-3xl border border-[#EFECE6] p-6 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#EFECE6] text-[11px] font-semibold text-[#64748B] uppercase">
                <th className="pb-3 pl-2">User Details</th>
                <th className="pb-3">Role & Status</th>
                <th className="pb-3">Timezone / Location</th>
                <th className="pb-3">Push Devices</th>
                <th className="pb-3 pr-2">Registered</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFECE6]/60 text-xs">
              {(!users || users.length === 0) ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-[#64748B]">
                    No users found in database.
                  </td>
                </tr>
              ) : (
                users.map((u: any) => {
                  const hasIosPush = (u.push_devices || []).length > 0;
                  return (
                    <tr key={u.id} className="hover:bg-[#F9F8F4]/80 transition-colors">
                      <td className="py-3.5 pl-2">
                        <div className="font-semibold text-[#1E1E24] text-sm">
                          {u.full_name || 'Anonymous User'}
                        </div>
                        <div className="text-xs text-[#64748B]">{u.email}</div>
                        <div className="text-[10px] text-[#64748B]/70 font-mono mt-0.5">{u.id}</div>
                      </td>
                      <td className="py-3.5">
                        <div className="flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#EBF8F2] text-emerald-800 border border-emerald-200 capitalize">
                            {u.is_active ? 'Active' : 'Disabled'}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 text-gray-700 capitalize">
                            {u.role || 'User'}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 text-[#64748B]">
                        <div className="flex items-center gap-1 text-[#1E1E24]">
                          <MapPin className="w-3.5 h-3.5 text-[#64748B]" />
                          <span>{u.timezone || 'UTC'}</span>
                        </div>
                        <div className="text-[11px] text-[#64748B] mt-0.5">
                          Sharing: {u.location_sharing_enabled ? 'Allowed' : 'Paused'}
                        </div>
                      </td>
                      <td className="py-3.5">
                        {hasIosPush ? (
                          <div className="flex items-center gap-1 text-emerald-700 font-medium">
                            <Smartphone className="w-3.5 h-3.5" />
                            <span>{u.push_devices.length} iOS APNs/FCM</span>
                          </div>
                        ) : (
                          <span className="text-[#64748B] italic">No active token</span>
                        )}
                      </td>
                      <td className="py-3.5 pr-2 text-[#64748B]">
                        <div>{formatDate(u.created_at)}</div>
                        <div className="text-[10px] text-[#64748B]/70">
                          {u.last_sign_in_at ? `Signed in ${formatDateTime(u.last_sign_in_at)}` : 'Never'}
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

