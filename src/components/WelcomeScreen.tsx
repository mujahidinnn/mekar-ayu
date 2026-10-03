import { ArrowRight } from 'lucide-react';
import { Logo } from './Logo';

interface WelcomeScreenProps {
  onStart: () => void;
}

const PETAL = 'M0 0C-11 -12 -12 -30 0 -40C12 -30 11 -12 0 0Z';

export function Flower({ className, fill, rotate = 0 }: { className: string; fill: string; rotate?: number }) {
  return (
    <svg viewBox="-44 -44 88 88" className={className} aria-hidden="true">
      <g transform={`rotate(${rotate})`}>
        {[0, 72, 144, 216, 288].map((a) => (
          <path key={a} d={PETAL} fill={fill} transform={`rotate(${a})`} />
        ))}
      </g>
    </svg>
  );
}

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <div className="relative mx-auto flex min-h-screen max-w-md flex-col items-center justify-center overflow-hidden px-6 text-center text-[#181818]">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(172deg,#FDA9A8_0%,#F98FB3_18%,#FBA5D5_34%,#F1C4E6_52%,#EAC0EE_68%,#DCC0F2_82%,#F8EBF2_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_35%_at_100%_0%,rgba(255,190,150,0.85),transparent_70%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_30%_at_0%_100%,rgba(255,214,190,0.8),transparent_70%)]" />

      <div className="pointer-events-none absolute inset-0">
        <Flower className="absolute -left-20 -top-16 h-[22rem] w-[22rem]" fill="#ED6B89" rotate={18} />
        <Flower className="absolute -right-6 top-[17%] h-32 w-32" fill="#FFFFFF" rotate={-12} />
        <Flower className="absolute -left-10 top-[63%] h-32 w-32" fill="#FFFFFF" rotate={24} />
        <Flower className="absolute -bottom-24 -right-16 h-[24rem] w-[24rem]" fill="#945ACF" rotate={-8} />
      </div>

      <div className="relative z-10">
        <div className="mb-8 flex items-center justify-center gap-2.5">
          <Logo size={40} />
          <span className="text-xl font-bold tracking-tight">Mekar Ayu</span>
        </div>
        <h1 className="text-[2.75rem] font-bold leading-[1.08] tracking-tight">
          Nemenin kamu
          <br />
          di tiap fase
        </h1>
        <button
          onClick={onStart}
          className="mx-auto mt-8 flex items-center gap-4 rounded-full bg-white/60 py-2 pl-7 pr-2 text-base font-bold backdrop-blur-sm transition active:scale-[0.98]"
        >
          Yuk, Mulai
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#181818] text-white">
            <ArrowRight size={18} />
          </span>
        </button>
      </div>
    </div>
  );
}
