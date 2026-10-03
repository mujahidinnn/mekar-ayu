import type { FlowIntensity } from '../db/schema';

export type PhaseKey = 'menstrual' | 'follicular' | 'ovulatory' | 'luteal';

export interface PhaseInfo {
  key: PhaseKey;
  label: string;
  dayRange: string;
  summary: string;
  color: string;
  textColor: string;
  hormonal: string;
  bodyExperience: string;
  selfCare: { title: string; tip: string }[];
}

export const PHASE_TINT: Record<PhaseKey, string> = { menstrual: '#F47C7C', follicular: '#F9B892', ovulatory: '#D7C2F7', luteal: '#B5D3F9' };
export const PHASE_ICON: Record<PhaseKey, string> = { menstrual: 'Haid', follicular: 'Folikuler', ovulatory: 'Ovulasi', luteal: 'Luteal' };

export const PHASES: Record<PhaseKey, PhaseInfo> = {
  menstrual: {
    key: 'menstrual',
    label: 'Fase Menstruasi',
    dayRange: 'Hari 1–5/7',
    summary: 'Lapisan rahim meluruh. Waktunya istirahat dulu.',
    color: 'bg-rose-600',
    textColor: 'text-rose-600',
    hormonal: 'Estrogen dan progesteron lagi di titik terendah karena lapisan rahim meluruh. Wajar banget kalau tubuhmu minta jeda.',
    bodyExperience: 'Ini fase istirahatmu. Kram (dismenore), pegal di punggung bawah, dan gampang capek itu sinyal tubuh buat slow down dulu.',
    selfCare: [
      { title: 'Kenyamanan', tip: 'Tempel kompres atau bantal hangat di perut bawah biar otot rahim lebih rileks.' },
      { title: 'Nutrisi', tip: 'Pilih makanan kaya zat besi kayak bayam, daging merah, atau lentil, plus vitamin C biar lebih gampang diserap.' },
      { title: 'Hidrasi', tip: 'Seduh teh jahe atau chamomile hangat buat bantu redain kembung dan kram.' },
    ],
  },
  follicular: {
    key: 'follicular',
    label: 'Fase Folikuler',
    dayRange: 'Hari 6–13',
    summary: 'Sel telur mulai matang, energi naik lagi.',
    color: 'bg-emerald-400',
    textColor: 'text-emerald-600',
    hormonal: 'Kelenjar hipofisis melepas FSH dan estrogen pelan-pelan naik, kayak kuncup yang siap mekar.',
    bodyExperience: 'Ini fase berkembangmu. Energi balik lagi, mood lebih enteng, kulit glowing, dan fokus makin tajam.',
    selfCare: [
      { title: 'Aktivitas', tip: 'Waktu yang pas buat olahraga yang lebih intens, ngerjain proyek kreatif, atau hangout bareng orang tersayang.' },
      { title: 'Perawatan Kulit', tip: 'Estrogen yang naik bikin kulitmu glowing alami, jadi pelembap ringan aja udah cukup.' },
    ],
  },
  ovulatory: {
    key: 'ovulatory',
    label: 'Fase Ovulasi',
    dayRange: 'Hari ke-14 / Pertengahan Siklus',
    summary: 'Sel telur dilepas. Ini puncak masa suburmu.',
    color: 'bg-purple-300',
    textColor: 'text-purple-600',
    hormonal: 'Lonjakan hormon luteinizing (LH) melepas sel telur matang, dan estrogen lagi di puncaknya.',
    bodyExperience: 'Ini fase mekarmu, lagi di puncak pesona. Lendir serviks jadi bening dan elastis kayak putih telur, suhu tubuh sedikit naik, gairah meningkat, dan kadang ada nyeri ringan di satu sisi panggul (Mittelschmerz).',
    selfCare: [
      { title: 'Kesadaran Kesuburan', tip: 'Ini puncak masa suburmu. Penting buat dicatat, entah kamu lagi merencanakan kehamilan atau memantau kontrasepsi.' },
    ],
  },
  luteal: {
    key: 'luteal',
    label: 'Fase Luteal',
    dayRange: 'Hari 15–28',
    summary: 'Tubuh bersiap menuju haid, PMS bisa muncul.',
    color: 'bg-amber-300',
    textColor: 'text-amber-600',
    hormonal: 'Progesteron ambil alih buat menebalkan lapisan rahim. Kalau nggak ada pembuahan, hormon turun cukup tajam di akhir fase.',
    bodyExperience: 'Tubuhmu mulai melambat. Payudara sensitif, perut kembung, gampang baper, pengin ngemil terus, atau jerawatan itu tanda PMS yang wajar, bukan salahmu.',
    selfCare: [
      { title: 'Nutrisi', tip: 'Kurangi garam dan gula olahan biar tubuh nggak nahan banyak cairan dan mood lebih stabil.' },
      { title: 'Istirahat', tip: 'Utamakan tidur nyenyak 7–8 jam, terus pilih gerak yang santai kayak yoga ringan atau jalan kaki.' },
    ],
  },
};

