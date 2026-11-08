import { createAdminClient } from '@/lib/supabase/server';
import { LifeBuoy, Search, AlertCircle, CheckCircle2, Clock, ShieldAlert, Paperclip, ImageIcon } from 'lucide-react';
import { formatDate, formatDateTime } from '@/lib/utils';
import { TicketModal, TicketAttachment } from './ticket-modal';

interface SupportTicketRow {
  id: string;
  user_id: string | null;
  email: string;
  category: string;
  subject: string;
  message: string;
  attachment_paths: string[];
  attachments?: TicketAttachment[];
  app_version: string | null;
  device_model: string | null;
  os_version: string | null;
  status: string;
  admin_reply: string | null;
  replied_at: string | null;
  resolved_at: string | null;
  created_at: string;
  user?: {
    full_name: string | null;
    email: string | null;
  } | null;
}

export default async function SupportPage() {
  const supabase = createAdminClient();

  let tickets: SupportTicketRow[] = [];
  let errorMsg: string | null = null;

  try {
    const { data, error } = await supabase
      .from('support_tickets')
      .select(`
        id,
        user_id,
        email,
        category,
        subject,
        message,
        attachment_paths,
        app_version,
        device_model,
        os_version,
        status,
        admin_reply,
        replied_at,
        resolved_at,
        created_at,
        user:users (
          full_name,
          email
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      errorMsg = error.message;
    } else if (data) {
      // Pre-sign URLs for private support-attachments bucket
      tickets = await Promise.all(
        (data as any[]).map(async (row) => {
          const paths: string[] = row.attachment_paths || [];
          const attachments: TicketAttachment[] = [];
          for (const p of paths) {
            try {
              const { data: signed } = await supabase
                .storage
                .from('support-attachments')
                .createSignedUrl(p, 86400); // 24 hours
              if (signed?.signedUrl) {
                attachments.push({ path: p, url: signed.signedUrl });
              }
            } catch {
              // Ignore failure for missing files
            }
          }
          return {
            ...row,
            attachments,
          };
        })
      );
    }
  } catch (err: any) {
    errorMsg = err.message || 'Failed to fetch support tickets';
  }

  const openCount = tickets.filter(t => t.status === 'open').length;
  const inProgressCount = tickets.filter(t => t.status === 'in_progress').length;
  const resolvedCount = tickets.filter(t => t.status === 'resolved' || t.status === 'closed').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[var(--color-card-border)] shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 bg-[var(--color-brand-pink)] text-[var(--color-brand-rose)] rounded-xl">
              <LifeBuoy className="w-5 h-5 fill-current" />
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text-main)]">
              Support & Help Desk
            </h1>
          </div>
          <p className="text-sm text-[var(--color-text-muted)]">
            Manage user inquiries, bug reports, and inspect screenshots submitted from the mobile app.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="px-3.5 py-1.5 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-xs font-semibold">
            Open: <span className="font-bold ml-1">{openCount}</span>
          </div>
          <div className="px-3.5 py-1.5 bg-sky-50 border border-sky-200 text-sky-900 rounded-xl text-xs font-semibold">
            In Progress: <span className="font-bold ml-1">{inProgressCount}</span>
          </div>
          <div className="px-3.5 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-semibold">
            Resolved: <span className="font-bold ml-1">{resolvedCount}</span>
          </div>
        </div>
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

      {/* Tickets Table */}
      <div className="bg-white rounded-2xl border border-[var(--color-card-border)] shadow-xs overflow-hidden">
        <div className="p-5 border-b border-[var(--color-card-border)] flex items-center justify-between">
          <h2 className="text-base font-semibold text-[var(--color-text-main)]">
            All Tickets ({tickets.length})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-[var(--color-card-border)] bg-[#FAFAF8] text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
                <th className="py-3 px-6">Subject & Preview</th>
                <th className="py-3 px-6">User / Email</th>
                <th className="py-3 px-6">Category</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6">Submitted</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-card-border)]">
              {tickets.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-sm text-[var(--color-text-muted)]">
                    <LifeBuoy className="w-8 h-8 text-rose-300 mx-auto mb-2 opacity-50" />
                    No support tickets submitted yet.
                  </td>
                </tr>
              ) : (
                tickets.map((t) => {
                  const isOpen = t.status === 'open';
                  const isResolved = t.status === 'resolved' || t.status === 'closed';
                  const attachmentsCount = t.attachments?.length || t.attachment_paths?.length || 0;

                  return (
                    <tr key={t.id} className="hover:bg-[#FAF9F5] transition-colors">
                      <td className="py-4 px-6 max-w-xs">
                        <div className="font-semibold text-xs text-slate-900 truncate">
                          {t.subject}
                        </div>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">
                          {t.message}
                        </p>
                        {attachmentsCount > 0 && (
                          <div className="flex items-center gap-1.5 text-[10px] text-[var(--color-brand-rose)] mt-1.5 font-medium">
                            <ImageIcon className="w-3.5 h-3.5" />
                            <span>{attachmentsCount} screenshot(s) attached</span>
                          </div>
                        )}
                      </td>

                      <td className="py-4 px-6">
                        <div className="font-medium text-xs text-slate-900">
                          {t.user?.full_name || t.email.split('@')[0]}
                        </div>
                        <div className="text-[11px] text-slate-400">{t.email}</div>
                        <div className="text-[10px] text-gray-400 mt-0.5">
                          {t.device_model || 'iPhone'} • {t.os_version || 'iOS'}
                        </div>
                      </td>

                      <td className="py-4 px-6 whitespace-nowrap">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 capitalize">
                          {t.category}
                        </span>
                      </td>

                      <td className="py-4 px-6 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            isOpen
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : isResolved
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-sky-50 text-sky-700 border border-sky-200'
                          }`}
                        >
                          {t.status}
                        </span>
                      </td>

                      <td className="py-4 px-6 whitespace-nowrap text-xs text-slate-500">
                        {formatDateTime(t.created_at)}
                      </td>

                      <td className="py-4 px-6 whitespace-nowrap text-right">
                        <TicketModal ticket={t} />
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
