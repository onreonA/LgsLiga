// Browser console'da çalıştırılacak video ekleme test script'i
// Admin panelinde F12 açıp console'a yapıştırın

console.log("🎬 Video ekleme testi başlıyor...");

// Test verileri
const testVideoData = {
  date: "2024-10-10",
  title: "Test Video - Console Eklendi",
  videoId: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  description: "Bu video browser console testi ile eklenmiştir.",
};

// YouTube ID çıkarma fonksiyonu
function extractVideoId(url) {
  const regex =
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : url;
}

// Video ID'yi çıkar
const videoId = extractVideoId(testVideoData.videoId);
console.log("📹 Extracted Video ID:", videoId);

// Supabase insert işlemi
async function testVideoInsert() {
  try {
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
testVideoInsert().then((success) => {
  if (success) {
    console.log("🎉 Test başarılı! Video ekleme çalışıyor!");

    // Video listesini yenile
    console.log("🔄 Video listesi yenileniyor...");
    if (typeof fetchDailyVideos === "function") {
      fetchDailyVideos();
    }
  } else {
    console.log("❌ Test başarısız! Video ekleme çalışmıyor!");
  }
});

console.log("🏁 Test tamamlandı!");
