// Force logout, fresh login, and test
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = "https://mtonzsgnclyfzzkpysfn.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10b256c2duY2x5Znp6a3B5c2ZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1MzM1ODAsImV4cCI6MjA3NTEwOTU4MH0.3WYGJGFJTaPqKV_UgQpiQ_XO7bLRhOnVBDk8JkxsS38";

async function freshSessionTest() {
  console.log("🧪 FRESH SESSION TEST\n");

  const supabase = createClient(supabaseUrl, supabaseKey);

  // 1. Force logout
  console.log("🚪 1. Forcing logout...");
  await supabase.auth.signOut();
  console.log("✅ Logged out\n");

  await new Promise((resolve) => setTimeout(resolve, 1000));

  // 2. Fresh login
  console.log("🔐 2. Fresh login...");
  const { data: loginData, error: loginError } =
    await supabase.auth.signInWithPassword({
      email: "admin@lgsliga.com",
      password: "LgsLiga_001",
    });

  if (loginError) {
    console.error("❌ Login error:", loginError);
    return;
  }
  console.log("✅ Fresh login successful");
  console.log("   Session:", loginData.session ? "Created" : "None");
  console.log(
    "   Access token (first 20):",
    loginData.session.access_token.substring(0, 20) + "...\n",
  );

  await new Promise((resolve) => setTimeout(resolve, 1000));

  // 3. Try video insert with fresh session
  console.log("📹 3. Trying video insert with FRESH SESSION...");
  const { data, error } = await supabase
    .from("daily_videos")
    .insert({
      date: "2025-10-12",
      title: "Fresh Session Test Video",
      video_id: "dQw4w9WgXcQ",
      description: "Test with completely fresh session",
      is_active: true,
    })
    .select();

  if (error) {
    console.error("❌ Insert error:", error.code, error.message);
  } else {
    console.log("✅ Video inserted successfully!");
    console.log("   ID:", data[0].id);
    console.log("   Title:", data[0].title);
  }

  console.log("\n🎯 Şimdi browser'da şunu yapın:");
  console.log("   1. Logout yapın");
  console.log("   2. Browser cache'i temizleyin (Cmd+Shift+R)");
  console.log("   3. Tekrar login yapın");
  console.log("   4. Video eklemeyi deneyin");
}

freshSessionTest();
