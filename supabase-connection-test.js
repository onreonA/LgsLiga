// Supabase bağlantı testi
// Admin panelinde F12 açıp console'a yapıştırın

console.log("🔗 Supabase bağlantı testi başlıyor...");

async function testSupabaseConnection() {
  try {
    // 1. Supabase client kontrolü
    console.log("🔍 Supabase client kontrolü...");
    console.log("📡 Supabase URL:", supabase.supabaseUrl);
    console.log("🔑 Supabase Key:", supabase.supabaseKey ? "Var" : "Yok");

    // 2. Basit API testi
    console.log("🔄 Basit API testi...");
    const { data, error } = await supabase
      .from("profiles")
      .select("count")
      .limit(1);

    if (error) {
      console.error("❌ Supabase API hatası:", error);
      return false;
    }

    console.log("✅ Supabase API çalışıyor!");
    console.log("📊 Test response:", data);

    // 3. Daily videos tablosu testi
    console.log("🎬 Daily videos tablosu testi...");
    const { data: videos, error: videosError } = await supabase
      .from("daily_videos")
      .select("count")
      .limit(1);

    if (videosError) {
      console.error("❌ Daily videos tablosu hatası:", videosError);
      return false;
    }

    console.log("✅ Daily videos tablosu çalışıyor!");
    console.log("📊 Videos response:", videos);

    return true;
  } catch (error) {
    console.error("❌ Beklenmeyen bağlantı hatası:", error);
    return false;
  }
}

// Test'i çalıştır
testSupabaseConnection().then((success) => {
  if (success) {
    console.log("🎉 Supabase bağlantı testi başarılı!");
    console.log("📝 Şimdi video insert testine geçebiliriz!");
  } else {
    console.log("❌ Supabase bağlantı testi başarısız!");
    console.log("📝 Bağlantı sorununu çözmemiz gerekiyor!");
  }
});

console.log("🏁 Supabase bağlantı testi tamamlandı!");
