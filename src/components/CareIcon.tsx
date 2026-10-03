const GLYPHS: Record<string, React.ReactNode> = {
  Kenyamanan: (
    <>
      <path d="M10 2.5h4M10.5 2.5v2.5M13.5 2.5v2.5" strokeWidth="1.5" />
      <path d="M10.5 5C7.5 6 6 8.5 6 12v6a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3v-6c0-3.5-1.5-6-4.5-7z" strokeWidth="1.6" />
      <path d="M12 16.800s-3-1.8-3-3.900a1.6 1.6 0 0 1 3-.7 1.6 1.6 0 0 1 3 .7c0 2.1-3 3.9-3 3.900z" fill="currentColor" strokeWidth="1" />
    </>
  ),
  Nutrisi: (
    <>
      <path d="M3.5 12h17a8.5 8.5 0 0 1-17 0z" strokeWidth="1.6" />
      <path d="M9 21h6" strokeWidth="1.6" />
      <path d="M8 11c-.6-3 .8-5.2 3.8-6 .6 3-.8 5.2-3.8 6z" fill="currentColor" strokeWidth="1" />
      <path d="M12.5 11c.2-2.6 1.9-4.2 4.8-4.3-.2 2.6-1.9 4.2-4.8 4.300z" fill="currentColor" strokeWidth="1" />
      <circle cx="6" cy="9" r="1.2" fill="currentColor" stroke="none" />
    </>
  ),
  Hidrasi: (
    <>
      <path d="M4 10h12v4a5.5 5.5 0 0 1-5.5 5.500h-1A5.5 5.5 0 0 1 4 14z" strokeWidth="1.6" />
      <path d="M16 11.500h1.300a2.7 2.7 0 0 1 0 5.400H15.5" strokeWidth="1.6" />
      <path d="M4 22h12" strokeWidth="1.6" />
      <path d="M8 6.500q1.5-1.5 0-3M12 6.500q1.5-1.5 0-3" strokeWidth="1.5" />
      <path d="M10 16.500c-2-.6-2.8-2-2.4-4 2 .6 2.8 2 2.4 4z" fill="currentColor" strokeWidth="1" />
    </>
  ),
  Aktivitas: (
    <>
      <circle cx="14.5" cy="4.5" r="1.8" />
      <path d="M13 3.600c-1.9-1-3.7-.5-4.8 1.3 1.9.9 3.6.4 4.8-1.300z" fill="currentColor" strokeWidth="1" />
      <path d="M13.5 8.5L11 13.5" />
      <path d="M13.5 8.5l3.5 2.5 2.5-1.500M13.5 8.500l-4 .5-2 3" />
      <path d="M11 13.5l3.5 2.5-.5 4.500M11 13.500l-2 3.5-4 1" />
    </>
  ),
  'Perawatan Kulit': (
    <>
      <circle cx="11" cy="14" r="7.5" strokeWidth="1.6" />
      <path d="M4.2 11.200q6.8-3.6 13.6 0" strokeWidth="1.5" />
      <path d="M11 6.500c-1.6-2.6-4.2-2.9-4.2-1.2 0 1.6 2.4 1.9 4.2 1.200zM11 6.500c1.6-2.6 4.2-2.9 4.2-1.2 0 1.6-2.4 1.9-4.2 1.200z" fill="currentColor" strokeWidth="1" />
      <path d="M7.2 14.300q1.3-1.6 2.6 0M12.2 14.300q1.3-1.6 2.6 0" strokeWidth="1.5" />
      <path d="M9.2 17.200q1.8 1.5 3.6 0" strokeWidth="1.5" />
      <circle cx="6.9" cy="16.6" r="1" fill="#fff" stroke="none" opacity="0.75" />
      <circle cx="15.1" cy="16.6" r="1" fill="#fff" stroke="none" opacity="0.75" />
      <path d="M20.5 3c.3 1.7.9 2.3 2.5 2.5-1.6.3-2.2.9-2.5 2.5-.3-1.6-.9-2.2-2.5-2.5 1.6-.2 2.2-.8 2.5-2.500z" fill="currentColor" strokeWidth="0.8" />
    </>
  ),
  'Kesadaran Kesuburan': (
    <>
      <rect x="3.5" y="5" width="17" height="15.5" rx="3.5" strokeWidth="1.6" />
      <path d="M3.5 9.500h17M8 3v3.500M16 3v3.5" strokeWidth="1.6" />
      <path d="M12 18.200s-3.3-2-3.3-4.300a1.750 1.750 0 0 1 3.3-.8 1.750 1.750 0 0 1 3.3.8c0 2.3-3.3 4.3-3.3 4.300z" fill="currentColor" strokeWidth="1" />
    </>
  ),
  Istirahat: (
    <>
      <path d="M16.5 15.500A7.5 7.5 0 0 1 8 5a7.5 7.5 0 1 0 8.5 10.500z" fill="currentColor" strokeWidth="1.5" />
      <path d="M15 3.500h3.500L15 7.500h3.5" strokeWidth="1.5" />
      <path d="M20 10.500h2l-2 2.500h2" strokeWidth="1.2" />
    </>
  ),
  Haid: (
    <>
      <path d="M12 2.5s7 7.2 7 12a7 7 0 0 1-14 0c0-4.8 7-12 7-12z" fill="currentColor" strokeWidth="1.5" />
      <path d="M8.8 14.5a3.2 3.2 0 0 0 3.2 3.2" stroke="#fff" strokeWidth="1.5" opacity="0.8" />
    </>
  ),
  Folikuler: (
    <>
      <path d="M12 21.500v-9" strokeWidth="1.7" />
      <path d="M12 12.500C12 8 9 5.5 4.5 5.500c0 4.5 3 7 7.5 7z" fill="currentColor" strokeWidth="1.2" />
      <path d="M12 15.500c0-3.5 2.5-5.5 6.5-5.5 0 3.5-2.5 5.5-6.5 5.500z" fill="currentColor" strokeWidth="1.2" />
      <path d="M7.5 21.500h9" strokeWidth="1.7" />
    </>
  ),
  Ovulasi: (
    <>
      <g fill="currentColor" stroke="none">
        <circle cx="12" cy="6" r="3.6" />
        <circle cx="17.7" cy="10.150" r="3.6" />
        <circle cx="15.530" cy="16.850" r="3.6" />
        <circle cx="8.470" cy="16.850" r="3.6" />
        <circle cx="6.3" cy="10.150" r="3.6" />
      </g>
      <circle cx="12" cy="12" r="2.3" fill="#fff" stroke="none" />
    </>
  ),
  Luteal: (
    <>
      <path d="M18.5 15.500A8 8 0 0 1 9 4a8 8 0 1 0 9.5 11.500z" fill="currentColor" strokeWidth="1.5" />
      <path d="M17.5 3.500c.3 1.7.9 2.3 2.5 2.5-1.6.3-2.2.9-2.5 2.5-.3-1.6-.9-2.2-2.5-2.5 1.6-.2 2.2-.8 2.5-2.500z" fill="currentColor" strokeWidth="0.8" />
    </>
  ),
};

export function CareIcon({ name, size = 18 }: { name: string; size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {GLYPHS[name] ?? <circle cx="12" cy="12" r="7" />}
    </svg>
  );
}
