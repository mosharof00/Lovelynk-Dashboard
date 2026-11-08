'use client';

import { useActionState } from 'react';
import { seedDemoCouple } from './actions';
import { Sparkles, Users, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export function SeedTools() {
  const [state, formAction, isPending] = useActionState(seedDemoCouple, null);

  return (
    <div className="bg-white p-6 rounded-2xl border border-[var(--color-card-border)] shadow-xs space-y-4">
      <div className="flex items-center gap-2 pb-3 border-b border-[var(--color-card-border)]">
        <Sparkles className="w-5 h-5 text-amber-500" />
        <div>
          <h2 className="text-base font-bold text-[var(--color-text-main)]">
            1-Click Demo Couple Generator
          </h2>
          <p className="text-xs text-[var(--color-text-muted)]">
            Creates 2 paired test accounts with active VIP subscription & anniversary date.
          </p>
        </div>
      </div>

      {state?.success && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1 text-emerald-900 text-xs animate-in fade-in">
          <div className="flex items-center gap-1.5 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{state.message}</span>
          </div>
          <p className="text-[11px] text-emerald-700">
            Partner 1: <code className="bg-emerald-100 px-1 rounded">demo.partner1@lovelynk.io</code> (VIP)<br />
            Partner 2: <code className="bg-emerald-100 px-1 rounded">demo.partner2@lovelynk.io</code>
          </p>
        </div>
      )}

      {state?.error && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-900 text-xs animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{state.error}</span>
        </div>
      )}

      <form action={formAction} className="space-y-4">
        <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200/50 text-xs text-amber-900 space-y-1">
          <p className="font-semibold text-amber-800">What this does:</p>
          <ul className="list-disc list-inside space-y-0.5 text-[11px] text-amber-700">
            <li>Registers <span className="font-mono">Alex Rivera</span> and <span className="font-mono">Taylor Swift</span></li>
            <li>Pairs them together with a 1-year anniversary</li>
            <li>Grants 1 Year of LoveLynk Plus (unlocked widgets on both phones)</li>
            <li>Sets an upcoming next-visit countdown</li>
          </ul>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors disabled:opacity-60 cursor-pointer"
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Generating Demo Accounts...</span>
            </>
          ) : (
            <>
              <Users className="w-4 h-4" />
              <span>Generate Demo Couple Now</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}

