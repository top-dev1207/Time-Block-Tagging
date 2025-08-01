// Audit Log system type definitions

export interface AuditLog {
  id: string;
  userId?: string;
  userEmail: string;
  userName?: string;
  action: AuditAction;
  resource: string;
  resourceId?: string;
  details: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  timestamp: string;
  createdAt: string;
}

export type AuditAction = 
  | 'user_login'
  | 'user_logout'
  | 'user_register'
  | 'user_email_verify'
  | 'user_password_reset'
  | 'user_profile_update'
  | 'user_role_change'
  | 'work_create'
  | 'work_update'
  | 'work_approve'
  | 'work_reject'
  | 'work_delete'
  | 'work_payment_request'
  | 'payment_create'
  | 'payment_complete'
  | 'payment_fail'
  | 'payment_refund'
  | 'report_create'
  | 'report_update'
  | 'report_resolve'
  | 'report_dismiss'
  | 'admin_access'
  | 'admin_action'
  | 'file_upload'
  | 'file_delete'
  | 'settings_update'
  | 'system_error';

export interface AuditLogFilter {
  search?: string;
  action?: AuditAction | 'all';
  userId?: string;
  dateFrom?: string;
  dateTo?: string;
  limit?: number;
  offset?: number;
}

export interface AuditLogStats {
  totalLogs: number;
  todayLogs: number;
  weekLogs: number;
  monthLogs: number;
  actionCounts: Record<AuditAction, number>;
  topUsers: Array<{
    userId: string;
    userEmail: string;
    userName?: string;
    logCount: number;
  }>;
  hourlyActivity: Array<{
    hour: string;
    count: number;
  }>;
}

export interface AuditLogApiResponse {
  success: boolean;
  logs: AuditLog[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  stats?: AuditLogStats;
  error?: string;
}

export interface ActionBadgeConfig {
  label: string;
  variant: 'default' | 'destructive' | 'secondary' | 'outline' | 'success' | 'warning';
  color: string;
  icon?: string;
}

export type ActionBadgeMap = Record<AuditAction, ActionBadgeConfig>;

// Component Props
export interface AuditLogTableProps {
  logs: AuditLog[];
  loading?: boolean;
  onRefresh?: () => void;
}

export interface AuditLogFilterProps {
  filter: AuditLogFilter;
  onChange: (filter: AuditLogFilter) => void;
  disabled?: boolean;
  searchPending?: boolean;
}

export interface AuditLogStatsProps {
  stats: AuditLogStats;
  loading?: boolean;
}

export interface ActionBadgeProps {
  action: AuditAction;
  size?: 'sm' | 'md' | 'lg';
}

// Export and Pagination
export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface ExportOptions {
  format: 'csv' | 'json' | 'pdf';
  dateRange?: {
    from: string;
    to: string;
  };
  filters?: AuditLogFilter;
}
