// Admin console test script'i
// Admin panelinde F12 açıp console'a yapıştırın

console.log("🔐 Admin console testi başlıyor...");

async function adminConsoleTest() {
  try {
    // 1. Admin login
    console.log("🔄 Admin login işlemi başlıyor...");
    const { data: loginData, error: loginError } =
      await supabase.auth.signInWithPassword({
        email: "admin@lgsliga.com",
        password: "LgsLiga_001",
      });

    if (loginError) {
      console.error("❌ Login hatası:", loginError);
      return false;
    }

    if (loginData.user) {
      console.log("✅ Admin login başarılı!");
      console.log("👤 User ID:", loginData.user.id);
      console.log("📧 Email:", loginData.user.email);
    }

    // 2. Profile kontrolü
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role, full_name")
      .eq("id", loginData.user.id)
      .single();

    if (profileError) {
      console.error("❌ Profile hatası:", profileError);
      return false;
    }

    if (profile && profile.role === "admin") {
      console.log("✅ Admin profile doğrulandı!");
      console.log("👤 Role:", profile.role);
      console.log("👤 Full Name:", profile.full_name);
    } else {
      console.error("❌ Admin profile bulunamadı!");
      return false;
    }

    // 3. Video insert test
    console.log("🎬 Video insert testi başlıyor...");

    const testVideoData = {
      date: "2024-10-10",
      title: "Admin Console Test Video",
      video_id: "admin_console_test_" + Date.now(),
      description: "Bu video admin console testi için eklenmiştir.",
      is_active: true,
    };

    console.log("📝 Insert data:", testVideoData);

    const { data: insertData, error: insertError } = await supabase
      .from("daily_videos")
      .insert(testVideoData)
      .select();

    if (insertError) {
      console.error("❌ Insert hatası:", insertError);
      console.error("❌ Error code:", insertError.code);
      console.error("❌ Error message:", insertError.message);
      console.error("❌ Error details:", insertError.details);
      console.error("❌ Error hint:", insertError.hint);
      return false;
    }

    if (insertData && insertData.length > 0) {
      console.log("✅ Video insert başarılı!");
      console.log("📹 Eklenen video:", insertData[0]);

      // Test videosunu temizle
      await supabase.from("daily_videos").delete().eq("id", insertData[0].id);
      console.log("🧹 Test video temizlendi!");

      return true;
    } else {
      console.error("❌ Video insert başarısız, data boş!");
      return false;
    }
  } catch (error) {
    console.error("❌ Beklenmeyen hata:", error);
    return false;
  }
}

// Test'i çalıştır
adminConsoleTest().then((success) => {
  if (success) {
    console.log("🎉 Admin console testi başarılı!");
    console.log("✅ Video ekleme sistemi çalışıyor!");
  } else {
    console.log("❌ Admin console testi başarısız!");
    console.log("📝 Sorun tespit edildi, çözüm gerekiyor!");
  }
});

console.log("🏁 Admin console testi tamamlandı!");
