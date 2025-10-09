// FRONTEND TEST: Admin Video Ekleme
// Browser console'a yapıştırın ve çalıştırın

(async () => {
  console.log("🧪 ===== FRONTEND ADMIN VIDEO EKLEME TESTİ =====");

  // 1. Import Supabase client
  console.log("\n📦 1. Supabase client yükleniyor...");
  const { supabase } = await import("./lib/supabase.ts");
  console.log("✅ Supabase client yüklendi");

  // 2. Check current session
  console.log("\n🔐 2. Mevcut oturum kontrol ediliyor...");
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError) {
    console.error("❌ Session error:", sessionError);
    alert("❌ Session hatası! Lütfen önce giriş yapın.");
    return;
  }

  if (!session) {
    console.warn("⚠️ Oturum bulunamadı!");
    alert("⚠️ Oturum bulunamadı! Lütfen önce giriş yapın.");
    return;
  }

  console.log("✅ Oturum mevcut:", session.user.email);

  // 3. Check user profile
  console.log("\n👤 3. Kullanıcı profili kontrol ediliyor...");
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", session.user.id)
    .single();

  if (profileError) {
    console.error("❌ Profile error:", profileError);
    alert("❌ Profil bilgisi alınamadı!");
    return;
  }

  console.log("✅ Profil bulundu, rol:", profile.role);

  if (profile.role !== "admin") {
    console.error("❌ Kullanıcı admin değil!");
    alert("❌ Bu işlem için admin yetkisi gerekiyor!");
    return;
  }

  // 4. Prepare video data (exactly like frontend)
  console.log("\n📹 4. Video verisi hazırlanıyor...");
  const videoForm = {
    date: new Date().toISOString().split("T")[0],
    title: "Frontend Test Videosu - " + new Date().toLocaleString("tr-TR"),
    videoId: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    description: "Bu frontend üzerinden eklenen bir test videosudur.",
  };

  // Extract video ID (like frontend does)
  const extractVideoId = (url) => {
    if (!url) return null;

    // If already just an ID
    if (url.length === 11 && !url.includes("/") && !url.includes("=")) {
      return url;
    }

    // Extract from various YouTube URL formats
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
  console.log("📝 Extracted Video ID:", videoId);

  if (!videoId) {
    console.error("❌ Geçerli bir YouTube URL veya Video ID bulunamadı!");
    alert("❌ Geçerli bir YouTube URL veya Video ID girin!");
    return;
  }

  // 5. Insert video (exactly like frontend)
  console.log("\n➕ 5. Video ekleniyor (frontend yöntemiyle)...");
  console.log("📊 Insert data:", {
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
      console.error("❌ Insert hatası:", error);
      console.error("   - Code:", error.code);
      console.error("   - Message:", error.message);
      console.error("   - Details:", error.details);
      console.error("   - Hint:", error.hint);
      alert("❌ Video ekleme hatası: " + error.message);
      return;
    }

    console.log("✅ Video başarıyla eklendi!", insertData[0]);
    alert(
      "✅ Video başarıyla eklendi!\n\nID: " +
        insertData[0].id +
        "\nTitle: " +
        insertData[0].title,
    );
  } catch (err) {
    console.error("❌ Genel hata:", err);
    alert("❌ Beklenmeyen hata: " + err.message);
  }

  console.log("\n🎉 ===== TEST TAMAMLANDI =====");
})();
