import type { Tab } from './BottomNav';

const GLYPHS: Record<Tab, { outline: React.ReactNode; solid: React.ReactNode }> = {
  home: {
    outline: (
      <>
        <path d="M4 11.2a2 2 0 0 1 .75-1.56l6-4.8a2 2 0 0 1 2.5 0l6 4.8A2 2 0 0 1 20 11.2v7.3a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" />
        <path d="M10 20.5v-4a2 2 0 0 1 4 0v4" />
      </>
    ),
    solid: (
      <>
        <path d="M4 11.2a2 2 0 0 1 .75-1.56l6-4.8a2 2 0 0 1 2.5 0l6 4.8A2 2 0 0 1 20 11.2v7.3a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" fill="currentColor" />
        <path d="M10.2 20.5v-4a1.8 1.8 0 0 1 3.6 0v4z" fill="var(--card)" stroke="var(--card)" strokeWidth="0.6" />
      </>
    ),
  },
  calendar: {
    outline: (
      <>
        <rect x="4" y="5" width="16" height="15.5" rx="4" />
        <path d="M4 10h16M8.5 3v3.5M15.5 3v3.5" />
        <circle cx="9" cy="14.5" r="1.1" fill="currentColor" stroke="none" />
        <circle cx="15" cy="14.5" r="1.1" fill="currentColor" stroke="none" />
      </>
    ),
    solid: (
      <>
        <rect x="4" y="5" width="16" height="15.5" rx="4" fill="currentColor" />
        <path d="M8.5 3v3.5M15.5 3v3.5" />
        <path d="M6 10h12" stroke="var(--card)" strokeWidth="1.5" />
        <circle cx="9" cy="14.8" r="1.3" fill="var(--card)" stroke="none" />
        <circle cx="15" cy="14.8" r="1.3" fill="var(--card)" stroke="none" />
      </>
    ),
  },
  stats: {
    outline: (
      <>
        <rect x="4" y="12" width="4" height="8.5" rx="2" />
        <rect x="10" y="7.5" width="4" height="13" rx="2" />
        <rect x="16" y="3.5" width="4" height="17" rx="2" />
      </>
    ),
    solid: (
      <>
        <rect x="3.5" y="11.5" width="5" height="9.5" rx="2.5" fill="currentColor" stroke="none" />
        <rect x="9.5" y="7" width="5" height="14" rx="2.5" fill="currentColor" stroke="none" />
        <rect x="15.5" y="3" width="5" height="18" rx="2.5" fill="currentColor" stroke="none" />
      </>
    ),
  },
  more: {
    outline: (
      <>
        <rect x="4" y="4" width="7" height="7" rx="2.5" />
        <rect x="13" y="4" width="7" height="7" rx="2.5" />
        <rect x="4" y="13" width="7" height="7" rx="2.5" />
        <circle cx="16.5" cy="16.5" r="3.5" />
      </>
    ),
    solid: (
      <>
        <rect x="3.5" y="3.5" width="8" height="8" rx="2.8" fill="currentColor" stroke="none" />
        <rect x="12.5" y="3.5" width="8" height="8" rx="2.8" fill="currentColor" stroke="none" />
        <rect x="3.5" y="12.5" width="8" height="8" rx="2.8" fill="currentColor" stroke="none" />
        <circle cx="16.5" cy="16.5" r="4" fill="currentColor" stroke="none" />
      </>
    ),
  },
};

export function NavIcon({ tab, active, size = 24 }: { tab: Tab; active: boolean; size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {active ? GLYPHS[tab].solid : GLYPHS[tab].outline}
    </svg>
  );
}
