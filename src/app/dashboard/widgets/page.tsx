import { createAdminClient } from '@/lib/supabase/server';
import { AppWindow, Heart, Activity, Smile, Sparkles, ShieldAlert, ArrowRight } from 'lucide-react';
import { formatDate, formatDateTime } from '@/lib/utils';
import Link from 'next/link';

interface InteractionRow {
  id: number;
  couple_id: string;
  sender_id: string;
  recipient_id: string;
  kind: 'kiss' | 'heartbeat' | 'emoji';
  count: number;
  emoji: string | null;
  created_at: string;
  sender?: {
    email: string | null;
    full_name: string | null;
  } | null;
  recipient?: {
    email: string | null;
    full_name: string | null;
  } | null;
}

export default async function WidgetsPage() {
  const supabase = createAdminClient();

  let interactions: InteractionRow[] = [];
  let errorMsg: string | null = null;

  try {
    const { data, error } = await supabase
      .from('interactions')
      .select(`
        id,
        couple_id,
        sender_id,
        recipient_id,
        kind,
        count,
        emoji,
        created_at,
        sender:users!interactions_sender_id_fkey (
          email,
          full_name
        ),
        recipient:users!interactions_recipient_id_fkey (
          email,
          full_name
        )
      `)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      errorMsg = error.message;
    } else {
      interactions = (data as unknown as InteractionRow[]) || [];
    }
  } catch (err: any) {
    errorMsg = err.message || 'Failed to fetch widget interactions';
  }

  const kissCount = interactions.filter(i => i.kind === 'kiss').reduce((acc, i) => acc + i.count, 0);
  const heartbeatCount = interactions.filter(i => i.kind === 'heartbeat').reduce((acc, i) => acc + i.count, 0);
  const emojiCount = interactions.filter(i => i.kind === 'emoji').reduce((acc, i) => acc + i.count, 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header Card */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl border border-[var(--color-card-border)] shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 bg-[var(--color-brand-pink)] text-[var(--color-brand-rose)] rounded-xl">
              <AppWindow className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold text-[var(--color-text-main)]">
              Widgets & Interaction Stream
            </h1>
          </div>
          <p className="text-sm text-[var(--color-text-muted)]">
            Live stream of widget gestures: kisses, synced heartbeats, and lockscreen emoji reactions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/sandbox"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Simulate Interaction</span>
          </Link>
        </div>
      </div>

      {/* Metric Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-[var(--color-card-border)] flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-[var(--color-text-muted)]">Recent Kisses</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{kissCount}</p>
          </div>
          <div className="p-2.5 bg-rose-50 text-[var(--color-brand-rose)] rounded-xl">
            <Heart className="w-5 h-5 fill-current" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[var(--color-card-border)] flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-[var(--color-text-muted)]">Heartbeats Sent</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{heartbeatCount}</p>
          </div>
          <div className="p-2.5 bg-red-50 text-red-600 rounded-xl">
            <Activity className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[var(--color-card-border)] flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-[var(--color-text-muted)]">Emoji Reactions</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{emojiCount}</p>
          </div>
          <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
            <Smile className="w-5 h-5" />
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <p className="font-semibold text-amber-800">Supabase Notice</p>
            <p>{errorMsg}</p>
          </div>
        </div>
      )}

      {/* Interactions Table */}
      <div className="bg-white rounded-2xl border border-[var(--color-card-border)] shadow-xs overflow-hidden">
        <div className="p-5 border-b border-[var(--color-card-border)] flex items-center justify-between">
          <h2 className="text-base font-semibold text-[var(--color-text-main)]">
            Recent Widget Events ({interactions.length})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-[var(--color-card-border)] bg-[#FAFAF8] text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
                <th className="py-3 px-6">Sender & Partner</th>
                <th className="py-3 px-6">Action / Kind</th>
                <th className="py-3 px-6">Payload / Count</th>
                <th className="py-3 px-6">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-card-border)]">
              {interactions.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-sm text-[var(--color-text-muted)]">
                    <Heart className="w-8 h-8 text-rose-300 mx-auto mb-2 opacity-50" />
                    No widget interaction events recorded yet. You can dispatch one using the Testing Sandbox!
                  </td>
                </tr>
              ) : (
                interactions.map((event) => {
                  return (
                    <tr
                      key={event.id}
                      className="hover:bg-[#FAF9F5] transition-colors"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2 text-xs">
                          <span className="font-semibold text-slate-900">
                            {event.sender?.full_name || event.sender?.email?.split('@')[0] || 'Sender'}
                          </span>
                          <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                          <span className="font-semibold text-slate-900">
                            {event.recipient?.full_name || event.recipient?.email?.split('@')[0] || 'Partner'}
                          </span>
                        </div>
                        <span className="text-[10px] text-gray-400 font-mono mt-0.5 block">
                          Couple: {event.couple_id.substring(0, 12)}...
                        </span>
                      </td>

                      <td className="py-4 px-6 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                            event.kind === 'kiss'
                              ? 'bg-rose-50 text-[var(--color-brand-rose)] border border-rose-200'
                              : event.kind === 'heartbeat'
                              ? 'bg-red-50 text-red-700 border border-red-200'
                              : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {event.kind === 'kiss' && <Heart className="w-3.5 h-3.5 fill-current" />}
                          {event.kind === 'heartbeat' && <Activity className="w-3.5 h-3.5" />}
                          {event.kind === 'emoji' && <Smile className="w-3.5 h-3.5" />}
                          <span className="capitalize">{event.kind}</span>
                        </span>
                      </td>

                      <td className="py-4 px-6 whitespace-nowrap font-medium text-slate-800 text-xs">
                        {event.kind === 'emoji' ? (
                          <span className="text-xl">{event.emoji || '💖'}</span>
                        ) : (
                          <span>{event.count}x {event.kind === 'heartbeat' ? 'BPM pulses' : 'kisses'}</span>
                        )}
                      </td>

                      <td className="py-4 px-6 whitespace-nowrap text-xs text-slate-500">
                        {formatDateTime(event.created_at)}
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
