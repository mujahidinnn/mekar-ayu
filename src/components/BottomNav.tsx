import { NavIcon } from './NavIcon';

export type Tab = 'home' | 'calendar' | 'stats' | 'more';

interface BottomNavProps {
  active: Tab;
  onChange: (tab: Tab) => void;
}

const ITEMS: { key: Tab; label: string }[] = [
  { key: 'home', label: 'Beranda' },
  { key: 'calendar', label: 'Kalender' },
  { key: 'stats', label: 'Statistik' },
  { key: 'more', label: 'Lainnya' },
];

export function BottomNav({ active, onChange }: BottomNavProps) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 mx-auto max-w-md rounded-t-[28px] bg-[var(--card)] px-4 pb-[max(env(safe-area-inset-bottom),0.75rem)] pt-2 shadow-[0_-10px_30px_-18px_rgba(0,0,0,0.25)]">
      <div className="flex items-center justify-between">
        {ITEMS.map(({ key, label }) => {
          const isActive = active === key;
          return (
            <button
              key={key}
              onClick={() => onChange(key)}
              aria-current={isActive ? 'page' : undefined}
              className={`flex flex-1 flex-col items-center gap-1 py-1.5 text-[11px] font-semibold transition active:scale-95 ${
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
