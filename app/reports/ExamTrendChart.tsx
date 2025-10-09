"use client";

import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const mockExamData = [
  {
    exam: "Okul Sınavı 1",
    date: "15 Ara",
    totalQuestions: 100,
    correctAnswers: 72,
    wrongAnswers: 18,
    emptyAnswers: 10,
    net: 67.5,
    score: 385,
    examType: "Okul",
  },
  {
    exam: "Doping Deneme 1",
    date: "22 Ara",
    totalQuestions: 90,
    correctAnswers: 68,
    wrongAnswers: 15,
    emptyAnswers: 7,
    net: 64.25,
    score: 392,
    examType: "Doping",
  },
  {
    exam: "Kaynak Deneme",
    date: "29 Ara",
    totalQuestions: 100,
    correctAnswers: 75,
    wrongAnswers: 20,
    emptyAnswers: 5,
    net: 70,
    score: 405,
    examType: "Kaynak",
  },
  {
    exam: "Kurs Sınavı",
    date: "5 Oca",
    totalQuestions: 90,
    correctAnswers: 71,
    wrongAnswers: 12,
    emptyAnswers: 7,
    net: 68,
    score: 398,
    examType: "Kurs",
  },
  {
    exam: "Okul Sınavı 2",
    date: "12 Oca",
    totalQuestions: 100,
    correctAnswers: 78,
    wrongAnswers: 16,
    emptyAnswers: 6,
    net: 74,
    score: 415,
    examType: "Okul",
  },
  {
    exam: "Doping Deneme 2",
    date: "19 Oca",
    totalQuestions: 90,
    correctAnswers: 73,
    wrongAnswers: 11,
    emptyAnswers: 6,
    net: 70.25,
    score: 408,
    examType: "Doping",
  },
];

export default function ExamTrendChart() {
  const getExamTypeColor = (examType: string) => {
    switch (examType) {
      case "Okul":
        return "#ef4444";
      case "Doping":
        return "#8b5cf6";
      case "Kaynak":
        return "#f59e0b";
      case "Kurs":
        return "#10b981";
      default:
        return "#6b7280";
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Sınav Performans Trendi
          </h3>
          <p className="text-sm text-gray-600">Net ve puan gelişimi analizi</p>
        </div>
        <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
          <i className="ri-line-chart-line text-emerald-600 text-xl"></i>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={mockExamData}
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
              yAxisId="net"
              orientation="left"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#6b7280" }}
            />
            <YAxis
              yAxisId="score"
              orientation="right"
              domain={[300, 500]}
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
              formatter={(value, name, props) => {
                if (name === "net") return [`${value} Net`, "Net Sayısı"];
                if (name === "score") return [`${value} Puan`, "LGS Puanı"];
                return [value, name];
              }}
              labelFormatter={(label, payload) => {
                if (payload && payload[0]) {
                  return `${payload[0].payload.exam} (${label})`;
                }
                return label;
              }}
            />
            <Legend />
            <Bar
              yAxisId="net"
              dataKey="net"
              fill="#3b82f6"
              name="Net Sayısı"
              radius={[4, 4, 0, 0]}
            />
            <Line
              yAxisId="score"
              type="monotone"
              dataKey="score"
              stroke="#ef4444"
              strokeWidth={3}
              name="LGS Puanı"
              dot={{ fill: "#ef4444", strokeWidth: 2, r: 6 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Exam Type Legend */}
      <div className="flex items-center justify-center space-x-6 mt-6 pt-4 border-t border-gray-100">
        {["Okul", "Doping", "Kaynak", "Kurs"].map((type) => (
          <div key={type} className="flex items-center space-x-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: getExamTypeColor(type) }}
            ></div>
            <span className="text-sm text-gray-600">{type}</span>
          </div>
        ))}
      </div>

      {/* Performance Summary */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-gray-100">
        <div className="bg-blue-50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">+6.75</div>
          <div className="text-sm text-blue-700">Net Artışı</div>
          <div className="text-xs text-gray-600 mt-1">İlk sınavdan bu yana</div>
        </div>
        <div className="bg-green-50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-green-600">+23</div>
          <div className="text-sm text-green-700">Puan Artışı</div>
          <div className="text-xs text-gray-600 mt-1">İlk sınavdan bu yana</div>
        </div>
        <div className="bg-purple-50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">408</div>
          <div className="text-sm text-purple-700">Son Puan</div>
          <div className="text-xs text-gray-600 mt-1">Hedef: 450</div>
        </div>
      </div>
    </div>
  );
}
