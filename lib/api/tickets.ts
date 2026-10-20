import { createClient } from '../supabase/server';
import { DatabaseSupportTicket } from '../../types/database';

export async function getSupportTickets(): Promise<DatabaseSupportTicket[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('support_tickets')
    .select(`
      *,
      user:users (*)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching support tickets:', error);
    return [];
  }

  return (data as DatabaseSupportTicket[]) || [];
}
