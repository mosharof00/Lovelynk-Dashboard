import { createAdminClient } from '@/lib/supabase/server';
import { Settings, ShieldAlert } from 'lucide-react';
import { SettingsForm } from './settings-form';

export default async function SettingsPage() {
  const supabase = createAdminClient();

  let settingsMap: Record<string, any> = {};
  let errorMsg: string | null = null;

  try {
    const { data, error } = await supabase
      .from('app_settings')
      .select('*');

    if (error) {
      errorMsg = error.message;
    } else if (data) {
      data.forEach((row: any) => {
        settingsMap[row.key] = row.value;
      });
    }
  } catch (err: any) {
    errorMsg = err.message || 'Failed to fetch app settings';
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Header Card */}
      <div className="bg-white p-6 rounded-2xl border border-[var(--color-card-border)] shadow-xs">
        <div className="flex items-center gap-2 mb-1">
          <span className="p-2 bg-[var(--color-brand-pink)] text-[var(--color-brand-rose)] rounded-xl">
            <Settings className="w-5 h-5" />
          </span>
          <h1 className="text-2xl font-bold text-[var(--color-text-main)]">
            System & Legal Settings
          </h1>
        </div>
        <p className="text-sm text-[var(--color-text-muted)]">
          Manage live mobile endpoints, legal documentation URLs, and App Store metadata directly in Supabase.
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

      {/* Interactive Settings Form */}
      <SettingsForm initialSettings={settingsMap} />
    </div>
  );
}
