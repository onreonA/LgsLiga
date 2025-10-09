// Test after removing unique constraint
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = "https://mtonzsgnclyfzzkpysfn.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10b256c2duY2x5Znp6a3B5c2ZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1MzM1ODAsImV4cCI6MjA3NTEwOTU4MH0.3WYGJGFJTaPqKV_UgQpiQ_XO7bLRhOnVBDk8JkxsS38";

async function testVideoAddAfterFix() {
  console.log("🧪 ===== CONSTRAINT FIX SONRASI VIDEO EKLEME TESTİ =====\n");

  const supabase = createClient(supabaseUrl, supabaseKey);

  // Login as admin
  console.log("🔐 Admin olarak giriş yapılıyor...");
  const { data: loginData, error: loginError } =
    await supabase.auth.signInWithPassword({
      email: "admin@lgsliga.com",
      password: "LgsLiga_001",
    });

  if (loginError) {
    console.error("❌ Login hatası:", loginError.message);
    return;
  }
  console.log("✅ Admin girişi başarılı\n");

  await new Promise((resolve) => setTimeout(resolve, 500));

  // Try to add multiple videos for the same day
  console.log("📹 BUGÜN İÇİN 2 FARKLI VİDEO EKLENİYOR...\n");

  const today = new Date().toISOString().split("T")[0];

  // Video 1
  console.log("➕ Video 1 ekleniyor...");
  const { data: video1, error: error1 } = await supabase
    .from("daily_videos")
    .insert({
      date: today,
      title: "Test Video 1 - Constraint Fix Sonrası",
      video_id: "dQw4w9WgXcQ",
      description: "İlk test videosu",
      is_active: true,
    })
    .select();

  if (error1) {
    console.error("❌ Video 1 hatası:", error1.code, error1.message);
    if (error1.code === "23505") {
      console.log("\n⚠️ HALA UNIQUE CONSTRAINT HATASI VAR!");
      console.log("💡 Lütfen Supabase SQL Editor'da şu komutu çalıştırın:");
      console.log(
        "   ALTER TABLE daily_videos DROP CONSTRAINT IF EXISTS daily_videos_date_key;",
      );
    }
    return;
  }
  console.log("✅ Video 1 eklendi:", video1[0].id);

  // Video 2 (same day!)
  console.log("\n➕ Video 2 ekleniyor (AYNI GÜN)...");
  const { data: video2, error: error2 } = await supabase
    .from("daily_videos")
    .insert({
      date: today,
      title: "Test Video 2 - Aynı Gün",
      video_id: "dQw4w9WgXcQ",
      description: "İkinci test videosu - aynı gün için",
      is_active: true,
    })
    .select();

  if (error2) {
    console.error("❌ Video 2 hatası:", error2.code, error2.message);
    if (error2.code === "23505") {
      console.log("\n⚠️ HALA UNIQUE CONSTRAINT HATASI VAR!");
      console.log("💡 Constraint henüz kaldırılmamış olabilir.");
    }
    return;
  }
  console.log("✅ Video 2 eklendi:", video2[0].id);

  // Success!
  console.log("\n✅✅✅ BAŞARILI! ✅✅✅");
  console.log("🎉 Aynı gün için 2 farklı video eklendi!");
  console.log("\n📹 Bugün için videolar:");

  const { data: todayVideos } = await supabase
    .from("daily_videos")
    .select("*")
    .eq("date", today)
    .order("created_at", { ascending: false });

  todayVideos.forEach((video, index) => {
    console.log(`   ${index + 1}. ${video.title}`);
  });

  console.log("\n🎯 Artık admin panelinden video eklemek çalışmalı!");
  console.log("\n🎉 ===== TEST TAMAMLANDI =====");
}

testVideoAddAfterFix();