export const SYMPTOM_OPTIONS = [
  { key: 'cr', label: 'Kram' },
  { key: 'hd', label: 'Sakit Kepala' },
  { key: 'ac', label: 'Jerawat' },
  { key: 'bl', label: 'Kembung' },
  { key: 'ft', label: 'Lelah' },
  { key: 'bk', label: 'Nyeri Punggung' },
  { key: 'tb', label: 'Payudara Nyeri' },
  { key: 'ns', label: 'Mual' },
  { key: 'cv', label: 'Ngidam' },
  { key: 'in', label: 'Susah Tidur' },
  { key: 'dc', label: 'Keputihan' },
  { key: 'ba', label: 'Pegal-pegal' },
  { key: 'dr', label: 'Diare' },
  { key: 'sp', label: 'Nyeri Hebat (mengganggu aktivitas)' },
] as const;

export const MOOD_OPTIONS = [
  { key: 'hp', label: 'Bahagia', color: 'bg-amber-300' },
  { key: 'ir', label: 'Mudah Marah', color: 'bg-rose-400' },
  { key: 'ax', label: 'Cemas', color: 'bg-sky-300' },
  { key: 'sd', label: 'Sedih', color: 'bg-indigo-300' },
  { key: 'en', label: 'Berenergi', color: 'bg-orange-300' },
  { key: 'cl', label: 'Tenang', color: 'bg-emerald-300' },
  { key: 'cf', label: 'Percaya Diri', color: 'bg-lime-300' },
  { key: 'ss', label: 'Sensitif', color: 'bg-teal-300' },
  { key: 'st', label: 'Stres', color: 'bg-yellow-300' },
  { key: 'um', label: 'Mager', color: 'bg-stone-300' },
] as const;

