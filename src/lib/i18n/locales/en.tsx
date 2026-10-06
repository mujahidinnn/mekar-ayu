import type { ReactNode } from 'react';
import type { Translations } from './id';

export const en: Translations = {
  common: {
    appName: 'Mekar Ayu',
    cancel: 'Cancel',
    close: 'Close',
    processing: 'Processing…',
    typeToConfirm: (text: string): ReactNode => (
      <>
        Type <b className="text-[var(--ink)]">{text}</b> to continue
      </>
    ),
  },

  nav: {
    home: 'Home',
    calendar: 'Calendar',
    stats: 'Stats',
    more: 'More',
  },

  welcome: {
    titleLine1: 'With you',
    titleLine2: 'every phase',
    subtitle: 'A private period, fertility, and mood tracker. Your data stays on your phone, period.',
    cta: "Let's Start",
  },

  header: {
    prevMonth: 'Previous month',
    nextMonth: 'Next month',
    backToThisMonth: 'Back to this month',
  },

  home: {
    appTagline: 'Understanding your cycle, nurturing your grace.',
    moodQuestion: 'How are you feeling today?',
    forecastTitle: 'Forecast',
    seeAll: 'See all',
    noForecastTitle: 'No forecast yet',
    noForecastBody: 'Log your first period first, then your phase, period schedule, and fertile window will show up here.',
    daysLeft: (n: number) => `${n} days left`,
    dueToday: 'Expected today',
    overdue: (n: number) => `${n} days late, still normal`,
    periodOn: (date: string) => `Period on ${date}`,
    fertileOn: (range: string) => `Fertile ${range}`,
    selfCareTitle: 'Self-care',
    selfCareEmptyTitle: "Let's log your first period day",
    selfCareEmptyBody: 'Self-care tips that match your phase will show up here.',
    phaseSheetBodyNow: "What's happening in your body",
    phaseSheetBodyFeel: 'What you might feel',
    phaseSheetSelfCare: 'Self-care tips',
    noLogTitle: 'No entry yet',
    noLogSubtitle: 'Tap to log your first day',
    todayActive: (day: number | string) => `Day ${day} of your period`,
    todayCountdown: (n: number) => `${n} days until your period`,
    todayDueToday: "Your period's expected today",
    todayOverdue: (n: number) => `${n} days late, no worries`,
    todayUnknown: "Let's get to know your cycle",
  },

  calendar: {
    title: 'Cycle Calendar',
    agenda: 'Agenda',
    agendaEmpty: 'Tap a date, then pick your flow. Once one period is logged, your period forecast, fertile window, and ovulation show up right here.',
    nextPeriod: 'Next period',
    fertileWindow: 'Fertile window',
    estimatedOvulation: 'Estimated ovulation',
    periodDaysLabel: 'Period days',
    loggedLabel: 'Logged',
    notesLabel: 'Notes',
    dayUnit: 'Days',
    countdownDaysLeft: (n: number) => `${n} days left`,
    countdownToday: 'Today',
    countdownDaysAgo: (n: number) => `${n} days ago`,
  },

  calendarGrid: {
    weekdays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    legendPeriod: 'Period',
    legendPredicted: 'Predicted period',
    legendFertile: 'Fertile window',
    legendOvulation: 'Ovulation',
    legendHasNote: 'Has a note',
  },

  stats: {
    title: 'Mood Calendar',
    moodSummaryCaption: "This month's mood summary",
    moodSummaryEmptyTitle: 'None yet',
    moodSummaryDefaultNote: 'Pick your mood on Home every day, and the recap will show up here.',
    moodDistribution: 'Mood breakdown',
    topSignalsTitle: 'Most common body signals',
    topSignalsEmpty: 'No body signals logged this month yet. Tap a date on the calendar to start logging.',
    yourCycleTitle: 'Your cycle',
    cycleLabel: 'Cycle',
    periodLabel: 'Period',
    recordedLabel: 'Logged',
    dayUnit: 'Days',
    cycleUnit: 'Cycles',
    historyRowTitle: 'Cycle history & trends',
    historyRowSub: "See all the cycles you've logged",
    moodNotes: {
      hp: "You've been happy a lot this month. Keep glowing!",
      ir: 'Feeling irritable? Totally normal. Take a break first.',
      ax: 'Overthinking a lot lately? Breathe slowly, one thing at a time.',
      sd: "You've been sad a lot this month. It's okay, you're not alone.",
      en: 'Your energy has been full! Great time to try something new.',
      cl: 'Your vibe has been calm and steady. Enjoy it.',
      cf: "You've been feeling confident. Keep carrying that energy!",
      ss: "You've been extra sensitive this month. Your feelings are valid.",
      st: "This month's been pretty stressful. Don't forget to give yourself a break.",
      um: 'Feeling low-energy a lot? That\'s okay, your body might just need rest.',
    },
  },

  historySheet: {
    title: 'Cycle History & Trends',
    avgCycle: 'Average Cycle',
    avgPeriod: 'Average Period',
    recordedCycles: 'Logged Cycles',
    cycleLengthTitle: 'Cycle Length (days)',
    cycleLengthHint: 'Typical range per ACOG: 21–35 days (highlighted area on the chart). Every body has its own rhythm.',
    emptyTrend: 'Your trend will show up once a few cycles are logged.',
    chartAriaLabel: 'Chart of cycle length per period',
    legendNormal: 'Typical (21–35 days)',
    legendAbnormal: 'Outside typical range',
    topSignalsTitle: 'Most Common Body Signals',
    emptySignals: 'No body signals logged yet.',
    historyListTitle: 'Cycle History List',
    emptyHistory: "No cycles logged yet. Let's start with your first period day.",
    colStart: 'Start',
    colDuration: 'Duration',
    colCycle: 'Cycle',
    daysSuffix: (n: number) => `${n} days`,
  },

  more: {
    title: 'More',
    subtitle: 'Settings, backup, and guides',
    groupApp: 'App',
    display: 'Appearance',
    language: 'Language',
    installApp: 'Add to home screen',
    installAppSub: 'Open faster, works offline',
    groupGuide: 'Guides',
    fullGuide: 'Complete period guide',
    fullGuideSub: 'Cycle phases, normal numbers, when to see a doctor',
    backupGuideTitle: 'Backup & restore guide',
    backupGuideSub: 'How to save and move your data',
    groupData: 'Data',
    backupExport: 'Backup & export',
    backupExportSub: 'JSON, PDF, Excel, WhatsApp',
    localStorage: 'Local storage',
    localStorageSub: (count: number, size: string) => `${count} entries · ${size}`,
    dataSafety: 'Data safety',
    dataSafetySub: 'Keep your data safe',
    groupAbout: 'About',
    privacyPolicy: 'Privacy policy',
    privacyPolicySub: 'Your data stays on your phone',
    supportDev: 'Support the developer',
    supportDevSub: 'Trakteer',
    groupDanger: 'Danger zone',
    deleteAll: 'Delete all data',
    deleteAllSub: 'Permanent, cannot be undone',
    footerNote: 'Your data belongs only to you. Mekar Ayu is 100% local-first — no server, no account, no tracking. Everything stays on this device.',

    themeOptions: { light: 'Light', dark: 'Dark', system: 'Follow system' },
    languageOptions: { id: 'Indonesia', en: 'English' },

    storageSheetTitle: 'Local storage',
    totalStoredLabel: 'Total data stored',
    totalStored: (count: number) => `${count} entries`,
    dataSizeLabel: 'Cycle & note data size',
    persistedYes: 'Your data is protected from automatic deletion',
    persistedNo: 'Waiting for storage permission from the browser',

    backupSheetTitle: 'Backup & export',
    backupJSON: 'Backup JSON',
    backupJSONSub: 'Save all your data, can be password-locked',
    shareWA: 'Send backup to WhatsApp',
    shareWASub: 'Share the backup file to your own chat',
    downloadPDF: 'Download PDF report',
    downloadPDFSub: 'A summary to bring to the doctor',
    downloadExcel: 'Download Excel',
    downloadExcelSub: 'Cycle and daily log tables',
    copySummaryWA: 'Copy summary to WhatsApp',
    copySummaryWASub: 'Send it to your own notes',
    waNumberLabel: 'Your WhatsApp number (optional), so the summary opens right in your own chat. Only stored on this device.',
    waNumberExample: (
      <>
        Example: <b className="text-[var(--ink)]">081234567890</b> or <b className="text-[var(--ink)]">6281234567890</b>
      </>
    ) as ReactNode,
    waNumberPlaceholder: '081234567890',
    restoreJSON: 'Restore JSON',
    restoreJSONSub: 'Replace current data with a backup file',

    safetySheetTitle: 'Data safety',
    safetyItem1Title: 'Clearing cache / site data.',
    safetyItem1Body: 'Tapping "Clear Browsing Data" or "Clear Website Cache" in Chrome/Safari settings will wipe your entire cycle history too, so be careful.',
    safetyItem2Title: 'Back up regularly.',
    safetyItem2Body: 'Make a habit of backing up to JSON or copying a summary to WhatsApp at least once a month.',
    safetyItem3Title: 'Switching phones.',
    safetyItem3Body: 'Before switching devices, download the .json file via Backup, then restore it on your new phone.',
    safetyItem4Title: 'Storage lock.',
    safetyItem4Body: "Mekar Ayu automatically asks the browser to protect your data when your phone's storage is full. You don't need to do anything.",

    installConfirmTitle: 'Install Mekar Ayu?',
    installConfirmBody: 'Mekar Ayu will appear on your home screen like a regular app, so it opens faster and still works offline. All your data stays 100% on this device.',
    installConfirmLabel: 'Install',

    importConfirmTitle: 'Replace with backup data?',
    importConfirmBody: (cycleCount: number, logCount: number): ReactNode => (
      <>
        This file has <b>{cycleCount} cycles</b> and <b>{logCount} daily logs</b>. Continuing will{' '}
        <b className="text-red-600 dark:text-red-400">delete and replace all of your current data</b> with this file's contents. This cannot be
        undone.
      </>
    ),
    importConfirmLabel: 'Yes, Replace Data',

    lockExportTitle: 'Lock the backup file?',
    lockExportBody: "Add a password so this file can't be read by anyone else if it ends up on Drive, in an email, or on a lost phone. Keep it safe — without this password, the file can't be restored.",

    unlockTitle: 'This file is locked',
    unlockBody: 'Enter the password used when this backup file was created.',

    deleteConfirmTitle: 'Delete all data?',
    deleteConfirmBody: (): ReactNode => (
      <>
        All cycle history, symptoms, and daily logs on this device will be{' '}
        <b className="text-red-600 dark:text-red-400">permanently deleted and cannot be recovered</b>. Make sure you've backed up anything you
        want to keep.
      </>
    ),
    deleteConfirmLabel: 'Yes, Delete Everything',
    deleteConfirmRequireText: 'DELETE',

    toasts: {
      pdfError: "The PDF report couldn't be created. Try again.",
      excelError: "The Excel report couldn't be created. Try again.",
      fileUnreadable: "This file can't be read. Make sure it's a JSON backup file from Mekar Ayu.",
      wrongPassword: "That password doesn't match. Try again.",
      lockedFileInvalid: 'This locked file seems corrupted or invalid.',
      exportLockFailed: "The file couldn't be locked. Try again.",
      importedSuccess: 'Your data is restored from the backup file.',
      importError: "Your data couldn't be restored. Make sure the backup file is valid.",
      deletedSuccess: 'All data has been deleted.',
      installSuccess: 'Mekar Ayu is being installed on your device.',
    },
  },

  logEditor: {
    flowLabel: 'Period flow',
    signalsLabel: 'Body signals',
    moodLabel: 'Mood',
    notesLabel: 'Notes',
    notesPlaceholder: "What's on your mind today? Write it here...",
    savedAutomatically: 'Saved automatically',
  },

  redFlag: {
    title: 'Your body is sending signals',
    footer: "No need to panic. But it's a good idea to check in with an Ob-Gyn for peace of mind. This note is educational, not a medical diagnosis.",
  },

  pwaInstall: {
    title: 'How to Add to Home Screen',
    intro: 'Add Mekar Ayu to your home screen so you can open it like a regular app: faster, works offline, and your data stays 100% on your device.',
    iosTab: 'iPhone (Safari)',
    androidTab: 'Android (Chrome)',
    stepLabel: (i: number) => `Step ${i}`,
    footerNote: 'Menu appearance may vary slightly by browser version. This feature needs Safari (iPhone) or Chrome/Edge (Android); some other browsers may not support "Add to Home Screen".',
    ios: [
      { title: 'Tap the Share button', description: 'In Safari, tap the Share icon (a box with an arrow pointing up) at the bottom of the screen.' },
      { title: 'Choose "Add to Home Screen"', description: 'Scroll down the menu list, then tap "Add to Home Screen".' },
      { title: 'Tap "Add"', description: 'Confirm the app name, then tap "Add" in the top-right corner.' },
      { title: 'Done!', description: 'The Mekar Ayu icon will appear on your home screen, ready to open like a regular app without opening the browser.' },
    ],
    android: [
      { title: 'Tap the three-dot menu', description: 'In Chrome, tap the three-dot icon (⋮) in the top-right corner.' },
      { title: 'Choose "Install app"', description: 'Find and tap "Install app" or "Add to Home screen" in the menu that appears.' },
      { title: 'Tap "Install"', description: 'Confirm the installation in the dialog that appears.' },
      { title: 'Done!', description: 'Mekar Ayu will be installed like a native app, complete with its own icon on your home screen.' },
    ],
  },

  updateToast: {
    newUpdateTitle: 'New update available',
    newUpdateBody: 'The latest version of Mekar Ayu is ready for you.',
    later: 'Later',
    update: 'Update',
    offlineReadyBody: 'Mekar Ayu now works offline too.',
  },

  fullGuide: {
    title: 'Complete Period Guide',
    intro: (
      <>
        According to ACOG (American College of Obstetricians and Gynecologists), the menstrual cycle deserves to be tracked as a{' '}
        <span className="font-semibold text-[var(--ink)]">vital sign</span>, just as important as blood pressure or heart rate. By knowing your
        own rhythm, you'll notice changes in cycle length or period duration sooner, including early clues for conditions like PCOS, thyroid
        disorders, or endometriosis.
      </>
    ) as ReactNode,
    cycleJourneyTitle: 'The journey of one cycle (28 days)',
    hormonalPhasesTitle: '4 hormonal phases',
    bodyNowLabel: "What's happening in your body",
    bodyFeelLabel: 'What you might feel',
    selfCareLabel: 'How to take care of yourself',
    normalNumbersTitle: "What counts as normal",
    warningPrefix: 'Worth noting:',
    docTitle: 'When to see a doctor (Ob-Gyn)',
    educationalNote: 'This note is educational and not a substitute for a professional medical diagnosis.',
    referencesTitle: 'References',
    whoDate: '22 June 2022',
    clinicalParameters: [
      { parameter: 'Cycle length', normal: '21–35 days (average 28 days)', warning: '<21 or >35 days' },
      { parameter: 'Period duration', normal: '2–7 days (average 4–5 days)', warning: '>8 days' },
      { parameter: 'Cycle-to-cycle variation', normal: '≤4–5 days', warning: '>7–9 days in a row' },
      { parameter: 'Ovulation & fertile window', normal: '~14 days before the next period' },
    ],
    redFlags: [
      { title: 'Severe pain (dysmenorrhea)', description: "Pelvic pain that disrupts daily activities and doesn't ease with regular pain relievers." },
      { title: 'Abnormal bleeding (menorrhagia)', description: 'Changing pads/tampons every hour for several hours in a row.' },
      { title: 'Irregular cycles', description: 'Cycles consistently shorter than 21 days or longer than 35 days.' },
      { title: 'Secondary amenorrhea', description: 'No period for 90+ days in a row (and not due to pregnancy).' },
      { title: 'Intermenstrual bleeding', description: 'Spotting or bleeding that shows up between clear periods.' },
    ],
  },

  backupGuide: {
    title: 'Backup & Restore Guide',
    intro: (
      <>
        Since Mekar Ayu has no server, a <span className="font-semibold text-[var(--ink)]">JSON backup</span> file is the only way to move your
        data to another phone or keep it from getting lost.
      </>
    ) as ReactNode,
    backupTitle: 'Backup (Export)',
    backupSteps: [
      'Open the More tab → Backup & export, then tap "Backup JSON".',
      'Choose whether to lock it with a password or not, then the file downloads automatically to your phone\'s Download/Files folder, e.g. mekarayu-backup-2026-07-29.json.',
      'Move that file somewhere safe, like your personal Google Drive, email it to yourself, or save it on a new phone.',
    ],
    restoreTitle: 'Restore (Import)',
    restoreSteps: [
      'Open the More tab → Backup & export, then tap "Restore JSON".',
      'Choose the matching backup file (for example, after switching phones).',
      'If the file is locked, enter the password used when it was created.',
      'Confirm when asked. This will replace all of your current data.',
    ],
    warningReplace: (
      <>
        <span className="font-semibold">Restore will REPLACE, not merge.</span> All current data will be deleted and replaced with the backup
        file's contents. If you have recent data that hasn't been backed up yet, back it up before restoring.
      </>
    ) as ReactNode,
    noPasswordNote: (
      <>
        <span className="font-semibold text-[var(--ink)]">Without a password, this file is not encrypted</span>, its contents are plain text
        readable by anyone who opens it. Choose "Lock backup file" during export to encrypt it, then keep the password safe, losing it means the
        file can never be restored.
      </>
    ) as ReactNode,
  },

  privacy: {
    title: 'Privacy Policy',
    intro: "Mekar Ayu is built privacy-first. This app has no server, so your cycle and daily log data is never sent anywhere unless you ask it to.",
    section1Title: 'Data Stored on Your Own Phone',
    section1Body: "All cycle data, daily logs, and settings are stored directly in your phone or computer browser's local storage. There's no account, no login, and no database on any server of ours, because there's no server at all.",
    section2Title: 'When Data Can Leave Your Phone',
    section2Items: [
      "When you choose Backup JSON, the file is downloaded to your own phone. You decide where it's saved or moved.",
      "When you choose Copy summary to WhatsApp, the summary opens through your own WhatsApp app and is only sent if you send it yourself.",
      "The Support the developer menu opens a third-party site (trakteer.id) in a new tab; that page has its own privacy policy.",
    ],
    section2Footer: 'Outside of those three things, this app never sends any data automatically. No analytics, no trackers, and no third party quietly collecting your data.',
    section3Title: 'You Stay in Control',
    section3Body: "You can lock your backup file with a password to encrypt it. If your phone is lost or used by someone else, the data can only be read through the same browser it's stored in, unless that person has direct access to your device.",
    deleteNote: (
      <>
        <span className="font-semibold text-[var(--ink)]">Delete your data anytime via the Delete all data menu in the More tab.</span> Since
        there's no copy on any server, that deletion is permanent. Make sure to back up first if you still need it.
      </>
    ) as ReactNode,
  },

  phases: {
    menstrual: {
      label: 'Menstrual Phase',
      dayRange: 'Day 1–5/7',
      summary: 'The uterine lining sheds. Time to rest.',
      hormonal: "Estrogen and progesterone are at their lowest as the uterine lining sheds. It's totally normal for your body to ask for a break.",
      bodyExperience: "This is your rest phase. Cramps (dysmenorrhea), lower back ache, and easy fatigue are your body's signal to slow down.",
      selfCare: [
        { care: 'comfort' as const, tip: 'Apply a warm compress or heating pad on your lower belly to help the uterine muscles relax.' },
        { care: 'nutrition' as const, tip: 'Go for iron-rich foods like spinach, red meat, or lentils, plus vitamin C to help absorption.' },
        { care: 'hydration' as const, tip: 'Brew warm ginger or chamomile tea to help ease bloating and cramps.' },
      ],
    },
    follicular: {
      label: 'Follicular Phase',
      dayRange: 'Day 6–13',
      summary: 'Your egg starts maturing, energy picks back up.',
      hormonal: 'The pituitary gland releases FSH and estrogen slowly rises, like a bud getting ready to bloom.',
      bodyExperience: 'This is your growth phase. Energy comes back, mood feels lighter, skin glows, and focus sharpens.',
      selfCare: [
        { care: 'activity' as const, tip: 'A good time for more intense workouts, creative projects, or hanging out with people you love.' },
        { care: 'skincare' as const, tip: 'Rising estrogen gives your skin a natural glow, so a light moisturizer is all you need.' },
      ],
    },
    ovulatory: {
      label: 'Ovulation Phase',
      dayRange: 'Day 14 / Mid-Cycle',
      summary: 'The egg is released. This is the peak of your fertile window.',
      hormonal: 'A surge in luteinizing hormone (LH) releases the mature egg, and estrogen is at its peak.',
      bodyExperience: 'This is your bloom phase, at peak glow. Cervical mucus turns clear and stretchy like egg whites, body temperature rises slightly, libido increases, and you might feel mild pain on one side of your pelvis (Mittelschmerz).',
      selfCare: [
        { care: 'fertility' as const, tip: "This is the peak of your fertile window. Worth tracking, whether you're planning a pregnancy or watching your contraception." },
      ],
    },
    luteal: {
      label: 'Luteal Phase',
      dayRange: 'Day 15–28',
      summary: 'Your body gets ready for your period, PMS may show up.',
      hormonal: "Progesterone takes over to thicken the uterine lining. If there's no fertilization, hormones drop fairly sharply toward the end of the phase.",
      bodyExperience: "Your body starts slowing down. Tender breasts, bloating, feeling extra emotional, craving snacks, or breakouts are normal PMS signs, not your fault.",
      selfCare: [
        { care: 'nutrition' as const, tip: 'Cut back on salt and processed sugar so your body holds less fluid and your mood stays steadier.' },
        { care: 'rest' as const, tip: 'Prioritize 7–8 hours of solid sleep, and stick to gentle movement like light yoga or walking.' },
      ],
    },
  },

  symptoms: {
    cr: 'Cramps',
    hd: 'Headache',
    ac: 'Acne',
    bl: 'Bloating',
    ft: 'Fatigue',
    bk: 'Back Pain',
    tb: 'Tender Breasts',
    ns: 'Nausea',
    cv: 'Cravings',
    in: 'Insomnia',
    dc: 'Discharge',
    ba: 'Body Aches',
    dr: 'Diarrhea',
    sp: 'Severe Pain (disrupts activity)',
  },

  moods: {
    hp: 'Happy',
    ir: 'Irritable',
    ax: 'Anxious',
    sd: 'Sad',
    en: 'Energetic',
    cl: 'Calm',
    cf: 'Confident',
    ss: 'Sensitive',
    st: 'Stressed',
    um: 'Low Energy',
  },

  flows: {
    n: 'None',
    s: 'Spotting',
    l: 'Light',
    m: 'Medium',
    h: 'Heavy',
  },

  careTitles: {
    comfort: 'Comfort',
    nutrition: 'Nutrition',
    hydration: 'Hydration',
    activity: 'Activity',
    skincare: 'Skincare',
    fertility: 'Fertility Awareness',
    rest: 'Rest',
  },

  signalCare: {
    cr: { care: 'comfort', tip: 'Got cramps? Put a warm compress on your lower belly and lie down for a bit.' },
    hd: { care: 'hydration', tip: "Headaches often show up when you're low on water. Drink some water first, then rest your eyes from the screen." },
    ac: { care: 'skincare', tip: "Wash your face with a gentle cleanser and don't pick at it, so the breakout doesn't get worse." },
    bl: { care: 'nutrition', tip: 'To ease the bloat, cut back on salty food and soda for now.' },
    ft: { care: 'rest', tip: "Your body's asking for a break. Sleep earlier tonight and don't push yourself." },
    bk: { care: 'comfort', tip: 'A warm compress on your lower back plus light stretching can help ease the pain.' },
    tb: { care: 'comfort', tip: "Wear a comfy, non-tight bra for now so your breasts don't get more sore." },
    ns: { care: 'nutrition', tip: 'Eat small portions more often, and try warm ginger tea to settle the nausea.' },
    cv: { care: 'nutrition', tip: 'Cravings are totally normal. Give in a little, then balance it out with fruit or a protein snack.' },
    in: { care: 'rest', tip: 'Put your phone away an hour before bed and dim the lights to fall asleep easier.' },
    dc: { care: 'comfort', tip: 'Wear breathable cotton underwear and change it once it feels damp.' },
    ba: { care: 'activity', tip: 'Light stretching or a 10-minute easy walk can make a sore body feel better.' },
    dr: { care: 'hydration', tip: 'Replace lost fluids by drinking plenty, and skip spicy or oily food for now.' },
    sp: { care: 'rest', tip: "Rest for now. If the pain doesn't ease up, it's best to see a doctor." },
    hp: { care: 'activity', tip: "You're feeling happy! Perfect time to do something you love or see someone you care about." },
    ir: { care: 'rest', tip: 'Feeling irritable? Take a short break and breathe slowly before moving on.' },
    ax: { care: 'rest', tip: 'Breathe in for 4 seconds, hold for 4, release for 4. Repeat until you feel calmer.' },
    sd: { care: 'comfort', tip: "It's okay to feel sad. Talk to someone you trust or just write it down." },
    en: { care: 'activity', tip: "Your energy's full tank, great time to work out or start that thing you've been putting off." },
    cl: { care: 'activity', tip: 'Vibes are calm. Keep the rhythm with an easy walk or your favorite me-time.' },
    cf: { care: 'activity', tip: "You're feeling confident, nice. Good time to try something new." },
    ss: { care: 'comfort', tip: 'Feeling extra sensitive? Give yourself some space and cut back on scrolling for now.' },
    st: { care: 'rest', tip: "Pick the one thing that matters most for now, the rest can wait. Don't forget to pause." },
    um: { care: 'activity', tip: 'Start small, like 5 minutes tidying your desk. It usually gets easier to keep going after that.' },
  },

  flags: {
    irregularity: {
      short_cycle: 'Cycle shorter than 21 days (Polymenorrhea).',
      long_cycle: 'Cycle longer than 35 days (Oligomenorrhea).',
      high_variance: 'Cycle-to-cycle variation of more than 7 days, repeatedly.',
      prolonged_bleeding: 'Period lasting more than 8 days (Menorrhagia).',
      amenorrhea: 'No period for more than 90 days.',
    },
    red: {
      severe_pain: "Severe pain that disrupts daily activities and doesn't ease with regular pain relievers.",
      heavy_bleeding: 'Heavy bleeding logged for 3 days in a row. Watch for signs of Menorrhagia.',
      irregular_cycle: 'Cycle length consistently outside the normal range (21–35 days).',
      amenorrhea: 'No period for 90+ days in a row (and not due to pregnancy).',
      intermenstrual_bleeding: 'Spotting or bleeding outside the main period.',
    },
  },

  cycleStatus: {
    active: (day: number | string) => `Day ${day} of your period`,
    countdown: (days: number) => `${days} days until your period`,
    dueToday: "Your period's expected today",
    overdue: (days: number) => `${days} days past your estimate`,
    unknown: "Let's get to know your cycle",
  },

  passwordDialog: {
    passwordPlaceholder: 'Password',
    repeatPasswordPlaceholder: 'Repeat password',
    showPassword: 'Show password',
    hidePassword: 'Hide password',
    lockAndDownload: 'Lock & Download',
    downloadWithoutPassword: 'Download Without Password',
    unlock: 'Unlock',
    errorTooShort: 'Password must be at least 4 characters.',
    errorMismatch: "Both passwords don't match. Double-check them.",
  },

  export: {
    pdf: {
      headerTitle: 'Mekar Ayu - Menstrual Cycle History Report',
      generatedOn: (date: string) => `Generated on: ${date}`,
      dataSource: 'Data source: 100% locally logged by the user (self-reported, local-first).',
      clinicalSummaryTitle: 'Clinical Summary',
      paramHeaders: ['Parameter', 'Value', 'Normal Range (ACOG)'],
      rowAvgCycle: 'Average Cycle Length',
      rowAvgPeriod: 'Average Period Duration',
      rowCycleCount: 'Number of Cycles Logged',
      rowNextPeriod: 'Next Period Estimate',
      rowOvulation: 'Ovulation Estimate',
      daysUnit: (n: number) => `${n} days`,
      normalCycleRange: '21–35 days',
      normalPeriodRange: '2–7 days',
      ovulationNormalNote: '~14 days before period',
      irregularityTitle: 'Irregularity Notes',
      indicatorHeader: 'Indicator',
      historyTitle: 'Cycle History',
      historyHeaders: ['Start', 'End', 'Period Duration', 'Cycle Length'],
      symptomLogTitle: 'Symptom & Mood Log',
      symptomLogHeaders: ['Date', 'Flow', 'Symptoms', 'Mood', 'Notes'],
      footer: 'Generated by Mekar Ayu - 100% Local-First, Zero Backend, Zero Telemetry.',
      filenamePrefix: 'mekarayu-medical-report',
    },
    excel: {
      sheetCycles: 'Cycle History',
      sheetLogs: 'Daily Logs',
      colStartDate: 'Start Date',
      colEndDate: 'End Date',
      colPeriodDuration: 'Period Duration (days)',
      colCycleLength: 'Cycle Length (days)',
      colNotes: 'Notes',
      colDate: 'Date',
      colFlow: 'Flow',
      colSymptoms: 'Symptoms',
      colMood: 'Mood',
      filenamePrefix: 'mekarayu-data',
    },
    whatsapp: {
      headerLine: '*MENSTRUAL CYCLE RECAP (MEKAR AYU)*',
      periodLabel: (m: string) => `Period: ${m}`,
      summaryTitle: '*Cycle Summary:*',
      totalDaysLogged: (n: number) => `Total Days Logged: ${n} days`,
      lastPeriodStart: (date: string) => `Last Period Start: ${date}`,
      noDataYet: 'No data yet',
      statusLabel: (avg: string) => `Cycle Status: ${avg}`,
      avgDays: (n: number) => `Average ${n} Days`,
      notEnoughData: 'Not enough data for an average yet',
      dailyNotesTitle: "*This Month's Daily Notes:*",
      logLine: (date: string, flow: string, symptoms: string, moods: string, notes: string) =>
        `• ${date}: Flow (${flow}), Symptoms (${symptoms}), Mood (${moods}), Notes: ${notes}`,
      noFlow: 'none',
      noDailyNotes: 'No daily notes logged this month yet.',
      footerPrivacy: 'This data is logged privately in Mekar Ayu (100% Local-First, No Server).',
    },
  },
};
