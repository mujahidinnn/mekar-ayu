import type { ReactNode } from 'react';

interface ChipProps {
  label: string;
  icon?: ReactNode;
  active: boolean;
  onClick: () => void;
  activeClassName?: string;
}

export function Chip({ label, icon, active, onClick, activeClassName }: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex min-h-11 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition active:scale-95 ${
        active
          ? (activeClassName ?? 'bg-[var(--ink)] text-white dark:text-[#181818]')
          : 'bg-[var(--surface)] text-[var(--ink)]'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
