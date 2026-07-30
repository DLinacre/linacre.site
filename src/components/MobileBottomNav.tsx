import { motion } from 'motion/react';
import { Menu } from 'lucide-react';
import { primaryNav } from '../lib/design-system';

interface MobileBottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  openMore: () => void;
}

export default function MobileBottomNav({
  activeTab,
  setActiveTab,
  openMore,
}: MobileBottomNavProps) {
  const mobileItems = primaryNav.slice(0, 4);

  return (
    <nav
      className="fixed inset-x-3 bottom-3 z-50 rounded-2xl border border-[var(--linacre-border)] bg-[#0b1018] p-1.5 shadow-[var(--linacre-shadow-float)] backdrop-blur-xl md:hidden"
      aria-label="Mobile navigation"
    >
      <div className="grid grid-cols-5 gap-1">
        {mobileItems.map(item => {
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
              {active && (
                <motion.span
                  layoutId="mobile-nav-active"
                  className="absolute inset-0 rounded-xl bg-[var(--linacre-accent-soft)]"
                />
              )}
              <span className="relative">
                <Icon className="h-4 w-4" aria-hidden="true" />
              </span>
              <span className="relative truncate">{item.label}</span>
            </button>
          );
        })}
        <button
          type="button"
          onClick={openMore}
          className="flex min-h-12 min-w-11 flex-col items-center justify-center gap-1 rounded-xl px-1 text-[10px] font-semibold text-[#cbd5e1] transition-colors hover:text-white"
          aria-label="Open more navigation"
        >
          <Menu className="h-4 w-4" aria-hidden="true" />
          <span>More</span>
        </button>
      </div>
    </nav>
  );
}
