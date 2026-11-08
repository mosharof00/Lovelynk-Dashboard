'use client';

import { useActionState, useState } from 'react';
import { sendTestInteraction } from './actions';
import { Heart, Activity, Smile, Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface CoupleOption {
  id: string;
  names: string;
}

export function InteractionSimulator({ couples }: { couples: CoupleOption[] }) {
  const [state, formAction, isPending] = useActionState(sendTestInteraction, null);
  const [selectedKind, setSelectedKind] = useState<'kiss' | 'heartbeat' | 'emoji'>('kiss');

  return (
    <div className="bg-white p-6 rounded-2xl border border-[var(--color-card-border)] shadow-xs space-y-4">
      <div className="flex items-center gap-2 pb-3 border-b border-[var(--color-card-border)]">
        <Heart className="w-5 h-5 text-[var(--color-brand-rose)]" />
        <div>
          <h2 className="text-base font-bold text-[var(--color-text-main)]">
            Widget Interaction Dispatcher
          </h2>
          <p className="text-xs text-[var(--color-text-muted)]">
            Simulate real kisses, heartbeats, or emoji reactions to test iOS widget sync.
          </p>
        </div>
      </div>

      {state?.success && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-emerald-900 text-xs font-medium animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{state.message}</span>
        </div>
      )}

      {state?.error && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-900 text-xs animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{state.error}</span>
        </div>
      )}

      <form action={formAction} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[var(--color-text-main)] mb-1">
            Target Couple
          </label>
          {couples.length > 0 ? (
            <select
              name="couple_id"
              required
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-[var(--color-card-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-rose)] text-[var(--color-text-main)]"
            >
              {couples.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.names} ({c.id.substring(0, 8)}...)
                </option>
              ))}
            </select>
          ) : (
            <input
              name="couple_id"
              type="text"
              required
              placeholder="Paste Couple UUID..."
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-[var(--color-card-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-rose)] font-mono text-xs"
            />
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-[var(--color-text-main)] mb-1">
            Interaction Type
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setSelectedKind('kiss')}
              className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-colors cursor-pointer ${
                selectedKind === 'kiss'
                  ? 'border-[var(--color-brand-rose)] bg-rose-50/60 text-[var(--color-brand-rose)] font-semibold'
                  : 'border-[var(--color-card-border)] hover:bg-gray-50 text-slate-700'
              }`}
            >
              <Heart className="w-5 h-5 fill-current" />
              <span className="text-xs">Kiss 💋</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedKind('heartbeat')}
              className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-colors cursor-pointer ${
                selectedKind === 'heartbeat'
                  ? 'border-[var(--color-brand-rose)] bg-rose-50/60 text-[var(--color-brand-rose)] font-semibold'
                  : 'border-[var(--color-card-border)] hover:bg-gray-50 text-slate-700'
              }`}
            >
              <Activity className="w-5 h-5" />
              <span className="text-xs">Heartbeat 💓</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedKind('emoji')}
              className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-colors cursor-pointer ${
                selectedKind === 'emoji'
                  ? 'border-[var(--color-brand-rose)] bg-rose-50/60 text-[var(--color-brand-rose)] font-semibold'
                  : 'border-[var(--color-card-border)] hover:bg-gray-50 text-slate-700'
              }`}
            >
              <Smile className="w-5 h-5" />
              <span className="text-xs">Emoji 😍</span>
            </button>
          </div>
          <input type="hidden" name="kind" value={selectedKind} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-[var(--color-text-main)] mb-1">
              Count (1 - 100)
            </label>
            <input
              name="count"
              type="number"
              min="1"
              max="100"
              defaultValue="5"
              className="w-full px-3.5 py-2 text-sm bg-white border border-[var(--color-card-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-rose)] text-[var(--color-text-main)]"
            />
          </div>

          {selectedKind === 'emoji' && (
            <div>
              <label className="block text-xs font-semibold text-[var(--color-text-main)] mb-1">
                Emoji Reaction
              </label>
              <input
                name="emoji"
                type="text"
                defaultValue="💖"
                className="w-full px-3.5 py-2 text-sm bg-white border border-[var(--color-card-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-rose)] text-[var(--color-text-main)] text-center text-lg"
              />
            </div>
          )}
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--color-brand-rose)] hover:bg-[var(--color-brand-rose-hover)] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors disabled:opacity-60 cursor-pointer"
          >
            {isPending ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Dispatching...</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Dispatch to Couple</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

