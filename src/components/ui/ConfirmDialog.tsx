import { useState } from 'react';
import type { ReactNode } from 'react';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: ReactNode;
  confirmLabel: string;
  cancelLabel?: string;
  destructive?: boolean;
  requireText?: string;
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
  requireText,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const [typed, setTyped] = useState('');
  if (!open) return null;

  const locked = !!requireText && typed.trim() !== requireText;
  const handle = (fn: () => void) => () => {
    setTyped('');
    fn();
  };

  return (
    <div className="fixed inset-0 z-[60] !m-0 flex items-center justify-center p-6">
      <button aria-label={cancelLabel} className="absolute inset-0 bg-[#181818]/50 animate-fade-in" onClick={handle(onCancel)} />
      <div className="relative w-full max-w-sm rounded-3xl bg-[var(--card)] p-5 shadow-2xl animate-fade-in">
        <h3 className="text-base font-bold text-[var(--ink)]">{title}</h3>
        <div className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{description}</div>
        {requireText && (
          <label className="mt-4 block text-xs text-[var(--muted)]">
            Ketik <b className="text-[var(--ink)]">{requireText}</b> buat lanjut
            <input
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              autoCapitalize="characters"
              autoComplete="off"
              spellCheck={false}
              className="mt-2 w-full rounded-xl bg-[var(--surface)] px-3 py-2.5 text-sm font-bold text-[var(--ink)] outline-none focus:ring-2 focus:ring-[var(--ink)]"
            />
          </label>
        )}
        <div className="mt-5 flex gap-2">
          <button
            onClick={handle(onCancel)}
            className="min-h-11 flex-1 rounded-2xl bg-[var(--surface)] text-sm font-semibold text-[var(--ink)] active:scale-95 transition"
          >
            {cancelLabel}
          </button>
          <button
            onClick={handle(onConfirm)}
            disabled={locked}
            className={`min-h-11 flex-1 rounded-2xl text-sm font-semibold text-white transition active:scale-95 disabled:opacity-40 ${
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
