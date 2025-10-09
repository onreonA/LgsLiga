// Kapsamlı admin test script'i
// Admin panelinde F12 açıp console'a yapıştırın

console.log("🎯 Kapsamlı admin testi başlıyor...");

async function comprehensiveAdminTest() {
  const results = {
    login: false,
    auth: false,
    profile: false,
    insert: false,
    error: null,
  };

  try {
    // 1. Admin Login Test
    console.log("🔐 1. Admin Login Test...");
    const { data: loginData, error: loginError } =
      await supabase.auth.signInWithPassword({
        email: "admin@lgsliga.com",
        password: "LgsLiga_001",
      });

    if (loginError) {
      console.error("❌ Login hatası:", loginError);
      results.error = loginError.message;
      return results;
    }

    if (loginData.user) {
      console.log("✅ Admin login başarılı!");
      results.login = true;
    }

    // 2. Auth User Test
    console.log("👤 2. Auth User Test...");
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      console.error("❌ User error:", userError);
      results.error = userError.message;
      return results;
    }

    if (user && user.email === "admin@lgsliga.com") {
      console.log("✅ Auth user doğrulandı!");
      results.auth = true;
    }

    // 3. Profile Test
    console.log("👤 3. Profile Test...");
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role, full_name")
      .eq("id", user.id)
      .single();

    if (profileError) {
      console.error("❌ Profile error:", profileError);
      results.error = profileError.message;
      return results;
    }

    if (profile && profile.role === "admin") {
      console.log("✅ Admin profile doğrulandı!");
      results.profile = true;
    }

    // 4. Video Insert Test
    console.log("🎬 4. Video Insert Test...");

    const testVideoData = {
      date: "2024-10-10",
      title: "Comprehensive Admin Test Video",
      video_id: "comprehensive_test_" + Date.now(),
      description: "Bu video kapsamlı admin testi ile eklenmiştir.",
      is_active: true,
    };

    const { data: insertData, error: insertError } = await supabase
      .from("daily_videos")
      .insert(testVideoData)
      .select();

    if (insertError) {
      console.error("❌ Insert error:", insertError);
      results.error = insertError.message;
      return results;
    }

    if (insertData && insertData.length > 0) {
      console.log("✅ Video insert başarılı!");
      console.log("📹 Eklenen video ID:", insertData[0].id);
      results.insert = true;

      // Test videosunu temizle
      await supabase.from("daily_videos").delete().eq("id", insertData[0].id);
      console.log("🧹 Test video temizlendi!");
    }

    return results;
  } catch (error) {
    console.error("❌ Beklenmeyen hata:", error);
    results.error = error.message;
    return results;
  }
}

// Test'i çalıştır
comprehensiveAdminTest().then((results) => {
  console.log("📊 Test Sonuçları:");
  console.log("🔐 Login:", results.login ? "✅" : "❌");
  console.log("👤 Auth:", results.auth ? "✅" : "❌");
  console.log("👤 Profile:", results.profile ? "✅" : "❌");
  console.log("🎬 Insert:", results.insert ? "✅" : "❌");

  if (results.error) {
    console.log("❌ Hata:", results.error);
  }

  if (results.login && results.auth && results.profile && results.insert) {
    console.log("🎉 TÜM TESTLER BAŞARILI!");
    console.log("✅ Admin video ekleme sistemi tamamen çalışıyor!");
  } else {
    console.log("❌ BAZI TESTLER BAŞARISIZ!");
    console.log("📝 Sorunlu alanları kontrol edin!");
  }
});

console.log("🏁 Kapsamlı admin testi tamamlandı!");
