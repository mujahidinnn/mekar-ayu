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
