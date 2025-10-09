"use client";

const mockTopicData = [
  { name: "Sayılar ve İşlemler", score: 85, difficulty: "Kolay" },
  { name: "Cebir", score: 45, difficulty: "Zor" },
  { name: "Geometri", score: 72, difficulty: "Orta" },
  { name: "Veri İşleme", score: 88, difficulty: "Kolay" },
  { name: "Olasılık", score: 38, difficulty: "Zor" },
  { name: "Paragraf", score: 75, difficulty: "Orta" },
  { name: "Sözcükte Anlam", score: 42, difficulty: "Zor" },
  { name: "Cümlede Anlam", score: 68, difficulty: "Orta" },
  { name: "Metin Bilgisi", score: 81, difficulty: "Kolay" },
  { name: "Yazım Kuralları", score: 55, difficulty: "Orta" },
  { name: "Besinler", score: 92, difficulty: "Kolay" },
  { name: "Madde ve Değişim", score: 35, difficulty: "Zor" },
  { name: "Kuvvet ve Hareket", score: 61, difficulty: "Orta" },
  { name: "Elektrik", score: 47, difficulty: "Zor" },
  { name: "Işık ve Ses", score: 78, difficulty: "Orta" },
];

export default function TopicHeatmap() {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    if (score >= 40) return "bg-orange-500";
    return "bg-red-500";
  };

  const getScoreTextColor = (score: number) => {
    if (score >= 80) return "text-green-700";
    if (score >= 60) return "text-yellow-700";
    if (score >= 40) return "text-orange-700";
    return "text-red-700";
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Konu Başarı Haritası
          </h3>
          <p className="text-sm text-gray-600">
            Konulara göre performans dağılımı
          </p>
        </div>
        <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
          <i className="ri-fire-line text-purple-600 text-xl"></i>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockTopicData.map((topic, index) => (
          <div
            key={index}
            className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-gray-900 truncate">
                {topic.name}
              </h4>
              <span
                className={`text-xs font-semibold ${getScoreTextColor(topic.score)}`}
              >
                {topic.score}%
              </span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div
                className={`h-2 rounded-full ${getScoreColor(topic.score)}`}
                style={{ width: `${topic.score}%` }}
              ></div>
            </div>

            <div className="flex items-center justify-between">
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  topic.difficulty === "Kolay"
                    ? "bg-green-100 text-green-700"
                    : topic.difficulty === "Orta"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                }`}
              >
                {topic.difficulty}
              </span>
              {topic.score < 50 && (
                <i className="ri-alert-line text-red-500 text-sm"></i>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center space-x-6 mt-6 pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <span className="text-sm text-gray-600">0-39%</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
          <span className="text-sm text-gray-600">40-59%</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <span className="text-sm text-gray-600">60-79%</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-sm text-gray-600">80-100%</span>
        </div>
      </div>
    </div>
  );
}
