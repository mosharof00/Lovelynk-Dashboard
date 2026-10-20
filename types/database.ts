export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type AdminRole = 'super_admin' | 'support' | 'marketing' | 'operations';

export type CoupleStatus = 'paired' | 'unpaired' | 'archived';

export type BroadcastStatus = 'draft' | 'scheduled' | 'sending' | 'sent' | 'cancelled';

export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';

export type TicketPriority = 'low' | 'normal' | 'high' | 'urgent';

export interface DatabaseUser {
  id: string;
  email: string | null;
  display_name: string | null;
  avatar_url: string | null;
  timezone: string;
  created_at: string;
  last_active_at: string | null;
  banned_at: string | null;
  ban_reason: string | null;
  deleted_at: string | null;
  is_profile_complete: boolean;
}

export interface DatabaseAdmin {
  user_id: string;
  role: AdminRole;
  is_active: boolean;
  created_at: string;
  created_by: string | null;
}

export interface DatabaseCouple {
  id: string;
  status: CoupleStatus;
  created_at: string;
  wedding_anniversary: string | null;
  relationship_start_date: string | null;
  timezone: string | null;
}

export interface DatabaseCoupleMember {
  couple_id: string;
  user_id: string;
  role: string | null;
  paired_at: string;
  unpaired_at: string | null;
}

export interface DatabaseBroadcast {
  id: string;
  title: string;
  body: string;
  status: BroadcastStatus;
  scheduled_for: string | null;
  sent_at: string | null;
  created_at: string;
  created_by: string | null;
  target_platform: 'all' | 'ios' | 'android';
  target_version_min: string | null;
  recipients_count?: number;
  read_count?: number;
}

export interface DatabaseSupportTicket {
  id: string;
  user_id: string;
  subject: string;
  message: string;
  status: TicketStatus;
  priority: TicketPriority;
  assigned_to: string | null;
  created_at: string;
  updated_at: string;
  user?: DatabaseUser;
}

export interface DatabaseAppSetting {
  key: string;
  value: Json;
  description: string | null;
  is_public: boolean;
  updated_at: string;
}

export interface DatabaseDailyMetric {
  date: string;
  total_users: number;
  new_users: number;
  daily_active_users: number;
  active_couples: number;
  premium_couples: number;
  trial_couples: number;
  total_interactions: number;
  total_notifications: number;
}

export interface TodayDashboardMetrics {
  totalUsers: number;
  newUsersToday: number;
  activeCouples: number;
  interactionsToday: number;
  openTickets: number;
  scheduledBroadcasts: number;
  premiumCouples: number;
}
