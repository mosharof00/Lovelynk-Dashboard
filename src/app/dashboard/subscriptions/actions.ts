'use server';

import { createAdminClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function grantVipSubscription(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  const duration = (formData.get('duration') as string) || '1_month';

  if (!email || !email.trim()) {
    return { success: false, error: 'User email is required' };
  }

  const supabase = createAdminClient();

  // Find user by email in public.users
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('id, email, full_name')
    .eq('email', email.trim().toLowerCase())
    .maybeSingle();

  if (userError || !user) {
    return {
      success: false,
      error: `User with email "${email.trim()}" was not found in public.users. Make sure the user has registered in the mobile app first.`,
    };
  }

  const now = new Date();
  const expiresAt = new Date();
  const isYearly = duration === '1_year';
  const plan = isYearly ? 'yearly' : 'monthly';
  const productId = isYearly ? 'lovelynk_yearly' : 'lovelynk_monthly';

  if (isYearly) {
    expiresAt.setFullYear(now.getFullYear() + 1);
  } else {
    expiresAt.setMonth(now.getMonth() + 1);
  }

  const { error: upsertError } = await supabase
    .from('subscription_entitlements')
    .upsert(
      {
        user_id: user.id,
        entitlement_id: 'premium',
        status: 'active',
        period_type: 'normal',
        plan: plan,
        product_id: productId,
        store: 'app_store',
        environment: 'sandbox',
        price_amount: isYearly ? 39.99 : 4.99,
        currency: 'USD',
        price_usd: isYearly ? 39.99 : 4.99,
        country_code: 'US',
        started_at: now.toISOString(),
        current_period_started_at: now.toISOString(),
        expires_at: expiresAt.toISOString(),
        will_renew: true,
        updated_at: now.toISOString(),
      },
      { onConflict: 'user_id' }
    );

  if (upsertError) {
    return { success: false, error: upsertError.message };
  }

  revalidatePath('/dashboard/subscriptions');
  revalidatePath('/dashboard');
  return { success: true, userEmail: user.email, plan, expiresAt: expiresAt.toISOString() };
}

export async function revokeSubscription(userId: string) {
  const supabase = createAdminClient();
  const now = new Date();

  const { error } = await supabase
    .from('subscription_entitlements')
    .update({
      status: 'expired',
      expires_at: now.toISOString(),
      will_renew: false,
      updated_at: now.toISOString(),
    })
    .eq('user_id', userId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/dashboard/subscriptions');
  revalidatePath('/dashboard');
  return { success: true };
}
