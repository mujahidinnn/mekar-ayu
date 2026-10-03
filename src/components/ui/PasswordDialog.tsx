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
        className="w-full rounded-xl bg-[var(--surface)] px-3 py-2.5 pr-10 text-sm text-[var(--ink)] outline-none focus:ring-2 focus:ring-[var(--ink)]"
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
        className="absolute right-0 top-0 flex h-full w-10 items-center justify-center text-[var(--muted)]"
      >
        {visible ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  );
}

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
      setLocalError('Kedua kata sandinya belum sama. Cek lagi, ya.');
      return;
    }
    setLocalError(null);
    onSubmit(password);
  };

  return (
    <div className="fixed inset-0 z-[60] !m-0 flex items-center justify-center p-6">
      <button aria-label="Batal" className="absolute inset-0 bg-[#181818]/50 animate-fade-in" onClick={onCancel} />
      <form onSubmit={handleSubmit} className="relative w-full max-w-sm rounded-3xl bg-[var(--card)] p-5 shadow-2xl animate-fade-in">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FFA7DC] text-[#181818]">
            <Lock size={16} />
          </span>
          <h3 className="text-base font-bold text-[var(--ink)]">{title}</h3>
        </div>
        {description && <div className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{description}</div>}

        <div className="mt-4 space-y-2">
          <PasswordField value={password} onChange={setPassword} placeholder="Kata sandi" />
          {mode === 'set' && <PasswordField value={confirm} onChange={setConfirm} placeholder="Ulangi kata sandi" />}
          {(localError || error) && <p className="text-xs font-medium text-red-600 dark:text-red-400">{localError || error}</p>}
        </div>

        {mode === 'set' && onSkip ? (
          <div className="mt-5 space-y-2">
            <button
              type="submit"
              disabled={busy}
              className="min-h-11 w-full rounded-2xl bg-[var(--ink)] text-sm font-semibold text-white dark:text-[#181818] transition active:scale-95 disabled:opacity-60"
            >
              {busy ? 'Memproses…' : 'Kunci & Unduh'}
            </button>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onCancel}
                className="min-h-11 flex-1 rounded-2xl bg-[var(--surface)] text-sm font-semibold text-[var(--ink)] active:scale-95 transition"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={onSkip}
                className="min-h-11 flex-1 rounded-2xl bg-[var(--surface)] text-sm font-semibold text-[var(--ink)] active:scale-95 transition"
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
              className="min-h-11 flex-1 rounded-2xl bg-[var(--surface)] text-sm font-semibold text-[var(--ink)] active:scale-95 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={busy}
              className="min-h-11 flex-1 rounded-2xl bg-[var(--ink)] text-sm font-semibold text-white dark:text-[#181818] transition active:scale-95 disabled:opacity-60"
            >
              {busy ? 'Memproses…' : 'Buka Kunci'}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
