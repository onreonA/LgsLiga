"use client";

import { useState } from "react";

const mockInsights = [
  {
    type: "success",
    icon: "ri-trophy-line",
    title: "Harika İlerleme!",
    description:
      "Son 2 haftada matematik performansınız %15 arttı. Bu trendi sürdürün!",
    action: "Matematik çalışmalarına devam et",
    priority: "high",
    color: "green",
  },
  {
    type: "warning",
    icon: "ri-alert-line",
    title: "Dikkat: Sosyal Bilgiler",
    description:
      "Sosyal Bilgiler dersinde son 3 sınavda düşüş var. Coğrafya konularına odaklanın.",
    action: "Coğrafya konularını tekrar et",
    priority: "high",
    color: "orange",
  },
  {
    type: "info",
    icon: "ri-lightbulb-line",
    title: "Çalışma Önerisi",
    description:
      "Kaynak kitap kullanımınız %86 doğruluk oranı sağlıyor. Bu kaynağı daha fazla kullanın.",
    action: "Kaynak kitap çalışmalarını artır",
    priority: "medium",
    color: "blue",
  },
  {
    type: "tip",
    icon: "ri-time-line",
    title: "Zaman Yönetimi",
    description:
      "En verimli çalışma saatiniz 14:00-16:00 arası. Bu saatleri değerlendirin.",
    action: "Öğleden sonra çalışma planı yap",
    priority: "medium",
    color: "purple",
  },
  {
    type: "goal",
    icon: "ri-target-line",
    title: "Hedef Takibi",
    description:
      "LGS hedefiniz 450 puan. Mevcut performansla 408 puana ulaşabilirsiniz.",
    action: "Zayıf konularda ekstra çalışma yap",
    priority: "high",
    color: "red",
  },
  {
    type: "pattern",
    icon: "ri-bar-chart-line",
    title: "Çalışma Deseni",
    description:
      "Hafta sonları çalışma performansınız %20 düşüyor. Düzenli program oluşturun.",
    action: "Hafta sonu çalışma programı hazırla",
    priority: "medium",
    color: "indigo",
  },
];

const mockWeeklyGoals = [
  {
    goal: "Matematik cebir konusunu bitir",
    progress: 75,
    deadline: "3 gün",
    status: "on-track",
  },
  {
    goal: "Türkçe paragraf testleri çöz",
    progress: 45,
    deadline: "5 gün",
    status: "behind",
  },
  {
    goal: "Fen bilimleri deneme sınavı",
    progress: 90,
    deadline: "2 gün",
    status: "ahead",
  },
  {
    goal: "İngilizce kelime çalışması",
    progress: 60,
    deadline: "4 gün",
    status: "on-track",
  },
];

const mockStudyRecommendations = [
  {
    subject: "Matematik",
    topic: "Cebir",
    reason: "Son 3 sınavda %45 başarı oranı",
    suggestedTime: "45 dakika",
    difficulty: "Zor",
    priority: 1,
  },
  {
    subject: "Sosyal Bilgiler",
    topic: "Coğrafya",
    reason: "Performans düşüşü gözlemlendi",
    suggestedTime: "30 dakika",
    difficulty: "Orta",
    priority: 2,
  },
  {
    subject: "Türkçe",
    topic: "Sözcükte Anlam",
    reason: "Hedef skorun altında",
    suggestedTime: "25 dakika",
    difficulty: "Orta",
    priority: 3,
  },
];

