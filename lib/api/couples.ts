import { createClient } from '../supabase/server';
import { DatabaseCouple, DatabaseUser } from '../../types/database';

export interface CoupleWithMembers extends DatabaseCouple {
  members: {
    user: DatabaseUser;
    role: string | null;
    paired_at: string;
  }[];
}

export async function getCouples({
  page = 1,
  limit = 20,
  status = 'all',
}: {
  page?: number;
  limit?: number;
  status?: string;
} = {}): Promise<{ couples: CoupleWithMembers[]; total: number; page: number; totalPages: number }> {
  const supabase = await createClient();
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase.from('couples').select(
    `
      *,
      couple_members (
        paired_at,
        role,
        user:users (*)
      )
    `,
    { count: 'exact' }
  );

  if (status !== 'all') {
    query = query.eq('status', status);
  }

  const { data, count, error } = await query
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) {
    console.error('Error fetching couples:', error);
    return { couples: [], total: 0, page, totalPages: 0 };
  }

  const total = count ?? 0;
  // Format couple members
  const couples: CoupleWithMembers[] = (data || []).map((c: any) => ({
    id: c.id,
    status: c.status,
    created_at: c.created_at,
    wedding_anniversary: c.wedding_anniversary,
    relationship_start_date: c.relationship_start_date,
    timezone: c.timezone,
    members: (c.couple_members || []).map((m: any) => ({
      user: m.user,
      role: m.role,
      paired_at: m.paired_at,
    })),
  }));

  return {
    couples,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}
