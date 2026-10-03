import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { format, isSameMonth } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { useSyncStatus } from '../hooks/useSyncStatus';

interface HeaderProps {
  title: string;
  visibleMonth: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
  children?: React.ReactNode;
}

const BTN = 'flex h-12 w-12 items-center justify-center rounded-2xl bg-white/70 transition active:scale-95 dark:bg-[var(--card)]';

export function Header({ title, visibleMonth, onPrevMonth, onNextMonth, onToday, children }: HeaderProps) {
  const isSaving = useSyncStatus();
  const isCurrentMonth = isSameMonth(visibleMonth, new Date());

  return (
    <header className="px-5 pt-[max(env(safe-area-inset-top),1.25rem)]">
      <div className="flex items-center justify-between">
        <button onClick={onPrevMonth} aria-label="Bulan sebelumnya" className={BTN}>
          <ChevronLeft size={20} />
        </button>
        <div className="text-center">
          <p className="flex items-center justify-center gap-1.5 text-base font-bold">
            {title}
            {isSaving && <Loader2 size={14} className="animate-spin text-[var(--muted)]" />}
          </p>
          <p className="text-sm capitalize text-[var(--muted)]">{format(visibleMonth, 'MMMM yyyy', { locale: localeId })}</p>
        </div>
        <button onClick={onNextMonth} aria-label="Bulan berikutnya" className={BTN}>
          <ChevronRight size={20} />
        </button>
      </div>
      {!isCurrentMonth && (
        <button
          onClick={onToday}
          className="mx-auto mt-3 block rounded-full bg-[var(--ink)] px-4 py-1.5 text-xs font-bold text-white transition active:scale-95 dark:text-[#181818]"
        >
          Kembali ke bulan ini
        </button>
      )}
      {children}
    </header>
  );
}
