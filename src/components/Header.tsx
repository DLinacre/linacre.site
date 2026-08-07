import Logo3D from './Logo3D';
import InteractiveGlobe from './InteractiveGlobe';

interface HeaderProps {
  setActiveTab: (tab: string) => void;
  activeColor: { primary: string; secondary: string };
}

/**
 * Header — deliberately minimal: the 3D logo on the left, the interactive
 * globe on the right. All navigation lives in the floating bottom dock.
 */
export default function Header({ setActiveTab, activeColor }: HeaderProps) {
  return (
    <header
      className="sticky top-0 z-50 w-full border-b border-amber-color/10 bg-background/70 backdrop-blur-xl transition-colors"
      style={{ transitionDuration: 'var(--linacre-duration-base)' }}
      role="banner"
    >
      {/* Skip-to-content link for keyboard/screen reader accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Brand: 3D logo */}
          <Logo3D onNavigate={setActiveTab} />

          {/* Globe */}
          <div className="flex items-center gap-2 shrink-0">
            <InteractiveGlobe primaryColor={activeColor.primary} />
          </div>
        </div>
      </div>
    </header>
  );
}
