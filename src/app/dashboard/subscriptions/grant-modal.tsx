'use client';

import { useState, useActionState, useEffect } from 'react';
import { Sparkles, Crown, X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { grantVipSubscription } from './actions';

interface GrantModalProps {
  onSuccess?: () => void;
}

export function GrantVipModal({ onSuccess }: GrantModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(grantVipSubscription, null);

  useEffect(() => {
    if (state?.success) {
      if (onSuccess) onSuccess();
    }
  }, [state, onSuccess]);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2.5 bg-[var(--color-brand-rose)] hover:bg-[var(--color-brand-rose-hover)] text-white text-sm font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
      >
        <Crown className="w-4 h-4 fill-white" />
        <span>Grant LoveLynk Plus (VIP)</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl border border-[var(--color-card-border)] shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-5 border-b border-[var(--color-card-border)] flex items-center justify-between bg-gradient-to-r from-rose-50/50 to-pink-50/30">
              <div className="flex items-center gap-2">
                <span className="p-2 bg-[var(--color-brand-pink)] text-[var(--color-brand-rose)] rounded-xl">
                  <Crown className="w-5 h-5 fill-current" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-[var(--color-text-main)]">
                    Grant VIP Premium Access
                  </h3>
                  <p className="text-xs text-[var(--color-text-muted)]">
                    Instantly activates LoveLynk Plus in Supabase
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form action={formAction} className="p-5 space-y-4">
              {state?.success ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2 text-emerald-900">
                  <div className="flex items-center gap-2 font-semibold text-sm">
                    <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>LoveLynk Plus Granted!</span>
                  </div>
                  <p className="text-xs text-emerald-700">
                    Successfully activated <strong>{state.plan}</strong> access for <strong>{state.userEmail}</strong>. Both the user and their partner now have full widget access.
                  </p>
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="w-full py-2 bg-emerald-600 text-white font-medium text-xs rounded-lg hover:bg-emerald-700 transition-colors cursor-pointer"
                    >
                      Done & Close
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {state?.error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-900 flex items-start gap-2 text-xs">
                      <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                      <span>{state.error}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-[var(--color-text-main)] mb-1">
                      User Email Address
                    </label>
                    <input
                      name="email"
                      type="email"
                      required
                      placeholder="e.g. jjtangltd@gmail.com"
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-[var(--color-card-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-rose)] focus:border-transparent text-[var(--color-text-main)] placeholder:text-gray-400"
                    />
                    <p className="text-[11px] text-gray-500 mt-1">
                      User must exist in the app database.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[var(--color-text-main)] mb-1">
                      Subscription Duration
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <label className="flex items-center gap-2 p-3 border border-[var(--color-card-border)] rounded-xl cursor-pointer hover:bg-rose-50/40 transition-colors">
                        <input
                          type="radio"
                          name="duration"
                          value="1_month"
                          defaultChecked
                          className="accent-[var(--color-brand-rose)]"
                        />
                        <div className="text-xs">
                          <p className="font-semibold text-slate-800">1 Month</p>
                          <p className="text-gray-400 text-[10px]">Monthly test pass</p>
                        </div>
                      </label>

                      <label className="flex items-center gap-2 p-3 border border-[var(--color-card-border)] rounded-xl cursor-pointer hover:bg-rose-50/40 transition-colors">
                        <input
                          type="radio"
                          name="duration"
                          value="1_year"
                          className="accent-[var(--color-brand-rose)]"
                        />
                        <div className="text-xs">
                          <p className="font-semibold text-slate-800">1 Year (VIP)</p>
                          <p className="text-gray-400 text-[10px]">Annual VIP access</p>
                        </div>
                      </label>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="px-4 py-2 text-xs font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isPending}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[var(--color-brand-rose)] hover:bg-[var(--color-brand-rose-hover)] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors disabled:opacity-60 cursor-pointer"
                    >
                      {isPending ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Granting Access...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Confirm & Grant</span>
                        </>
                      )}
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      )}
    </>
  );
}

