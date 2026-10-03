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
    <div className="fixed inset-0 z-[60] !m-0 flex items-center justify-center p-6">
      <button aria-label={cancelLabel} className="absolute inset-0 bg-[#181818]/50 animate-fade-in" onClick={onCancel} />
      <div className="relative w-full max-w-sm rounded-3xl bg-[var(--card)] p-5 shadow-2xl animate-fade-in">
        <h3 className="text-base font-bold text-[var(--ink)]">{title}</h3>
        <div className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{description}</div>
        <div className="mt-5 flex gap-2">
          <button
            onClick={onCancel}
            className="min-h-11 flex-1 rounded-2xl bg-[var(--surface)] text-sm font-semibold text-[var(--ink)] active:scale-95 transition"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`min-h-11 flex-1 rounded-2xl text-sm font-semibold text-white transition active:scale-95 ${
              destructive ? 'bg-red-600' : 'bg-[var(--ink)] dark:text-[#181818]'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
