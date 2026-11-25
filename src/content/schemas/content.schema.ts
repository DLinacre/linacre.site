/** Missing status is intentional: existence of source or a URL is not release evidence. */
export const CONTENT_STATUSES = [
  'Live',
  'Released',
  'In Development',
  'Prototype',
  'Archived',
] as const;
export type ContentStatus = (typeof CONTENT_STATUSES)[number];
export type ProjectKind = 'App' | 'Tool' | 'AI' | 'Game' | 'DevOps' | 'Source' | 'Private';
export type Relationship = 'original' | 'wrapper' | 'template' | 'directory' | 'integration';
export interface Screenshot {
  src: string;
  alt: string;
  capturedAt?: string;
  sourceSha?: string;
}
export interface BaseContent {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  fullDescription?: string;
  role?: string;
  implementation?: string;
  status?: ContentStatus;
  statusNote?: string;
  platforms?: string[];
  features?: string[];
  technologyStack?: string[];
  artwork?: string;
  screenshots?: Screenshot[];
  downloadUrl?: string;
  sourceRepository?: string;
  documentation?: string;
  lastVerifiedDate?: string;
  verification?: {
    method: 'source' | 'page-retrieval' | 'boot' | 'functional' | 'device-install';
    scope: string;
  };
  featured: boolean;
  relationship: Relationship;
  tags?: string[];
  relatedIds?: string[];
  provenance?: string[];
  presentation?: {
    emoji?: string;
    pinned?: boolean;
    dashboardCategory?: string;
    color?: 'cyan' | 'purple' | 'sakura' | 'emerald' | 'amber';
  };
}
export interface GameContent extends BaseContent {
  type: 'game';
  genre?: string[];
  inputMethods?: string[];
  controls?: string;
  modes?: string;
  playUrl?: string;
  development?: {
    systems?: string[];
    changelog?: { version: string; date: string; title: string; changes: string[] }[];
    roadmap?: { item: string; status: string }[];
  };
}
export const PORTFOLIO_CATEGORIES = [
  'AI & Machine Learning',
  'Windows Software',
  'Web Applications',
  'Android Applications',
  'Developer Tools',
  'Automation & Infrastructure',
  'Experimental Projects',
] as const;
export type PortfolioCategory = (typeof PORTFOLIO_CATEGORIES)[number];
export interface ProjectContent extends BaseContent {
  type: 'project';
  category: Exclude<ProjectKind, 'Game' | 'Private'>;
  portfolio?: {
    category: PortfolioCategory;
    sourceVerifiedAt: string;
    sourceSha: string;
    reviewNote: string;
  };
  whyBuilt?: string;
  downloads?: { label: string; url: string; version: string; note?: string }[];
  releases?: { version: string; url: string; publishedAt?: string; notes?: string }[];
  problemSolved?: string;
  liveUrl?: string;
}
export type StudioContent = GameContent | ProjectContent;
export const contentStatusLabel = (record: Pick<BaseContent, 'status'>): string =>
  record.status ?? 'Status not verified';
