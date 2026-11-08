'use client';

import { useActionState } from 'react';
import { saveAllAppSettings } from './actions';
import { Save, CheckCircle, AlertCircle, Loader2, Globe, Shield, Mail, Smartphone, ExternalLink } from 'lucide-react';

interface SettingsFormProps {
  initialSettings: Record<string, any>;
}

export function SettingsForm({ initialSettings }: SettingsFormProps) {
  const [state, formAction, isPending] = useActionState(saveAllAppSettings, null);

  const getVal = (k: string, defaultVal: any = '') => {
    const raw = initialSettings[k];
    if (raw === undefined || raw === null) return defaultVal;
    if (typeof raw === 'string') {
      // Might be JSON string
      try {
        const parsed = JSON.parse(raw);
        return typeof parsed === 'string' ? parsed : raw;
      } catch {
        return raw;
      }
    }
    return raw;
  };

  return (
    <form action={formAction} className="space-y-6">
      {state?.success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2.5 text-emerald-900 text-sm animate-in fade-in">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-medium">{state.message}</span>
        </div>
      )}

      {state?.error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-2.5 text-rose-900 text-sm animate-in fade-in">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{state.error}</span>
        </div>
      )}

      {/* Legal & App URLs */}
      <div className="bg-white p-6 rounded-2xl border border-[var(--color-card-border)] shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-[var(--color-card-border)]">
          <Globe className="w-5 h-5 text-[var(--color-brand-rose)]" />
          <h2 className="text-base font-bold text-[var(--color-text-main)]">
            Legal & Public Policy URLs
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-[var(--color-text-main)]">
                Privacy Policy URL
              </label>
              {getVal('privacy_url') && (
                <a
                  href={getVal('privacy_url')}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-[var(--color-brand-rose)] hover:underline inline-flex items-center gap-0.5"
                >
                  <span>Test Link</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
            <input
              name="privacy_url"
              type="url"
              defaultValue={getVal('privacy_url', 'https://lovelynk.io/privacy-policy')}
              placeholder="https://lovelynk.io/privacy-policy"
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-[var(--color-card-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-rose)] focus:border-transparent text-[var(--color-text-main)]"
            />
            <p className="text-[11px] text-gray-500 mt-1">
              Used inside mobile app settings and App Store Review.
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-[var(--color-text-main)]">
                Terms of Service URL
              </label>
              {getVal('terms_url') && (
                <a
                  href={getVal('terms_url')}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-[var(--color-brand-rose)] hover:underline inline-flex items-center gap-0.5"
                >
                  <span>Test Link</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
            <input
              name="terms_url"
              type="url"
              defaultValue={getVal('terms_url', 'https://lovelynk.io/terms-of-service')}
              placeholder="https://lovelynk.io/terms-of-service"
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-[var(--color-card-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-rose)] focus:border-transparent text-[var(--color-text-main)]"
            />
            <p className="text-[11px] text-gray-500 mt-1">
              Required for Apple auto-renewable in-app purchase guidelines.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--color-text-main)] mb-1">
              Customer Support Email
            </label>
            <input
              name="support_email"
              type="email"
              defaultValue={getVal('support_email', 'info@lovelynk.io')}
              placeholder="info@lovelynk.io"
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-[var(--color-card-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-rose)] focus:border-transparent text-[var(--color-text-main)]"
            />
            <p className="text-[11px] text-gray-500 mt-1">
              Contact email shown in the mobile "Contact Us" screen.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--color-text-main)] mb-1">
              Apple App Store ID
            </label>
            <input
              name="app_store_id"
              type="text"
              defaultValue={getVal('app_store_id', '')}
              placeholder="e.g. 6737582910"
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-[var(--color-card-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-rose)] focus:border-transparent text-[var(--color-text-main)]"
            />
            <p className="text-[11px] text-gray-500 mt-1">
              Numeric Apple ID used for "Rate Us" and store redirection.
            </p>
          </div>
        </div>
      </div>

      {/* Versioning & Maintenance Control */}
      <div className="bg-white p-6 rounded-2xl border border-[var(--color-card-border)] shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-[var(--color-card-border)]">
          <Smartphone className="w-5 h-5 text-[var(--color-brand-rose)]" />
          <h2 className="text-base font-bold text-[var(--color-text-main)]">
            App Versioning & Maintenance
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[var(--color-text-main)] mb-1">
              Minimum Required iOS Version
            </label>
            <input
              name="min_ios_version"
              type="text"
              defaultValue={getVal('min_ios_version', '1.0.0')}
              placeholder="1.0.0"
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-[var(--color-card-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-rose)] focus:border-transparent text-[var(--color-text-main)] font-mono"
            />
            <p className="text-[11px] text-gray-500 mt-1">
              Users on older builds will be forced to update.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--color-text-main)] mb-1">
              Latest Available iOS Version
            </label>
            <input
              name="latest_ios_version"
              type="text"
              defaultValue={getVal('latest_ios_version', '1.0.1')}
              placeholder="1.0.1"
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-[var(--color-card-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-rose)] focus:border-transparent text-[var(--color-text-main)] font-mono"
            />
            <p className="text-[11px] text-gray-500 mt-1">
              Users on older builds receive an optional update banner.
            </p>
          </div>

          <div className="md:col-span-2 pt-2 border-t border-gray-100">
            <div className="flex items-center justify-between p-4 bg-gray-50/80 rounded-xl border border-gray-200">
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  Maintenance Mode
                </p>
                <p className="text-xs text-slate-500">
                  When enabled, non-admin mobile apps show a full-screen maintenance alert.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="maintenance_mode"
                  defaultChecked={getVal('maintenance_mode', false) === true}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-brand-rose)]"></div>
              </label>
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-[var(--color-text-main)] mb-1">
              Maintenance Announcement Message
            </label>
            <input
              name="maintenance_message"
              type="text"
              defaultValue={getVal('maintenance_message', '')}
              placeholder="LoveLynk is undergoing scheduled server updates. Please check back in 15 minutes."
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-[var(--color-card-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-rose)] focus:border-transparent text-[var(--color-text-main)]"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--color-brand-rose)] hover:bg-[var(--color-brand-rose-hover)] text-white text-sm font-semibold rounded-xl shadow-xs transition-colors disabled:opacity-60 cursor-pointer"
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Saving Changes...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Settings</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
