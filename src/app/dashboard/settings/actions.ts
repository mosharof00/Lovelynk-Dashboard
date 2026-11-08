'use server';

import { createAdminClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateAppSetting(key: string, value: any) {
  const supabase = createAdminClient();

  const { error } = await supabase
    .from('app_settings')
    .upsert({
      key,
      value: JSON.stringify(value),
      is_public: true,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'key' });

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/dashboard/settings');
  return { success: true };
}

export async function saveAllAppSettings(prevState: any, formData: FormData) {
  const privacyUrl = formData.get('privacy_url') as string;
  const termsUrl = formData.get('terms_url') as string;
  const supportEmail = formData.get('support_email') as string;
  const appStoreId = formData.get('app_store_id') as string;
  const maintenanceMode = formData.get('maintenance_mode') === 'on';
  const maintenanceMessage = formData.get('maintenance_message') as string;
  const minIosVersion = formData.get('min_ios_version') as string;
  const latestIosVersion = formData.get('latest_ios_version') as string;

  const supabase = createAdminClient();

  const updates = [
    { key: 'privacy_url', value: privacyUrl },
    { key: 'terms_url', value: termsUrl },
    { key: 'support_email', value: supportEmail },
    { key: 'app_store_id', value: appStoreId },
    { key: 'maintenance_mode', value: maintenanceMode },
    { key: 'maintenance_message', value: maintenanceMessage || '' },
    { key: 'min_ios_version', value: minIosVersion || '1.0.0' },
    { key: 'latest_ios_version', value: latestIosVersion || '1.0.0' },
  ];

  for (const item of updates) {
    const { error } = await supabase
      .from('app_settings')
      .upsert({
        key: item.key,
        value: typeof item.value === 'string' ? item.value : item.value,
        is_public: true,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'key' });

    if (error) {
      return { success: false, error: `Failed to update ${item.key}: ${error.message}` };
    }
  }

  revalidatePath('/dashboard/settings');
  return { success: true, message: 'Settings successfully updated!' };
}

