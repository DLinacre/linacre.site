import { Activity, Bot, BookOpen, Cpu, FileText, FolderCode, Gamepad2, Github, House, Layers, Mail, Sliders, Sparkles, User } from 'lucide-react';

export const primaryNav = [
  { id: 'home', label: 'Start', href: '/', icon: House },
  { id: 'toolkit', label: 'Tools', href: '/toolkit', icon: Layers },
  { id: 'projects', label: 'Projects', href: '/projects', icon: FolderCode },
  { id: 'playground', label: 'Playground', href: '/playground', icon: Sliders },
  { id: 'about', label: 'About', href: '/about', icon: User },
  { id: 'contact', label: 'Contact', href: '/contact', icon: Mail },
];

export const moreNav = [
  { id: 'blog', label: 'Blog', href: '/blog', icon: FileText },
  { id: 'learn', label: 'Learn', href: '/learn', icon: BookOpen },
  { id: 'agents', label: 'Agents', href: '/agents', icon: Bot },
  { id: 'games', label: 'Games', href: '/games', icon: Gamepad2 },
  { id: 'lab', label: 'AI Lab', href: '/lab', icon: Cpu },
  { id: 'identity', label: 'Identity', href: '/identity', icon: Sparkles },
  { id: 'status', label: 'Status', href: '/status', icon: Activity },
  { id: 'dashboard', label: 'Dashboard', href: '/dashboard', icon: Github },
];

export const quickToolChips = [
  { label: 'Format JSON', utility: 'json' },
  { label: 'New UUID', utility: 'generate' },
  { label: 'Decode Base64', utility: 'base64' },
  { label: 'Convert time', utility: 'time' },
  { label: 'UK VAT', utility: 'vat' },
  { label: 'Clean text', utility: 'text' },
  { label: 'SHA-256', utility: 'hash' },
  { label: 'Clean URL', utility: 'url' },
] as const;
