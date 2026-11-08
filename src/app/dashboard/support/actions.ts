'use server';

import { createAdminClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateTicketStatus(ticketId: string, status: string, adminReply?: string) {
  const supabase = createAdminClient();

  const updates: Record<string, any> = {
    status,
    updated_at: new Date().toISOString(),
  };

  if (adminReply && adminReply.trim()) {
    updates.admin_reply = adminReply.trim();
    updates.replied_at = new Date().toISOString();
  }

  if (status === 'resolved') {
    updates.resolved_at = new Date().toISOString();
  }

  const { error } = await supabase
    .from('support_tickets')
    .update(updates)
    .eq('id', ticketId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/dashboard/support');
  return { success: true };
}

