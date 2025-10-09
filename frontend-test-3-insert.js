// TEST 3: Video Insert Testi
// Admin panelinde F12 açıp console'a yapıştırın

console.log("🎬 TEST 3: Video Insert Testi başlıyor...");

async function testVideoInsert() {
  try {
    console.log("🔄 Video insert testi başlıyor...");

    // Test verileri
    const testVideoData = {
      date: "2024-10-10",
      title: "Frontend Test Video",
      video_id: "frontend_test_" + Date.now(),
      description: "Bu video frontend testi için eklenmiştir.",
      is_active: true,
    };

    console.log("📝 Insert data:", testVideoData);

    // Supabase insert işlemi
    const { data: insertData, error } = await supabase
      .from("daily_videos")
      .insert(testVideoData)
      .select();

    console.log("📊 Insert response:", { insertData, error });

    if (error) {
      console.error("❌ Insert hatası:", error);
      console.error("❌ Error code:", error.code);
      console.error("❌ Error message:", error.message);
      console.error("❌ Error details:", error.details);
      console.error("❌ Error hint:", error.hint);
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
    console.error("❌ Beklenmeyen insert hatası:", error);
    return false;
  }
}

// Test'i çalıştır
testVideoInsert().then((success) => {
  if (success) {
    console.log("🎉 TEST 3 BAŞARILI: Video insert çalışıyor!");
    console.log("📝 Tüm testler başarılı!");
  } else {
    console.log("❌ TEST 3 BAŞARISIZ: Video insert çalışmıyor!");
    console.log("📝 Sorun tespit edildi, çözüm gerekiyor!");
  }
});

console.log("🏁 TEST 3 tamamlandı!");
