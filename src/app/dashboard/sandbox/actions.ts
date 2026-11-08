'use server';

import { createAdminClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function sendTestInteraction(prevState: any, formData: FormData) {
  const coupleId = formData.get('couple_id') as string;
  const kind = (formData.get('kind') as 'kiss' | 'heartbeat' | 'emoji') || 'kiss';
  const count = parseInt((formData.get('count') as string) || '1', 10);
  const emoji = (formData.get('emoji') as string) || null;

  if (!coupleId || !coupleId.trim()) {
    return { success: false, error: 'Couple ID is required' };
  }

  const supabase = createAdminClient();

  // Find couple members to get sender and recipient IDs
  const { data: members, error: membersError } = await supabase
    .from('couple_members')
    .select('user_id')
    .eq('couple_id', coupleId.trim())
    .limit(2);

  if (membersError || !members || members.length < 2) {
    return {
      success: false,
      error: 'Could not find two paired members for this couple ID. Make sure the couple is active.',
    };
  }

  const senderId = members[0].user_id;
  const recipientId = members[1].user_id;

  // Insert interaction event into public.interactions
  const { error: insertError } = await supabase
    .from('interactions')
    .insert({
      couple_id: coupleId.trim(),
      sender_id: senderId,
      recipient_id: recipientId,
      kind: kind,
      count: Math.min(100, Math.max(1, count)),
      emoji: kind === 'emoji' ? (emoji || '💖') : null,
      created_at: new Date().toISOString(),
    });

  if (insertError) {
    return { success: false, error: `Failed to insert interaction: ${insertError.message}` };
  }

  // Also update interaction_totals running total
  try {
    const { data: existingTotal } = await supabase
      .from('interaction_totals')
      .select('total, recent_emojis')
      .eq('couple_id', coupleId.trim())
      .eq('sender_id', senderId)
      .eq('kind', kind)
      .maybeSingle();

    const newTotal = (existingTotal?.total ? Number(existingTotal.total) : 0) + count;
    let recentEmojis = existingTotal?.recent_emojis || [];
    if (kind === 'emoji' && emoji) {
      recentEmojis = [emoji, ...recentEmojis].slice(0, 9);
    }

    await supabase
      .from('interaction_totals')
      .upsert({
        couple_id: coupleId.trim(),
        sender_id: senderId,
        kind: kind,
        total: newTotal,
        recent_emojis: recentEmojis,
        last_sent_at: new Date().toISOString(),
      }, { onConflict: 'couple_id,sender_id,kind' });
  } catch (err) {
    // Non-fatal if totals update fails
  }

  revalidatePath('/dashboard');
  revalidatePath('/dashboard/couples');
  return {
    success: true,
    message: `Successfully dispatched ${count}x ${kind} ${kind === 'emoji' ? (emoji || '💖') : ''} to couple!`,
  };
}

export async function seedDemoCouple(prevState: any, formData: FormData) {
  const supabase = createAdminClient();

  // Create or get Demo User A
  const emailA = 'demo.partner1@lovelynk.io';
  const emailB = 'demo.partner2@lovelynk.io';

  try {
    // 1. Upsert Partner A in users
    const { data: userA, error: errA } = await supabase
      .from('users')
      .upsert({
        email: emailA,
        full_name: 'Alex Rivera',
        role: 'user',
        is_active: true,
        timezone: 'UTC',
        location_sharing_enabled: true,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'email' })
      .select('id')
      .single();

    if (errA || !userA) throw new Error(errA?.message || 'Failed creating user A');

    // 2. Upsert Partner B in users
    const { data: userB, error: errB } = await supabase
      .from('users')
      .upsert({
        email: emailB,
        full_name: 'Taylor Swift',
        role: 'user',
        is_active: true,
        timezone: 'UTC',
        location_sharing_enabled: true,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'email' })
      .select('id')
      .single();

    if (errB || !userB) throw new Error(errB?.message || 'Failed creating user B');

    // 3. Create Couple
    const anniversary = new Date();
    anniversary.setFullYear(anniversary.getFullYear() - 1); // 1 year ago

    const { data: couple, error: coupleErr } = await supabase
      .from('couples')
      .insert({
        status: 'active',
        together_since: anniversary.toISOString().split('T')[0],
        next_visit_at: new Date(Date.now() + 7 * 86400000).toISOString(),
      })
      .select('id')
      .single();

    if (coupleErr || !couple) throw new Error(coupleErr?.message || 'Failed creating couple');

    // 4. Add members
    await supabase.from('couple_members').insert([
      { couple_id: couple.id, user_id: userA.id, partner_nickname: 'TayTay' },
      { couple_id: couple.id, user_id: userB.id, partner_nickname: 'Al' },
    ]);

    // 5. Grant VIP subscription to Partner A (which unlocks both via sharing!)
    await supabase.from('subscription_entitlements').upsert({
      user_id: userA.id,
      entitlement_id: 'premium',
      status: 'active',
      period_type: 'normal',
      plan: 'yearly',
      product_id: 'lovelynk_yearly',
      store: 'app_store',
      environment: 'sandbox',
      price_amount: 39.99,
      currency: 'USD',
      started_at: new Date().toISOString(),
      current_period_started_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 365 * 86400000).toISOString(),
      will_renew: true,
    }, { onConflict: 'user_id' });

    revalidatePath('/dashboard/couples');
    revalidatePath('/dashboard/subscriptions');
    revalidatePath('/dashboard');

    return {
      success: true,
      coupleId: couple.id,
      message: `Demo couple created successfully! (Couple ID: ${couple.id})`,
    };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to seed demo couple' };
  }
}
