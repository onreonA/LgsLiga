"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const mockSubjectData = [
  {
    subject: "Matematik",
    dailyAverage: 85,
    examAverage: 78,
    totalQuestions: 1250,
    correctAnswers: 1063,
    improvement: +12,
    color: "#ef4444",
  },
  {
    subject: "Türkçe",
    dailyAverage: 78,
    examAverage: 82,
    totalQuestions: 980,
    correctAnswers: 765,
    improvement: +8,
    color: "#f97316",
  },
  {
    subject: "Fen Bilimleri",
    dailyAverage: 82,
    examAverage: 75,
    totalQuestions: 890,
    correctAnswers: 730,
    improvement: +15,
    color: "#eab308",
  },
  {
    subject: "Sosyal Bilgiler",
    dailyAverage: 70,
    examAverage: 73,
    totalQuestions: 650,
    correctAnswers: 468,
    improvement: +5,
    color: "#22c55e",
  },
  {
    subject: "İnkılap Tarihi",
    dailyAverage: 88,
    examAverage: 85,
    totalQuestions: 420,
    correctAnswers: 370,
    improvement: +18,
    color: "#3b82f6",
  },
  {
    subject: "Din Kültürü",
    dailyAverage: 92,
    examAverage: 89,
    totalQuestions: 380,
    correctAnswers: 348,
    improvement: +10,
    color: "#8b5cf6",
  },
  {
    subject: "İngilizce",
    dailyAverage: 75,
    examAverage: 71,
    totalQuestions: 520,
    correctAnswers: 390,
    improvement: +7,
    color: "#06b6d4",
  },
];

export default function SubjectComparisonChart() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Ders Bazında Performans Karşılaştırması
          </h3>
          <p className="text-sm text-gray-600">
            Günlük çalışma vs sınav performansı
          </p>
        </div>
        <div className="w-10 h-10 bg-cyan-100 rounded-xl flex items-center justify-center">
          <i className="ri-bar-chart-2-line text-cyan-600 text-xl"></i>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={mockSubjectData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis
              dataKey="subject"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#6b7280" }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#6b7280" }}
              domain={[0, 100]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
              formatter={(value, name) => {
                if (name === "dailyAverage")
                  return [`${value}%`, "Günlük Ortalama"];
                if (name === "examAverage")
                  return [`${value}%`, "Sınav Ortalaması"];
                return [value, name];
              }}
            />
            <Bar
              dataKey="dailyAverage"
              name="Günlük Ortalama"
              radius={[4, 4, 0, 0]}
            >
              {mockSubjectData.map((entry, index) => (
                <Cell key={`daily-${index}`} fill={`${entry.color}80`} />
              ))}
            </Bar>
            <Bar
              dataKey="examAverage"
              name="Sınav Ortalaması"
              radius={[4, 4, 0, 0]}
            >
              {mockSubjectData.map((entry, index) => (
                <Cell key={`exam-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Subject Details */}
      <div className="mt-6 space-y-3">
        {mockSubjectData.map((subject, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
          >
            <div className="flex items-center space-x-3">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: subject.color }}
              ></div>
              <div>
                <h4 className="font-medium text-gray-900">{subject.subject}</h4>
                <p className="text-sm text-gray-600">
                  {subject.correctAnswers}/{subject.totalQuestions} doğru
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  Günlük: {subject.dailyAverage}%
                </span>
                <span className="text-sm text-gray-400">|</span>
                <span className="text-sm text-gray-600">
                  Sınav: {subject.examAverage}%
                </span>
              </div>
              <div
                className={`text-sm font-medium ${
                  subject.improvement > 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {subject.improvement > 0 ? "+" : ""}
                {subject.improvement}% gelişim
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Performance Insights */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-green-50 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-2">
              <i className="ri-arrow-up-line text-green-600 w-5 h-5"></i>
              <span className="text-sm font-medium text-green-700">
                En İyi Gelişim
              </span>
            </div>
            <div className="text-lg font-bold text-green-600">
              İnkılap Tarihi
            </div>
            <div className="text-sm text-gray-600">+18% artış</div>
          </div>
          <div className="bg-orange-50 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-2">
              <i className="ri-focus-line text-orange-600 w-5 h-5"></i>
              <span className="text-sm font-medium text-orange-700">
                Odaklanılacak Alan
              </span>
            </div>
            <div className="text-lg font-bold text-orange-600">
              Sosyal Bilgiler
            </div>
            <div className="text-sm text-gray-600">72% ortalama</div>
          </div>
        </div>
      </div>
    </div>
  );
}
