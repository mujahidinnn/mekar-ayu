import { useState } from 'react';
import { Sheet } from './ui/Sheet';
import { Share, ListPlus, LayoutGrid, Menu, DownloadCloud, Smartphone } from 'lucide-react';

interface PwaInstallSheetProps {
  open: boolean;
  onClose: () => void;
}

type Platform = 'ios' | 'android';

const STEPS: Record<Platform, { icon: React.ReactNode; title: string; description: string }[]> = {
  ios: [
    {
      icon: <Share size={20} />,
      title: 'Ketuk tombol Share',
      description: 'Di Safari, ketuk ikon Share (kotak dengan panah ke atas) di bagian bawah layar.',
    },
    {
      icon: <ListPlus size={20} />,
      title: 'Pilih "Add to Home Screen"',
      description: 'Scroll ke bawah pada daftar menu, lalu ketuk "Tambah ke Layar Utama" / "Add to Home Screen".',
    },
    {
      icon: <Smartphone size={20} />,
      title: 'Ketuk "Add" / "Tambah"',
      description: 'Konfirmasi nama aplikasi lalu ketuk "Add" di pojok kanan atas.',
    },
    {
      icon: <LayoutGrid size={20} />,
      title: 'Selesai!',
      description: 'Ikon Mekar Ayu akan muncul di layar utama HP-mu, bisa dibuka seperti aplikasi biasa tanpa membuka browser.',
    },
  ],
  android: [
    {
      icon: <Menu size={20} />,
      title: 'Ketuk menu titik tiga',
      description: 'Di Chrome, ketuk ikon titik tiga (⋮) di pojok kanan atas.',
    },
    {
      icon: <DownloadCloud size={20} />,
      title: 'Pilih "Install app"',
      description: 'Cari dan ketuk "Install app" atau "Tambahkan ke layar Utama" pada menu yang muncul.',
    },
    {
      icon: <Smartphone size={20} />,
      title: 'Ketuk "Install" / "Pasang"',
      description: 'Konfirmasi pemasangan pada dialog yang muncul.',
    },
    {
      icon: <LayoutGrid size={20} />,
      title: 'Selesai!',
      description: 'Mekar Ayu akan terpasang seperti aplikasi native, lengkap dengan ikonnya sendiri di layar utama.',
    },
  ],
};

export function PwaInstallSheet({ open, onClose }: PwaInstallSheetProps) {
  const [platform, setPlatform] = useState<Platform>('ios');

  return (
    <Sheet open={open} onClose={onClose} title="Cara Pasang ke Layar Utama">
      <div className="space-y-5 pb-4">
        <p className="text-sm text-rose-900/70 dark:text-stone-300">
          Pasang Mekar Ayu ke layar utama HP-mu agar bisa dibuka seperti aplikasi biasa, lebih cepat, bisa dipakai offline, dan tetap 100%
          tersimpan lokal di perangkatmu.
        </p>

        <div className="flex rounded-full bg-rose-50 p-1 dark:bg-stone-800">
          <button
            onClick={() => setPlatform('ios')}
            className={`flex-1 rounded-full py-2 text-sm font-semibold transition ${
              platform === 'ios' ? 'bg-white text-rose-950 shadow-sm dark:bg-stone-700 dark:text-rose-50' : 'text-rose-900/60 dark:text-stone-400'
            }`}
          >
            iPhone (Safari)
          </button>
          <button
            onClick={() => setPlatform('android')}
            className={`flex-1 rounded-full py-2 text-sm font-semibold transition ${
              platform === 'android'
                ? 'bg-white text-rose-950 shadow-sm dark:bg-stone-700 dark:text-rose-50'
                : 'text-rose-900/60 dark:text-stone-400'
            }`}
          >
            Android (Chrome)
          </button>
        </div>

        <ol className="space-y-4">
          {STEPS[platform].map((step, i) => (
            <li key={step.title} className="flex gap-3">
              <div className="flex shrink-0 flex-col items-center">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-400">
                  {step.icon}
                </span>
                {i < STEPS[platform].length - 1 && <span className="mt-1 h-full w-px flex-1 bg-rose-100 dark:bg-stone-700" />}
              </div>
              <div className="pb-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-rose-400">Langkah {i + 1}</p>
                <p className="text-sm font-semibold text-rose-950 dark:text-rose-50">{step.title}</p>
                <p className="mt-0.5 text-sm text-rose-900/70 dark:text-stone-300">{step.description}</p>
              </div>
            </li>
          ))}
        </ol>

        <p className="rounded-2xl bg-amber-50 p-3 text-xs text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
          Tampilan menu bisa sedikit berbeda tergantung versi browser. Fitur ini butuh Safari (iPhone) atau Chrome/Edge (Android); beberapa
          browser lain mungkin tidak mendukung "Add to Home Screen".
        </p>
      </div>
    </Sheet>
  );
}
