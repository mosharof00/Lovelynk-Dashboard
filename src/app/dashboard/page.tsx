import { createAdminClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';
import {
  Users,
  HeartHandshake,
  CreditCard,
  Heart,
  ArrowUpRight,
  Sparkles,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';

interface DashboardStats {
  totalUsers: number;
  activeCouples: number;
  activeSubscriptions: number;
  totalInteractions: number;
  recentCouples: Array<{
    id: string;
    together_since: string | null;
    created_at: string;
    status: string;
    members: Array<{
      full_name: string;
      email: string;
      nickname: string | null;
    }>;
  }>;
  recentSubscriptions: Array<{
    user_id: string;
    plan: string | null;
    status: string;
    period_type: string;
    expires_at: string | null;
    updated_at: string;
    user_email?: string;
  }>;
}

async function getDashboardData(): Promise<DashboardStats> {
  const supabase = createAdminClient();

  try {
    // 1. Total Users
    const { count: usersCount } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });

    // 2. Active Couples
    const { count: couplesCount } = await supabase
      .from('couples')
      .select('*', { count: 'exact', head: true });

    // 3. Active Subscriptions
    const { count: subsCount } = await supabase
      .from('subscription_entitlements')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');

    // 4. Widget Events / Interactions
    const { count: eventsCount } = await supabase
      .from('interactions')
      .select('*', { count: 'exact', head: true });

    // 5. Recent Couples
    const { data: couplesData } = await supabase
      .from('couples')
      .select(`
        id,
        together_since,
        created_at,
        status,
        couple_members (
          partner_nickname,
          users (
            full_name,
            email
          )
        )
      `)
      .order('created_at', { ascending: false })
      .limit(6);

    const formattedCouples = (couplesData || []).map((c: any) => ({
      id: c.id,
      together_since: c.together_since,
      created_at: c.created_at,
      status: c.status || 'active',
      members: (c.couple_members || []).map((m: any) => ({
        full_name: m.users?.full_name || 'Member',
        email: m.users?.email || '',
        nickname: m.partner_nickname || null,
      })),
    }));

    // 6. Recent Subscriptions
    const { data: subsData } = await supabase
      .from('subscription_entitlements')
      .select(`
        user_id,
        plan,
        status,
        period_type,
        expires_at,
        updated_at,
        users (
          email
        )
      `)
      .order('updated_at', { ascending: false })
      .limit(6);

    const formattedSubs = (subsData || []).map((s: any) => ({
      user_id: s.user_id,
      plan: s.plan,
      status: s.status,
      period_type: s.period_type,
      expires_at: s.expires_at,
      updated_at: s.updated_at,
      user_email: s.users?.email || 'Test Account',
    }));

    return {
      totalUsers: usersCount || 0,
      activeCouples: couplesCount || 0,
      activeSubscriptions: subsCount || 0,
      totalInteractions: eventsCount || 0,
      recentCouples: formattedCouples,
      recentSubscriptions: formattedSubs,
    };
  } catch (error) {
    console.error('Failed to load dashboard data:', error);
    return {
      totalUsers: 0,
      activeCouples: 0,
      activeSubscriptions: 0,
      totalInteractions: 0,
      recentCouples: [],
      recentSubscriptions: [],
    };
  }
}