export default function PerformanceInsights() {
  const [activeTab, setActiveTab] = useState<
    "insights" | "goals" | "recommendations"
  >("insights");

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-red-200 bg-red-50";
      case "medium":
        return "border-yellow-200 bg-yellow-50";
      case "low":
        return "border-green-200 bg-green-50";
      default:
        return "border-gray-200 bg-gray-50";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ahead":
        return "text-green-600 bg-green-100";
      case "on-track":
        return "text-blue-600 bg-blue-100";
      case "behind":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "ahead":
        return "Hedefin Önünde";
      case "on-track":
        return "Hedefte";
      case "behind":
        return "Geride";
      default:
        return "Bilinmiyor";
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Akıllı Performans Önerileri
          </h3>
          <p className="text-sm text-gray-600">
            AI destekli kişiselleştirilmiş öneriler ve hedef takibi
          </p>
        </div>
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
          <i className="ri-brain-line text-white text-xl"></i>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-gray-100 rounded-xl p-1">
        <button
          onClick={() => setActiveTab("insights")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
            activeTab === "insights"
              ? "bg-white text-purple-600 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <i className="ri-lightbulb-line w-4 h-4 mr-2"></i>
          Öneriler
        </button>
        <button
          onClick={() => setActiveTab("goals")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
            activeTab === "goals"
              ? "bg-white text-purple-600 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <i className="ri-target-line w-4 h-4 mr-2"></i>
          Hedefler
        </button>
        <button
          onClick={() => setActiveTab("recommendations")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
            activeTab === "recommendations"
              ? "bg-white text-purple-600 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <i className="ri-book-open-line w-4 h-4 mr-2"></i>
          Çalışma Planı
        </button>
      </div>

      {/* Insights Tab */}
      {activeTab === "insights" && (
        <div className="space-y-4">
          {mockInsights.map((insight, index) => (
            <div
              key={index}
              className={`border rounded-xl p-4 ${getPriorityColor(insight.priority)}`}
            >
              <div className="flex items-start space-x-4">
                <div
                  className={`w-10 h-10 bg-${insight.color}-100 rounded-xl flex items-center justify-center flex-shrink-0`}
                >
                  <i
                    className={`${insight.icon} text-${insight.color}-600 text-xl`}
                  ></i>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">
                      {insight.title}
                    </h4>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        insight.priority === "high"
                          ? "bg-red-100 text-red-700"
                          : insight.priority === "medium"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-green-100 text-green-700"
                      }`}
                    >
                      {insight.priority === "high"
                        ? "Yüksek"
                        : insight.priority === "medium"
                          ? "Orta"
                          : "Düşük"}{" "}
                      Öncelik
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    {insight.description}
                  </p>
                  <button
                    className={`text-sm font-medium text-${insight.color}-600 hover:text-${insight.color}-700 cursor-pointer whitespace-nowrap`}
                  >
                    {insight.action} →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Goals Tab */}
      {activeTab === "goals" && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 mb-6">
            <h4 className="font-semibold text-gray-900 mb-2">
              Bu Haftaki Hedefler
            </h4>
            <p className="text-sm text-gray-600">
              Belirlediğiniz hedeflerin ilerleme durumu
            </p>
          </div>

          {mockWeeklyGoals.map((goal, index) => (
            <div key={index} className="border border-gray-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">{goal.goal}</h4>
                <div className="flex items-center space-x-2">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(goal.status)}`}
                  >
                    {getStatusText(goal.status)}
                  </span>
                  <span className="text-sm text-gray-500">
                    {goal.deadline} kaldı
                  </span>
                </div>
              </div>

              <div className="mb-2">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-600">İlerleme</span>
                  <span className="font-medium text-gray-900">
                    {goal.progress}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      goal.status === "ahead"
                        ? "bg-green-500"
                        : goal.status === "on-track"
                          ? "bg-blue-500"
                          : "bg-red-500"
                    }`}
                    style={{ width: `${goal.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}

          <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all cursor-pointer whitespace-nowrap">
            <i className="ri-add-line w-5 h-5 mr-2"></i>
            Yeni Hedef Ekle
          </button>
        </div>
      )}

      {/* Recommendations Tab */}
      {activeTab === "recommendations" && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-4 mb-6">
            <h4 className="font-semibold text-gray-900 mb-2">
              Bugün İçin Önerilen Çalışma Planı
            </h4>
            <p className="text-sm text-gray-600">
              Performans analizinize göre özelleştirilmiş plan
            </p>
          </div>

          {mockStudyRecommendations.map((rec, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold text-sm">
                    {rec.priority}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {rec.subject}
                    </h4>
                    <p className="text-sm text-gray-600">{rec.topic}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-blue-600">
                    {rec.suggestedTime}
                  </div>
                  <div
                    className={`text-xs px-2 py-1 rounded-full ${
                      rec.difficulty === "Zor"
                        ? "bg-red-100 text-red-700"
                        : rec.difficulty === "Orta"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                    }`}
                  >
                    {rec.difficulty}
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-3">{rec.reason}</p>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <i className="ri-time-line text-gray-400 w-4 h-4"></i>
                  <span className="text-sm text-gray-500">
                    Önerilen süre: {rec.suggestedTime}
                  </span>
                </div>
                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors cursor-pointer whitespace-nowrap">
                  Çalışmaya Başla
                </button>
              </div>
            </div>
          ))}

          <div className="bg-gray-50 rounded-xl p-4 text-center">
            <i className="ri-calendar-check-line text-gray-400 text-2xl mb-2"></i>
            <p className="text-sm text-gray-600 mb-3">
              Toplam önerilen çalışma süresi: <strong>1 saat 40 dakika</strong>
            </p>
            <button className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-2 rounded-lg font-medium hover:from-green-600 hover:to-blue-600 transition-all cursor-pointer whitespace-nowrap">
              Tüm Planı Uygula
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
