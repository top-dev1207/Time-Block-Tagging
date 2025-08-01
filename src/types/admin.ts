import { LucideIcon } from 'lucide-react';

// Admin Dashboard Statistics Types
export interface AdminStat {
  title: string;
  value: string | number;
  change: string;
  color: string;
  icon: LucideIcon;
  trend: 'up' | 'down' | 'stable';
  isLoading?: boolean;
}

// Quick Actions Types
export interface QuickAction {
  title: string;
  description: string;
  icon: LucideIcon;
  path: string;
  color: string;
  enabled: boolean;
  badge?: string;
}

// Activity Types
export interface RecentActivity {
  id: string;
  action: string;
  user: string;
  time: string;
  type: 'work' | 'report' | 'payment' | 'user' | 'system';
  details?: string;
  severity?: 'info' | 'warning' | 'error' | 'success';
}

// System Status Types
export interface SystemStatus {
  component: string;
  status: 'online' | 'offline' | 'warning' | 'maintenance';
  lastChecked: string;
  uptime?: string;
  details?: string;
}

// Admin Dashboard State
export interface AdminDashboardState {
  stats: AdminStat[];
  activities: RecentActivity[];
  systemStatus: SystemStatus[];
  loading: boolean;
  error: string | null;
  lastUpdated: string | null;
}

// Admin Navigation Types
export interface AdminNavItem {
  title: string;
  path: string;
  icon: LucideIcon;
  description: string;
  enabled: boolean;
  requiresSpecialPermission?: boolean;
}

// Admin User Management Types
export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'USER' | 'ADMIN' | 'MODERATOR';
  created_at: string;
  last_sign_in_at?: string;
  email_verified: boolean;
  banned: boolean;
  total_works: number;
  total_payments: number;
}

// Admin Work Management Types
export interface AdminWork {
  id: string;
  title: string;
  author: string;
  user_id: string;
  status: 'pending' | 'approved' | 'rejected' | 'published';
  created_at: string;
  work_type: string;
  isrc?: string;
  iswc?: string;
  payment_required: boolean;
  payment_status: 'pending' | 'paid' | 'failed' | 'not_required';
}

// Admin Report Management Types
export interface AdminReport {
  id: string;
  title: string;
  description: string;
  work_id: string;
  work_title: string;
  reporter_id: string;
  reporter_name: string;
  status: 'pending' | 'investigating' | 'resolved' | 'dismissed';
  created_at: string;
  resolved_at?: string;
  resolved_by?: string;
  resolution_notes?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

// Admin API Response Types
export interface AdminStatsApiResponse {
  success: boolean;
  data: {
    users: {
      total: number;
      active: number;
      new_today: number;
      verified: number;
    };
    works: {
      total: number;
      pending: number;
      approved: number;
      rejected: number;
    };
    reports: {
      total: number;
      pending: number;
      resolved: number;
      high_priority: number;
    };
    revenue: {
      today: number;
      this_month: number;
      total: number;
    };
  };
  error?: string;
}

export interface AdminActivitiesApiResponse {
  success: boolean;
  data: RecentActivity[];
  error?: string;
}

export interface AdminSystemStatusApiResponse {
  success: boolean;
  data: SystemStatus[];
  error?: string;
}

// Filter Types for Admin Lists
export interface AdminUsersFilter {
  search: string;
  role?: 'USER' | 'ADMIN' | 'MODERATOR' | 'all';
  verified?: 'verified' | 'unverified' | 'all';
  status?: 'active' | 'banned' | 'all';
  sortBy: 'created_at' | 'last_sign_in_at' | 'name' | 'email';
  sortOrder: 'asc' | 'desc';
  limit: number;
  offset: number;
}

export interface AdminWorksFilter {
  search: string;
  status?: 'pending' | 'approved' | 'rejected' | 'published' | 'all';
  work_type?: string;
  payment_status?: 'pending' | 'paid' | 'failed' | 'not_required' | 'all';
  date_from?: string;
  date_to?: string;
  sortBy: 'created_at' | 'title' | 'author' | 'status';
  sortOrder: 'asc' | 'desc';
  limit: number;
  offset: number;
}

export interface AdminReportsFilter {
  search: string;
  status?: 'pending' | 'investigating' | 'resolved' | 'dismissed' | 'all';
  severity?: 'low' | 'medium' | 'high' | 'critical' | 'all';
  date_from?: string;
  date_to?: string;
  sortBy: 'created_at' | 'severity' | 'status';
  sortOrder: 'asc' | 'desc';
  limit: number;
  offset: number;
}

// Component Props Types
export interface AdminStatsProps {
  stats: AdminStat[];
  loading?: boolean;
  onRefresh?: () => void;
}

export interface AdminQuickActionsProps {
  actions: QuickAction[];
  onActionClick: (path: string) => void;
}

export interface AdminActivitiesProps {
  activities: RecentActivity[];
  loading?: boolean;
  onViewAll?: () => void;
}

export interface AdminSystemStatusProps {
  status: SystemStatus[];
  loading?: boolean;
  onRefresh?: () => void;
}

// Permission and Role Types
export interface AdminPermission {
  id: string;
  name: string;
  description: string;
  category: 'users' | 'works' | 'reports' | 'system' | 'analytics';
}

export interface AdminRole {
  id: string;
  name: string;
  description: string;
  permissions: AdminPermission[];
  level: number;
}

// Settings Types
export interface AdminSettings {
  site_name: string;
  maintenance_mode: boolean;
  registration_enabled: boolean;
  email_verification_required: boolean;
  max_file_size_mb: number;
  allowed_file_types: string[];
  smtp_configured: boolean;
  backup_enabled: boolean;
  auto_approve_works: boolean;
  payment_required_for_registration: boolean;
}
