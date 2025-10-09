// TEST 2: Profile Kontrolü
// Admin panelinde F12 açıp console'a yapıştırın

console.log("👤 TEST 2: Profile Kontrolü başlıyor...");

async function testProfileCheck() {
  try {
    console.log("🔄 Profile kontrolü başlıyor...");

    // Mevcut kullanıcıyı kontrol et
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      console.error("❌ User error:", userError);
      return false;
    }

    if (!user) {
      console.error("❌ Kullanıcı oturumu bulunamadı!");
      return false;
    }

    console.log("✅ Kullanıcı oturumu bulundu!");
    console.log("👤 User ID:", user.id);
    console.log("📧 Email:", user.email);

    // Profile bilgilerini kontrol et
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role, full_name")
      .eq("id", user.id)
      .single();

    if (profileError) {
      console.error("❌ Profile error:", profileError);
      return false;
    }

    if (profile && profile.role === "admin") {
      console.log("✅ Admin profile doğrulandı!");
      console.log("👤 Role:", profile.role);
      console.log("👤 Full Name:", profile.full_name);
      return true;
    } else {
      console.error("❌ Admin profile bulunamadı!");
      console.log("👤 Mevcut role:", profile?.role);
      return false;
    }
  } catch (error) {
    console.error("❌ Beklenmeyen profile hatası:", error);
    return false;
  }
}

// Test'i çalıştır
testProfileCheck().then((success) => {
  if (success) {
    console.log("🎉 TEST 2 BAŞARILI: Profile kontrolü çalışıyor!");
    console.log("📝 Şimdi TEST 3'e geçebiliriz!");
  } else {
    console.log("❌ TEST 2 BAŞARISIZ: Profile kontrolü çalışmıyor!");
    console.log("📝 Önce profile sorununu çözmemiz gerekiyor!");
  }
});

console.log("🏁 TEST 2 tamamlandı!");
