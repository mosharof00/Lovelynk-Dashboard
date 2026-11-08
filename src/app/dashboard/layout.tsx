import { DashboardShell } from '@/components/layout/dashboard-shell';
import { createClient, createAdminClient } from '@/lib/supabase/server';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const adminClient = createAdminClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Get live open support tickets count for notification badge
  let openTicketsCount = 0;
  try {
    const { count } = await adminClient
      .from('support_tickets')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'open');
    openTicketsCount = count ?? 0;
  } catch {
    openTicketsCount = 0;
  }

  return (
    <DashboardShell
      userEmail={user?.email || 'admin@lovelynk.com'}
      openTicketCount={openTicketsCount}
    >
      {children}
    </DashboardShell>
  );
}
