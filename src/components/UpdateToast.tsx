import { CheckCircle2, RefreshCw, X } from 'lucide-react';

interface UpdateToastProps {
  needRefresh: boolean;
  offlineReady: boolean;
  onApplyUpdate: () => void;
  onDismissNeedRefresh: () => void;
  onDismissOfflineReady: () => void;
}

export function UpdateToast({ needRefresh, offlineReady, onApplyUpdate, onDismissNeedRefresh, onDismissOfflineReady }: UpdateToastProps) {
  if (!needRefresh && !offlineReady) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-24 z-30 lg:bottom-6 mx-auto flex max-w-md justify-center px-4">
      {needRefresh ? (
        <div className="pointer-events-auto flex w-full items-center gap-3 rounded-2xl bg-[var(--card)] p-3 shadow-lg">
          <RefreshCw size={20} className="shrink-0 text-[var(--ink)]" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-[var(--ink)]">Ada update baru, nih</p>
            <p className="text-xs text-[var(--muted)]">Versi terbaru Mekar Ayu udah siap buat kamu.</p>
          </div>
          <button
            onClick={onDismissNeedRefresh}
            aria-label="Nanti saja"
            className="shrink-0 rounded-full p-1.5 text-[var(--muted)] active:bg-[var(--line)]"
          >
            <X size={16} />
          </button>
          <button
            onClick={onApplyUpdate}
            className="shrink-0 rounded-full bg-[var(--ink)] px-3 py-2 text-xs font-semibold text-white dark:text-[#181818] active:scale-95 transition"
          >
            Update
          </button>
        </div>
      ) : (
        <div className="pointer-events-auto flex w-full items-center gap-3 rounded-2xl bg-[#C9F2D9] p-3 shadow-lg">
          <CheckCircle2 size={20} className="shrink-0 text-[#181818]" />
          <p className="flex-1 text-sm text-[#181818]">Mekar Ayu udah bisa dipakai offline juga.</p>
          <button
            onClick={onDismissOfflineReady}
            aria-label="Tutup"
            className="shrink-0 rounded-full p-1.5 text-[#181818] active:bg-[#181818]/10"
          >
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
