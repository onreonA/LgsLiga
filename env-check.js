// Environment variables kontrolü
// Admin panelinde F12 açıp console'a yapıştırın

console.log("🔧 Environment variables kontrolü başlıyor...");

function checkEnvironmentVariables() {
  try {
    // 1. Supabase URL kontrolü
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    console.log("📡 Supabase URL:", supabaseUrl);

    if (!supabaseUrl) {
      console.error("❌ NEXT_PUBLIC_SUPABASE_URL bulunamadı!");
      return false;
    }

    if (!supabaseUrl.startsWith("https://")) {
      console.error("❌ Supabase URL geçersiz format!");
      return false;
    }

    console.log("✅ Supabase URL doğru format!");

    // 2. Supabase Key kontrolü
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    console.log("🔑 Supabase Key:", supabaseKey ? "Var" : "Yok");

    if (!supabaseKey) {
      console.error("❌ NEXT_PUBLIC_SUPABASE_ANON_KEY bulunamadı!");
      return false;
    }

    if (!supabaseKey.startsWith("eyJ")) {
      console.error("❌ Supabase Key geçersiz format!");
      return false;
    }

    console.log("✅ Supabase Key doğru format!");

    // 3. Supabase client kontrolü
    console.log("🔍 Supabase client kontrolü...");
    console.log("📡 Client URL:", supabase.supabaseUrl);
    console.log("🔑 Client Key:", supabase.supabaseKey ? "Var" : "Yok");

    if (supabase.supabaseUrl !== supabaseUrl) {
      console.error("❌ Client URL ile environment URL eşleşmiyor!");
      return false;
    }

    if (supabase.supabaseKey !== supabaseKey) {
      console.error("❌ Client Key ile environment Key eşleşmiyor!");
      return false;
    }

    console.log("✅ Supabase client doğru yapılandırılmış!");

    return true;
  } catch (error) {
    console.error("❌ Beklenmeyen environment hatası:", error);
    return false;
  }
}

// Test'i çalıştır
const success = checkEnvironmentVariables();

if (success) {
  console.log("🎉 Environment variables kontrolü başarılı!");
  console.log("📝 Supabase bağlantısı hazır!");
} else {
  console.log("❌ Environment variables kontrolü başarısız!");
  console.log("📝 Environment sorununu çözmemiz gerekiyor!");
}

console.log("🏁 Environment variables kontrolü tamamlandı!");
