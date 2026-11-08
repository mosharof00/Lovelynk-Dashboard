import { createAdminClient } from '@/lib/supabase/server';
import { CreditCard, ShieldAlert, Sparkles, CheckCircle2, Clock, AlertTriangle, ShieldCheck } from 'lucide-react';
import { formatDate, formatDateTime, formatCurrency } from '@/lib/utils';
import { GrantVipModal } from './grant-modal';
import { RevokeButton } from './revoke-button';

interface SubscriptionRow {
  user_id: string;
  entitlement_id: string;
  status: string;
  period_type: string;
  plan: string | null;
  product_id: string;
  store: string;
  environment: string;
  price_amount: number | null;
  currency: string | null;
  started_at: string | null;
  expires_at: string | null;
  will_renew: boolean;
  updated_at: string;
  user?: {
    id: string;
    email: string | null;
    full_name: string | null;
  } | null;
}

export default async function SubscriptionsPage() {
  const supabase = createAdminClient();

  let subscriptions: SubscriptionRow[] = [];
  let errorMsg: string | null = null;

  try {
    const { data, error } = await supabase
      .from('subscription_entitlements')
      .select(`
        user_id,
        entitlement_id,
        status,
        period_type,
        plan,
        product_id,
        store,
        environment,
        price_amount,
        currency,
        started_at,
        expires_at,
        will_renew,
        updated_at,
        user:users (
          id,
          email,
          full_name
        )
      `)
      .order('updated_at', { ascending: false })
      .limit(50);

    if (error) {
      errorMsg = error.message;
    } else {
      subscriptions = (data as unknown as SubscriptionRow[]) || [];
    }
  } catch (err: any) {
    errorMsg = err.message || 'Failed to fetch subscriptions';
  }

  const activeCount = subscriptions.filter(s => s.status === 'active').length;
  const trialCount = subscriptions.filter(s => s.period_type === 'trial' && s.status === 'active').length;
  const expiredCount = subscriptions.filter(s => s.status === 'expired').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header Card */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl border border-[var(--color-card-border)] shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 bg-[var(--color-brand-pink)] text-[var(--color-brand-rose)] rounded-xl">
              <CreditCard className="w-5 h-5 fill-current" />
            </span>
            <h1 className="text-2xl font-bold text-[var(--color-text-main)]">
              Subscription Entitlements
            </h1>
          </div>
          <p className="text-sm text-[var(--color-text-muted)]">
            Manage RevenueCat store purchases, active entitlements, and grant manual VIP access.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <GrantVipModal />
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-[var(--color-card-border)] flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-[var(--color-text-muted)]">Active Subscribers</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{activeCount}</p>
          </div>
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[var(--color-card-border)] flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-[var(--color-text-muted)]">In Free Trial</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{trialCount}</p>
          </div>
          <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[var(--color-card-border)] flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-[var(--color-text-muted)]">Expired / Past Due</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{expiredCount}</p>
          </div>
          <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Error / Notice */}
      {errorMsg && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <p className="font-semibold text-amber-800">Supabase RLS Notice</p>
            <p>
              Supabase returned: <code className="bg-amber-100 px-1 py-0.5 rounded">{errorMsg}</code>
            </p>
            <p className="text-amber-700">
              Ensure <code className="font-mono">SUPABASE_SERVICE_ROLE_KEY</code> is configured in <code className="font-mono">.env.local</code> to query all subscriptions.
            </p>
          </div>
        </div>
      )}

      {/* Subscriptions Table */}
      <div className="bg-white rounded-2xl border border-[var(--color-card-border)] shadow-xs overflow-hidden">
        <div className="p-5 border-b border-[var(--color-card-border)] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[var(--color-brand-rose)]" />
            <h2 className="text-base font-semibold text-[var(--color-text-main)]">
              All Entitlements ({subscriptions.length})
            </h2>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-[var(--color-card-border)] bg-[#FAFAF8] text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
                <th className="py-3 px-6">User / Account</th>
                <th className="py-3 px-6">Plan & Store</th>
                <th className="py-3 px-6">Type</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6">Renewal</th>
                <th className="py-3 px-6">Expires At</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-card-border)]">
              {subscriptions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-sm text-[var(--color-text-muted)]">
                    <CreditCard className="w-8 h-8 text-rose-300 mx-auto mb-2 opacity-50" />
                    No subscription entitlements recorded yet. Click "Grant LoveLynk Plus (VIP)" above to add test access.
                  </td>
                </tr>
              ) : (
                subscriptions.map((sub) => {
                  const isActive = sub.status === 'active';
                  const isTrial = sub.period_type === 'trial';

                  return (
                    <tr
                      key={sub.user_id}
                      className="hover:bg-[#FAF9F5] transition-colors"
                    >
                      <td className="py-4 px-6">
                        <div className="font-medium text-xs text-slate-900">
                          {sub.user?.full_name || sub.user?.email || 'Unknown User'}
                        </div>
                        {sub.user?.email && sub.user?.full_name && (
                          <div className="text-[11px] text-gray-400">
                            {sub.user.email}
                          </div>
                        )}
                        <span className="text-[10px] text-gray-400 font-mono block mt-0.5">
                          ID: {sub.user_id.substring(0, 12)}...
                        </span>
                      </td>

                      <td className="py-4 px-6 whitespace-nowrap">
                        <span className="font-semibold text-xs text-slate-800 capitalize">
                          {sub.plan || 'Plus'}
                        </span>
                        <div className="text-[11px] text-gray-500 capitalize">
                          {sub.store} • {sub.environment}
                        </div>
                      </td>

                      <td className="py-4 px-6 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${
                            isTrial
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-slate-100 text-slate-700 border border-slate-200'
                          }`}
                        >
                          {isTrial ? 'Free Trial' : 'Normal Paid'}
                        </span>
                      </td>

                      <td className="py-4 px-6 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            isActive
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {sub.status}
                        </span>
                      </td>

                      <td className="py-4 px-6 whitespace-nowrap text-xs">
                        {sub.will_renew ? (
                          <span className="text-emerald-700 font-medium">Auto-Renews</span>
                        ) : (
                          <span className="text-rose-600 font-medium">Cancelled</span>
                        )}
                      </td>

                      <td className="py-4 px-6 whitespace-nowrap text-xs text-slate-600">
                        {sub.expires_at ? (
                          formatDateTime(sub.expires_at)
                        ) : (
                          <span className="text-gray-400">Lifetime / None</span>
                        )}
                      </td>

                      <td className="py-4 px-6 whitespace-nowrap text-right">
                        {isActive && <RevokeButton userId={sub.user_id} />}
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

