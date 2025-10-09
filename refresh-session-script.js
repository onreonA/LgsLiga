// Browser console'da çalıştırın: Session refresh script
// Admin panelinde F12 açıp console'a yapıştırın

console.log("🔄 Supabase session refresh başlıyor...");

// Supabase client'ı al
const { createClient } = window.supabase || {};
if (!createClient) {
  console.error("❌ Supabase client bulunamadı!");
} else {
  // Mevcut session'ı kontrol et
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  console.log("📊 Mevcut session:", session);
  console.log("❌ Session error:", error);

  if (session) {
    console.log("✅ Session mevcut:", session.user.email);

    // Session'ı refresh et
    const { data: refreshData, error: refreshError } =
      await supabase.auth.refreshSession();

    console.log("🔄 Refresh sonucu:", refreshData);
    console.log("❌ Refresh error:", refreshError);

    if (refreshData.session) {
      console.log("✅ Session başarıyla refresh edildi!");
    } else {
      console.log("❌ Session refresh başarısız!");
    }
  } else {
    console.log("❌ Session bulunamadı!");

    // Yeniden login olmayı dene
    console.log("🔄 Yeniden login deneniyor...");

    const { data: loginData, error: loginError } =
      await supabase.auth.signInWithPassword({
        email: "admin@lgsliga.com",
        password: "LgsLiga_001",
      });

    console.log("🔑 Login sonucu:", loginData);
    console.log("❌ Login error:", loginError);
  }
}

console.log("🏁 Session refresh tamamlandı!");
