// Statistics page type definitions
export interface StatisticsOverview {
  totalUsers: number;
  totalWorks: number;
  totalReports: number;
  totalPayments: number;
  activeUsers: number;
  verifiedUsers: number;
  verificationRate: string;
  totalFiles: number;
  totalFileSize: number;
}

export interface WorksByStatus {
  pending?: number;
  authorized?: number;
  waiting_payment?: number;
  exclusive?: number;
  rejected?: number;
}

export interface MonthlyWorksData {
  month: string;
  total: number;
  approved: number;
  rejected: number;
  pending: number;
}

export interface MonthlyUsersData {
  month: string;
  total: number;
}

export interface PaymentStatusData {
  count: number;
  amount: number;
}

export interface PaymentsByStatus {
  pending?: PaymentStatusData;
  processing?: PaymentStatusData;
  completed?: PaymentStatusData;
  failed?: PaymentStatusData;
  refunded?: PaymentStatusData;
}

export interface RevenueByMonth {
  month: string;
  revenue: number;
  transactions: number;
}

export interface PaymentStatistics {
  byStatus: PaymentsByStatus;
  revenueByMonth: RevenueByMonth[];
}

export interface ReportsByType {
  plagiarism?: number;
  inappropriate?: number;
  false_info?: number;
  copyright_violation?: number;
  other?: number;
}

export interface ReportsByStatus {
  pending?: number;
  investigating?: number;
  resolved?: number;
  dismissed?: number;
}

export interface ReportsStatistics {
  byType: ReportsByType;
  byStatus: ReportsByStatus;
}

export interface TopAuthor {
  id: string;
  name: string;
  email: string;
  worksCount: number;
}

export interface DailyActivity {
  day: string;
  type: 'works' | 'users' | 'reports';
  count: number;
}

export interface StatisticsMetadata {
  timeRange: string;
  startDate?: string;
  endDate?: string;
  generatedAt: string;
}

export interface StatisticsData {
  overview: StatisticsOverview;
  worksByStatus: WorksByStatus;
  worksByMonth: MonthlyWorksData[];
  usersByMonth: MonthlyUsersData[];
  paymentStats: PaymentStatistics;
  reports: ReportsStatistics;
  topAuthors: TopAuthor[];
  dailyActivity: DailyActivity[];
  metadata: StatisticsMetadata;
}

export interface StatisticsApiResponse {
  success: boolean;
  statistics: StatisticsData;
  error?: string;
  details?: string;
}

// Chart data interfaces
export interface ChartDataPoint {
  name: string;
  value: number;
  color?: string;
}

export interface LineChartDataPoint {
  month: string;
  [key: string]: string | number;
}

export interface BarChartDataPoint {
  month: string;
  [key: string]: string | number;
}

// Component props interfaces
export interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  description?: string;
}

export interface ChartCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export interface TimeRangeFilterProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export interface ExportButtonProps {
  onExport: () => void;
  loading?: boolean;
  disabled?: boolean;
}

// Filter and export types
export type TimeRange = '7d' | '30d' | '90d' | '1y' | 'custom';

export interface DateRangeFilter {
  startDate?: Date;
  endDate?: Date;
}

export interface StatisticsFilters {
  timeRange: TimeRange;
  dateRange?: DateRangeFilter;
}

export interface ExportData {
  format: 'pdf' | 'excel' | 'csv';
  data: StatisticsData;
  filters: StatisticsFilters;
}
