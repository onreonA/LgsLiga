"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("🔐 Login attempt started...");

      // Real Supabase authentication
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("❌ Login error:", error);
        alert("Giriş hatası: " + error.message);
        setLoading(false);
        return;
      }

      if (data.user) {
        console.log("✅ Login başarılı! User ID:", data.user.id);
        console.log("👤 User email:", data.user.email);

        // Fetch user profile to check role
        console.log("🔍 Profile fetch başlatılıyor...");
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", data.user.id)
          .single();

        console.log("👤 Profile data:", profile);
        console.log("❌ Profile error:", profileError);

        if (profileError) {
          console.error("❌ Profile fetch error:", profileError);
          console.log("🔀 Profile yoksa dashboard'a yönlendiriliyor...");
          // Profile yoksa default olarak dashboard'a yönlendir
          router.push("/dashboard");
          setLoading(false);
          return;
        }

        // Redirect based on role - sadece router.push kullan
        const redirectPath =
          profile?.role === "admin" ? "/admin" : "/dashboard";
        console.log("🔀 Yönlendiriliyor:", redirectPath);
        console.log("📊 Profile role:", profile?.role);

        // Loading'i önce kapat
        console.log("✅ Loading kapatılıyor...");
        setLoading(false);

        // Sonra yönlendir
        console.log("🚀 Navigation başlatılıyor...");
        router.push(redirectPath);
      }
    } catch (error) {
      console.error("❌ Login error:", error);
      alert("Bir hata oluştu!");
      setLoading(false);
    }
  };

  const fillDemoCredentials = (type: "student" | "admin") => {
    if (type === "student") {
      setEmail("zeyno@zeynepunsal.com.tr");
      setPassword("Zeyno_001");
    } else {
      setEmail("admin@lgsliga.com");
      setPassword("LgsLiga_001");
    }
  };

  const handleDemoLogin = async (type: "student" | "admin") => {
    setLoading(true);

    try {
      const credentials =
        type === "student"
          ? { email: "zeyno@zeynepunsal.com.tr", password: "Zeyno_001" }
          : { email: "admin@lgsliga.com", password: "LgsLiga_001" };

      const { data, error } =
        await supabase.auth.signInWithPassword(credentials);

      if (error) {
        alert("Giriş hatası: " + error.message);
        return;
      }

      if (data.user) {
        console.log("✅ Demo login başarılı! User ID:", data.user.id);

        // Fetch profile
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", data.user.id)
          .single();

        console.log("👤 Demo Profile data:", profile);
        console.log("❌ Demo Profile error:", profileError);

        if (profile?.role === "admin") {
          console.log("🔀 Demo Admin'e yönlendiriliyor...");
          router.push("/admin");
        } else {
          console.log("🔀 Demo Dashboard'a yönlendiriliyor...");
          router.push("/dashboard");
        }

        // Force refresh to ensure navigation
        setTimeout(() => {
          window.location.href =
            profile?.role === "admin" ? "/admin" : "/dashboard";
        }, 1000);
      }
    } catch (error) {
      console.error("Demo login error:", error);
      alert("Bir hata oluştu!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="min-h-screen flex">
        <div className="flex-1 flex items-center justify-center px-8 lg:px-12">
          <div className="max-w-lg w-full">
            <div className="text-center mb-12">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
                <i className="ri-trophy-line text-white text-4xl w-10 h-10 flex items-center justify-center"></i>
              </div>
              <h1 className="font-[\'Pacifico\'] text-5xl text-gray-900 mb-4">
                LGS Liga
              </h1>
              <p className="text-xl text-gray-700 font-semibold mb-2">
                Şampiyonlar Takımı ile LGS\'ye Hazırlık
              </p>
              <p className="text-sm text-gray-600">
                2026 Müfredatına Uyumlu Gamified Eğitim Platformu
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-10">
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 border border-white/30 hover:scale-105 transition-transform duration-300 shadow-lg">
                <div className="w-10 h-10 text-blue-500 mb-3 flex items-center justify-center">
                  <i className="ri-target-line w-10 h-10 flex items-center justify-center"></i>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Hedefli Çalışma
                </h3>
                <p className="text-sm text-gray-600">
                  Kişisel hedeflerle sistematik ilerleme
                </p>
              </div>

              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 border border-white/30 hover:scale-105 transition-transform duration-300 shadow-lg">
                <div className="w-10 h-10 text-purple-500 mb-3 flex items-center justify-center">
                  <i className="ri-sword-line w-10 h-10 flex items-center justify-center"></i>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Boss Savaşları
                </h3>
                <p className="text-sm text-gray-600">
                  Zorlu konularda epic mücadeleler
                </p>
              </div>

              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 border border-white/30 hover:scale-105 transition-transform duration-300 shadow-lg">
                <div className="w-10 h-10 text-orange-500 mb-3 flex items-center justify-center">
                  <i className="ri-trophy-line w-10 h-10 flex items-center justify-center"></i>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Başarı Rozetleri
                </h3>
                <p className="text-sm text-gray-600">
                  Ödüllerle sürekli motivasyon
                </p>
              </div>

              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 border border-white/30 hover:scale-105 transition-transform duration-300 shadow-lg">
                <div className="w-10 h-10 text-green-500 mb-3 flex items-center justify-center">
                  <i className="ri-bar-chart-line w-10 h-10 flex items-center justify-center"></i>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  İlerleme Analizi
                </h3>
                <p className="text-sm text-gray-600">
                  Detaylı performans raporları
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl p-6 text-white text-center shadow-xl">
              <div className="text-3xl mb-4 flex items-center justify-center">
                <i className="ri-heart-fill w-8 h-8 flex items-center justify-center"></i>
              </div>
              <p className="font-semibold text-lg leading-relaxed">
                "Her smaç gibi güçlü, her servis gibi kararlı! LGS\'de de
                şampiyon olacaksın!
              </p>
              <p className="text-sm opacity-90 mt-3">
                Antrenör\'den motivasyon
              </p>
            </div>
          </div>
        </div>

        <div className="w-96 bg-white shadow-2xl flex items-center justify-center">
          <div className="w-full max-w-sm px-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                Giriş Yap
              </h2>
              <p className="text-gray-600">
                Hesabına giriş yaparak LGS Liga\'ya katıl
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  E-posta Adresi
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all"
                  placeholder="ornek@email.com"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Şifre
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all"
                    placeholder="••••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    {showPassword ? (
                      <i className="ri-eye-off-line w-5 h-5 flex items-center justify-center"></i>
                    ) : (
                      <i className="ri-eye-line w-5 h-5 flex items-center justify-center"></i>
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 whitespace-nowrap cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <i className="ri-loader-4-line animate-spin mr-2 w-5 h-5 flex items-center justify-center"></i>
                    Giriş Yapılıyor...
                  </span>
                ) : (
                  "Giriş Yap"
                )}
              </button>
            </form>

            <div className="mt-8 p-5 bg-gray-50 rounded-xl">
              <p className="text-sm font-semibold text-gray-700 mb-4 text-center">
                <i className="ri-play-circle-line mr-2 w-4 h-4 inline-flex items-center justify-center"></i>
                Demo Hesaplarını Dene:
              </p>
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => handleDemoLogin("student")}
                  className="w-full text-left px-4 py-3 bg-white rounded-xl text-sm text-gray-700 hover:bg-blue-50 hover:border-blue-200 border border-gray-200 transition-all cursor-pointer whitespace-nowrap"
                >
                  <div className="flex items-center">
                    <span className="text-lg mr-3">👩🎓</span>
                    <div>
                      <div className="font-medium">Öğrenci Hesabı</div>
                      <div className="text-xs text-gray-500">
                        zeyno@zeynepunsal.com.tr
                      </div>
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleDemoLogin("admin")}
                  className="w-full text-left px-4 py-3 bg-white rounded-xl text-sm text-gray-700 hover:bg-purple-50 hover:border-purple-200 border border-gray-200 transition-all cursor-pointer whitespace-nowrap"
                >
                  <div className="flex items-center">
                    <span className="text-lg mr-3">👨💼</span>
                    <div>
                      <div className="font-medium">Admin Hesabı</div>
                      <div className="text-xs text-gray-500">
                        admin@lgsliga.com
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            <div className="text-center mt-6 space-y-3">
              <Link
                href="/profile-setup"
                className="block text-blue-600 hover:text-blue-700 text-sm font-medium cursor-pointer transition-colors"
              >
                <i className="ri-user-add-line mr-1 w-4 h-4 inline-flex items-center justify-center"></i>
                Yeni hesap oluştur
              </Link>
              <Link
                href="/auth/reset-password"
                className="block text-gray-500 hover:text-gray-700 text-sm cursor-pointer transition-colors"
              >
                Şifremi unuttum
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
