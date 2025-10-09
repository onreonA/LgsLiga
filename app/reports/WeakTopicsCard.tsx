"use client";

const weakTopics = [
  {
    subject: "Matematik",
    topic: "Cebir",
    score: 45,
    totalQuestions: 128,
    correctAnswers: 58,
    lastStudied: "3 gün önce",
    difficulty: "Zor",
  },
  {
    subject: "Matematik",
    topic: "Olasılık",
    score: 38,
    totalQuestions: 96,
    correctAnswers: 36,
    lastStudied: "1 hafta önce",
    difficulty: "Zor",
  },
  {
    subject: "Türkçe",
    topic: "Sözcükte Anlam",
    score: 42,
    totalQuestions: 145,
    correctAnswers: 61,
    lastStudied: "2 gün önce",
    difficulty: "Zor",
  },
  {
    subject: "Fen Bilimleri",
    topic: "Madde ve Değişim",
    score: 35,
    totalQuestions: 89,
    correctAnswers: 31,
    lastStudied: "5 gün önce",
    difficulty: "Zor",
  },
  {
    subject: "Fen Bilimleri",
    topic: "Elektrik",
    score: 47,
    totalQuestions: 112,
    correctAnswers: 53,
    lastStudied: "4 gün önce",
    difficulty: "Zor",
  },
];

export default function WeakTopicsCard() {
  const getSubjectColor = (subject: string) => {
    switch (subject) {
      case "Matematik":
        return "bg-red-500";
      case "Türkçe":
        return "bg-orange-500";
      case "Fen Bilimleri":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  const getUrgencyLevel = (score: number, lastStudied: string) => {
    if (score < 40) return "Acil";
    if (score < 50 && lastStudied.includes("hafta")) return "Önemli";
    return "Normal";
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "Acil":
        return "bg-red-100 text-red-700 border-red-200";
      case "Önemli":
        return "bg-orange-100 text-orange-700 border-orange-200";
      default:
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Zayıf Kazanımlar
          </h3>
          <p className="text-sm text-gray-600">
            Acil çalışma gereken konular (50% altı)
          </p>
        </div>
        <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
          <i className="ri-alert-line text-red-600 text-xl"></i>
        </div>
      </div>

      <div className="space-y-4">
        {weakTopics.map((topic, index) => {
          const urgency = getUrgencyLevel(topic.score, topic.lastStudied);

          return (
            <div
              key={index}
              className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div
                      className={`w-3 h-3 ${getSubjectColor(topic.subject)} rounded-full`}
                    ></div>
                    <h4 className="font-semibold text-gray-900">
                      {topic.topic}
                    </h4>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full border ${getUrgencyColor(urgency)}`}
                    >
                      {urgency}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{topic.subject}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-red-600">
                    {topic.score}%
                  </div>
                  <div className="text-xs text-gray-500">başarı oranı</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-3">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-lg font-semibold text-gray-900">
                    {topic.correctAnswers}/{topic.totalQuestions}
                  </div>
                  <div className="text-xs text-gray-600">Doğru/Toplam</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-lg font-semibold text-gray-900">
                    {topic.lastStudied}
                  </div>
                  <div className="text-xs text-gray-600">Son çalışma</div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="w-full bg-gray-200 rounded-full h-2 mr-3">
                  <div
                    className="bg-red-500 h-2 rounded-full"
                    style={{ width: `${topic.score}%` }}
                  ></div>
                </div>
                <button className="flex items-center px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap cursor-pointer">
                  <i className="ri-play-line w-4 h-4 mr-1"></i>
                  Çalış
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Button */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <button className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white py-3 rounded-xl font-semibold hover:from-red-600 hover:to-orange-600 transition-all cursor-pointer whitespace-nowrap">
          <i className="ri-fire-line w-5 h-5 mr-2"></i>
          Tüm Zayıf Konularda Boss Fight Başlat
        </button>
      </div>
    </div>
  );
}
