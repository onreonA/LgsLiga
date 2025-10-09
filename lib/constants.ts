// Site genelinde kullanılacak sabit metinler ve mesajlar

export const DASHBOARD_TITLES = {
  dashboard: "Kaptan Panosu",
  quests: "Görev Tahtası",
  bossFight: "Boss Fight",
  exams: "Deneme Sınavları",
  reports: "Raporlarım",
  app: "VolleLearn",
  shop: "Ödül Mağazası",
  settings: "Motivasyon Köşesi",
};

export const MOTIVATION_MESSAGES = [
  {
    id: 1,
    message: "Her gün biraz daha iyi olmak, yarın şampiyon olmak demek! 🏐",
    type: "daily",
  },
  {
    id: 2,
    message: "Bugün çalışarak yarın kendine teşekkür edeceksin. Başla!",
    type: "study",
  },
  {
    id: 3,
    message:
      "Voleybolda nasıl takım halinde güçlüysen, LGS'de de kararlılığınla güçlüsün!",
    type: "teamwork",
  },
  {
    id: 4,
    message: "Her soru bir smaç fırsatı! Güçlü ol, isabetli vur! 💪",
    type: "challenge",
  },
  {
    id: 5,
    message: "Zorlandığın her konu, güçlendiğin bir adım. Pes etme!",
    type: "perseverance",
  },
  {
    id: 6,
    message: "Hedefin net, kararlılığın güçlü. LGS'de de şampiyon olacaksın!",
    type: "goal",
  },
];

export const SUBJECT_MESSAGES = {
  matematik: {
    title: "Matematik - Sayıların Dansı",
    messages: [
      "Her problem bir bilmece, her çözüm bir keşif!",
      "Formüller senin süper gücün, kullan onları!",
      "Matematik, mantığının sahneye çıktığı yer.",
      "Sayılar seninle konuşuyor, dinle onları!",
    ],
    icon: "ri-calculator-line",
    color: "blue",
  },
  turkce: {
    title: "Türkçe - Kelimelerin Büyüsü",
    messages: [
      "Paragrafları çözmek bir keşif, her cümle bir ipucu!",
      "Kelimeler senin dostun, anlamları hazinen!",
      "Her metin bir yolculuk, sen de yolcusun.",
      "Dil bilgisi kuralları, yazının şifresi!",
    ],
    icon: "ri-book-open-line",
    color: "green",
  },
  fen: {
    title: "Fen Bilimleri - Evrenin Sırları",
    messages: [
      "Sorular, sadece bilgini değil merakını da ölçüyor!",
      "Her deney bir macera, her keşif bir zafer!",
      "Doğanın dilini öğren, onunla konuş!",
      "Bilim, merakının karşılığını veren tek şey!",
    ],
    icon: "ri-flask-line",
    color: "purple",
  },
  sosyal: {
    title: "Sosyal Bilgiler - Tarihten Geleceğe",
    messages: [
      "Geçmiş senin rehberin, gelecek senin eserin!",
      "Her tarih sorusu bir zaman yolculuğu!",
      "Coğrafya, dünyanın haritasını çizme sanatı!",
      "Toplumu anlamak, kendini anlamaktır!",
    ],
    icon: "ri-earth-line",
    color: "orange",
  },
  inkilap: {
    title: "İnkılap Tarihi - Milli Mücadele",
    messages: [
      "Atatürk'ün izinde, bilgiyle aydınlan!",
      "Her soru, şanlı tarihimizin bir parçası!",
      "Cumhuriyet değerleri, senin gücün!",
      "Milli mücadele ruhu, çalışma azminle yaşıyor!",
    ],
    icon: "ri-flag-line",
    color: "red",
  },
  din: {
    title: "Din Kültürü - Değerler Eğitimi",
    messages: [
      "Güzel ahlak, en değerli bilgidir!",
      "Her soru, değerlerini güçlendirir!",
      "Hoşgörü ve saygı, en büyük kazancın!",
      "İnsan olmak, en güzel ders!",
    ],
    icon: "ri-heart-line",
    color: "pink",
  },
};

export const STREAK_MESSAGES = {
  daily: [
    {
      days: 1,
      message: "Harika başlangıç! İlk adımı attın! 🎯",
      emoji: "🌱",
    },
    {
      days: 3,
      message: "3 gün üst üste! Momentum yakaladın! ⚡",
      emoji: "🔥",
    },
    {
      days: 7,
      message: "7 gün üst üste çalıştın! Bu disiplin seni zirveye taşır! 🏆",
      emoji: "👑",
    },
    {
      days: 14,
      message: "2 hafta seri! Sen gerçek bir şampiyonsun! 💪",
      emoji: "🏐",
    },
    {
      days: 30,
      message: "1 ay kesintisiz! Bu azim efsanevi! Tebrikler! 🌟",
      emoji: "🚀",
    },
    {
      days: 60,
      message: "60 günlük seri! Artık sen bir LGS efsanesisin! 🔥⚡",
      emoji: "👑",
    },
  ],
  broken: [
    {
      message: "Seri kırıldı ama sorun değil! Her şampiyon bazen tökezler. 💪",
      encouragement: "Önemli olan tekrar kalkmak. Yeni serini bugün başlat!",
    },
    {
      message: "Bir gün kaçırdın, dünya yıkılmadı! 🌍",
      encouragement:
        "Voleybolda da bazen top kaçar. Önemli olan bir sonraki vuruş!",
    },
  ],
  motivation: [
    {
      message: "Serini koruma zamanı! Bugün de güçlü kal! 🏐",
      type: "daily_reminder",
    },
    {
      message: "Dün harikaydın, bugün de aynı enerjinle devam! ⚡",
      type: "continue",
    },
    {
      message: "Her gün biraz daha güçleniyorsun! Devam et! 💪",
      type: "progress",
    },
  ],
};

