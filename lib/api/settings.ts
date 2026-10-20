import { createClient } from '../supabase/server';
import { DatabaseAppSetting } from '../../types/database';

export async function getAppSettings(): Promise<DatabaseAppSetting[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('app_settings')
    .select('*')
    .order('key', { ascending: true });

  if (error) {
    console.error('Error fetching app settings:', error);
    return [];
  }

  return (data as DatabaseAppSetting[]) || [];
}
