export type ToolCategory = 'start' | 'build' | 'deploy' | 'design' | 'email' | 'stack' | 'learn';

export interface Tool {
  id: string;
  name: string;
  category: ToolCategory;
  description: string;
  url: string;
  host: string;
  searchKeywords: string;
  tag: string;
}

export interface Project {
  name: string;
  category: string;
  description: string;
  url: string;
  host: string;
  tag: string;
  role?: string;
  challenges?: string;
  solution?: string;
  tech?: string[];
  repoUrl?: string;
  liveUrl?: string;
  paypalUrl?: string;
  /** Confirmed live & accessible right now */
  live?: boolean;
  /** Card artwork served from /public/projects/ (webp photo-style or svg line-art) */
  artwork?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface MCPServer {
  id: string;
  title: string;
  description: string;
  category: string;
  package?: string;
  config: string;
  isReady: boolean;
}

export interface SkillTemplate {
  id: string;
  title: string;
  description: string;
  prompt: string;
}

export interface ChangelogItem {
  version: string;
  title: string;
  description: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  readTime: string;
  tags: string[];
  category: 'concurrency' | 'styling' | 'caching' | 'automation';
}
