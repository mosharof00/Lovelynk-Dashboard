import { createClient } from '../supabase/server';
import { DatabaseBroadcast } from '../../types/database';

export async function getBroadcasts(): Promise<DatabaseBroadcast[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('broadcasts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching broadcasts:', error);
    return [];
  }

  return (data as DatabaseBroadcast[]) || [];
}
