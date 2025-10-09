// EXACT Frontend Simulation - Admin Panel Video Add Button
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = "https://mtonzsgnclyfzzkpysfn.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10b256c2duY2x5Znp6a3B5c2ZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1MzM1ODAsImV4cCI6MjA3NTEwOTU4MH0.3WYGJGFJTaPqKV_UgQpiQ_XO7bLRhOnVBDk8JkxsS38";

async function exactFrontendSimulation() {
  console.log("🧪 ===== TAM FRONTEND SİMÜLASYONU =====");
  console.log(
    '(Aynen admin panelindeki "Video Ekle" butonuna bastığınız gibi)\n',
  );

  const supabase = createClient(supabaseUrl, supabaseKey);

  // Step 1: Login (browser'da zaten giriş yapmışsınız ama simüle edelim)
  console.log("🔐 1. Admin login...");
  const { data: loginData, error: loginError } =
    await supabase.auth.signInWithPassword({
      email: "admin@lgsliga.com",
      password: "LgsLiga_001",
    });

  if (loginError) {
    console.error("❌ Login failed:", loginError);
    return;
  }
  console.log("✅ Login successful\n");

  await new Promise((resolve) => setTimeout(resolve, 500));

  // Step 2: Get session (frontend'de otomatik olur)
  console.log("🔐 2. Getting session...");
  const {
    data: { session },
  } = await supabase.auth.getSession();
  console.log("✅ Session:", session ? "Active" : "None");
  console.log("   User ID:", session?.user.id);
  console.log("   Email:", session?.user.email, "\n");

  // Step 3: Check profile (frontend'de otomatik olur)
  console.log("👤 3. Checking admin profile...");
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", session.user.id)
    .single();

  if (profileError) {
    console.error("❌ Profile error:", profileError);
    return;
  }
  console.log("✅ Profile role:", profile.role, "\n");

  // Step 4: Prepare form data (kullanıcı formu doldurur)
  console.log("📝 4. Form data (kullanıcı girdi)...");
  const videoForm = {
    date: "2025-10-11", // Farklı bir tarih deneyelim
    title: "Frontend Panel Test Videosu",
    videoId: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    description: "Admin panelinden eklenen test videosu",
  };
  console.log("   Form:", videoForm, "\n");

  // Step 5: Extract video ID (frontend extractVideoId fonksiyonu)
  console.log("🎬 5. Extracting video ID from URL...");
  const extractVideoId = (url) => {
    if (!url) {
      console.log("   ⚠️ URL boş!");
      return null;
    }

    // Already just an ID
    if (url.length === 11 && !url.includes("/") && !url.includes("=")) {
      console.log("   ℹ️ Already a video ID:", url);
      return url;
    }

    // Extract from various YouTube URL formats
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /^([a-zA-Z0-9_-]{11})$/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        console.log("   ✅ Extracted video ID:", match[1]);
        return match[1];
      }
    }

    console.log("   ❌ Could not extract video ID");
    return null;
  };

  const videoId = extractVideoId(videoForm.videoId);

  if (!videoId) {
    console.error("❌ Geçerli bir YouTube URL veya Video ID girin!");
    return;
  }
  console.log("");

  // Step 6: EXACT handleVideoSubmit from frontend
  console.log("➕ 6. EXECUTING EXACT handleVideoSubmit...");
  console.log("   (Bu kod aynen app/admin/page.tsx'teki handleVideoSubmit)\n");

  try {
    console.log("🎬 Video submit başladı!", videoForm);
    console.log("📹 Extracted Video ID:", videoId, "\n");

    console.log("✏️ editingVideo:", null, "(yeni video ekleme)");
    console.log("➕ Yeni video ekleniyor...\n");

    console.log("⚠️ GEÇİCİ: Admin kontrolü bypass ediliyor...\n");

    console.log("🔄 Supabase insert başlıyor...");
    console.log("📝 Insert data:", {
      date: videoForm.date,
      title: videoForm.title,
      video_id: videoId,
      description: videoForm.description,
      is_active: true,
    });
    console.log("");

    // EXACT insert from handleVideoSubmit
    const startTime = Date.now();
    console.log("⏱️ Insert request gönderiliyor...\n");

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

    const duration = Date.now() - startTime;
    console.log(`⏱️ Insert tamamlandı (${duration}ms)\n`);

    console.log("📊 Insert response:", { insertData, error });
    console.log("");

    if (error) {
      console.error("❌ ====== INSERT HATASI ======");
      console.error("   Error code:", error.code);
      console.error("   Error message:", error.message);
      console.error("   Error details:", error.details);
      console.error("   Error hint:", error.hint);
      console.error("   Full error:", JSON.stringify(error, null, 2));
      console.error("");

      console.log("🔍 HATA ANALİZİ:");
      if (error.code === "42501") {
        console.log("   ❌ RLS POLICY HATASI - Admin yetkisi yok");
        console.log("   💡 RLS policy'leri kontrol edin");
      } else if (error.code === "23505") {
        console.log("   ❌ DUPLICATE KEY HATASI - Bu tarih dolu");
        console.log("   💡 Farklı bir tarih seçin veya constraint'i kaldırın");
      } else if (error.code === "PGRST301") {
        console.log("   ❌ TIMEOUT HATASI - İstek zaman aşımına uğradı");
        console.log("   💡 RLS policy sonsuz döngüde olabilir");
      } else {
        console.log("   ❓ Bilinmeyen hata:", error.code);
      }
      console.log("");

      console.log("🎭 Frontend'de göreceğiniz:");
      console.log('   ⚠️ Alert: "Hata: ' + error.message + '"');
      console.log("   ⚠️ Console: Error log kayıtları");
      console.log('   ⚠️ Modal: Kapanmaz, "Ekle" butonu aktif kalır');

      throw error;
    }

    console.log("✅ ====== BAŞARILI! ======");
    console.log("✅ Yeni video eklendi!", insertData);
    console.log("");

    console.log("🔄 Videolar yeniden yükleniyor...");
    // fetchDailyVideos simulation
    const { data: videos } = await supabase
      .from("daily_videos")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5);

    console.log("✅ Son 5 video:");
    videos.forEach((v, i) =>
      console.log(`   ${i + 1}. ${v.title} (${v.date})`),
    );
    console.log("");

    console.log("🎭 Frontend'de göreceğiniz:");
    console.log('   ✅ Alert: "Video başarıyla eklendi!"');
    console.log("   ✅ Modal: Kapanır");
    console.log("   ✅ Form: Temizlenir");
    console.log("   ✅ Video listesi: Güncellenir");
  } catch (err) {
    console.error("\n❌ ====== BEKLENMEYEN HATA (CATCH BLOCK) ======");
    console.error("   Message:", err.message);
    console.error("   Stack:", err.stack);
    console.error("");
    console.log("🎭 Frontend'de göreceğiniz:");
    console.log('   ⚠️ Alert: "Hata: ' + err.message + '"');
    console.log(
      '   ⚠️ Buton: "Yeni video ekleniyor..." yazısında TAKILI KALIR!',
    );
  }

  console.log("\n🎉 ===== SİMÜLASYON TAMAMLANDI =====");
}

exactFrontendSimulation();
