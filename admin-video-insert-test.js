// Browser console'da çalıştırılacak admin video ekleme test script'i
// Admin panelinde F12 açıp console'a yapıştırın

console.log("🎬 Admin video ekleme testi başlıyor...");

// Test verileri
const testVideoData = {
  date: "2024-10-10",
  title: "Admin Test Video - Console Eklendi",
  videoId: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  description:
    "Bu video admin console testi ile eklenmiştir. Test tarihi: " +
    new Date().toISOString(),
};

// YouTube ID çıkarma fonksiyonu
function extractVideoId(url) {
  const regex =
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : url;
}

async function testAdminVideoInsert() {
  try {
    console.log("🔍 Admin kullanıcısını kontrol ediyorum...");

    // Mevcut kullanıcıyı kontrol et
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    console.log("👤 Current user:", user?.email);
    console.log("❌ User error:", userError);

    if (!user) {
      console.log("❌ Kullanıcı oturumu bulunamadı!");
      return false;
    }

    // Admin role kontrolü
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    console.log("👤 Profile data:", profile);
    console.log("❌ Profile error:", profileError);

    if (profile?.role !== "admin") {
      console.log("❌ Admin role bulunamadı! Mevcut role:", profile?.role);
      return false;
    }

    console.log("✅ Admin kullanıcısı doğrulandı!");

    // Video ID'yi çıkar
    const videoId = extractVideoId(testVideoData.videoId);
    console.log("📹 Extracted Video ID:", videoId);

    // Supabase insert işlemi
    console.log("🔄 Supabase insert başlıyor...");
    console.log("📝 Insert data:", {
      date: testVideoData.date,
      title: testVideoData.title,
      video_id: videoId,
      description: testVideoData.description,
      is_active: true,
    });

    const { data: insertData, error } = await supabase
      .from("daily_videos")
      .insert({
        date: testVideoData.date,
        title: testVideoData.title,
        video_id: videoId,
        description: testVideoData.description,
        is_active: true,
      })
      .select();

    console.log("📊 Insert response:", { insertData, error });

    if (error) {
      console.error("❌ Insert hatası detayı:", error);
      console.error("❌ Error code:", error.code);
      console.error("❌ Error message:", error.message);
      console.error("❌ Error details:", error.details);
      console.error("❌ Error hint:", error.hint);
      return false;
    }

    if (insertData && insertData.length > 0) {
      console.log("✅ Video başarıyla eklendi!");
      console.log("📹 Eklenen video:", insertData[0]);

      // Video listesini yenile
      console.log("🔄 Video listesi yenileniyor...");
      if (typeof fetchDailyVideos === "function") {
        await fetchDailyVideos();
        console.log("✅ Video listesi yenilendi!");
      }

      return true;
    } else {
      console.log("❌ Video eklenmedi, data boş!");
      return false;
    }
  } catch (error) {
    console.error("❌ Beklenmeyen hata:", error);
    return false;
  }
}

// Test'i çalıştır
testAdminVideoInsert().then((success) => {
  if (success) {
    console.log("🎉 Admin video ekleme testi başarılı!");
    console.log("✅ Video ekleme sistemi çalışıyor!");
  } else {
    console.log("❌ Admin video ekleme testi başarısız!");
    console.log("📝 Sorun tespit edildi, çözüm gerekiyor!");
  }
});

console.log("🏁 Admin video ekleme testi tamamlandı!");
