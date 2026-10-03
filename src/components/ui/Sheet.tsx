import { useEffect, useRef } from 'react';
import type { PointerEvent as ReactPointerEvent, ReactNode } from 'react';
import { X } from 'lucide-react';

interface SheetProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

const DISMISS_HEIGHT_RATIO = 0.25;
const FLICK_MIN_DISTANCE_PX = 24;
const FLICK_VELOCITY_PX_PER_MS = 0.5;
const CLOSE_ANIMATION_MS = 200;

export function Sheet({ open, onClose, title, children }: SheetProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({ startY: 0, lastY: 0, lastTime: 0, velocity: 0, dragging: false });

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  const setTranslate = (y: number, animated: boolean) => {
    const panel = panelRef.current;
    if (!panel) return;
    panel.style.transition = animated ? 'transform 0.25s cubic-bezier(0.32, 0.72, 0, 1)' : 'none';
    panel.style.transform = y > 0 ? `translateY(${y}px)` : '';
  };

  const handlePointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('button')) return;
    const now = performance.now();
    dragRef.current = { startY: e.clientY, lastY: e.clientY, lastTime: now, velocity: 0, dragging: true };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag.dragging) return;
    const now = performance.now();
    const dt = now - drag.lastTime;
    if (dt > 0) drag.velocity = (e.clientY - drag.lastY) / dt;
    drag.lastY = e.clientY;
    drag.lastTime = now;
    const delta = e.clientY - drag.startY;
    if (delta > 0) setTranslate(delta, false);
  };

  const finishDrag = (endY: number | null) => {
    const drag = dragRef.current;
    if (!drag.dragging) return;
    drag.dragging = false;

    if (endY === null) {
      setTranslate(0, true);
      return;
    }
    const delta = endY - drag.startY;
    const panelHeight = panelRef.current?.offsetHeight ?? 400;
    const isFastFlick = delta > FLICK_MIN_DISTANCE_PX && drag.velocity > FLICK_VELOCITY_PX_PER_MS;

    if (delta > panelHeight * DISMISS_HEIGHT_RATIO || isFastFlick) {
      setTranslate(panelHeight, true);
      window.setTimeout(onClose, CLOSE_ANIMATION_MS);
    } else {
      setTranslate(0, true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 !m-0 flex items-end justify-center md:items-center md:p-6">
      <button aria-label="Tutup" className="absolute inset-0 bg-[#181818]/40 animate-fade-in" onClick={onClose} />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="relative max-h-[88vh] w-full max-w-md overflow-hidden rounded-t-[28px] bg-[var(--card)] md:max-w-xl md:rounded-[28px] lg:max-w-2xl shadow-2xl animate-slide-up"
      >
        <div className="max-h-[88vh] overflow-y-auto pb-[env(safe-area-inset-bottom)]">
          <div
            className="sticky top-0 z-10 flex touch-none select-none items-center justify-between bg-[var(--card)]/95 px-5 pb-3 pt-5 backdrop-blur cursor-grab active:cursor-grabbing"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={(e) => finishDrag(e.clientY)}
            onPointerCancel={() => finishDrag(null)}
          >
            <div className="absolute left-1/2 top-2 h-1.5 w-10 -translate-x-1/2 rounded-full bg-[var(--line)] md:hidden" />
            <h2 className="mt-2 text-lg font-extrabold">{title}</h2>
            <button
              onClick={onClose}
              aria-label="Tutup"
              className="mt-2 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--surface)] transition active:scale-95"
            >
              <X size={18} />
            </button>
          </div>
          <div className="px-5 pb-5 pt-2">{children}</div>
        </div>
      </div>
    </div>
  );
}
