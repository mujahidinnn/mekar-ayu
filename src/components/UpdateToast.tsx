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
    <div className="pointer-events-none fixed inset-x-0 bottom-24 z-30 mx-auto flex max-w-md justify-center px-4">
      {needRefresh ? (
        <div className="pointer-events-auto flex w-full items-center gap-3 rounded-2xl border border-rose-200 bg-white p-3 shadow-lg shadow-rose-900/10 dark:border-stone-700 dark:bg-stone-900 dark:shadow-black/40">
          <RefreshCw size={20} className="shrink-0 text-rose-500 dark:text-rose-400" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-rose-950 dark:text-rose-50">Update tersedia</p>
            <p className="text-xs text-rose-900/70 dark:text-stone-400">Versi baru Mekar Ayu sudah siap dipasang.</p>
          </div>
          <button
            onClick={onDismissNeedRefresh}
            aria-label="Nanti saja"
            className="shrink-0 rounded-full p-1.5 text-rose-900/50 active:bg-rose-100 dark:text-stone-400 dark:active:bg-stone-800"
          >
            <X size={16} />
          </button>
          <button
            onClick={onApplyUpdate}
            className="shrink-0 rounded-full bg-rose-500 px-3 py-2 text-xs font-semibold text-white active:scale-95 transition dark:bg-rose-600"
          >
            Update Sekarang
          </button>
        </div>
      ) : (
        <div className="pointer-events-auto flex w-full items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-3 shadow-lg shadow-emerald-900/10 dark:border-emerald-800 dark:bg-emerald-950/40">
          <CheckCircle2 size={20} className="shrink-0 text-emerald-600 dark:text-emerald-400" />
          <p className="flex-1 text-sm text-emerald-900 dark:text-emerald-200">Mekar Ayu siap dipakai offline.</p>
          <button
            onClick={onDismissOfflineReady}
            aria-label="Tutup"
            className="shrink-0 rounded-full p-1.5 text-emerald-700/60 active:bg-emerald-100 dark:text-emerald-400 dark:active:bg-emerald-900"
          >
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
