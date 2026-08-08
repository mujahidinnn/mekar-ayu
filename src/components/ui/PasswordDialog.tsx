import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';

interface PasswordDialogProps {
  open: boolean;
  mode: 'set' | 'unlock';
  title: string;
  description?: ReactNode;
  error?: string | null;
  busy?: boolean;
  onSubmit: (password: string) => void;
  onCancel: () => void;
  onSkip?: () => void;
}

function PasswordField({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        type={visible ? 'text' : 'password'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-rose-200 bg-white px-3 py-2.5 pr-10 text-sm text-rose-950 outline-none focus:border-rose-400 dark:border-stone-700 dark:bg-stone-800 dark:text-rose-50"
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
        className="absolute right-0 top-0 flex h-full w-10 items-center justify-center text-rose-900/50 dark:text-stone-400"
      >
        {visible ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  );
}

// Same centered-modal treatment as ConfirmDialog: entering/handling a password is a
// deliberate, security-relevant action, not a routine bottom-sheet choice.
export function PasswordDialog({ open, mode, title, description, error, busy, onSubmit, onCancel, onSkip }: PasswordDialogProps) {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setPassword('');
      setConfirm('');
      setLocalError(null);
    }
  }, [open]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 4) {
      setLocalError('Kata sandi minimal 4 karakter.');
      return;
    }
    if (mode === 'set' && password !== confirm) {
      setLocalError('Konfirmasi kata sandi tidak cocok.');
      return;
    }
    setLocalError(null);
    onSubmit(password);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
      <button aria-label="Batal" className="absolute inset-0 bg-rose-950/50 animate-fade-in dark:bg-black/60" onClick={onCancel} />
      <form onSubmit={handleSubmit} className="relative w-full max-w-sm rounded-3xl bg-white p-5 shadow-2xl animate-fade-in dark:bg-stone-900">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-400">
            <Lock size={16} />
          </span>
          <h3 className="text-base font-bold text-rose-950 dark:text-rose-50">{title}</h3>
        </div>
        {description && <div className="mt-2 text-sm leading-relaxed text-rose-900/70 dark:text-stone-300">{description}</div>}

        <div className="mt-4 space-y-2">
          <PasswordField value={password} onChange={setPassword} placeholder="Kata sandi" />
          {mode === 'set' && <PasswordField value={confirm} onChange={setConfirm} placeholder="Ulangi kata sandi" />}
          {(localError || error) && <p className="text-xs font-medium text-red-600 dark:text-red-400">{localError || error}</p>}
        </div>

        {mode === 'set' && onSkip ? (
          // Both export paths are legitimate (a password is recommended, not required), so
          // "without a password" and "Batal" get equal-weight buttons here, not a demoted text
          // link. Only the locked/recommended path stands out, as the standalone primary button.
          <div className="mt-5 space-y-2">
            <button
              type="submit"
              disabled={busy}
              className="min-h-11 w-full rounded-2xl bg-rose-500 text-sm font-semibold text-white transition active:scale-95 hover:bg-rose-600 disabled:opacity-60"
            >
              {busy ? 'Memproses…' : 'Kunci & Unduh'}
            </button>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onCancel}
                className="min-h-11 flex-1 rounded-2xl border border-rose-200 text-sm font-semibold text-rose-900 active:scale-95 transition hover:bg-rose-50 dark:border-stone-700 dark:text-rose-100 dark:hover:bg-stone-800"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={onSkip}
                className="min-h-11 flex-1 rounded-2xl border border-rose-200 text-sm font-semibold text-rose-900 active:scale-95 transition hover:bg-rose-50 dark:border-stone-700 dark:text-rose-100 dark:hover:bg-stone-800"
              >
                Unduh Tanpa Sandi
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-5 flex gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="min-h-11 flex-1 rounded-2xl border border-rose-200 text-sm font-semibold text-rose-900 active:scale-95 transition hover:bg-rose-50 dark:border-stone-700 dark:text-rose-100 dark:hover:bg-stone-800"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={busy}
              className="min-h-11 flex-1 rounded-2xl bg-rose-500 text-sm font-semibold text-white transition active:scale-95 hover:bg-rose-600 disabled:opacity-60"
            >
              {busy ? 'Memproses…' : 'Buka Kunci'}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
