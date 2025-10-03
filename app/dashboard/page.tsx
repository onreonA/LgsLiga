
'use client';

import { useState, useEffect } from 'react';

export default function DashboardPage() {
  const [currentTime, setCurrentTime] = useState('');
  const [currentMotivation, setCurrentMotivation] = useState('');
  const [isClient, setIsClient] = useState(false);
  const [todayVideo, setTodayVideo] = useState<{
    title: string;
    videoId: string;
    description: string;
  } | null>(null);

  const motivationMessages = [
    "Bugün sahada olduğun gibi LGS'de de smaç yap! 🏐",
    "Her doğru cevap takımına bir sayı kazandırır! 💪",
    "Voleybolda olduğu gibi LGS'de de takım halinde başarıya ulaş! 🏆",
    "Antrenmanlarında verdiğin mücadeleyi LGS'de de göster! 🔥"
  ];

  // Mock data - gerçek uygulamada Supabase'den gelecek
  const mockDailyVideos = {
    '2024-01-15': {
      title: 'LGS Matematik Motivasyonu',
      videoId: 'dQw4w9WgXcQ',
      description: 'Matematik sorularına yaklaşımın nasıl olmalı?'
    },
    '2024-01-16': {
      title: 'Başarı Hikayesi - Eski LGS Birincisi',
      videoId: 'dQw4w9WgXcQ',
      description: 'Geçen sene LGS birincisi olan öğrencinin deneyimleri'
    },
    '2024-01-17': {
      title: 'Etkili Çalışma Teknikleri',
      videoId: 'dQw4w9WgXcQ',
      description: 'Daha verimli nasıl çalışabilirsin?'
    },
    '2024-01-18': {
      title: 'Motivasyon ve Hedef Belirleme',
      videoId: 'dQw4w9WgXcQ',
      description: 'Hedeflerini nasıl belirlemeli ve motive kalmalısın?'
    },
    '2024-01-19': {
      title: 'Sınav Kaygısı ile Başa Çıkma',
      videoId: 'dQw4w9WgXcQ',
      description: 'Sınav öncesi stresi nasıl yönetebilirsin?'
    },
    '2024-01-20': {
      title: 'Zaman Yönetimi Teknikleri',
      videoId: 'dQw4w9WgXcQ',
      description: 'Zamanını en verimli şekilde nasıl kullanırsın?'
    }
  };

  useEffect(() => {
    setIsClient(true);
    setCurrentTime(new Date().toLocaleTimeString('tr-TR', {
      hour: '2-digit',
      minute: '2-digit'
    }));
    setCurrentMotivation(
      motivationMessages[Math.floor(Math.random() * motivationMessages.length)]
    );

    // Bugünün tarihini al ve video bul - eğer bugün yoksa varsayılan video göster
    const today = new Date().toISOString().split('T')[0];
    let video = mockDailyVideos[today as keyof typeof mockDailyVideos];
    
    // Eğer bugün için video yoksa, varsayılan bir video göster
    if (!video) {
      video = {
        title: 'Günün Motivasyon Videosu',
        videoId: 'dQw4w9WgXcQ',
        description: 'Bugün kendini motive edecek özel bir video!'
      };
    }
    
    setTodayVideo(video);
  }, []);

  if (!isClient) {
    return (
      <div className="space-y-8">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Merhaba Sporcu! 👋</h1>
              <p className="text-blue-100 mb-4">LGS Liga'ya hoş geldin. Bugün hangi konuları çalışacaksın?</p>
              <div className="bg-white/20 rounded-xl p-4">
                <p className="text-lg font-medium">Yükleniyor...</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold mb-2">--:--</div>
              <div className="text-blue-100">Şu an</div>
            </div>
          </div>
        </div>
        <div className="animate-pulse">
          <div className="h-32 bg-gray-200 rounded-xl mb-6"></div>
          <div className="h-64 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Merhaba Sporcu! 👋</h1>
            <p className="text-blue-100 mb-4">LGS Liga'ya hoş geldin. Bugün hangi konuları çalışacaksın?</p>
            <div className="bg-white/20 rounded-xl p-4">
              <p className="text-lg font-medium">{currentMotivation}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold mb-2" suppressHydrationWarning={true}>{currentTime}</div>
            <div className="text-blue-100">Şu an</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <i className="ri-target-line text-2xl text-blue-500 w-8 h-8 flex items-center justify-center"></i>
            <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">+5 XP</span>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">87</div>
          <div className="text-sm text-gray-600">Bu hafta çözülen soru</div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <i className="ri-sword-line text-2xl text-red-500 w-8 h-8 flex items-center justify-center"></i>
            <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">Boss</span>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">3</div>
          <div className="text-sm text-gray-600">Boss savaşı kazanıldı</div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <i className="ri-fire-line text-2xl text-orange-500 w-8 h-8 flex items-center justify-center"></i>
            <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full">Streak</span>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">12</div>
          <div className="text-sm text-gray-600">Günlük çalışma serisi</div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <i className="ri-trophy-line text-2xl text-blue-500 w-8 h-8 flex items-center justify-center"></i>
            <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">Level</span>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">15</div>
          <div className="text-sm text-gray-600">Mevcut seviye</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Günün Motivasyon Videosu - Her zaman göster */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <i className="ri-play-circle-line text-red-500 mr-3 w-6 h-6 flex items-center justify-center"></i>
                Günün Motivasyon Videosu
              </h2>
              <span className="text-xs bg-red-100 text-red-600 px-3 py-1 rounded-full">
                Bugün
              </span>
            </div>
            
            <div className="bg-gray-100 rounded-xl overflow-hidden mb-4">
              <div className="aspect-video">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${todayVideo?.videoId}?rel=0&modestbranding=1`}
                  title={todayVideo?.title}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">{todayVideo?.title}</h3>
              <p className="text-sm text-gray-600">{todayVideo?.description}</p>
            </div>
          </div>

          {/* Günlük Görevler */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Günlük Görevlerin</h2>
              <span className="text-sm text-gray-500">3/5 tamamlandı</span>
            </div>

            <div className="space-y-4">
              <div className="flex items-center p-4 bg-green-50 rounded-xl border border-green-200">
                <i className="ri-check-line text-green-500 text-xl mr-4 w-6 h-6 flex items-center justify-center"></i>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">20 Matematik sorusu çöz</h3>
                  <p className="text-sm text-gray-600">Tamamlandı - +15 XP kazandın!</p>
                </div>
                <span className="text-sm font-medium text-green-600">20/20</span>
              </div>

              <div className="flex items-center p-4 bg-green-50 rounded-xl border border-green-200">
                <i className="ri-check-line text-green-500 text-xl mr-4 w-6 h-6 flex items-center justify-center"></i>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">10 Fen sorusu çöz</h3>
                  <p className="text-sm text-gray-600">Tamamlandı - +10 XP kazandın!</p>
                </div>
                <span className="text-sm font-medium text-green-600">10/10</span>
              </div>

              <div className="flex items-center p-4 bg-blue-50 rounded-xl border border-blue-200">
                <i className="ri-book-line text-blue-500 text-xl mr-4 w-6 h-6 flex items-center justify-center"></i>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">15 Türkçe sorusu çöz</h3>
                  <p className="text-sm text-gray-600">Devam ediyor...</p>
                </div>
                <span className="text-sm font-medium text-blue-600">8/15</span>
              </div>

              <div className="flex items-center p-4 bg-gray-50 rounded-xl border border-gray-200">
                <i className="ri-time-line text-gray-400 text-xl mr-4 w-6 h-6 flex items-center justify-center"></i>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">Boss savaşına katıl</h3>
                  <p className="text-sm text-gray-600">Henüz başlanmadı</p>
                </div>
                <span className="text-sm font-medium text-gray-500">0/1</span>
              </div>

              <div className="flex items-center p-4 bg-gray-50 rounded-xl border border-gray-200">
                <i className="ri-time-line text-gray-400 text-xl mr-4 w-6 h-6 flex items-center justify-center"></i>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">30 dakika çalış</h3>
                  <p className="text-sm text-gray-600">Henüz başlanmadı</p>
                </div>
                <span className="text-sm font-medium text-gray-500">0/30</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Bu Hafta</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Matematik</span>
                <span className="font-medium">78 soru</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '78%' }}></div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Fen Bilimleri</span>
                <span className="font-medium">45 soru</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '45%' }}></div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Türkçe</span>
                <span className="font-medium">32 soru</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '32%' }}></div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Sosyal Bilgiler</span>
                <span className="font-medium">28 soru</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-orange-500 h-2 rounded-full" style={{ width: '28%' }}></div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-pink-500 rounded-xl p-6 text-white">
            <h3 className="text-lg font-bold mb-3">🏐 Yaklaşan Antrenmanlar</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Pazartesi</span>
                <span className="font-medium">17:00 - 19:00</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Çarşamba</span>
                <span className="font-medium">17:00 - 19:00</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Cuma</span>
                <span className="font-medium">17:00 - 19:00</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-white/20">
              <p className="text-xs opacity-90">
                Antrenman öncesi ve sonrası çalışma programını unutma! 💪
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Son Başarılar</h3>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                  <i className="ri-trophy-line text-white text-sm w-4 h-4 flex items-center justify-center"></i>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Matematik Ustası</p>
                  <p className="text-xs text-gray-600">100 matematik sorusu çöz</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <i className="ri-fire-line text-white text-sm w-4 h-4 flex items-center justify-center"></i>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Haftalık Seri</p>
                  <p className="text-xs text-gray-600">7 gün üst üste çalış</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                  <i className="ri-sword-line text-white text-sm w-4 h-4 flex items-center justify-center"></i>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Boss Avcısı</p>
                  <p className="text-xs text-gray-600">İlk boss savaşını kazan</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
