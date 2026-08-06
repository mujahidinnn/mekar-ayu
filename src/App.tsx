import { useEffect, useRef, useState } from 'react';
import { addMonths, format, subMonths } from 'date-fns';
import { Plus } from 'lucide-react';
import { Header } from './components/Header';
import { CalendarGrid } from './components/CalendarGrid';
import { BottomSheetLogEditor } from './components/BottomSheetLogEditor';
import { EducationCard } from './components/EducationCard';
import { RedFlagBanner } from './components/RedFlagBanner';
import { SettingsSheet } from './components/SettingsSheet';
import { UpdateToast } from './components/UpdateToast';
import { useCycleAnalytics } from './hooks/useCycleAnalytics';
import { usePwaUpdate } from './hooks/usePwaUpdate';
import { useStorageMonitor } from './hooks/useStorageMonitor';
import { useSyncStatus } from './hooks/useSyncStatus';
import { useTheme } from './hooks/useTheme';

const MIN_SPLASH_MS = 400;

function App() {
  const [visibleMonth, setVisibleMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const { stats, cycles, dailyLogs, isLoading } = useCycleAnalytics();
  const { usageKB, recordCount, isPersisted, refreshStorage } = useStorageMonitor();
  const { preference: themePreference, setTheme } = useTheme();
  const { needRefresh, offlineReady, applyUpdate, dismissNeedRefresh, dismissOfflineReady } = usePwaUpdate();

  // navigator.storage.estimate() has no native "changed" event, so the header's storage
  // size is kept fresh by re-checking right after each save finishes (isSaving true -> false).
  const isSaving = useSyncStatus();
  const wasSaving = useRef(false);
  useEffect(() => {
    if (wasSaving.current && !isSaving) refreshStorage();
    wasSaving.current = isSaving;
  }, [isSaving, refreshStorage]);

  // #splash is a plain DOM node painted inline in index.html so it appears before the JS
  // bundle even loads. It's dismissed here once the first cycle data query resolves, held
  // for a minimum stretch so it doesn't flash on/off on devices where that query is instant.
  const mountedAt = useRef(Date.now());
  useEffect(() => {
    if (isLoading) return;
    const splash = document.getElementById('splash');
    if (!splash) return;
    const wait = Math.max(0, MIN_SPLASH_MS - (Date.now() - mountedAt.current));
    const timer = setTimeout(() => {
      splash.classList.add('splash-hide');
      splash.addEventListener('transitionend', () => splash.remove(), { once: true });
    }, wait);
    return () => clearTimeout(timer);
  }, [isLoading]);

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col bg-rose-50/50 dark:bg-stone-950">
      <Header
        visibleMonth={visibleMonth}
        onPrevMonth={() => setVisibleMonth((m) => subMonths(m, 1))}
        onNextMonth={() => setVisibleMonth((m) => addMonths(m, 1))}
        onToday={() => setVisibleMonth(new Date())}
        statusLabel={stats.statusLabel}
        currentPhase={stats.currentPhase}
        usageKB={usageKB}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      <main className="flex-1 space-y-4 pb-28 pt-2">
        <RedFlagBanner flags={stats.redFlags} />

        <CalendarGrid
          visibleMonth={visibleMonth}
          stats={stats}
          dailyLogs={dailyLogs}
          onSelectDate={setSelectedDate}
          onSwipePrev={() => setVisibleMonth((m) => subMonths(m, 1))}
          onSwipeNext={() => setVisibleMonth((m) => addMonths(m, 1))}
        />

        <EducationCard phase={stats.currentPhase} />
      </main>

      <div className="pointer-events-none fixed inset-x-0 bottom-6 z-20 mx-auto flex max-w-md justify-end px-6">
        <button
          onClick={() => setSelectedDate(format(new Date(), 'yyyy-MM-dd'))}
          aria-label="Catat hari ini"
          className="pointer-events-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-500 text-white shadow-lg shadow-rose-500/30 active:scale-95 transition dark:bg-rose-600 dark:shadow-black/40"
        >
          <Plus size={26} />
        </button>
      </div>

      <UpdateToast
        needRefresh={needRefresh}
        offlineReady={offlineReady}
        onApplyUpdate={applyUpdate}
        onDismissNeedRefresh={dismissNeedRefresh}
        onDismissOfflineReady={dismissOfflineReady}
      />

      <BottomSheetLogEditor dateStr={selectedDate} onClose={() => setSelectedDate(null)} />

      <SettingsSheet
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onRefreshStorage={refreshStorage}
        cycles={cycles}
        dailyLogs={dailyLogs}
        stats={stats}
        usageKB={usageKB}
        recordCount={recordCount}
        isPersisted={isPersisted}
        themePreference={themePreference}
        onThemeChange={setTheme}
      />
    </div>
  );
}

export default App;
