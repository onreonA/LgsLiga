// FRONTEND TEST: Admin Login + Video Ekleme
// Browser console'a yapıştırın ve çalıştırın
// Localhost'ta çalıştığınızdan emin olun: http://localhost:3000

(async () => {
  console.log("🧪 ===== FRONTEND ADMIN LOGIN + VIDEO EKLEME TESTİ =====");

  // 1. Import Supabase client
  console.log("\n📦 1. Supabase client yükleniyor...");
  const { supabase } = await import("./lib/supabase.ts");
  console.log("✅ Supabase client yüklendi");

  // 2. Admin login
  console.log("\n🔐 2. Admin olarak giriş yapılıyor...");
  const { data: loginData, error: loginError } =
    await supabase.auth.signInWithPassword({
      email: "admin@lgsliga.com",
      password: "LgsLiga_001",
    });

  if (loginError) {
    console.error("❌ Login hatası:", loginError);
    alert("❌ Login hatası: " + loginError.message);
    return;
  }

  console.log("✅ Admin girişi başarılı:", loginData.user.email);
  alert("✅ Admin olarak giriş yapıldı!");

  // Wait a bit for session to establish
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // 3. Check session
  console.log("\n🔐 3. Oturum kontrol ediliyor...");
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError || !session) {
    console.error("❌ Session error:", sessionError);
    alert("❌ Oturum kurulamadı!");
    return;
  }

  console.log("✅ Oturum aktif:", session.user.email);

  // 4. Check profile
  console.log("\n👤 4. Admin profili kontrol ediliyor...");
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

  // 5. Prepare video data
  console.log("\n📹 5. Video verisi hazırlanıyor...");
  const now = new Date();
  const videoForm = {
    date: now.toISOString().split("T")[0],
    title: "Frontend Test - " + now.toLocaleString("tr-TR"),
    videoId: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    description:
      "Frontend üzerinden admin kullanıcısı tarafından eklenen test videosu.",
  };

  // Extract video ID
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
  console.log("📝 Video ID:", videoId);

  if (!videoId) {
    console.error("❌ Geçerli video ID çıkarılamadı!");
    alert("❌ Geçerli bir YouTube URL veya Video ID girin!");
    return;
  }

  // 6. Insert video
  console.log("\n➕ 6. Video ekleniyor...");
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
      console.error("❌ Insert hatası detayı:");
      console.error("   - Code:", error.code);
      console.error("   - Message:", error.message);
      console.error("   - Details:", error.details);
      console.error("   - Hint:", error.hint);
      console.error("   - Full error:", error);
      alert(
        "❌ Video ekleme hatası:\n\nCode: " +
          error.code +
          "\nMessage: " +
          error.message,
      );
      return;
    }

    console.log("✅✅✅ VIDEO BAŞARIYLA EKLENDİ! ✅✅✅");
    console.log("📹 Eklenen video:", insertData[0]);
    alert(
      "✅ Video başarıyla eklendi!\n\n" +
        "ID: " +
        insertData[0].id +
        "\n" +
        "Title: " +
        insertData[0].title +
        "\n" +
        "Date: " +
        insertData[0].date,
    );
  } catch (err) {
    console.error("❌ Beklenmeyen hata:", err);
    alert("❌ Beklenmeyen hata: " + err.message);
  }

  console.log("\n🎉 ===== TEST TAMAMLANDI =====");
})();
