export type PhaseKey = 'menstrual' | 'follicular' | 'ovulatory' | 'luteal';

export interface PhaseInfo {
  key: PhaseKey;
  label: string;
  dayRange: string;
  color: string; // tailwind bg class for badges
  textColor: string;
  hormonal: string;
  bodyExperience: string;
  selfCare: { title: string; tip: string }[];
}

export const PHASES: Record<PhaseKey, PhaseInfo> = {
  menstrual: {
    key: 'menstrual',
    label: 'Fase Menstruasi',
    dayRange: 'Hari 1–5/7',
    color: 'bg-rose-600',
    textColor: 'text-rose-600',
    hormonal: 'Estrogen dan Progesteron berada di titik terendah saat lapisan rahim meluruh.',
    bodyExperience: 'Nyeri punggung bawah, kram rahim (dismenore), kelelahan, energi fisik rendah.',
    selfCare: [
      { title: 'Kenyamanan', tip: 'Gunakan bantal/kompres hangat di perut bagian bawah untuk merelaksasi otot rahim.' },
      { title: 'Nutrisi', tip: 'Konsumsi makanan kaya zat besi (bayam, daging merah, kacang lentil) dipadukan Vitamin C.' },
      { title: 'Hidrasi', tip: 'Minum teh herbal hangat (jahe atau chamomile) untuk mengurangi kembung dan kram.' },
    ],
  },
  follicular: {
    key: 'follicular',
    label: 'Fase Folikuler',
    dayRange: 'Hari 6–13',
    color: 'bg-emerald-400',
    textColor: 'text-emerald-600',
    hormonal: 'Kelenjar hipofisis melepaskan FSH; Estrogen meningkat secara bertahap.',
    bodyExperience: 'Energi fisik meningkat, mood membaik, kulit lebih cerah, fokus mental meningkat.',
    selfCare: [
      { title: 'Aktivitas', tip: 'Waktu ideal untuk olahraga intensitas tinggi, proyek kreatif, dan aktivitas sosial.' },
      { title: 'Perawatan Kulit', tip: 'Kulit alami lebih cerah karena estrogen meningkat; hidrasi ringan sudah cukup.' },
    ],
  },
  ovulatory: {
    key: 'ovulatory',
    label: 'Fase Ovulasi',
    dayRange: 'Hari ke-14 / Pertengahan Siklus',
    color: 'bg-purple-300',
    textColor: 'text-purple-600',
    hormonal: 'Lonjakan Hormon Luteinizing (LH) memicu pelepasan sel telur matang. Estrogen mencapai puncaknya.',
    bodyExperience: 'Lendir serviks subur (bening, elastis seperti putih telur), sedikit peningkatan suhu tubuh, libido meningkat, nyeri panggul ringan sesisi (Mittelschmerz).',
    selfCare: [
      { title: 'Kesadaran Kesuburan', tip: 'Ini adalah jendela subur puncak bagi yang merencanakan kehamilan atau memantau kontrasepsi.' },
    ],
  },
  luteal: {
    key: 'luteal',
    label: 'Fase Luteal',
    dayRange: 'Hari 15–28',
    color: 'bg-amber-300',
    textColor: 'text-amber-600',
    hormonal: 'Progesteron mendominasi untuk menebalkan lapisan rahim. Jika tidak ada pembuahan, hormon turun drastis menjelang akhir fase.',
    bodyExperience: 'Gejala PMS: nyeri payudara, kembung, retensi cairan, mudah tersinggung, ngidam makanan, jerawat.',
    selfCare: [
      { title: 'Nutrisi', tip: 'Kurangi asupan natrium dan gula olahan untuk meminimalkan retensi air dan perubahan mood.' },
      { title: 'Istirahat', tip: 'Prioritaskan tidur 7–8 jam berkualitas; beralih ke yoga ringan atau jalan kaki.' },
    ],
  },
};

export const SYMPTOM_OPTIONS = [
  { key: 'cramps', label: 'Kram', emoji: '\u{1FA79}' },
  { key: 'headache', label: 'Sakit Kepala', emoji: '\u{1F915}' },
  { key: 'acne', label: 'Jerawat', emoji: '\u{1F914}' },
  { key: 'bloating', label: 'Kembung', emoji: '\u{1F6AB}' },
  { key: 'fatigue', label: 'Lelah', emoji: '\u{1F634}' },
  { key: 'backache', label: 'Nyeri Punggung', emoji: '\u{1F9B4}' },
  { key: 'tender_breasts', label: 'Payudara Nyeri', emoji: '\u{1F318}' },
  { key: 'nausea', label: 'Mual', emoji: '\u{1F922}' },
  { key: 'severe_pain', label: 'Nyeri Hebat (mengganggu aktivitas)', emoji: '\u{1F6A8}' },
] as const;

export const MOOD_OPTIONS = [
  { key: 'happy', label: 'Bahagia', emoji: '\u{1F60A}' },
  { key: 'irritable', label: 'Mudah Marah', emoji: '\u{1F624}' },
  { key: 'anxious', label: 'Cemas', emoji: '\u{1F630}' },
  { key: 'sad', label: 'Sedih', emoji: '\u{1F622}' },
  { key: 'energetic', label: 'Berenergi', emoji: '\u{26A1}' },
  { key: 'calm', label: 'Tenang', emoji: '\u{1F60C}' },
] as const;

export const FLOW_OPTIONS: { key: 'heavy' | 'medium' | 'light' | 'spotting' | 'none'; label: string }[] = [
  { key: 'none', label: 'Tidak Ada' },
  { key: 'spotting', label: 'Flek' },
  { key: 'light', label: 'Ringan' },
  { key: 'medium', label: 'Sedang' },
  { key: 'heavy', label: 'Deras' },
];
