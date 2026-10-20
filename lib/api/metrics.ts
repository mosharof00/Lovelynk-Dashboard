import { createClient } from '../supabase/server';
import { TodayDashboardMetrics, DatabaseDailyMetric } from '../../types/database';

export async function getTodayMetrics(): Promise<TodayDashboardMetrics> {
  const supabase = await createClient();

  // Try calling the admin_dashboard_today RPC if created, or compute from tables
  const { data: rpcData, error: rpcError } = await supabase.rpc('admin_dashboard_today');

  if (!rpcError && rpcData) {
    return {
      totalUsers: rpcData.total_users ?? 0,
      newUsersToday: rpcData.new_users_today ?? 0,
      activeCouples: rpcData.active_couples ?? 0,
      interactionsToday: rpcData.interactions_today ?? 0,
      openTickets: rpcData.open_tickets ?? 0,
      scheduledBroadcasts: rpcData.scheduled_broadcasts ?? 0,
      premiumCouples: rpcData.premium_couples ?? 0,
    };
  }

  // Graceful fallback to direct queries if RPC is not yet compiled in Supabase
  const startOfDay = new Date();
  startOfDay.setUTCHours(0, 0, 0, 0);
  const startIso = startOfDay.toISOString();

  const [
    { count: totalUsers },
    { count: newUsersToday },
    { count: activeCouples },
    { count: interactionsToday },
    { count: openTickets },
    { count: scheduledBroadcasts },
  ] = await Promise.all([
    supabase.from('users').select('*', { count: 'exact', head: true }),
    supabase.from('users').select('*', { count: 'exact', head: true }).gte('created_at', startIso),
    supabase.from('couples').select('*', { count: 'exact', head: true }).eq('status', 'paired'),
    supabase.from('interactions').select('*', { count: 'exact', head: true }).gte('created_at', startIso),
    supabase.from('support_tickets').select('*', { count: 'exact', head: true }).in('status', ['open', 'in_progress']),
    supabase.from('broadcasts').select('*', { count: 'exact', head: true }).eq('status', 'scheduled'),
  ]);

  return {
    totalUsers: totalUsers ?? 0,
    newUsersToday: newUsersToday ?? 0,
    activeCouples: activeCouples ?? 0,
    interactionsToday: interactionsToday ?? 0,
    openTickets: openTickets ?? 0,
    scheduledBroadcasts: scheduledBroadcasts ?? 0,
    premiumCouples: 0,
  };
}

export async function getDailyMetricsHistory(days = 14): Promise<DatabaseDailyMetric[]> {
  const supabase = await createClient();

  const { data } = await supabase
    .from('daily_metrics')
    .select('*')
    .order('date', { ascending: false })
    .limit(days);

  return (data as DatabaseDailyMetric[]) || [];
}
