"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../lib/auth";
import { supabase } from "../../lib/supabase";

const volleyballDays = [
  { id: "pazartesi", label: "Pazartesi" },
  { id: "sali", label: "Salı" },
  { id: "carsamba", label: "Çarşamba" },
  { id: "persembe", label: "Perşembe" },
  { id: "cuma", label: "Cuma" },
  { id: "cumartesi", label: "Cumartesi" },
  { id: "pazar", label: "Pazar" },
];

export default function ProfileSetup() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    grade: 9,
    targetScore: 400,
    volleyballDays: [] as string[],
  });

  const handleVolleyballDayChange = (dayId: string) => {
    setFormData((prev) => ({
      ...prev,
      volleyballDays: prev.volleyballDays.includes(dayId)
        ? prev.volleyballDays.filter((d) => d !== dayId)
        : [...prev.volleyballDays, dayId],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: formData.fullName,
          grade: formData.grade,
          target_score: formData.targetScore,
          volleyball_days: formData.volleyballDays,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) {
        throw error;
      }

      router.push("/app");
    } catch (error) {
      console.error("Profile update error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <i className="ri-user-settings-line text-white text-2xl"></i>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Profilini Tamamla
          </h1>
          <p className="text-gray-600 text-sm">
            LGS yolculuğuna başlamak için bilgilerini girelim
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ad Soyad
            </label>
            <input
              type="text"
              required
              value={formData.fullName}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, fullName: e.target.value }))
              }
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              placeholder="Adın ve soyadını gir"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sınıf
              </label>
              <select
                value={formData.grade}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    grade: parseInt(e.target.value),
                  }))
                }
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm pr-8"
              >
                <option value={8}>8. Sınıf</option>
                <option value={9}>9. Sınıf Hazırlık</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hedef Puan
              </label>
              <input
                type="number"
                min="200"
                max="500"
                value={formData.targetScore}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    targetScore: parseInt(e.target.value),
                  }))
                }
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Voleybol Antrenman Günlerin 🏐
            </label>
            <div className="grid grid-cols-2 gap-2">
              {volleyballDays.map((day) => (
                <label
                  key={day.id}
                  className={`flex items-center p-3 rounded-xl border-2 cursor-pointer transition-all ${
                    formData.volleyballDays.includes(day.id)
                      ? "border-purple-300 bg-purple-50"
                      : "border-gray-200 hover:border-purple-200"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.volleyballDays.includes(day.id)}
                    onChange={() => handleVolleyballDayChange(day.id)}
                    className="sr-only"
                  />
                  <div
                    className={`w-4 h-4 rounded border-2 mr-3 flex items-center justify-center ${
                      formData.volleyballDays.includes(day.id)
                        ? "border-purple-500 bg-purple-500"
                        : "border-gray-300"
                    }`}
                  >
                    {formData.volleyballDays.includes(day.id) && (
                      <i className="ri-check-line text-white text-xs"></i>
                    )}
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {day.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !formData.fullName}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 whitespace-nowrap cursor-pointer"
          >
            {loading ? "Kaydediliyor..." : "LGS Yolculuğuna Başla! 🚀"}
          </button>
        </form>
      </div>
    </div>
  );
}
