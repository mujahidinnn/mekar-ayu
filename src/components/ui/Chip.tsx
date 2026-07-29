interface ChipProps {
  label: string;
  emoji?: string;
  active: boolean;
  onClick: () => void;
  activeClassName?: string;
}

export function Chip({ label, emoji, active, onClick, activeClassName }: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex min-h-11 items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition active:scale-95 ${
        active
          ? (activeClassName ?? 'border-rose-400 bg-rose-400 text-white shadow-sm')
          : 'border-rose-200 bg-white text-rose-900 hover:bg-rose-50 dark:border-stone-700 dark:bg-stone-800 dark:text-rose-100 dark:hover:bg-stone-700'
      }`}
    >
      {emoji && <span>{emoji}</span>}
      {label}
    </button>
  );
}
