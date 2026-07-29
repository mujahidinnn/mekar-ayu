import type { ReactNode } from 'react';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: ReactNode;
  confirmLabel: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

// A centered modal on purpose — every other confirmation in this app is a bottom sheet, so a
// destructive/irreversible action getting a different, more deliberate shape is itself a signal.
export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel = 'Batal',
  destructive = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
      <button aria-label={cancelLabel} className="absolute inset-0 bg-rose-950/50 animate-fade-in dark:bg-black/60" onClick={onCancel} />
      <div className="relative w-full max-w-sm rounded-3xl bg-white p-5 shadow-2xl animate-fade-in dark:bg-stone-900">
        <h3 className="text-base font-bold text-rose-950 dark:text-rose-50">{title}</h3>
        <div className="mt-2 text-sm leading-relaxed text-rose-900/70 dark:text-stone-300">{description}</div>
        <div className="mt-5 flex gap-2">
          <button
            onClick={onCancel}
            className="min-h-11 flex-1 rounded-2xl border border-rose-200 text-sm font-semibold text-rose-900 active:scale-95 transition hover:bg-rose-50 dark:border-stone-700 dark:text-rose-100 dark:hover:bg-stone-800"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`min-h-11 flex-1 rounded-2xl text-sm font-semibold text-white transition active:scale-95 ${
              destructive ? 'bg-red-600 hover:bg-red-700' : 'bg-rose-500 hover:bg-rose-600'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
