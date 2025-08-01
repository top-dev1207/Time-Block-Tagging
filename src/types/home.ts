// Types for Home/Landing Page
export interface HomeStat {
  id: string;
  number: string;
  label: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
  trend?: 'up' | 'down' | 'stable';
  change?: string;
}

export interface HomeFeature {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  link?: string;
  color?: string;
}

export interface HowItWorksStep {
  id: string;
  step: number;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  color?: string;
}

export interface RecentWork {
  id: string;
  title: string;
  author: string;
  coauthor?: string;
  genre?: string;
  description?: string;
  code: string;
  registeredAt: string;
  isExclusive?: boolean;
  coverImage?: string;
  status?: string;
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  publishedAt: string;
  category: 'news' | 'update' | 'announcement';
  link?: string;
  image?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'general' | 'registration' | 'payment' | 'technical';
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company?: string;
  content: string;
  avatar?: string;
  rating: number;
}

export interface Partner {
  id: string;
  name: string;
  logo: string;
  website?: string;
  description?: string;
}

export interface HomePageData {
  stats: HomeStat[];
  recentWorks: RecentWork[];
  news: NewsItem[];
  faqs: FAQItem[];
  testimonials: Testimonial[];
  partners: Partner[];
}
