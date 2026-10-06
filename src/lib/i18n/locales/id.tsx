import type { ReactNode } from 'react';

export const id = {
  common: {
    appName: 'Mekar Ayu',
    cancel: 'Batal',
    close: 'Tutup',
    processing: 'Memproses…',
    typeToConfirm: (text: string): ReactNode => (
      <>
        Ketik <b className="text-[var(--ink)]">{text}</b> buat lanjut
      </>
    ),
  },

  nav: {
    home: 'Beranda',
    calendar: 'Kalender',
    stats: 'Statistik',
    more: 'Lainnya',
  },

  welcome: {
    titleLine1: 'Nemenin kamu',
    titleLine2: 'di tiap fase',
    subtitle: 'Kalender haid, masa subur, dan mood tracker yang privat. Semua data cuma ada di HP kamu.',
    cta: 'Yuk, Mulai',
  },

  header: {
    prevMonth: 'Bulan sebelumnya',
    nextMonth: 'Bulan berikutnya',
    backToThisMonth: 'Kembali ke bulan ini',
  },

  home: {
    appTagline: 'Memahami Siklusmu, Merawat Anggunmu.',
    moodQuestion: 'Gimana mood kamu hari ini?',
    forecastTitle: 'Perkiraan',
    seeAll: 'Lihat semua',
    noForecastTitle: 'Belum ada perkiraan',
    noForecastBody: 'Catat haid pertamamu dulu, nanti fase, jadwal haid, dan masa subur muncul di sini.',
    daysLeft: (n: number) => `${n} hari lagi`,
    dueToday: 'Diperkirakan hari ini',
    overdue: (n: number) => `Telat ${n} hari, masih wajar kok`,
    periodOn: (date: string) => `Haid ${date}`,
    fertileOn: (range: string) => `Subur ${range}`,
    selfCareTitle: 'Self-care',
    selfCareEmptyTitle: 'Yuk, catat hari pertama haidmu',
    selfCareEmptyBody: 'Nanti tips self-care yang cocok sama fasemu muncul di sini.',
    phaseSheetBodyNow: 'Yang lagi terjadi di tubuhmu',
    phaseSheetBodyFeel: 'Yang mungkin kamu rasakan',
    phaseSheetSelfCare: 'Tips self-care',
    noLogTitle: 'Belum ada catatan',
    noLogSubtitle: 'Ketuk untuk mencatat hari pertamamu',
    todayActive: (day: number | string) => `Menstruasi hari ke-${day}`,
    todayCountdown: (n: number) => `${n} hari menuju haid`,
    todayDueToday: 'Haid diperkirakan hari ini',
    todayOverdue: (n: number) => `Telat ${n} hari, tenang aja ya`,
    todayUnknown: 'Yuk, kenali siklusmu',
  },

  calendar: {
    title: 'Kalender Siklus',
    agenda: 'Agenda',
    agendaEmpty: 'Ketuk tanggal, terus pilih aliran haidmu. Begitu satu periode tercatat, perkiraan haid, masa subur, dan ovulasi langsung muncul di sini.',
    nextPeriod: 'Haid berikutnya',
    fertileWindow: 'Masa subur',
    estimatedOvulation: 'Perkiraan ovulasi',
    periodDaysLabel: 'Hari haid',
    loggedLabel: 'Tercatat',
    notesLabel: 'Catatan',
    dayUnit: 'Hari',
    countdownDaysLeft: (n: number) => `${n} hari lagi`,
    countdownToday: 'Hari ini',
    countdownDaysAgo: (n: number) => `${n} hari lalu`,
  },

  calendarGrid: {
    weekdays: ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'] as string[],
    legendPeriod: 'Haid',
    legendPredicted: 'Perkiraan haid',
    legendFertile: 'Masa subur',
    legendOvulation: 'Ovulasi',
    legendHasNote: 'Ada catatan',
  },

  stats: {
    title: 'Kalender Mood',
    moodSummaryCaption: 'Ringkasan mood bulan ini',
    moodSummaryEmptyTitle: 'Belum ada',
    moodSummaryDefaultNote: 'Pilih mood di Beranda tiap hari, nanti rekapnya muncul di sini.',
    moodDistribution: 'Sebaran mood',
    topSignalsTitle: 'Sinyal tubuh tersering',
    topSignalsEmpty: 'Belum ada sinyal tubuh yang tercatat bulan ini. Ketuk tanggal di kalender buat mulai catat.',
    yourCycleTitle: 'Siklus kamu',
    cycleLabel: 'Siklus',
    periodLabel: 'Haid',
    recordedLabel: 'Tercatat',
    dayUnit: 'Hari',
    cycleUnit: 'Siklus',
    historyRowTitle: 'Riwayat & tren siklus',
    historyRowSub: 'Lihat semua siklus yang udah tercatat',
    moodNotes: {
      hp: 'Bulan ini kamu banyak happy-nya. Keep glowing, ya!',
      ir: 'Lagi gampang kesel? Wajar banget, kok. Ambil jeda dulu, ya.',
      ax: 'Lagi sering overthinking, ya? Tarik napas pelan, satu-satu aja.',
      sd: 'Bulan ini lagi sering sedih. Nggak apa-apa, kamu nggak sendirian.',
      en: 'Energimu lagi full! Pas banget buat coba hal baru.',
      cl: 'Vibes kamu lagi adem dan stabil. Nikmatin aja, ya.',
      cf: 'Lagi pede-pedenya, nih. Bawa terus energi itu, ya!',
      ss: 'Lagi gampang baper bulan ini. Perasaanmu valid, kok.',
      st: 'Bulan ini lumayan bikin stres, ya. Jangan lupa kasih jeda buat dirimu.',
      um: 'Lagi sering mager? Nggak apa-apa, tubuhmu mungkin butuh rehat.',
    },
  },

  historySheet: {
    title: 'Riwayat & Tren Siklus',
    avgCycle: 'Rata-rata Siklus',
    avgPeriod: 'Rata-rata Menstruasi',
    recordedCycles: 'Siklus Tercatat',
    cycleLengthTitle: 'Panjang Siklus (hari)',
    cycleLengthHint: 'Rentang umum menurut ACOG: 21–35 hari (area terang di grafik). Tiap tubuh punya ritmenya sendiri.',
    emptyTrend: 'Trenmu bakal kelihatan setelah beberapa siklus tercatat.',
    chartAriaLabel: 'Grafik panjang siklus per periode',
    legendNormal: 'Umum (21–35 hari)',
    legendAbnormal: 'Di luar rentang umum',
    topSignalsTitle: 'Sinyal Tubuh Tersering',
    emptySignals: 'Belum ada sinyal tubuh yang tercatat.',
    historyListTitle: 'Daftar Riwayat Siklus',
    emptyHistory: 'Belum ada siklus yang tercatat. Yuk, mulai dari hari pertama haidmu.',
    colStart: 'Mulai',
    colDuration: 'Durasi',
    colCycle: 'Siklus',
    daysSuffix: (n: number) => `${n} hari`,
  },

  more: {
    title: 'Lainnya',
    subtitle: 'Pengaturan, backup, dan panduan',
    groupApp: 'Aplikasi',
    display: 'Tampilan',
    language: 'Bahasa',
    installApp: 'Pasang di layar utama',
    installAppSub: 'Buka lebih cepat, bisa offline',
    groupGuide: 'Panduan',
    fullGuide: 'Panduan lengkap menstruasi',
    fullGuideSub: 'Fase siklus, angka normal, kapan ke dokter',
    backupGuideTitle: 'Panduan backup & restore',
    backupGuideSub: 'Cara simpan dan pindahin datamu',
    groupData: 'Data',
    backupExport: 'Backup & ekspor',
    backupExportSub: 'JSON, PDF, Excel, WhatsApp',
    localStorage: 'Penyimpanan lokal',
    localStorageSub: (count: number, size: string) => `${count} entri · ${size}`,
    dataSafety: 'Keamanan data',
    dataSafetySub: 'Biar datamu tetap aman',
    groupAbout: 'Tentang',
    privacyPolicy: 'Kebijakan privasi',
    privacyPolicySub: 'Datamu cuma ada di HP kamu',
    supportDev: 'Dukung pengembang',
    supportDevSub: 'Trakteer',
    groupDanger: 'Zona bahaya',
    deleteAll: 'Hapus semua data',
    deleteAllSub: 'Permanen, nggak bisa dibalikin',
    footerNote: 'Datamu cuma punya kamu. Mekar Ayu 100% local-first - tanpa server, tanpa akun, tanpa pelacakan. Semuanya tersimpan di perangkat ini aja.',

    themeOptions: { light: 'Terang', dark: 'Gelap', system: 'Ikuti sistem' },
    languageOptions: { id: 'Indonesia', en: 'English' },

    storageSheetTitle: 'Penyimpanan lokal',
    totalStoredLabel: 'Total data tersimpan',
    totalStored: (count: number) => `${count} entri`,
    dataSizeLabel: 'Ukuran data siklus & catatan',
    persistedYes: 'Datamu terlindungi dari penghapusan otomatis',
    persistedNo: 'Menunggu izin penyimpanan dari browser',

    backupSheetTitle: 'Backup & ekspor',
    backupJSON: 'Backup JSON',
    backupJSONSub: 'Simpan seluruh data, bisa dikunci kata sandi',
    shareWA: 'Kirim backup ke WhatsApp',
    shareWASub: 'Bagikan file backup ke chat pribadimu',
    downloadPDF: 'Unduh laporan PDF',
    downloadPDFSub: 'Ringkasan untuk dibawa ke dokter',
    downloadExcel: 'Unduh Excel',
    downloadExcelSub: 'Tabel siklus dan catatan harian',
    copySummaryWA: 'Salin ringkasan ke WhatsApp',
    copySummaryWASub: 'Kirim ke catatan pribadimu',
    waNumberLabel: 'Nomor WhatsApp kamu (opsional), biar ringkasan langsung kebuka di chat kamu sendiri. Cuma disimpan di perangkat ini.',
    waNumberExample: (
      <>
        Contoh: <b className="text-[var(--ink)]">081234567890</b> atau <b className="text-[var(--ink)]">6281234567890</b>
      </>
    ) as ReactNode,
    waNumberPlaceholder: '081234567890',
    restoreJSON: 'Pulihkan JSON',
    restoreJSONSub: 'Ganti data saat ini dengan file backup',

    safetySheetTitle: 'Keamanan data',
    safetyItem1Title: 'Hapus cache / site data.',
    safetyItem1Body: 'Menekan "Clear Browsing Data" atau "Hapus Cache Website" di pengaturan Chrome/Safari bakal ikut menghapus semua riwayat siklusmu, jadi hati-hati, ya.',
    safetyItem2Title: 'Amankan data berkala.',
    safetyItem2Body: 'Biasakan Backup JSON atau salin ringkasan ke WhatsApp minimal sebulan sekali.',
    safetyItem3Title: 'Ganti HP.',
    safetyItem3Body: 'Sebelum pindah perangkat, unduh file .json lewat Backup, lalu pulihkan di HP barumu.',
    safetyItem4Title: 'Kunci memori.',
    safetyItem4Body: 'Mekar Ayu otomatis meminta browser menjaga datamu saat memori HP penuh. Kamu nggak perlu ngapa-ngapain.',

    installConfirmTitle: 'Pasang Mekar Ayu?',
    installConfirmBody: 'Mekar Ayu bakal muncul di layar utama HP-mu kayak aplikasi biasa, jadi lebih cepat dibuka dan tetap bisa dipakai pas offline. Semua datamu tetap 100% tersimpan di perangkat ini.',
    installConfirmLabel: 'Pasang',

    importConfirmTitle: 'Ganti dengan data backup?',
    importConfirmBody: (cycleCount: number, logCount: number): ReactNode => (
      <>
        File ini berisi <b>{cycleCount} siklus</b> dan <b>{logCount} catatan harian</b>. Melanjutkan akan{' '}
        <b className="text-red-600 dark:text-red-400">menghapus dan mengganti seluruh data saat ini</b> dengan isi file ini. Tindakan ini tidak bisa dibatalkan.
      </>
    ),
    importConfirmLabel: 'Ya, Ganti Data',

    lockExportTitle: 'Kunci file backup?',
    lockExportBody: 'Tambahkan kata sandi supaya isi file ini tidak bisa dibaca orang lain kalau tersimpan di Drive, email, atau HP yang hilang. Simpan baik-baik, ya, karena tanpa kata sandi ini file tidak bisa dipulihkan.',

    unlockTitle: 'File ini terkunci',
    unlockBody: 'Masukkan kata sandi yang dipakai saat file backup ini dibuat.',

    deleteConfirmTitle: 'Hapus semua data?',
    deleteConfirmBody: (): ReactNode => (
      <>
        Seluruh riwayat siklus, gejala, dan catatan harian di perangkat ini akan{' '}
        <b className="text-red-600 dark:text-red-400">dihapus permanen dan tidak bisa dikembalikan</b>. Pastikan kamu sudah membackup data yang ingin disimpan.
      </>
    ),
    deleteConfirmLabel: 'Ya, Hapus Semua',
    deleteConfirmRequireText: 'HAPUS',

    toasts: {
      pdfError: 'Laporan PDF-nya belum berhasil dibuat. Coba lagi, ya.',
      excelError: 'Laporan Excel-nya belum berhasil dibuat. Coba lagi, ya.',
      fileUnreadable: 'File-nya belum bisa dibaca. Pastikan itu file backup JSON dari Mekar Ayu, ya.',
      wrongPassword: 'Kata sandinya belum cocok. Coba lagi, ya.',
      lockedFileInvalid: 'File terkunci ini kayaknya rusak atau nggak valid.',
      exportLockFailed: 'File-nya belum berhasil dikunci. Coba lagi, ya.',
      importedSuccess: 'Datamu udah balik dari file backup.',
      importError: 'Data belum berhasil dipulihkan. Pastikan file backup-nya valid, ya.',
      deletedSuccess: 'Semua data udah dihapus.',
      installSuccess: 'Mekar Ayu sedang dipasang ke perangkatmu.',
    },
  },

  logEditor: {
    flowLabel: 'Aliran haid',
    signalsLabel: 'Sinyal tubuh',
    moodLabel: 'Mood',
    notesLabel: 'Catatan',
    notesPlaceholder: 'Ada cerita apa hari ini? Tulis di sini...',
    savedAutomatically: 'Tersimpan otomatis',
  },

  redFlag: {
    title: 'Tubuhmu lagi kasih sinyal',
    footer: 'Nggak perlu panik, ya. Tapi ada baiknya kamu konsultasi ke dokter kandungan (Sp.OG) biar lebih tenang. Catatan ini bersifat edukatif, bukan diagnosis medis.',
  },

  pwaInstall: {
    title: 'Cara Pasang ke Layar Utama',
    intro: 'Pasang Mekar Ayu di layar utama HP-mu biar bisa dibuka kayak aplikasi biasa: lebih cepat, tetap bisa dipakai offline, dan datamu tetap 100% tersimpan di perangkatmu.',
    iosTab: 'iPhone (Safari)',
    androidTab: 'Android (Chrome)',
    stepLabel: (i: number) => `Langkah ${i}`,
    footerNote: 'Tampilan menu bisa sedikit berbeda tergantung versi browser. Fitur ini butuh Safari (iPhone) atau Chrome/Edge (Android); beberapa browser lain mungkin tidak mendukung "Add to Home Screen".',
    ios: [
      { title: 'Ketuk tombol Share', description: 'Di Safari, ketuk ikon Share (kotak dengan panah ke atas) di bagian bawah layar.' },
      { title: 'Pilih "Add to Home Screen"', description: 'Scroll ke bawah pada daftar menu, lalu ketuk "Tambah ke Layar Utama" / "Add to Home Screen".' },
      { title: 'Ketuk "Add" / "Tambah"', description: 'Konfirmasi nama aplikasi lalu ketuk "Add" di pojok kanan atas.' },
      { title: 'Selesai!', description: 'Ikon Mekar Ayu akan muncul di layar utama HP-mu, bisa dibuka seperti aplikasi biasa tanpa membuka browser.' },
    ],
    android: [
      { title: 'Ketuk menu titik tiga', description: 'Di Chrome, ketuk ikon titik tiga (⋮) di pojok kanan atas.' },
      { title: 'Pilih "Install app"', description: 'Cari dan ketuk "Install app" atau "Tambahkan ke layar Utama" pada menu yang muncul.' },
      { title: 'Ketuk "Install" / "Pasang"', description: 'Konfirmasi pemasangan pada dialog yang muncul.' },
      { title: 'Selesai!', description: 'Mekar Ayu akan terpasang seperti aplikasi native, lengkap dengan ikonnya sendiri di layar utama.' },
    ],
  },

  updateToast: {
    newUpdateTitle: 'Ada update baru, nih',
    newUpdateBody: 'Versi terbaru Mekar Ayu udah siap buat kamu.',
    later: 'Nanti saja',
    update: 'Update',
    offlineReadyBody: 'Mekar Ayu udah bisa dipakai offline juga.',
  },

  fullGuide: {
    title: 'Panduan Lengkap Menstruasi',
    intro: (
      <>
        Menurut ACOG (American College of Obstetricians and Gynecologists), siklus menstruasi layak dipantau sebagai{' '}
        <span className="font-semibold text-[var(--ink)]">tanda vital</span>, sama pentingnya dengan tekanan darah atau detak jantung. Dengan
        mengenal ritmemu sendiri, perubahan pada panjang siklus atau durasi haid lebih cepat kamu sadari, termasuk yang bisa menjadi petunjuk awal
        kondisi seperti PCOS, gangguan tiroid, atau endometriosis.
      </>
    ) as ReactNode,
    cycleJourneyTitle: 'Perjalanan satu siklus (28 hari)',
    hormonalPhasesTitle: '4 fase hormonal',
    bodyNowLabel: 'Yang terjadi di tubuhmu',
    bodyFeelLabel: 'Yang mungkin kamu rasakan',
    selfCareLabel: 'Cara merawat diri',
    normalNumbersTitle: 'Angka normalnya',
    warningPrefix: 'Perlu diperhatikan:',
    docTitle: 'Kapan perlu ke dokter (Sp.OG)',
    educationalNote: 'Catatan ini bersifat edukatif dan bukan pengganti diagnosis medis profesional.',
    referencesTitle: 'Referensi',
    whoDate: '22 Juni 2022',
    clinicalParameters: [
      { parameter: 'Panjang siklus', normal: '21–35 hari (rata-rata 28 hari)', warning: '<21 hari atau >35 hari' },
      { parameter: 'Durasi menstruasi', normal: '2–7 hari (rata-rata 4–5 hari)', warning: '>8 hari' },
      { parameter: 'Variasi antar siklus', normal: '≤4–5 hari', warning: '>7–9 hari berturut-turut' },
      { parameter: 'Ovulasi & masa subur', normal: '~14 hari sebelum menstruasi berikutnya' },
    ],
    redFlags: [
      { title: 'Nyeri hebat (dismenore)', description: 'Nyeri panggul yang mengganggu aktivitas harian dan tidak mereda dengan obat pereda nyeri biasa.' },
      { title: 'Pendarahan abnormal (menorrhagia)', description: 'Mengganti pembalut/tampon setiap jam selama beberapa jam berturut-turut.' },
      { title: 'Siklus tidak teratur', description: 'Siklus konsisten lebih pendek dari 21 hari atau lebih panjang dari 35 hari.' },
      { title: 'Amenore sekunder', description: 'Tidak menstruasi selama 90+ hari berturut-turut (dan bukan karena kehamilan).' },
      { title: 'Pendarahan intermenstrual', description: 'Flek atau pendarahan yang muncul di antara periode menstruasi yang jelas.' },
    ],
  },

  backupGuide: {
    title: 'Panduan Backup & Restore',
    intro: (
      <>
        Karena Mekar Ayu tidak punya server, file <span className="font-semibold text-[var(--ink)]">JSON backup</span> adalah satu-satunya cara
        untuk memindahkan datamu ke HP lain atau menjaganya agar tidak hilang.
      </>
    ) as ReactNode,
    backupTitle: 'Backup (Ekspor)',
    backupSteps: [
      'Buka tab Lainnya → Backup & ekspor, lalu ketuk "Backup JSON".',
      'Pilih mau dikunci dengan kata sandi atau tidak, lalu file otomatis terunduh ke folder Download/File HP-mu, contoh: mekarayu-backup-2026-07-29.json.',
      'Pindahkan file itu ke tempat aman, misalnya Google Drive pribadi, email ke dirimu sendiri, atau simpan di HP baru.',
    ],
    restoreTitle: 'Restore (Impor)',
    restoreSteps: [
      'Buka tab Lainnya → Backup & ekspor, lalu ketuk "Pulihkan JSON".',
      'Pilih file backup yang sesuai (misalnya setelah ganti HP).',
      'Kalau file itu dikunci, masukkan kata sandi yang dipakai saat membuatnya.',
      'Konfirmasi saat diminta. Proses ini akan mengganti seluruh data yang ada saat ini.',
    ],
    warningReplace: (
      <>
        <span className="font-semibold">Restore akan MENGGANTI, bukan menggabungkan.</span> Semua data saat ini akan dihapus dan diganti isi file
        backup. Jika ada data terbaru yang belum di-backup, backup dulu sebelum melakukan restore.
      </>
    ) as ReactNode,
    noPasswordNote: (
      <>
        <span className="font-semibold text-[var(--ink)]">Tanpa kata sandi, file ini tidak terenkripsi</span>, isinya berupa teks biasa yang bisa
        dibaca siapa saja yang membukanya. Pilih "Kunci file backup" saat ekspor kalau mau isinya terenkripsi, lalu simpan kata sandinya baik-baik
        karena hilang kata sandi berarti file itu tidak bisa dipulihkan lagi.
      </>
    ) as ReactNode,
  },

  privacy: {
    title: 'Kebijakan Privasi',
    intro: 'Mekar Ayu dibuat dengan prinsip privasi dulu. Aplikasi ini tidak punya server, jadi data siklus dan catatan harianmu tidak pernah dikirim ke mana pun tanpa kamu memintanya sendiri.',
    section1Title: 'Data Disimpan di HP-mu Sendiri',
    section1Body: 'Seluruh data siklus, catatan harian, dan pengaturan disimpan langsung di penyimpanan lokal browser HP atau komputermu. Tidak ada akun, tidak ada login, dan tidak ada database di server milik kami, karena memang tidak ada server sama sekali.',
    section2Title: 'Kapan Data Bisa Keluar dari HP-mu',
    section2Items: [
      'Saat kamu memilih Backup JSON, file diunduh ke HP-mu sendiri. Kamu yang menentukan mau disimpan atau dipindahkan ke mana.',
      'Saat kamu memilih Salin ringkasan ke WhatsApp, ringkasan dibuka lewat aplikasi WhatsApp-mu dan hanya terkirim kalau kamu sendiri yang mengirimnya.',
      'Menu Dukung pengembang membuka situs pihak ketiga (trakteer.id) di tab baru; halaman itu punya kebijakan privasinya sendiri.',
    ],
    section2Footer: 'Di luar tiga hal di atas, aplikasi ini tidak mengirim data apa pun secara otomatis. Tidak ada analitik, tidak ada pelacak, dan tidak ada pihak ketiga yang diam-diam mengumpulkan datamu.',
    section3Title: 'Kendali Ada di Tanganmu',
    section3Body: 'Kamu bisa mengunci file backup dengan kata sandi supaya isinya terenkripsi. Kalau HP-mu hilang atau dipakai orang lain, data hanya bisa dibaca lewat browser yang sama tempat data itu tersimpan, kecuali orang tersebut punya akses langsung ke perangkatmu.',
    deleteNote: (
      <>
        <span className="font-semibold text-[var(--ink)]">Hapus data kapan saja lewat menu Hapus semua data di tab Lainnya.</span> Karena tidak ada
        salinan di server manapun, penghapusan itu bersifat permanen. Pastikan sudah backup dulu kalau masih membutuhkannya.
      </>
    ) as ReactNode,
  },

  phases: {
    menstrual: {
      label: 'Fase Menstruasi',
      dayRange: 'Hari 1–5/7',
      summary: 'Lapisan rahim meluruh. Waktunya istirahat dulu.',
      hormonal: 'Estrogen dan progesteron lagi di titik terendah karena lapisan rahim meluruh. Wajar banget kalau tubuhmu minta jeda.',
      bodyExperience: 'Ini fase istirahatmu. Kram (dismenore), pegal di punggung bawah, dan gampang capek itu sinyal tubuh buat slow down dulu.',
      selfCare: [
        { care: 'comfort' as const, tip: 'Tempel kompres atau bantal hangat di perut bawah biar otot rahim lebih rileks.' },
        { care: 'nutrition' as const, tip: 'Pilih makanan kaya zat besi kayak bayam, daging merah, atau lentil, plus vitamin C biar lebih gampang diserap.' },
        { care: 'hydration' as const, tip: 'Seduh teh jahe atau chamomile hangat buat bantu redain kembung dan kram.' },
      ],
    },
    follicular: {
      label: 'Fase Folikuler',
      dayRange: 'Hari 6–13',
      summary: 'Sel telur mulai matang, energi naik lagi.',
      hormonal: 'Kelenjar hipofisis melepas FSH dan estrogen pelan-pelan naik, kayak kuncup yang siap mekar.',
      bodyExperience: 'Ini fase berkembangmu. Energi balik lagi, mood lebih enteng, kulit glowing, dan fokus makin tajam.',
      selfCare: [
        { care: 'activity' as const, tip: 'Waktu yang pas buat olahraga yang lebih intens, ngerjain proyek kreatif, atau hangout bareng orang tersayang.' },
        { care: 'skincare' as const, tip: 'Estrogen yang naik bikin kulitmu glowing alami, jadi pelembap ringan aja udah cukup.' },
      ],
    },
    ovulatory: {
      label: 'Fase Ovulasi',
      dayRange: 'Hari ke-14 / Pertengahan Siklus',
      summary: 'Sel telur dilepas. Ini puncak masa suburmu.',
      hormonal: 'Lonjakan hormon luteinizing (LH) melepas sel telur matang, dan estrogen lagi di puncaknya.',
      bodyExperience: 'Ini fase mekarmu, lagi di puncak pesona. Lendir serviks jadi bening dan elastis kayak putih telur, suhu tubuh sedikit naik, gairah meningkat, dan kadang ada nyeri ringan di satu sisi panggul (Mittelschmerz).',
      selfCare: [
        { care: 'fertility' as const, tip: 'Ini puncak masa suburmu. Penting buat dicatat, entah kamu lagi merencanakan kehamilan atau memantau kontrasepsi.' },
      ],
    },
    luteal: {
      label: 'Fase Luteal',
      dayRange: 'Hari 15–28',
      summary: 'Tubuh bersiap menuju haid, PMS bisa muncul.',
      hormonal: 'Progesteron ambil alih buat menebalkan lapisan rahim. Kalau nggak ada pembuahan, hormon turun cukup tajam di akhir fase.',
      bodyExperience: 'Tubuhmu mulai melambat. Payudara sensitif, perut kembung, gampang baper, pengin ngemil terus, atau jerawatan itu tanda PMS yang wajar, bukan salahmu.',
      selfCare: [
        { care: 'nutrition' as const, tip: 'Kurangi garam dan gula olahan biar tubuh nggak nahan banyak cairan dan mood lebih stabil.' },
        { care: 'rest' as const, tip: 'Utamakan tidur nyenyak 7–8 jam, terus pilih gerak yang santai kayak yoga ringan atau jalan kaki.' },
      ],
    },
  },

  symptoms: {
    cr: 'Kram',
    hd: 'Sakit Kepala',
    ac: 'Jerawat',
    bl: 'Kembung',
    ft: 'Lelah',
    bk: 'Nyeri Punggung',
    tb: 'Payudara Nyeri',
    ns: 'Mual',
    cv: 'Ngidam',
    in: 'Susah Tidur',
    dc: 'Keputihan',
    ba: 'Pegal-pegal',
    dr: 'Diare',
    sp: 'Nyeri Hebat (mengganggu aktivitas)',
  },

  moods: {
    hp: 'Bahagia',
    ir: 'Mudah Marah',
    ax: 'Cemas',
    sd: 'Sedih',
    en: 'Berenergi',
    cl: 'Tenang',
    cf: 'Percaya Diri',
    ss: 'Sensitif',
    st: 'Stres',
    um: 'Mager',
  },

  flows: {
    n: 'Tidak Ada',
    s: 'Flek',
    l: 'Ringan',
    m: 'Sedang',
    h: 'Deras',
  },

  careTitles: {
    comfort: 'Kenyamanan',
    nutrition: 'Nutrisi',
    hydration: 'Hidrasi',
    activity: 'Aktivitas',
    skincare: 'Perawatan Kulit',
    fertility: 'Kesadaran Kesuburan',
    rest: 'Istirahat',
  },

  signalCare: {
    cr: { care: 'comfort' as const, tip: 'Lagi kram? Tempel kompres hangat di perut bawah, terus rebahan sebentar.' },
    hd: { care: 'hydration' as const, tip: 'Sakit kepala sering muncul pas kurang minum. Minum air putih dulu, terus istirahatin mata dari layar.' },
    ac: { care: 'skincare' as const, tip: 'Cuci muka pakai pembersih yang lembut dan jangan dipencet, ya, biar jerawatnya nggak makin meradang.' },
    bl: { care: 'nutrition' as const, tip: 'Biar kembungnya reda, kurangi dulu makanan asin dan minuman bersoda.' },
    ft: { care: 'rest' as const, tip: 'Tubuhmu lagi minta jeda. Tidur lebih awal malam ini dan jangan paksain diri.' },
    bk: { care: 'comfort' as const, tip: 'Kompres hangat di punggung bawah plus peregangan ringan bisa bantu ngurangin nyerinya.' },
    tb: { care: 'comfort' as const, tip: 'Pakai bra yang nyaman dan nggak ketat dulu biar payudara nggak makin nyeri.' },
    ns: { care: 'nutrition' as const, tip: 'Makan porsi kecil tapi sering, dan coba teh jahe hangat buat redain mual.' },
    cv: { care: 'nutrition' as const, tip: 'Ngidam itu wajar, kok. Turutin secukupnya, terus imbangi sama buah atau camilan berprotein.' },
    in: { care: 'rest' as const, tip: 'Jauhin HP sejam sebelum tidur dan redupin lampu kamar biar lebih gampang ngantuk.' },
    dc: { care: 'comfort' as const, tip: 'Pakai celana dalam katun yang menyerap keringat dan ganti kalau udah lembap.' },
    ba: { care: 'activity' as const, tip: 'Stretching ringan atau jalan santai 10 menit bisa bikin badan yang pegal lebih enakan.' },
    dr: { care: 'hydration' as const, tip: 'Ganti cairan yang hilang dengan banyak minum, dan hindari dulu makanan pedas atau berminyak.' },
    sp: { care: 'rest' as const, tip: 'Istirahat dulu, ya. Kalau nyerinya nggak mereda, sebaiknya periksa ke dokter.' },
    hp: { care: 'activity' as const, tip: 'Lagi happy! Pas banget buat ngerjain hal yang kamu suka atau ketemu orang tersayang.' },
    ir: { care: 'rest' as const, tip: 'Lagi gampang kesel? Ambil jeda sebentar dan tarik napas pelan sebelum lanjut.' },
    ax: { care: 'rest' as const, tip: 'Tarik napas 4 detik, tahan 4 detik, buang 4 detik. Ulangi sampai lebih tenang.' },
    sd: { care: 'comfort' as const, tip: 'Nggak apa-apa sedih. Cerita ke orang yang kamu percaya atau tulis aja di catatan.' },
    en: { care: 'activity' as const, tip: 'Energimu lagi full, cocok buat olahraga atau mulai hal yang dari kemarin ketunda.' },
    cl: { care: 'activity' as const, tip: 'Vibes lagi adem. Jaga ritmenya dengan jalan santai atau me-time favoritmu.' },
    cf: { care: 'activity' as const, tip: 'Lagi pede-pedenya, nih. Waktu yang pas buat coba hal baru.' },
    ss: { care: 'comfort' as const, tip: 'Lagi gampang baper? Kasih ruang buat dirimu dan kurangi scroll medsos dulu.' },
    st: { care: 'rest' as const, tip: 'Pilih satu hal yang paling penting dulu, sisanya bisa nunggu. Jangan lupa jeda.' },
    um: { care: 'activity' as const, tip: 'Mulai dari yang kecil aja, misalnya 5 menit beresin meja. Biasanya abis itu lebih gampang lanjut.' },
  },

  flags: {
    irregularity: {
      short_cycle: 'Siklus lebih pendek dari 21 hari (Polymenorrhea).',
      long_cycle: 'Siklus lebih panjang dari 35 hari (Oligomenorrhea).',
      high_variance: 'Variasi antar siklus lebih dari 7 hari secara berturut-turut.',
      prolonged_bleeding: 'Durasi menstruasi lebih dari 8 hari (Menorrhagia).',
      amenorrhea: 'Tidak ada menstruasi selama lebih dari 90 hari.',
    },
    red: {
      severe_pain: 'Nyeri hebat yang mengganggu aktivitas harian dan tidak mereda dengan obat pereda nyeri biasa.',
      heavy_bleeding: 'Pendarahan deras tercatat 3 hari berturut-turut. Waspadai tanda Menorrhagia.',
      irregular_cycle: 'Panjang siklus di luar rentang normal (21–35 hari) secara konsisten.',
      amenorrhea: 'Tidak menstruasi selama 90+ hari berturut-turut (dan bukan karena kehamilan).',
      intermenstrual_bleeding: 'Terdapat flek/bercak darah di luar periode menstruasi utama.',
    },
  },

  cycleStatus: {
    active: (day: number | string) => `Hari ke-${day} Menstruasi`,
    countdown: (days: number) => `${days} hari menuju haid`,
    dueToday: 'Haid diperkirakan hari ini',
    overdue: (days: number) => `Lewat ${days} hari dari perkiraan`,
    unknown: 'Yuk, kenali siklusmu',
  },

  passwordDialog: {
    passwordPlaceholder: 'Kata sandi',
    repeatPasswordPlaceholder: 'Ulangi kata sandi',
    showPassword: 'Tampilkan kata sandi',
    hidePassword: 'Sembunyikan kata sandi',
    lockAndDownload: 'Kunci & Unduh',
    downloadWithoutPassword: 'Unduh Tanpa Sandi',
    unlock: 'Buka Kunci',
    errorTooShort: 'Kata sandi minimal 4 karakter.',
    errorMismatch: 'Kedua kata sandinya belum sama. Cek lagi, ya.',
  },

  export: {
    pdf: {
      headerTitle: 'Mekar Ayu - Laporan Riwayat Siklus Menstruasi',
      generatedOn: (date: string) => `Dibuat pada: ${date}`,
      dataSource: 'Sumber data: 100% tercatat lokal oleh pengguna (self-reported, local-first).',
      clinicalSummaryTitle: 'Ringkasan Klinis',
      paramHeaders: ['Parameter', 'Nilai', 'Rentang Normal (ACOG)'] as string[],
      rowAvgCycle: 'Rata-rata Panjang Siklus',
      rowAvgPeriod: 'Rata-rata Durasi Menstruasi',
      rowCycleCount: 'Jumlah Siklus Tercatat',
      rowNextPeriod: 'Estimasi Menstruasi Berikutnya',
      rowOvulation: 'Estimasi Ovulasi',
      daysUnit: (n: number) => `${n} hari`,
      normalCycleRange: '21–35 hari',
      normalPeriodRange: '2–7 hari',
      ovulationNormalNote: '~14 hari sebelum menstruasi',
      irregularityTitle: 'Catatan Ketidakteraturan',
      indicatorHeader: 'Indikator',
      historyTitle: 'Riwayat Siklus',
      historyHeaders: ['Mulai', 'Selesai', 'Durasi Menstruasi', 'Panjang Siklus'] as string[],
      symptomLogTitle: 'Catatan Gejala & Mood',
      symptomLogHeaders: ['Tanggal', 'Flow', 'Gejala', 'Mood', 'Catatan'] as string[],
      footer: 'Dihasilkan oleh Mekar Ayu - 100% Local-First, Zero Backend, Zero Telemetry.',
      filenamePrefix: 'mekarayu-laporan-medis',
    },
    excel: {
      sheetCycles: 'Riwayat Siklus',
      sheetLogs: 'Catatan Harian',
      colStartDate: 'Tanggal Mulai',
      colEndDate: 'Tanggal Selesai',
      colPeriodDuration: 'Durasi Menstruasi (hari)',
      colCycleLength: 'Panjang Siklus (hari)',
      colNotes: 'Catatan',
      colDate: 'Tanggal',
      colFlow: 'Flow',
      colSymptoms: 'Gejala',
      colMood: 'Mood',
      filenamePrefix: 'mekarayu-data',
    },
    whatsapp: {
      headerLine: '*REKAP SIKLUS MENSTRUASI (MEKAR AYU)*',
      periodLabel: (m: string) => `Periode: ${m}`,
      summaryTitle: '*Ringkasan Siklus:*',
      totalDaysLogged: (n: number) => `Total Hari Dicatat: ${n} hari`,
      lastPeriodStart: (date: string) => `Hari Pertama Menstruasi Terakhir: ${date}`,
      noDataYet: 'Belum ada data',
      statusLabel: (avg: string) => `Status Siklus: ${avg}`,
      avgDays: (n: number) => `Rata-rata ${n} Hari`,
      notEnoughData: 'Data belum cukup untuk rata-rata',
      dailyNotesTitle: '*Catatan Harian Bulan Ini:*',
      logLine: (date: string, flow: string, symptoms: string, moods: string, notes: string) =>
        `• ${date}: Flow (${flow}), Gejala (${symptoms}), Mood (${moods}), Catatan: ${notes}`,
      noFlow: 'tidak ada',
      noDailyNotes: 'Belum ada catatan harian pada bulan ini.',
      footerPrivacy: 'Data ini dicatat privat di Mekar Ayu (100% Local-First, Tanpa Server).',
    },
  },
};

export type Translations = typeof id;
