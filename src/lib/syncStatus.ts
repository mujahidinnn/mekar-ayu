// Tracks whether a write to IndexedDB is currently in flight, so the UI can show a brief
// "Menyinkronkan…" indicator the way Docs/Sheets does — not tied to browser storage-persistence
// permission, which many browsers never auto-grant and would otherwise show forever.
//
// Once shown, the indicator stays up for at least MIN_VISIBLE_MS. Small writes can resolve
// within the same microtask batch React uses to flush state, which would otherwise make the
// "on" state invisible — shown and hidden before a single paint ever happens.
type Listener = () => void;

const MIN_VISIBLE_MS = 400;

let activeWrites = 0;
let visible = false;
let shownAt = 0;
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
  if (!visible) {
    visible = true;
    shownAt = Date.now();
    notify();
  }
}

export function endSync() {
  activeWrites = Math.max(0, activeWrites - 1);
  if (activeWrites > 0) return;

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
