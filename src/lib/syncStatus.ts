// Tracks whether a write to IndexedDB is currently in flight, so the UI can show a brief
// "Menyinkronkan…" indicator the way Docs/Sheets does — not tied to browser storage-persistence
// permission, which many browsers never auto-grant and would otherwise show forever.
//
// The indicator only appears after SHOW_DELAY_MS of a write still being in flight. Ordinary
// local IndexedDB writes finish in a few ms, well under that delay, so it never mounts for them
// — this is what keeps the header/sheet from visibly reflowing on every keystroke. It's reserved
// for genuinely slow operations (large import/export). Once shown, it stays up for at least
// MIN_VISIBLE_MS so it doesn't flash on/off before a single paint happens.
type Listener = () => void;

const SHOW_DELAY_MS = 1200;
const MIN_VISIBLE_MS = 400;

let activeWrites = 0;
let visible = false;
let shownAt = 0;
let showTimer: ReturnType<typeof setTimeout> | null = null;
let hideTimer: ReturnType<typeof setTimeout> | null = null;
const listeners = new Set<Listener>();

function notify() {
  listeners.forEach((l) => l());
}

export function beginSync() {
  activeWrites += 1;
  if (hideTimer) {
    clearTimeout(hideTimer);
    hideTimer = null;
  }
  if (!visible && !showTimer) {
    showTimer = setTimeout(() => {
      showTimer = null;
      if (activeWrites === 0) return;
      visible = true;
      shownAt = Date.now();
      notify();
    }, SHOW_DELAY_MS);
  }
}

export function endSync() {
  activeWrites = Math.max(0, activeWrites - 1);
  if (activeWrites > 0) return;

  if (showTimer) {
    clearTimeout(showTimer);
    showTimer = null;
  }
  if (!visible) return;

  const remaining = MIN_VISIBLE_MS - (Date.now() - shownAt);
  if (remaining > 0) {
    hideTimer = setTimeout(() => {
      hideTimer = null;
      visible = false;
      notify();
    }, remaining);
  } else {
    visible = false;
    notify();
  }
}

export function isSyncing() {
  return visible;
}

export function subscribeSyncStatus(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export async function withSync<T>(fn: () => Promise<T>): Promise<T> {
  beginSync();
  try {
    return await fn();
  } finally {
    endSync();
  }
}
