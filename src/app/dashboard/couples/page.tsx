import { createClient, createAdminClient } from '@/lib/supabase/server';
import { Heart, Search, Users, Calendar, ArrowRight, ShieldAlert, Sparkles, HeartCrack } from 'lucide-react';
import { formatDate, formatDateTime } from '@/lib/utils';
import { differenceInDays } from 'date-fns';
import Link from 'next/link';

interface CoupleMember {
  user_id: string;
  partner_nickname: string | null;
  joined_at: string;
  left_at: string | null;
  user?: {
    id: string;
    email: string | null;
    full_name: string | null;
  } | null;
}

interface CoupleRow {
  id: string;
  status: string;
  together_since: string | null;
  next_visit_at: string | null;
  created_at: string;
  couple_members: CoupleMember[];
}

export default async function CouplesPage() {
  // Use admin client (service role if available) or session client
  const supabase = createAdminClient();

  let couples: CoupleRow[] = [];
  let errorMsg: string | null = null;

  try {
    const { data, error } = await supabase
      .from('couples')
      .select(`
        id,
        status,
        together_since,
        next_visit_at,
        created_at,
        couple_members (
          user_id,
          partner_nickname,
          joined_at,
          left_at,
          user:users (
            id,
            email,
            full_name
          )
        )
      `)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      errorMsg = error.message;
    } else {
      couples = (data as unknown as CoupleRow[]) || [];
    }
  } catch (err: any) {
    errorMsg = err.message || 'Failed to fetch couples';
  }

  const activeCount = couples.filter(c => c.status === 'active').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header Card */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl border border-[var(--color-card-border)] shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 bg-[var(--color-brand-pink)] text-[var(--color-brand-rose)] rounded-xl">
              <Heart className="w-5 h-5 fill-current" />
            </span>
            <h1 className="text-2xl font-bold text-[var(--color-text-main)]">
              Couples Registry
            </h1>
          </div>
          <p className="text-sm text-[var(--color-text-muted)]">
            Inspect all paired accounts, anniversary milestones, and relationship statuses.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-[var(--color-pastel-yellow)] rounded-xl border border-amber-200/60 text-xs font-semibold text-amber-900">
            Total Couples: <span className="font-bold text-sm ml-1">{couples.length}</span>
          </div>
          <div className="px-4 py-2 bg-[var(--color-pastel-mint)] rounded-xl border border-emerald-200/60 text-xs font-semibold text-emerald-900">
            Active: <span className="font-bold text-sm ml-1">{activeCount}</span>
          </div>
        </div>
      </div>

      {/* RLS / Permission Notice if service role key not yet set */}
      {errorMsg && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <p className="font-semibold text-amber-800">Supabase RLS Notice</p>
            <p>
              Supabase returned: <code className="bg-amber-100 px-1 py-0.5 rounded">{errorMsg}</code>
            </p>
            <p className="text-amber-700">
              To grant full admin bypass, add your <code className="font-mono">SUPABASE_SERVICE_ROLE_KEY</code> from the Supabase Dashboard into <code className="font-mono">.env.local</code>.
            </p>
          </div>
        </div>
      )}

      {/* Couples Table Card */}
      <div className="bg-white rounded-2xl border border-[var(--color-card-border)] shadow-xs overflow-hidden">
        <div className="p-5 border-b border-[var(--color-card-border)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[var(--color-brand-rose)]" />
            <h2 className="text-base font-semibold text-[var(--color-text-main)]">
              All Paired Couples ({couples.length})
            </h2>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-[var(--color-card-border)] bg-[#FAFAF8] text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
                <th className="py-3 px-6">Couple Partners</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6">Days Together</th>
                <th className="py-3 px-6">Anniversary / Since</th>
                <th className="py-3 px-6">Next Visit</th>
                <th className="py-3 px-6">Paired Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-card-border)]">
              {couples.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-sm text-[var(--color-text-muted)]">
                    <Heart className="w-8 h-8 text-rose-300 mx-auto mb-2 opacity-50" />
                    No paired couples registered yet.
                  </td>
                </tr>
              ) : (
                couples.map((couple) => {
                  const memberA = couple.couple_members?.[0]?.user;
                  const memberB = couple.couple_members?.[1]?.user;
                  const daysTogether = couple.together_since
                    ? differenceInDays(new Date(), new Date(couple.together_since))
                    : null;

                  return (
                    <tr
                      key={couple.id}
                      className="hover:bg-[#FAF9F5] transition-colors"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2 flex-wrap">
                          {/* Partner A */}
                          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-rose-50 border border-rose-100 rounded-lg">
                            <span className="w-2 h-2 rounded-full bg-[var(--color-brand-rose)]"></span>
                            <span className="font-medium text-xs text-rose-950">
                              {memberA?.full_name || memberA?.email?.split('@')[0] || 'Partner A'}
                            </span>
                            {memberA?.email && (
                              <span className="text-[11px] text-rose-400">
                                ({memberA.email})
                              </span>
                            )}
                          </div>

                          <Heart className="w-3.5 h-3.5 text-rose-400 fill-current shrink-0" />

                          {/* Partner B */}
                          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-sky-50 border border-sky-100 rounded-lg">
                            <span className="w-2 h-2 rounded-full bg-sky-500"></span>
                            <span className="font-medium text-xs text-sky-950">
                              {memberB?.full_name || memberB?.email?.split('@')[0] || (couple.status === 'active' ? 'Partner B' : 'Awaiting Partner')}
                            </span>
                            {memberB?.email && (
                              <span className="text-[11px] text-sky-400">
                                ({memberB.email})
                              </span>
                            )}
                          </div>
                        </div>
                        <span className="text-[10px] text-gray-400 font-mono mt-1 block">
                          ID: {couple.id.substring(0, 18)}...
                        </span>
                      </td>

                      <td className="py-4 px-6 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            couple.status === 'active'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-gray-100 text-gray-700 border border-gray-200'
                          }`}
                        >
                          {couple.status}
                        </span>
                      </td>

                      <td className="py-4 px-6 whitespace-nowrap font-medium text-slate-800">
                        {daysTogether !== null ? (
                          <div className="flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                            <span>{Math.max(0, daysTogether)} days</span>
                          </div>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>

                      <td className="py-4 px-6 whitespace-nowrap text-xs text-slate-600">
                        {couple.together_since ? (
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-rose-400" />
                            <span>{formatDate(couple.together_since)}</span>
                          </div>
                        ) : (
                          <span className="text-gray-400">Not set</span>
                        )}
                      </td>

                      <td className="py-4 px-6 whitespace-nowrap text-xs text-slate-600">
                        {couple.next_visit_at ? (
                          formatDateTime(couple.next_visit_at)
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>

                      <td className="py-4 px-6 whitespace-nowrap text-xs text-slate-500">
                        {formatDate(couple.created_at)}
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
