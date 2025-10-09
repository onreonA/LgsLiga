"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const mockProgressData = [
  {
    date: "1 Oca",
    totalQuestions: 45,
    correctAnswers: 32,
    accuracy: 71,
    studyTime: 120,
  },
  {
    date: "2 Oca",
    totalQuestions: 52,
    correctAnswers: 41,
    accuracy: 79,
    studyTime: 135,
  },
  {
    date: "3 Oca",
    totalQuestions: 38,
    correctAnswers: 31,
    accuracy: 82,
    studyTime: 95,
  },
  {
    date: "4 Oca",
    totalQuestions: 67,
    correctAnswers: 54,
    accuracy: 81,
    studyTime: 160,
  },
  {
    date: "5 Oca",
    totalQuestions: 43,
    correctAnswers: 37,
    accuracy: 86,
    studyTime: 110,
  },
  {
    date: "6 Oca",
    totalQuestions: 59,
    correctAnswers: 51,
    accuracy: 86,
    studyTime: 145,
  },
  {
    date: "7 Oca",
    totalQuestions: 71,
    correctAnswers: 63,
    accuracy: 89,
    studyTime: 180,
  },
  {
    date: "8 Oca",
    totalQuestions: 48,
    correctAnswers: 44,
    accuracy: 92,
    studyTime: 125,
  },
  {
    date: "9 Oca",
    totalQuestions: 65,
    correctAnswers: 59,
    accuracy: 91,
    studyTime: 155,
  },
  {
    date: "10 Oca",
    totalQuestions: 73,
    correctAnswers: 68,
    accuracy: 93,
    studyTime: 190,
  },
  {
    date: "11 Oca",
    totalQuestions: 56,
    correctAnswers: 53,
    accuracy: 95,
    studyTime: 140,
  },
  {
    date: "12 Oca",
    totalQuestions: 82,
    correctAnswers: 78,
    accuracy: 95,
    studyTime: 200,
  },
  {
    date: "13 Oca",
    totalQuestions: 69,
    correctAnswers: 66,
    accuracy: 96,
    studyTime: 175,
  },
  {
    date: "14 Oca",
    totalQuestions: 91,
    correctAnswers: 87,
    accuracy: 96,
    studyTime: 220,
  },
];

export default function StudyProgressChart() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Günlük Çalışma İlerlemesi
          </h3>
          <p className="text-sm text-gray-600">
            Son 14 günlük çalışma performansı ve doğruluk oranı
          </p>
        </div>
        <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
          <i className="ri-trending-up-line text-indigo-600 text-xl"></i>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={mockProgressData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#6b7280" }}
            />
            <YAxis
              yAxisId="questions"
              orientation="left"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#6b7280" }}
            />
            <YAxis
              yAxisId="accuracy"
              orientation="right"
              domain={[0, 100]}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#6b7280" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
              formatter={(value, name) => {
                if (name === "accuracy") return [`${value}%`, "Doğruluk Oranı"];
                if (name === "totalQuestions") return [value, "Toplam Soru"];
                if (name === "correctAnswers") return [value, "Doğru Cevap"];
                return [value, name];
              }}
            />
            <Legend />
            <Line
              yAxisId="questions"
              type="monotone"
              dataKey="totalQuestions"
              stroke="#3b82f6"
              strokeWidth={2}
              name="Toplam Soru"
              dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
            />
            <Line
              yAxisId="questions"
              type="monotone"
              dataKey="correctAnswers"
              stroke="#10b981"
              strokeWidth={2}
              name="Doğru Cevap"
              dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
            />
            <Line
              yAxisId="accuracy"
              type="monotone"
              dataKey="accuracy"
              stroke="#f59e0b"
              strokeWidth={3}
              strokeDasharray="5 5"
              name="Doğruluk Oranı (%)"
              dot={{ fill: "#f59e0b", strokeWidth: 2, r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-4 mt-6 pt-4 border-t border-gray-100">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">847</div>
          <div className="text-xs text-gray-600">Toplam Soru</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">764</div>
          <div className="text-xs text-gray-600">Doğru Cevap</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-600">90%</div>
          <div className="text-xs text-gray-600">Ortalama Doğruluk</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">2.1h</div>
          <div className="text-xs text-gray-600">Günlük Ortalama</div>
        </div>
      </div>
    </div>
  );
}
