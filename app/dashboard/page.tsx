"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

interface WeeklySubjectStats {
  subject: string;
  totalQuestions: number;
  color: string;
}

export default function DashboardPage() {
  const [currentTime, setCurrentTime] = useState("");
  const [currentMotivation, setCurrentMotivation] = useState("");
  const [isClient, setIsClient] = useState(false);
  const [todayVideo, setTodayVideo] = useState<{
    title: string;
    videoId: string;
    description: string;
  } | null>(null);
  const [weeklyStats, setWeeklyStats] = useState<WeeklySubjectStats[]>([]);
  const [totalWeeklyQuestions, setTotalWeeklyQuestions] = useState<number>(0);

  const motivationMessages = [
    "Bugün sahada olduğun gibi LGS'de de smaç yap! 🏐",
    "Her doğru cevap takımına bir sayı kazandırır! 💪",
    "Voleybolda olduğu gibi LGS'de de takım halinde başarıya ulaş! 🏆",
    "Antrenmanlarında verdiğin mücadeleyi LGS'de de göster! 🔥",
  ];

  useEffect(() => {
    setIsClient(true);
    setCurrentTime(
      new Date().toLocaleTimeString("tr-TR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    );
    setCurrentMotivation(
      motivationMessages[Math.floor(Math.random() * motivationMessages.length)],
    );

    // Fetch today's video from Supabase
    fetchTodayVideo();

    // Fetch weekly stats
    fetchWeeklyStats();
  }, []);

  const fetchTodayVideo = async () => {
    try {
      // UTC+3 (Türkiye) saat diliminde bugünün tarihini al
      const now = new Date();
      const turkishTime = new Date(now.getTime() + 3 * 60 * 60 * 1000); // UTC+3
      const today = turkishTime.toISOString().split("T")[0];

      console.log("🔍 Bugünün tarihi (TR UTC+3):", today);

      const { data, error } = await supabase
        .from("daily_videos")
        .select("*")
        .eq("date", today)
        .eq("is_active", true)
        .single();

      console.log("📊 Database response:", { data, error });

      if (error) {
        // If no video found for today, show default video
        console.log(
          "❌ No video found for today, showing default. Error:",
          error.message,
        );
        setTodayVideo({
          title: "Günün Motivasyon Videosu",
          videoId: "dQw4w9WgXcQ",
          description: "Bugün kendini motive edecek özel bir video!",
        });
        return;
      }

      if (data) {
        console.log("✅ Today video found:", data);
        setTodayVideo({
          title: data.title,
          videoId: data.video_id,
          description: data.description || "",
        });
      }
    } catch (error) {
      console.error("❌ Error fetching today video:", error);
      // Show default video on error
      setTodayVideo({
        title: "Günün Motivasyon Videosu",
        videoId: "dQw4w9WgXcQ",
        description: "Bugün kendini motive edecek özel bir video!",
      });
    }
  };

  const fetchWeeklyStats = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      // Calculate date 7 days ago
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const sevenDaysAgoStr = sevenDaysAgo.toISOString();

      // Fetch study sessions from last 7 days with subject names
      const { data, error } = await supabase
        .from("study_sessions")
        .select(
          `
          questions_solved,
          subjects:subject_id (
            name
          )
        `,
        )
        .eq("user_id", user.id)
        .gte("completed_at", sevenDaysAgoStr)
        .order("completed_at", { ascending: false });

      if (error) throw error;

      // Group by subject and sum questions
      const subjectMap: Record<string, number> = {};

      data?.forEach((session: any) => {
        const subjectName = session.subjects?.name || "Diğer";
        if (!subjectMap[subjectName]) {
          subjectMap[subjectName] = 0;
        }
        subjectMap[subjectName] += session.questions_solved || 0;
      });

      // Convert to array and assign colors
      const subjectColors: Record<string, string> = {
        Matematik: "bg-blue-500",
        Fen: "bg-green-500",
        "Fen Bilimleri": "bg-green-500",
        Türkçe: "bg-purple-500",
        "Sosyal Bilgiler": "bg-orange-500",
        Tarih: "bg-amber-500",
        "Din Kültürü": "bg-teal-500",
        İngilizce: "bg-pink-500",
      };

      const statsArray: WeeklySubjectStats[] = Object.entries(subjectMap)
        .map(([subject, total]) => ({
          subject,
          totalQuestions: total,
          color: subjectColors[subject] || "bg-gray-500",
        }))
        .sort((a, b) => b.totalQuestions - a.totalQuestions)
        .slice(0, 4); // Top 4 subjects

      // Calculate total questions from all subjects
      const totalQuestions = Object.values(subjectMap).reduce(
        (sum, count) => sum + count,
        0,
      );

      setWeeklyStats(statsArray);
      setTotalWeeklyQuestions(totalQuestions);
    } catch (error) {
      console.error("Error fetching weekly stats:", error);
    }
  };

  if (!isClient) {
    return (
      <div className="space-y-8">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Merhaba Sporcu! 👋</h1>
              <p className="text-blue-100 mb-4">
                LGS Liga'ya hoş geldin. Bugün hangi konuları çalışacaksın?
              </p>
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
            <p className="text-blue-100 mb-4">
              LGS Liga'ya hoş geldin. Bugün hangi konuları çalışacaksın?
            </p>
            <div className="bg-white/20 rounded-xl p-4">
              <p className="text-lg font-medium">{currentMotivation}</p>
            </div>
          </div>
          <div className="text-right">
            <div
              className="text-4xl font-bold mb-2"
              suppressHydrationWarning={true}
            >
              {currentTime}
            </div>
            <div className="text-blue-100">Şu an</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <i className="ri-target-line text-2xl text-blue-500 w-8 h-8 flex items-center justify-center"></i>
            <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
              +5 XP
            </span>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {totalWeeklyQuestions}
          </div>
          <div className="text-sm text-gray-600">Bu hafta çözülen soru</div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <i className="ri-sword-line text-2xl text-red-500 w-8 h-8 flex items-center justify-center"></i>
            <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
              Boss
            </span>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">3</div>
          <div className="text-sm text-gray-600">Boss savaşı kazanıldı</div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <i className="ri-fire-line text-2xl text-orange-500 w-8 h-8 flex items-center justify-center"></i>
            <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full">
              Streak
            </span>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">12</div>
          <div className="text-sm text-gray-600">Günlük çalışma serisi</div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <i className="ri-trophy-line text-2xl text-blue-500 w-8 h-8 flex items-center justify-center"></i>
            <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
              Level
            </span>
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
              <h3 className="font-semibold text-gray-900 mb-2">
                {todayVideo?.title}
              </h3>
              <p className="text-sm text-gray-600">{todayVideo?.description}</p>
            </div>
          </div>

          {/* Günlük Görevler */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Günlük Görevlerin
              </h2>
              <span className="text-sm text-gray-500">3/5 tamamlandı</span>
            </div>

            <div className="space-y-4">
              <div className="flex items-center p-4 bg-green-50 rounded-xl border border-green-200">
                <i className="ri-check-line text-green-500 text-xl mr-4 w-6 h-6 flex items-center justify-center"></i>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">
                    20 Matematik sorusu çöz
                  </h3>
                  <p className="text-sm text-gray-600">
                    Tamamlandı - +15 XP kazandın!
                  </p>
                </div>
                <span className="text-sm font-medium text-green-600">
                  20/20
                </span>
              </div>

              <div className="flex items-center p-4 bg-green-50 rounded-xl border border-green-200">
                <i className="ri-check-line text-green-500 text-xl mr-4 w-6 h-6 flex items-center justify-center"></i>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">
                    10 Fen sorusu çöz
                  </h3>
                  <p className="text-sm text-gray-600">
                    Tamamlandı - +10 XP kazandın!
                  </p>
                </div>
                <span className="text-sm font-medium text-green-600">
                  10/10
                </span>
              </div>

              <div className="flex items-center p-4 bg-blue-50 rounded-xl border border-blue-200">
                <i className="ri-book-line text-blue-500 text-xl mr-4 w-6 h-6 flex items-center justify-center"></i>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">
                    15 Türkçe sorusu çöz
                  </h3>
                  <p className="text-sm text-gray-600">Devam ediyor...</p>
                </div>
                <span className="text-sm font-medium text-blue-600">8/15</span>
              </div>

              <div className="flex items-center p-4 bg-gray-50 rounded-xl border border-gray-200">
                <i className="ri-time-line text-gray-400 text-xl mr-4 w-6 h-6 flex items-center justify-center"></i>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">
                    Boss savaşına katıl
                  </h3>
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

            {weeklyStats.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <i className="ri-file-list-3-line text-4xl mb-2"></i>
                <p className="text-sm">Bu hafta henüz çalışma kaydı yok</p>
                <p className="text-xs mt-1">Hemen başla! 🚀</p>
              </div>
            ) : (
              <div className="space-y-3">
                {weeklyStats.map((stat, index) => {
                  const maxQuestions = weeklyStats[0]?.totalQuestions || 1;
                  const percentage = Math.round(
                    (stat.totalQuestions / maxQuestions) * 100,
                  );

                  return (
                    <div key={index}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-600">{stat.subject}</span>
                        <span className="font-medium">
                          {stat.totalQuestions} soru
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`${stat.color} h-2 rounded-full transition-all duration-500`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
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

          <div className="bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">🎬 Motivasyon Videoları</h3>
              <Link
                href="/motivation-videos"
                className="text-sm bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-1 rounded-full transition-colors"
              >
                Tümünü Gör
              </Link>
            </div>

            {todayVideo ? (
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-16 h-12 bg-white bg-opacity-20 rounded overflow-hidden flex-shrink-0">
                    <img
                      src={`https://img.youtube.com/vi/${todayVideo.videoId}/mqdefault.jpg`}
                      alt={todayVideo.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm leading-tight mb-1 line-clamp-2">
                      {todayVideo.title}
                    </h4>
                    <p className="text-xs opacity-90 line-clamp-2">
                      {todayVideo.description}
                    </p>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Link
                    href="/motivation-videos"
                    className="flex-1 bg-white bg-opacity-20 hover:bg-opacity-30 text-center py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    <i className="ri-play-line mr-1"></i>
                    İzle
                  </Link>
                  <Link
                    href="/motivation-videos"
                    className="flex-1 bg-white bg-opacity-20 hover:bg-opacity-30 text-center py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    <i className="ri-heart-line mr-1"></i>
                    Favoriler
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <i className="ri-video-line text-3xl opacity-60 mb-2"></i>
                <p className="text-sm opacity-90">
                  Bugün için video bulunamadı
                </p>
                <Link
                  href="/motivation-videos"
                  className="inline-block mt-2 bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Tüm Videoları Gör
                </Link>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Son Başarılar
            </h3>

            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                  <i className="ri-trophy-line text-white text-sm w-4 h-4 flex items-center justify-center"></i>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Matematik Ustası
                  </p>
                  <p className="text-xs text-gray-600">
                    100 matematik sorusu çöz
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <i className="ri-fire-line text-white text-sm w-4 h-4 flex items-center justify-center"></i>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Haftalık Seri
                  </p>
                  <p className="text-xs text-gray-600">7 gün üst üste çalış</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                  <i className="ri-sword-line text-white text-sm w-4 h-4 flex items-center justify-center"></i>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Boss Avcısı
                  </p>
                  <p className="text-xs text-gray-600">
                    İlk boss savaşını kazan
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
