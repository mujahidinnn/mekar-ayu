const GLYPHS: Record<string, React.ReactNode> = {
  cr: (
    <>
      <path d="M12 10.5C10.5 7.5 6.5 6 3.5 7c0 3.2 2 5.6 5.5 6v3.5a3 3 0 0 0 6 0V13c3.5-.4 5.5-2.8 5.5-6-3-1-7 .5-8.5 3.5z" />
      <path d="M12 14v3" />
    </>
  ),
  hd: (
    <>
      <circle cx="12" cy="14.5" r="6.5" />
      <path d="M9 13l1.8 1-1.8 1M15 13l-1.8 1 1.8 1" />
      <path d="M10 18.2q2-1.4 4 0" />
      <path d="M12 2.5v2.5M5.5 4.5l1.6 1.8M18.5 4.5l-1.6 1.8" />
    </>
  ),
  ac: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 10q1-1.2 2 0M14 10q1-1.2 2 0" />
      <path d="M9.5 15.5q2.5 1.8 5 0" />
      <circle cx="6.5" cy="13.5" r="0.9" fill="currentColor" />
      <circle cx="17.5" cy="13.5" r="0.9" fill="currentColor" />
      <circle cx="12" cy="6" r="0.9" fill="currentColor" />
    </>
  ),
  bl: (
    <>
      <path d="M8.5 3c0 3-4.5 5-4.5 10a8 8 0 0 0 16 0c0-5-4.5-7-4.5-10" />
      <circle cx="12" cy="15" r="1" fill="currentColor" />
    </>
  ),
  ft: (
    <>
      <rect x="2.5" y="8" width="16" height="9" rx="2.5" />
      <path d="M21.5 11v3" />
      <path d="M6.5 11v3" />
    </>
  ),
  bk: (
    <>
      <path d="M9 3c4 3 4 7 2 10s-1 6 1 8" />
      <path d="M10 6.5h3.5M12 10h3.5M10.5 13.5H14M10 17h3.5" />
      <path d="M20 8l-2 3h2.5l-2 3" />
    </>
  ),
  tb: (
    <>
      <path d="M4 5.5c-1.2 6 1 11.5 4.5 11.5 2.3 0 3.5-2 3.5-4.5 0 2.5 1.2 4.5 3.5 4.5 3.5 0 5.7-5.5 4.5-11.5" />
      <circle cx="8.3" cy="13.2" r="0.9" fill="currentColor" />
      <circle cx="15.7" cy="13.2" r="0.9" fill="currentColor" />
    </>
  ),
  ns: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 9.5l2 1M16 9.5l-2 1" />
      <path d="M7.5 15.5q1.5-1.8 3 0t3 0 3 0" />
    </>
  ),
  cv: (
    <>
      <path d="M5.5 11.5a6.5 5.5 0 0 1 13 0z" />
      <path d="M6.5 11.5l1.5 9h8l1.5-9" />
      <path d="M10 14l.4 3.5M14 14l-.4 3.5" />
      <circle cx="12" cy="3.6" r="1.1" fill="currentColor" />
    </>
  ),
  in: (
    <>
      <path d="M2.5 15.5q9.5-8.5 19 0q-9.5 8.5-19 0z" />
      <circle cx="12" cy="15.5" r="2.5" />
      <path d="M17.5 2.5a3.6 3.6 0 1 0 4 4.6 3 3 0 0 1-4-4.6z" />
    </>
  ),
  dc: (
    <>
      <path d="M3 6h18v3.5c-4.5.8-7 4-7.5 9h-3C10 13.5 7.5 10.3 3 9.5z" />
      <path d="M12 9.2c-1 1.5-1 2.6 0 2.6s1-1.1 0-2.6z" />
    </>
  ),
  ba: (
    <>
      <circle cx="12" cy="4.8" r="2.3" />
      <path d="M12 7.5v7.5M12 15l-3 6M12 15l3 6M6.5 12.5l5.5-2.5 5.5 2.5" />
      <path d="M4 6.5l1.8 1.3M20 6.5l-1.8 1.3" />
    </>
  ),
  dr: (
    <>
      <path d="M6 3h4.5v8H6z" />
      <path d="M5 11h14.5c0 4-3 6.5-6 6.5h-3C7.5 17.5 5 15 5 11z" />
      <path d="M10.5 17.5V21h4v-3.7" />
    </>
  ),
  sp: (
    <>
      <path d="M12 3l9 16H3z" />
      <path d="M12 10v4" />
      <circle cx="12" cy="16.5" r="0.9" fill="currentColor" />
    </>
  ),
};

export function SymptomIcon({ symptom, size = 18, className = '' }: { symptom: string; size?: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={`${size / 16}rem`}
      height={`${size / 16}rem`}
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {GLYPHS[symptom] ?? <circle cx="12" cy="12" r="7" />}
    </svg>
  );
}
