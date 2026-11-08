'use client';

import { useState, useTransition } from 'react';
import { MessageSquare, X, CheckCircle, Clock, Smartphone, User, Mail, Send, Loader2, Paperclip, ExternalLink } from 'lucide-react';
import { updateTicketStatus } from './actions';
import { formatDateTime } from '@/lib/utils';

interface TicketModalProps {
  ticket: {
    id: string;
    email: string;
    category: string;
    subject: string;
    message: string;
    attachment_paths: string[];
    app_version: string | null;
    device_model: string | null;
    os_version: string | null;
    status: string;
    admin_reply: string | null;
    created_at: string;
    user?: {
      full_name: string | null;
      email: string | null;
    } | null;
  };
}

export function TicketModal({ ticket }: TicketModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [replyText, setReplyText] = useState(ticket.admin_reply || '');
  const [status, setStatus] = useState(ticket.status);
  const [isPending, startTransition] = useTransition();
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    startTransition(async () => {
      const res = await updateTicketStatus(ticket.id, status, replyText);
      if (res.success) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    });
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-3 py-1.5 bg-[var(--color-brand-pink)] hover:bg-rose-100 text-[var(--color-brand-rose)] font-semibold text-xs rounded-lg transition-colors cursor-pointer"
      >
        View & Reply
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl border border-[var(--color-card-border)] shadow-xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-5 border-b border-[var(--color-card-border)] flex items-center justify-between bg-gradient-to-r from-rose-50/40 to-pink-50/20">
              <div className="flex items-center gap-2">
                <span className="p-2 bg-[var(--color-brand-pink)] text-[var(--color-brand-rose)] rounded-xl">
                  <MessageSquare className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-slate-900 truncate max-w-md">
                    {ticket.subject}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Category: <span className="font-semibold capitalize text-slate-700">{ticket.category}</span> • Submitted {formatDateTime(ticket.created_at)}
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

            {/* Scrollable Content */}
            <div className="p-6 space-y-5 overflow-y-auto flex-1">
              {/* User device info card */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase">User</span>
                  <span className="font-semibold text-slate-900 truncate block">
                    {ticket.user?.full_name || ticket.email}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase">Device</span>
                  <span className="font-semibold text-slate-900 block">
                    {ticket.device_model || 'Unknown Device'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase">OS / Version</span>
                  <span className="font-semibold text-slate-900 block">
                    {ticket.os_version || 'iOS'} ({ticket.app_version || '1.0.0'})
                  </span>
                </div>
              </div>

              {/* User Message */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  User Message
                </label>
                <div className="p-4 bg-slate-50/80 border border-slate-200 rounded-xl text-sm text-slate-800 whitespace-pre-wrap leading-relaxed">
                  {ticket.message}
                </div>
              </div>

              {/* Attachments */}
              {ticket.attachment_paths && ticket.attachment_paths.length > 0 && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Attached Screenshots ({ticket.attachment_paths.length})
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {ticket.attachment_paths.map((path, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 border border-rose-100 rounded-lg text-xs text-rose-800"
                      >
                        <Paperclip className="w-3.5 h-3.5" />
                        <span className="font-mono text-[11px] truncate max-w-[180px]">{path.split('/').pop()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Status Selector & Admin Notes */}
              <div className="pt-3 border-t border-slate-100 space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Ticket Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="text-xs font-medium px-3 py-1.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-rose)]"
                  >
                    <option value="open">Open (Needs Attention)</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Admin Reply / Internal Notes
                  </label>
                  <textarea
                    rows={3}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type reply or resolution notes for this ticket..."
                    className="w-full p-3 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-rose)]"
                  />
                </div>
              </div>

              {savedSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-medium flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Ticket successfully updated!</span>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-[var(--color-card-border)] bg-slate-50/60 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-xs font-medium text-gray-600 hover:text-gray-800 rounded-xl hover:bg-gray-100 transition-colors"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={isPending}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[var(--color-brand-rose)] hover:bg-[var(--color-brand-rose-hover)] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors disabled:opacity-60 cursor-pointer"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Update Ticket</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
