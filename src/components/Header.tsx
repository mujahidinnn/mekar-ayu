import { ChevronLeft, ChevronRight, Database, Loader2, Settings } from 'lucide-react';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { PHASES } from '../data/phases';
import type { PhaseKey } from '../data/phases';
import { useSyncStatus } from '../hooks/useSyncStatus';
import { formatStorageSize } from '../lib/formatStorageSize';

interface HeaderProps {
  visibleMonth: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
  statusLabel: string;
  currentPhase: PhaseKey | null;
  usageKB: number;
  onOpenSettings: () => void;
}

export function Header({
  visibleMonth,
  onPrevMonth,
  onNextMonth,
  onToday,
  statusLabel,
  currentPhase,
  usageKB,
  onOpenSettings,
}: HeaderProps) {
  const phase = currentPhase ? PHASES[currentPhase] : null;
  const isSaving = useSyncStatus();

  return (
    <header className="sticky top-0 z-30 border-b border-rose-100 bg-rose-50/90 backdrop-blur px-4 pt-[max(env(safe-area-inset-top),0.75rem)] pb-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <button
            onClick={onPrevMonth}
            aria-label="Bulan sebelumnya"
            className="flex h-11 w-11 items-center justify-center rounded-full text-rose-500 active:scale-95 hover:bg-rose-100 transition"
          >
            <ChevronLeft size={20} />
          </button>
          <button onClick={onToday} className="min-w-[9rem] text-center text-base font-bold text-rose-950 capitalize">
            {format(visibleMonth, 'MMMM yyyy', { locale: localeId })}
          </button>
          <button
            onClick={onNextMonth}
            aria-label="Bulan berikutnya"
            className="flex h-11 w-11 items-center justify-center rounded-full text-rose-500 active:scale-95 hover:bg-rose-100 transition"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="flex items-center gap-1">
          {isSaving && (
            <span
              role="status"
              aria-label="Menyinkronkan perubahan"
              title="Menyinkronkan perubahan…"
              className="flex items-center gap-1.5 pl-1 pr-2 text-amber-600"
            >
              <Loader2 size={16} className="animate-spin" />
              <span className="text-xs font-medium">Menyinkronkan…</span>
            </span>
          )}
          <button
            onClick={onOpenSettings}
            aria-label="Pengaturan & Backup"
            className="flex h-11 w-11 items-center justify-center rounded-full text-rose-500 hover:bg-rose-100 active:scale-95 transition"
          >
            <Settings size={20} />
          </button>
        </div>
      </div>

      <div className="mt-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center rounded-full bg-rose-400 px-3 py-1 text-xs font-semibold text-white shadow-sm">
            {statusLabel}
          </span>
          {phase && (
            <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold text-rose-950/80 ${phase.color}/30`}>
              {phase.label}
            </span>
          )}
        </div>
        <span
          className="flex shrink-0 items-center gap-1 text-[11px] font-medium text-rose-900/40"
          title="Perkiraan ukuran data tersimpan di perangkat ini"
        >
          <Database size={12} />
          {formatStorageSize(usageKB)}
        </span>
      </div>
    </header>
  );
}
