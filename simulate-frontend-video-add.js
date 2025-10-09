// Node.js ile Frontend Video Ekleme Simülasyonu
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = "https://mtonzsgnclyfzzkpysfn.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10b256c2duY2x5Znp6a3B5c2ZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1MzM1ODAsImV4cCI6MjA3NTEwOTU4MH0.3WYGJGFJTaPqKV_UgQpiQ_XO7bLRhOnVBDk8JkxsS38";

async function simulateFrontendVideoAdd() {
  console.log("🧪 ===== FRONTEND VIDEO EKLEME SİMÜLASYONU =====\n");

  const supabase = createClient(supabaseUrl, supabaseKey);

  // 1. Admin Login (Frontend'deki gibi)
  console.log("🔐 1. Admin olarak giriş yapılıyor...");
  const { data: loginData, error: loginError } =
    await supabase.auth.signInWithPassword({
      email: "admin@lgsliga.com",
      password: "LgsLiga_001",
    });

  if (loginError) {
    console.error("❌ Login hatası:", loginError.message);
    return;
  }
  console.log("✅ Admin girişi başarılı:", loginData.user.email);

  // Wait for session
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // 2. Session Check (Frontend'deki gibi)
  console.log("\n🔐 2. Oturum kontrol ediliyor...");
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError || !session) {
    console.error("❌ Session error:", sessionError);
    return;
  }
  console.log("✅ Oturum aktif:", session.user.email);
  console.log("📋 Session details:", {
    user_id: session.user.id,
    email: session.user.email,
    role: session.user.role,
    access_token: session.access_token.substring(0, 20) + "...",
  });

  // 3. Profile Check (Frontend'deki gibi)
  console.log("\n👤 3. Admin profili kontrol ediliyor...");
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", session.user.id)
    .single();

  if (profileError) {
    console.error("❌ Profile error:", profileError);
    return;
  }
  console.log("✅ Profil bulundu, rol:", profile.role);

  if (profile.role !== "admin") {
    console.error("❌ Kullanıcı admin değil!");
    return;
  }

  // 4. Prepare Video Data (Frontend'deki handleVideoSubmit gibi)
  console.log(
    "\n📹 4. Video verisi hazırlanıyor (Frontend handleVideoSubmit)...",
  );
  const videoForm = {
    date: new Date().toISOString().split("T")[0],
    title: "Frontend Simülasyon Test - " + new Date().toLocaleString("tr-TR"),
    videoId: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    description:
      "Frontend handleVideoSubmit fonksiyonu simülasyonu ile eklenen test videosu.",
  };

  console.log("🎬 Video form başladı:", videoForm);

  // Extract video ID (Frontend'deki extractVideoId gibi)
  const extractVideoId = (url) => {
    if (!url) return null;
    if (url.length === 11 && !url.includes("/") && !url.includes("="))
      return url;
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /^([a-zA-Z0-9_-]{11})$/,
    ];
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  const videoId = extractVideoId(videoForm.videoId);
  console.log("📹 Extracted Video ID:", videoId);

  if (!videoId) {
    console.error("❌ Geçerli bir YouTube URL veya Video ID girin!");
    return;
  }

  // 5. Insert Video (AYNEN Frontend'deki handleVideoSubmit gibi)
  console.log(
    "\n➕ 5. Yeni video ekleniyor (Frontend handleVideoSubmit exact copy)...",
  );
  console.log(
    "⚠️ GEÇİCİ: Admin kontrolü bypass ediliyor... (Frontend kodundaki gibi)",
  );

  console.log("🔄 Supabase insert başlıyor...");
  console.log("📝 Insert data:", {
    date: videoForm.date,
    title: videoForm.title,
    video_id: videoId,
    description: videoForm.description,
    is_active: true,
  });

  try {
    const { data: insertData, error } = await supabase
      .from("daily_videos")
      .insert({
        date: videoForm.date,
        title: videoForm.title,
        video_id: videoId,
        description: videoForm.description,
        is_active: true,
      })
      .select();

    console.log("📊 Insert response:", { insertData, error });

    if (error) {
      console.error("❌ Insert hatası detayı:");
      console.error("   - Error code:", error.code);
      console.error("   - Error message:", error.message);
      console.error("   - Error details:", error.details);
      console.error("   - Error hint:", error.hint);
      console.error("   - Full error object:", JSON.stringify(error, null, 2));

      console.log("\n🔍 HATA ANALİZİ:");
      if (error.code === "42501") {
        console.log(
          "❌ RLS POLICY HATASI! Admin kullanıcının INSERT yetkisi yok!",
        );
        console.log(
          "💡 Çözüm: RLS policy'leri kontrol edin ve admin için INSERT yetkisi verin.",
        );
      } else if (error.code === "PGRST301") {
        console.log("❌ TIMEOUT HATASI! İstek zaman aşımına uğradı.");
        console.log("💡 Çözüm: RLS policy sonsuz döngüye giriyor olabilir.");
      } else {
        console.log("❓ Bilinmeyen hata kodu:", error.code);
      }

      return;
    }

    console.log("✅✅✅ VIDEO BAŞARIYLA EKLENDİ! ✅✅✅");
    console.log("📹 Eklenen video:", insertData[0]);

    // 6. Reload Videos (Frontend'deki fetchDailyVideos gibi)
    console.log("\n🔄 6. Videolar yeniden yükleniyor (fetchDailyVideos)...");
    const { data: videos, error: fetchError } = await supabase
      .from("daily_videos")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5);

    if (fetchError) {
      console.error("❌ Video listesi hatası:", fetchError);
    } else {
      console.log("✅ Son 5 video:");
      videos.forEach((video, index) => {
        console.log(`   ${index + 1}. ${video.title} (${video.date})`);
      });
    }

    console.log("\n✅ Frontend video ekleme simülasyonu BAŞARILI!");
    console.log("🎉 Alert mesajı: Video başarıyla eklendi!");
  } catch (err) {
    console.error("\n❌ BEKLENMEYEN HATA (catch block):");
    console.error("   - Error message:", err.message);
    console.error("   - Error stack:", err.stack);
    console.log("\n🔍 HATA ANALİZİ:");
    console.log(
      'Bu hata frontend\'de "Yeni video ekleniyor..." mesajında takılı kalmanıza neden olur!',
    );
  }

  console.log("\n🎉 ===== TEST TAMAMLANDI =====");
}

simulateFrontendVideoAdd();
