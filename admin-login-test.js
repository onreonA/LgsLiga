// Browser console'da çalıştırılacak admin login test script'i
// Admin panelinde F12 açıp console'a yapıştırın

console.log("🔐 Admin login testi başlıyor...");

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

      // Profile bilgilerini kontrol et
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role, full_name")
        .eq("id", data.user.id)
        .single();

      console.log("👤 Profile data:", profile);
      console.log("❌ Profile error:", profileError);

      if (profile?.role === "admin") {
        console.log("✅ Admin role doğrulandı!");
        return true;
      } else {
        console.log("❌ Admin role bulunamadı!");
        return false;
      }
    } else {
      console.log("❌ Login başarısız, user data yok!");
      return false;
    }
  } catch (error) {
    console.error("❌ Beklenmeyen login hatası:", error);
    return false;
  }
}

// Login test'ini çalıştır
testAdminLogin().then((success) => {
  if (success) {
    console.log("🎉 Admin login testi başarılı!");
    console.log("📝 Şimdi video ekleme testine geçebiliriz!");
  } else {
    console.log("❌ Admin login testi başarısız!");
    console.log("📝 Önce login sorununu çözmemiz gerekiyor!");
  }
});

console.log("🏁 Admin login testi tamamlandı!");
