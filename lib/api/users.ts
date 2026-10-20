import { createClient } from '../supabase/server';
import { DatabaseUser } from '../../types/database';

export interface GetUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: 'all' | 'active' | 'banned';
}

export interface GetUsersResponse {
  users: DatabaseUser[];
  total: number;
  page: number;
  totalPages: number;
}

export async function getUsers({
  page = 1,
  limit = 20,
  search = '',
  status = 'all',
}: GetUsersParams = {}): Promise<GetUsersResponse> {
  const supabase = await createClient();
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase.from('users').select('*', { count: 'exact' });

  if (search.trim()) {
    query = query.or(`display_name.ilike.%${search}%,email.ilike.%${search}%`);
  }

  if (status === 'banned') {
    query = query.not('banned_at', 'is', null);
  } else if (status === 'active') {
    query = query.is('banned_at', null);
  }

  const { data, count, error } = await query
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) {
    console.error('Error fetching users:', error);
    return { users: [], total: 0, page, totalPages: 0 };
  }

  const total = count ?? 0;
  return {
    users: (data as DatabaseUser[]) || [],
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getUserById(id: string): Promise<DatabaseUser | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return null;
  return data as DatabaseUser;
}