export default async function DashboardPage() {
  const stats = await getDashboardData();

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Page Title & Subtitle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-[#1E1E24]">Platform Overview</h2>
          <p className="text-sm text-[#64748B] mt-1">
            Real-time couples, subscribers, and widget interaction telemetry.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/sandbox"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1E1E24] hover:bg-black text-white text-xs font-semibold shadow-sm transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#FF4B72]" />
            <span>Developer Sandbox</span>
          </Link>
        </div>
      </div>

      {/* 4 KPI Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Subscriptions */}
        <div className="bg-[#FFFFFF] p-6 rounded-3xl border border-[#EFECE6] shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
              Active Plus Plans
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#F9F8F4] border border-[#EFECE6] flex items-center justify-center text-[#1E1E24]">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-[#1E1E24] tracking-tight">
              {stats.activeSubscriptions}
            </div>
            <p className="text-xs text-[#64748B] mt-1 flex items-center gap-1">
              <span className="font-semibold text-emerald-600">Couple Shared</span> · £4.99/mo & £19.99/yr
            </p>
          </div>
        </div>

        {/* Card 2: Active Couples (Soft Butter Yellow Accent) */}
        <div className="bg-[#FEF7D6] p-6 rounded-3xl border border-[#EFECE6] shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-[#856404] uppercase tracking-wider">
              Connected Couples
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#FFFFFF]/80 border border-[#856404]/20 flex items-center justify-center text-[#856404]">
              <HeartHandshake className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-[#1E1E24] tracking-tight">
              {stats.activeCouples}
            </div>
            <p className="text-xs text-[#856404] mt-1">
              Paired partner relationships
            </p>
          </div>
        </div>

        {/* Card 3: Total Users */}
        <div className="bg-[#FFFFFF] p-6 rounded-3xl border border-[#EFECE6] shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
              Registered Users
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#F9F8F4] border border-[#EFECE6] flex items-center justify-center text-[#1E1E24]">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-[#1E1E24] tracking-tight">
              {stats.totalUsers}
            </div>
            <p className="text-xs text-[#64748B] mt-1">
              Total authenticated accounts
            </p>
          </div>
        </div>

        {/* Card 4: Widget Interactions (Soft Rose Accent) */}
        <div className="bg-[#FFF0F3] p-6 rounded-3xl border border-[#FF4B72]/20 shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-[#FF4B72] uppercase tracking-wider">
              Widget Interactions
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#FFFFFF]/80 border border-[#FF4B72]/20 flex items-center justify-center text-[#FF4B72]">
              <Heart className="w-4 h-4 fill-[#FF4B72]" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-[#1E1E24] tracking-tight">
              {stats.totalInteractions}
            </div>
            <p className="text-xs text-[#FF4B72] mt-1 font-medium">
              Kisses, heartbeats & emojis
            </p>
          </div>
        </div>
      </div>

      {/* Two Column Section: Recent Couples & Recent Subscriptions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Recent Couples */}
        <div className="bg-[#FFFFFF] rounded-3xl border border-[#EFECE6] p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-bold text-base text-[#1E1E24]">Recent Couples</h3>
              <p className="text-xs text-[#64748B]">Latest registered pairings</p>
            </div>
            <Link
              href="/dashboard/couples"
              className="text-xs font-semibold text-[#FF4B72] hover:underline flex items-center gap-1"
            >
              <span>View all</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#EFECE6] text-[11px] font-semibold text-[#64748B] uppercase">
                  <th className="pb-3 pl-2">Couple / Partners</th>
                  <th className="pb-3">Since</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 pr-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EFECE6]/60 text-xs">
                {stats.recentCouples.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-[#64748B]">
                      No couples paired yet. Use the Sandbox to generate a test couple!
                    </td>
                  </tr>
                ) : (
                  stats.recentCouples.map((c) => (
                    <tr key={c.id} className="hover:bg-[#F9F8F4]/80 transition-colors">
                      <td className="py-3 pl-2">
                        <div className="font-semibold text-[#1E1E24]">
                          {c.members.map((m) => m.full_name).join(' & ') || 'Pairing in progress'}
                        </div>
                        <div className="text-[11px] text-[#64748B] font-mono truncate max-w-[200px]">
                          {c.id}
                        </div>
                      </td>
                      <td className="py-3 text-[#64748B]">
                        {formatDate(c.together_since || c.created_at)}
                      </td>
                      <td className="py-3">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#EBF8F2] text-emerald-800 border border-emerald-200 capitalize">
                          {c.status}
                        </span>
                      </td>
                      <td className="py-3 pr-2 text-right">
                        <Link
                          href={`/dashboard/couples`}
                          className="px-2.5 py-1 rounded-lg bg-[#F9F8F4] hover:bg-[#1E1E24] hover:text-white text-[#1E1E24] border border-[#EFECE6] text-[11px] font-semibold transition-all inline-block"
                        >
                          Manage
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Active Subscriptions & Entitlements */}
        <div className="bg-[#FFFFFF] rounded-3xl border border-[#EFECE6] p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-bold text-base text-[#1E1E24]">Subscriptions & VIP</h3>
              <p className="text-xs text-[#64748B]">Active StoreKit & granted entitlements</p>
            </div>
            <Link
              href="/dashboard/subscriptions"
              className="text-xs font-semibold text-[#FF4B72] hover:underline flex items-center gap-1"
            >
              <span>Manage VIP</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#EFECE6] text-[11px] font-semibold text-[#64748B] uppercase">
                  <th className="pb-3 pl-2">User Account</th>
                  <th className="pb-3">Plan</th>
                  <th className="pb-3">Expires</th>
                  <th className="pb-3 pr-2 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EFECE6]/60 text-xs">
                {stats.recentSubscriptions.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-[#64748B]">
                      No active subscriptions yet.
                    </td>
                  </tr>
                ) : (
                  stats.recentSubscriptions.map((s) => (
                    <tr key={s.user_id} className="hover:bg-[#F9F8F4]/80 transition-colors">
                      <td className="py-3 pl-2">
                        <div className="font-semibold text-[#1E1E24] truncate max-w-[180px]">
                          {s.user_email}
                        </div>
                        <div className="text-[10px] text-[#64748B] font-mono truncate max-w-[150px]">
                          {s.user_id}
                        </div>
                      </td>
                      <td className="py-3 capitalize text-[#1E1E24] font-medium">
                        {s.plan || 'Plus'} {s.period_type === 'trial' && <span className="text-amber-600 font-normal">(Trial)</span>}
                      </td>
                      <td className="py-3 text-[#64748B]">
                        {formatDate(s.expires_at)}
                      </td>
                      <td className="py-3 pr-2 text-right">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#FFF0F3] text-[#FF4B72] border border-[#FF4B72]/20 capitalize">
                          {s.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

