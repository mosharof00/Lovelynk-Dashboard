import { createAdminClient } from '@/lib/supabase/server';
import { TestTube2, ShieldAlert } from 'lucide-react';
import { InteractionSimulator } from './interaction-simulator';
import { SeedTools } from './seed-tools';

export default async function SandboxPage() {
  const supabase = createAdminClient();

  let couplesOptions: Array<{ id: string; names: string }> = [];
  let errorMsg: string | null = null;

  try {
    const { data: couples, error } = await supabase
      .from('couples')
      .select(`
        id,
        status,
        couple_members (
          user:users (
            full_name,
            email
          )
        )
      `)
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) {
      errorMsg = error.message;
    } else if (couples) {
      couplesOptions = couples.map((c: any) => {
        const memA = c.couple_members?.[0]?.user;
        const memB = c.couple_members?.[1]?.user;
        const nameA = memA?.full_name || memA?.email?.split('@')[0] || 'User A';
        const nameB = memB?.full_name || memB?.email?.split('@')[0] || 'User B';
        return {
          id: c.id,
          names: `${nameA} & ${nameB}`,
        };
      });
    }
  } catch (err: any) {
    errorMsg = err.message || 'Failed fetching couples';
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Header Card */}
      <div className="bg-white p-6 rounded-2xl border border-[var(--color-card-border)] shadow-xs">
        <div className="flex items-center gap-2 mb-1">
          <span className="p-2 bg-[var(--color-brand-pink)] text-[var(--color-brand-rose)] rounded-xl">
            <TestTube2 className="w-5 h-5" />
          </span>
          <h1 className="text-2xl font-bold text-[var(--color-text-main)]">
            Developer Sandbox & QA Tools
          </h1>
        </div>
        <p className="text-sm text-[var(--color-text-muted)]">
          Fast-track manual QA: dispatch widget interactions, test realtime events, and generate paired test couples.
        </p>
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

      {/* Grid of QA Tools */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InteractionSimulator couples={couplesOptions} />
        <SeedTools />
      </div>
    </div>
  );
}

