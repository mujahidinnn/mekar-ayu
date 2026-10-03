import { useEffect, useRef, useState } from 'react';
import { addMonths, format, subMonths } from 'date-fns';
import type { Tab } from './components/BottomNav';
import { BottomNav } from './components/BottomNav';
import { WelcomeScreen } from './components/WelcomeScreen';
import { HomeScreen } from './components/screens/HomeScreen';
import { CalendarScreen } from './components/screens/CalendarScreen';
import { StatsScreen } from './components/screens/StatsScreen';
import { MoreScreen } from './components/screens/MoreScreen';
import { BottomSheetLogEditor } from './components/BottomSheetLogEditor';
import { UpdateToast } from './components/UpdateToast';
import { useCycleAnalytics } from './hooks/useCycleAnalytics';
import { usePwaUpdate } from './hooks/usePwaUpdate';
import { useStorageMonitor } from './hooks/useStorageMonitor';
import { useSyncStatus } from './hooks/useSyncStatus';
import { useTheme } from './hooks/useTheme';

const MIN_SPLASH_MS = 400;
const ONBOARDED_KEY = 'mekarayu_onboarded';

function App() {
  const [visibleMonth, setVisibleMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>('home');
  const [onboarded, setOnboarded] = useState(() => localStorage.getItem(ONBOARDED_KEY) === '1');

  const { stats, cycles, dailyLogs, isLoading } = useCycleAnalytics();
  const todayLog = dailyLogs.find((l) => l.date === format(new Date(), 'yyyy-MM-dd'));
  const { usageKB, recordCount, isPersisted, refreshStorage } = useStorageMonitor();
  const { preference: themePreference, setTheme } = useTheme();
  const { needRefresh, offlineReady, applyUpdate, dismissNeedRefresh, dismissOfflineReady } = usePwaUpdate();

  const isSaving = useSyncStatus();
  const wasSaving = useRef(false);
  useEffect(() => {
    if (wasSaving.current && !isSaving) refreshStorage();
    wasSaving.current = isSaving;
  }, [isSaving, refreshStorage]);

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

  if (!onboarded) {
    return (
      <WelcomeScreen
        onStart={() => {
          localStorage.setItem(ONBOARDED_KEY, '1');
          setOnboarded(true);
        }}
      />
    );
  }

  const openToday = () => setSelectedDate(format(new Date(), 'yyyy-MM-dd'));
  const monthNav = {
    visibleMonth,
    onPrevMonth: () => setVisibleMonth((m) => subMonths(m, 1)),
    onNextMonth: () => setVisibleMonth((m) => addMonths(m, 1)),
    onToday: () => setVisibleMonth(new Date()),
    onSelectDate: setSelectedDate,
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col">
      {tab === 'home' && <HomeScreen stats={stats} todayLog={todayLog} onOpenLogEditor={openToday} onSeeAll={() => setTab('calendar')} />}
      {tab === 'calendar' && <CalendarScreen {...monthNav} stats={stats} dailyLogs={dailyLogs} />}
      {tab === 'stats' && <StatsScreen {...monthNav} stats={stats} cycles={cycles} dailyLogs={dailyLogs} />}
      {tab === 'more' && (
        <MoreScreen
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
      )}

      <BottomNav active={tab} onChange={setTab} />

      <UpdateToast
        needRefresh={needRefresh}
        offlineReady={offlineReady}
        onApplyUpdate={applyUpdate}
        onDismissNeedRefresh={dismissNeedRefresh}
        onDismissOfflineReady={dismissOfflineReady}
      />

      <BottomSheetLogEditor dateStr={selectedDate} onClose={() => setSelectedDate(null)} />
    </div>
  );
}

export default App;
