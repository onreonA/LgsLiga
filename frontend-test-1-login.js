// TEST 1: Admin Login Testi
// Admin panelinde F12 açıp console'a yapıştırın

console.log("🔐 TEST 1: Admin Login Testi başlıyor...");

async function testAdminLogin() {
  try {
    console.log("🔄 Admin login işlemi başlıyor...");

    // Admin bilgileri ile login ol
    const { data, error } = await supabase.auth.signInWithPassword({
      email: "admin@lgsliga.com",
      password: "LgsLiga_001",
    });

    console.log("📊 Login response:", { data, error });

    if (error) {
      console.error("❌ Login hatası:", error);
      return false;
    }

    if (data.user) {
      console.log("✅ Admin login başarılı!");
      console.log("👤 User ID:", data.user.id);
      console.log("📧 Email:", data.user.email);
      return true;
    } else {
      console.log("❌ Login başarısız, user data yok!");
      return false;
    }
  } catch (error) {
    console.error("❌ Beklenmeyen login hatası:", error);
    return false;
  }
}

// Test'i çalıştır
testAdminLogin().then((success) => {
  if (success) {
    console.log("🎉 TEST 1 BAŞARILI: Admin login çalışıyor!");
    console.log("📝 Şimdi TEST 2'ye geçebiliriz!");
  } else {
    console.log("❌ TEST 1 BAŞARISIZ: Admin login çalışmıyor!");
    console.log("📝 Önce login sorununu çözmemiz gerekiyor!");
  }
});

console.log("🏁 TEST 1 tamamlandı!");
