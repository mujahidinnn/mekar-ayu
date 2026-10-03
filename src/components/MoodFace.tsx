const FACE_COLORS: Record<string, string> = {
  hp: '#FFA7DC',
  ir: '#F47C7C',
  ax: '#D7C2F7',
  sd: '#B5D3F9',
  en: '#8E8CE6',
  cl: '#F9B892',
  cf: '#BFE8D2',
  ss: '#A8DDE0',
  st: '#FFE3A3',
  um: '#D9C7B8',
};

const INK = '#181818';
const S = { stroke: INK, strokeWidth: 4.5, strokeLinecap: 'round' as const, fill: 'none' };

export function FaceDetails({ mood }: { mood: string }) {
  switch (mood) {
    case 'hp':
      return (
        <>
          <path d="M28 40q6-6 12 0" {...S} />
          <path d="M52 40q6-6 12 0" {...S} />
          <path d="M32 54c6 8 22 8 28 0" {...S} strokeWidth={5} />
        </>
      );
    case 'ir':
      return (
        <>
          <path d="M26 36l14 6M66 36l-14 6" {...S} />
          <circle cx="34" cy="49" r="3.5" fill={INK} />
          <circle cx="58" cy="49" r="3.5" fill={INK} />
          <path d="M34 66q12-8 24 0" {...S} strokeWidth={5} />
        </>
      );
    case 'ax':
      return (
        <>
          <circle cx="34" cy="42" r="4" fill={INK} />
          <circle cx="58" cy="42" r="4" fill={INK} />
          <path d="M32 62q4-4 8 0t8 0t8 0t8 0" {...S} />
        </>
      );
    case 'sd':
      return (
        <>
          <path d="M28 42q6 4 12 0" {...S} />
          <path d="M52 42q6 4 12 0" {...S} />
          <path d="M34 66q12-10 24 0" {...S} strokeWidth={5} />
          <circle cx="63" cy="52" r="3" fill={INK} opacity="0.35" />
        </>
      );
    case 'en':
      return (
        <>
          <circle cx="34" cy="42" r="6" fill="white" stroke={INK} strokeWidth="3" />
          <circle cx="58" cy="42" r="6" fill="white" stroke={INK} strokeWidth="3" />
          <circle cx="35" cy="42" r="2.5" fill={INK} />
          <circle cx="59" cy="42" r="2.5" fill={INK} />
          <ellipse cx="46" cy="62" rx="9" ry="6" fill={INK} />
        </>
      );
    case 'cf':
      return (
        <>
          <path d="M28 42q6-6 12 0" {...S} />
          <circle cx="58" cy="41" r="4" fill={INK} />
          <path d="M33 57q14 13 27-3" {...S} strokeWidth={5} />
        </>
      );
    case 'ss':
      return (
        <>
          <path d="M27 33l12-4M65 33l-12-4" {...S} />
          <circle cx="34" cy="43" r="4" fill={INK} />
          <circle cx="58" cy="43" r="4" fill={INK} />
          <path d="M34 51c-3 5-3 8 0 8s3-3 0-8z" fill={INK} opacity="0.35" />
          <path d="M58 51c-3 5-3 8 0 8s3-3 0-8z" fill={INK} opacity="0.35" />
          <path d="M39 68q7-6 14 0" {...S} strokeWidth={5} />
        </>
      );
    case 'st':
      return (
        <>
          <path d="M28 36l10 6-10 6" {...S} strokeLinejoin="round" />
          <path d="M64 36l-10 6 10 6" {...S} strokeLinejoin="round" />
          <path d="M31 65l5-5 5 5 5-5 5 5 5-5 5 5" {...S} strokeLinejoin="round" />
        </>
      );
    case 'um':
      return (
        <>
          <path d="M27 40h14" {...S} />
          <path d="M51 40h14" {...S} />
          <circle cx="34" cy="47" r="3" fill={INK} />
          <circle cx="58" cy="47" r="3" fill={INK} />
          <path d="M40 64h14" {...S} strokeWidth={5} />
        </>
      );
    case 'cl':
    default:
      return (
        <>
          <path d="M27 43h14" {...S} />
          <path d="M51 43h14" {...S} />
          <path d="M36 60c5 4 15 4 20 0" {...S} strokeWidth={5} />
        </>
      );
  }
}

interface MoodFaceProps {
  mood: string;
  size?: number;
  className?: string;
}

export function MoodFace({ mood, size = 40, className = '' }: MoodFaceProps) {
  const color = FACE_COLORS[mood] ?? '#E8E3E6';
  return (
    <svg viewBox="0 0 92 92" width={size} height={size} className={className} role="img" aria-label={mood}>
      <rect width="92" height="92" rx="28" fill={color} />
      <FaceDetails mood={mood} />
    </svg>
  );
}
