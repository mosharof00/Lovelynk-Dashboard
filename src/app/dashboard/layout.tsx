import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { createClient } from '@/lib/supabase/server';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex min-h-screen bg-[#F9F8F4] text-[#1E1E24]">
      {/* Fixed Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header userEmail={user?.email || 'admin@lovelynk.io'} />
        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

