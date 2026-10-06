import { NavIcon } from './NavIcon';
import { useI18n } from '../lib/i18n';

export type Tab = 'home' | 'calendar' | 'stats' | 'more';

interface BottomNavProps {
  active: Tab;
  onChange: (tab: Tab) => void;
}

const ITEMS: Tab[] = ['home', 'calendar', 'stats', 'more'];

export function BottomNav({ active, onChange }: BottomNavProps) {
  const { t } = useI18n();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 mx-auto max-w-md rounded-t-[28px] bg-[var(--card)] px-4 pb-[max(env(safe-area-inset-bottom),0.75rem)] pt-2 shadow-[0_-10px_30px_-18px_rgba(0,0,0,0.25)] md:max-w-2xl lg:inset-y-0 lg:right-auto lg:mx-0 lg:w-24 lg:max-w-none lg:rounded-l-none lg:rounded-r-[28px] lg:px-2 lg:py-6 lg:shadow-[10px_0_30px_-18px_rgba(0,0,0,0.25)]">
      <div className="flex items-center justify-between lg:h-full lg:flex-col lg:justify-center lg:gap-6">
        {ITEMS.map((key) => {
          const label = t.nav[key];
          const isActive = active === key;
          return (
            <button
              key={key}
              onClick={() => onChange(key)}
              aria-current={isActive ? 'page' : undefined}
              className={`flex flex-1 flex-col items-center gap-1 py-1.5 text-[0.6875rem] lg:w-full lg:flex-none font-semibold transition active:scale-95 ${
                isActive ? 'text-[var(--ink)]' : 'text-[#7d777b] dark:text-[#8f8a8d]'
              }`}
            >
              <NavIcon tab={key} active={isActive} />
              {label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
