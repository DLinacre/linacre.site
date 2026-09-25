export type ProjectCategory = 
  | 'All' 
  | 'Desktop & Systems' 
  | 'AI & LLM' 
  | 'Mobile & Android' 
  | 'Web & Tools' 
  | 'Games & Creative';

export type BadgeColor = 'cyan' | 'purple' | 'sakura' | 'emerald' | 'amber';

export interface ProjectCard {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  badge: string;
  color: BadgeColor;
  description: string;
  tags: string[];
  stats: string;
  links: {
    github?: string;
    live?: string;
    download?: string;
  };
  featured: boolean;
}
