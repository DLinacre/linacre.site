import { motion } from 'motion/react';
import { Menu, House, FolderCode, Gamepad2, Layers } from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  openMore: () => void;
}

/** Primary destinations for the floating dock (Start · Projects · Games · Toolkit + More). */
const DOCK_ITEMS = [
  { id: 'home', label: 'Start', icon: House },
  { id: 'projects', label: 'Projects', icon: FolderCode },
  { id: 'games', label: 'Games', icon: Gamepad2 },
  { id: 'toolkit', label: 'Tools', icon: Layers },
];

/**
 * Floating bottom navigation dock.
 *
 * v7.1: shown on ALL screen sizes (was mobile-only) — a compact floating
 * pill on desktop, full-width-ish on phones. Keeps the primary destinations
 * one thumb-tap away and mirrors the header's core items.
 */
export default function MobileBottomNav({ activeTab, setActiveTab, openMore }: MobileBottomNavProps) {
  const mobileItems = DOCK_ITEMS;

  return (
    <nav
      className="fixed bottom-3 inset-x-3 sm:inset-x-6 z-50 rounded-2xl border border-[var(--linacre-border)] bg-background/88 p-1.5 shadow-[var(--linacre-shadow-float)] backdrop-blur-xl sm:mx-auto sm:max-w-md"
      aria-label="Primary navigation"
    >
      <div className="grid grid-cols-5 gap-1">
        {mobileItems.map((item) => {
          const Icon = item.icon;
          const active = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              aria-current={active ? 'page' : undefined}
              className={`relative flex min-h-12 flex-col items-center justify-center gap-1 rounded-xl px-1 text-[10px] font-semibold transition-colors ${active ? 'text-[var(--linacre-accent)]' : 'text-muted-foreground hover:text-foreground'}`}
            >
              {active && <motion.span layoutId="mobile-nav-active" className="absolute inset-0 rounded-xl bg-[var(--linacre-accent-soft)]" />}
              <span className="relative"><Icon className="h-4 w-4" aria-hidden="true" /></span>
              <span className="relative truncate">{item.label}</span>
            </button>
          );
        })}
        <button type="button" onClick={openMore} className="flex min-h-12 flex-col items-center justify-center gap-1 rounded-xl px-1 text-[10px] font-semibold text-muted-foreground transition-colors hover:text-foreground" aria-label="Open more navigation">
          <Menu className="h-4 w-4" aria-hidden="true" />
          <span>More</span>
        </button>
      </div>
    </nav>
  );
}