export const FAMILY_MESSAGES = {
  support: [
    {
      sender: "Anne",
      message: "Seninle gurur duyuyoruz! Her gün biraz daha büyüyorsun. ❤️",
      type: "pride",
    },
    {
      sender: "Baba",
      message: "Bu yolculukta yalnız değilsin! Biz hep yanındayız. 🤝",
      type: "support",
    },
    {
      sender: "Abla",
      message: "Küçük kardeşim ama büyük hedefler! Sen yaparsın! 🌟",
      type: "encouragement",
    },
    {
      sender: "Dede",
      message: "Sabır ve çalışkanlık, her kapıyı açar. Sen de açacaksın! 🗝️",
      type: "wisdom",
    },
  ],
  congratulations: [
    {
      message: "Harika bir performans! Tebrikler şampiyon! 🏆",
      occasion: "exam_success",
    },
    {
      message: "Bu başarı seni daha da motive etsin! Böyle devam! 🎉",
      occasion: "quest_completion",
    },
    {
      message: "Çalışkan ellerin her zaman bereketli olsun! 🙌",
      occasion: "study_milestone",
    },
  ],
  reminders: [
    {
      message:
        "Çalışmayı unutma ama kendini çok yorma da. Sağlığın her şeyden önemli! 🌸",
      type: "health",
    },
    {
      message: "Düzenli beslen, bol su iç. Beynin için en iyi yakıt! 🧠",
      type: "nutrition",
    },
    {
      message: "Ara vermek de önemli. Dinlenince daha güçlü olursun! 😊",
      type: "rest",
    },
  ],
};

export const VOLLEYBALL_THEMES = {
  positions: [
    { name: "Kaptan", description: "Takımı yöneten lider", level: "advanced" },
    { name: "Libero", description: "Savunmanın kalbi", level: "intermediate" },
    { name: "Smaçör", description: "Güçlü saldırgan", level: "beginner" },
    { name: "Pasör", description: "Oyunun beyni", level: "expert" },
  ],
  terms: {
    spike: "Smaç - Güçlü ve isabetli vuruş",
    serve: "Servis - Oyunu başlatan hareket",
    block: "Blok - Rakibin saldırısını durdurma",
    dig: "Manşet - Savunma hareketi",
    set: "Pas - Takım arkadaşına yardım",
  },
  motivational_terms: [
    "Her smaç gibi güçlü ol!",
    "Servisin gibi kararlı başla!",
    "Bloğun gibi engelleri aş!",
    "Pasın gibi takım ol!",
    "Manşetin gibi dayanıklı ol!",
  ],
};

export const ACHIEVEMENT_MESSAGES = {
  first_quest: "İlk görevini tamamladın! Hoş geldin şampiyon! 🎯",
  first_boss: "İlk Boss'u yendin! Gerçek bir savaşçısın! ⚔️",
  perfect_score: "Mükemmel skor! Sen bir efsanesin! 💯",
  streak_week: "Haftalık seri! Disiplinin takdire şayan! 📅",
  streak_month: "Aylık seri! Sen gerçek bir atlet ruhu taşıyorsun! 🏃‍♂️",
  level_up: "Seviye atladın! Güç ve bilgin arttı! ⬆️",
  subject_master: "Bu konuda ustalaştın! Tebrikler! 🎓",
  exam_success: "Sınav başarısı! Emeğin karşılığını aldın! 📝",
};

export const UI_LABELS = {
  buttons: {
    start: "Başlat",
    continue: "Devam Et",
    finish: "Bitir",
    retry: "Tekrar Dene",
    next: "Sonraki",
    previous: "Önceki",
    save: "Kaydet",
    cancel: "İptal",
    close: "Kapat",
    edit: "Düzenle",
    delete: "Sil",
    add: "Ekle",
    submit: "Gönder",
    back: "Geri",
  },
  status: {
    pending: "Bekliyor",
    in_progress: "Devam Ediyor",
    completed: "Tamamlandı",
    failed: "Başarısız",
    expired: "Süresi Dolmuş",
    locked: "Kilitli",
    available: "Mevcut",
  },
  time: {
    seconds: "saniye",
    minutes: "dakika",
    hours: "saat",
    days: "gün",
    weeks: "hafta",
    months: "ay",
    remaining: "kalan",
    elapsed: "geçen",
  },
};

export const ERROR_MESSAGES = {
  network: "İnternet bağlantınızı kontrol edin.",
  auth: "Giriş yapmanız gerekiyor.",
  permission: "Bu işlem için yetkiniz bulunmuyor.",
  validation: "Lütfen tüm alanları doğru doldurun.",
  server: "Sunucu hatası. Lütfen tekrar deneyin.",
  not_found: "Aradığınız sayfa bulunamadı.",
  timeout: "İşlem zaman aşımına uğradı.",
};

export const SUCCESS_MESSAGES = {
  saved: "Başarıyla kaydedildi!",
  updated: "Güncellenme tamamlandı!",
  deleted: "Silme işlemi başarılı!",
  sent: "Gönderim tamamlandı!",
  completed: "İşlem başarıyla tamamlandı!",
  progress_saved: "İlerlemeniz kaydedildi!",
};