export const SIGNAL_CARE: Record<string, { title: string; tip: string }> = {
  cr: { title: 'Kenyamanan', tip: 'Lagi kram? Tempel kompres hangat di perut bawah, terus rebahan sebentar.' },
  hd: { title: 'Hidrasi', tip: 'Sakit kepala sering muncul pas kurang minum. Minum air putih dulu, terus istirahatin mata dari layar.' },
  ac: { title: 'Perawatan Kulit', tip: 'Cuci muka pakai pembersih yang lembut dan jangan dipencet, ya, biar jerawatnya nggak makin meradang.' },
  bl: { title: 'Nutrisi', tip: 'Biar kembungnya reda, kurangi dulu makanan asin dan minuman bersoda.' },
  ft: { title: 'Istirahat', tip: 'Tubuhmu lagi minta jeda. Tidur lebih awal malam ini dan jangan paksain diri.' },
  bk: { title: 'Kenyamanan', tip: 'Kompres hangat di punggung bawah plus peregangan ringan bisa bantu ngurangin nyerinya.' },
  tb: { title: 'Kenyamanan', tip: 'Pakai bra yang nyaman dan nggak ketat dulu biar payudara nggak makin nyeri.' },
  ns: { title: 'Nutrisi', tip: 'Makan porsi kecil tapi sering, dan coba teh jahe hangat buat redain mual.' },
  cv: { title: 'Nutrisi', tip: 'Ngidam itu wajar, kok. Turutin secukupnya, terus imbangi sama buah atau camilan berprotein.' },
  in: { title: 'Istirahat', tip: 'Jauhin HP sejam sebelum tidur dan redupin lampu kamar biar lebih gampang ngantuk.' },
  dc: { title: 'Kenyamanan', tip: 'Pakai celana dalam katun yang menyerap keringat dan ganti kalau udah lembap.' },
  ba: { title: 'Aktivitas', tip: 'Stretching ringan atau jalan santai 10 menit bisa bikin badan yang pegal lebih enakan.' },
  dr: { title: 'Hidrasi', tip: 'Ganti cairan yang hilang dengan banyak minum, dan hindari dulu makanan pedas atau berminyak.' },
  sp: { title: 'Istirahat', tip: 'Istirahat dulu, ya. Kalau nyerinya nggak mereda, sebaiknya periksa ke dokter.' },
  hp: { title: 'Aktivitas', tip: 'Lagi happy! Pas banget buat ngerjain hal yang kamu suka atau ketemu orang tersayang.' },
  ir: { title: 'Istirahat', tip: 'Lagi gampang kesel? Ambil jeda sebentar dan tarik napas pelan sebelum lanjut.' },
  ax: { title: 'Istirahat', tip: 'Tarik napas 4 detik, tahan 4 detik, buang 4 detik. Ulangi sampai lebih tenang.' },
  sd: { title: 'Kenyamanan', tip: 'Nggak apa-apa sedih. Cerita ke orang yang kamu percaya atau tulis aja di catatan.' },
  en: { title: 'Aktivitas', tip: 'Energimu lagi full, cocok buat olahraga atau mulai hal yang dari kemarin ketunda.' },
  cl: { title: 'Aktivitas', tip: 'Vibes lagi adem. Jaga ritmenya dengan jalan santai atau me-time favoritmu.' },
  cf: { title: 'Aktivitas', tip: 'Lagi pede-pedenya, nih. Waktu yang pas buat coba hal baru.' },
  ss: { title: 'Kenyamanan', tip: 'Lagi gampang baper? Kasih ruang buat dirimu dan kurangi scroll medsos dulu.' },
  st: { title: 'Istirahat', tip: 'Pilih satu hal yang paling penting dulu, sisanya bisa nunggu. Jangan lupa jeda.' },
  um: { title: 'Aktivitas', tip: 'Mulai dari yang kecil aja, misalnya 5 menit beresin meja. Biasanya abis itu lebih gampang lanjut.' },
};

export const MOOD_COLOR_MAP: Record<string, string> = Object.fromEntries(
  MOOD_OPTIONS.map((m) => [m.key, m.color]),
);

export const FLOW_OPTIONS: { key: FlowIntensity; label: string }[] = [
  { key: 'n', label: 'Tidak Ada' },
  { key: 's', label: 'Flek' },
  { key: 'l', label: 'Ringan' },
  { key: 'm', label: 'Sedang' },
  { key: 'h', label: 'Deras' },
];

const SIGNAL_LABEL: Record<string, string> = Object.fromEntries([...SYMPTOM_OPTIONS, ...MOOD_OPTIONS].map((o) => [o.key, o.label]));

export function selfCareTips(phase: PhaseKey | null, symptoms: string[] = [], moods: string[] = []) {
  const signals = [...symptoms, ...moods].sort((a, b) => Number(b === 'sp') - Number(a === 'sp'));
  return [
    ...signals.flatMap((k) => (SIGNAL_CARE[k] ? [{ ...SIGNAL_CARE[k], reason: SIGNAL_LABEL[k] }] : [])),
    ...(phase ? PHASES[phase].selfCare.map((t) => ({ ...t, reason: PHASES[phase].label })) : []),
  ];
}
