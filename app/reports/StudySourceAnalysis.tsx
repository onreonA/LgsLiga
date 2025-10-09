"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const mockSourceData = [
  {
    source: "Doping",
    questions: 485,
    correct: 412,
    accuracy: 85,
    timeSpent: 1240,
    color: "#8b5cf6",
  },
  {
    source: "Kaynak Kitap",
    questions: 623,
    correct: 534,
    accuracy: 86,
    timeSpent: 1580,
    color: "#f59e0b",
  },
  {
    source: "Okul",
    questions: 392,
    correct: 314,
    accuracy: 80,
    timeSpent: 980,
    color: "#ef4444",
  },
  {
    source: "Ödev",
    questions: 347,
    correct: 285,
    accuracy: 82,
    timeSpent: 870,
    color: "#10b981",
  },
];

const mockSourceTrend = [
  { week: "Hafta 1", Doping: 45, "Kaynak Kitap": 62, Okul: 38, Ödev: 28 },
  { week: "Hafta 2", Doping: 52, "Kaynak Kitap": 58, Okul: 42, Ödev: 35 },
  { week: "Hafta 3", Doping: 48, "Kaynak Kitap": 65, Okul: 35, Ödev: 31 },
  { week: "Hafta 4", Doping: 58, "Kaynak Kitap": 71, Okul: 45, Ödev: 38 },
];

export default function StudySourceAnalysis() {
  const totalQuestions = mockSourceData.reduce(
    (sum, item) => sum + item.questions,
    0,
  );

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Kaynak Bazlı Analiz
          </h3>
          <p className="text-sm text-gray-600">
            Çalışma kaynaklarının performans karşılaştırması
          </p>
        </div>
        <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
          <i className="ri-book-2-line text-amber-600 text-xl"></i>
        </div>
      </div>

      {/* Source Distribution Pie Chart */}
      <div className="h-64 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={mockSourceData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="questions"
            >
              {mockSourceData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name, props) => [
                `${value} soru (${(((value as number) / totalQuestions) * 100).toFixed(1)}%)`,
                props.payload.source,
              ]}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Source Performance Details */}
      <div className="space-y-4 mb-6">
        {mockSourceData.map((source, index) => (
          <div key={index} className="border border-gray-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: source.color }}
                ></div>
                <h4 className="font-semibold text-gray-900">{source.source}</h4>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-gray-900">
                  {source.accuracy}%
                </div>
                <div className="text-xs text-gray-500">Doğruluk oranı</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <div className="text-lg font-semibold text-gray-900">
                  {source.questions}
                </div>
                <div className="text-xs text-gray-600">Toplam Soru</div>
              </div>
              <div className="bg-green-50 rounded-lg p-3 text-center">
                <div className="text-lg font-semibold text-green-600">
                  {source.correct}
                </div>
                <div className="text-xs text-gray-600">Doğru Cevap</div>
              </div>
              <div className="bg-blue-50 rounded-lg p-3 text-center">
                <div className="text-lg font-semibold text-blue-600">
                  {Math.floor(source.timeSpent / 60)}h {source.timeSpent % 60}m
                </div>
                <div className="text-xs text-gray-600">Süre</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-3">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 rounded-full"
                  style={{
                    width: `${source.accuracy}%`,
                    backgroundColor: source.color,
                  }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Weekly Trend */}
      <div className="border-t border-gray-100 pt-6">
        <h4 className="font-semibold text-gray-900 mb-4">
          Haftalık Kaynak Kullanım Trendi
        </h4>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={mockSourceTrend}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis
                dataKey="week"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#6b7280" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#6b7280" }}
              />
              <Tooltip />
              <Bar dataKey="Doping" fill="#8b5cf6" radius={[2, 2, 0, 0]} />
              <Bar
                dataKey="Kaynak Kitap"
                fill="#f59e0b"
                radius={[2, 2, 0, 0]}
              />
              <Bar dataKey="Okul" fill="#ef4444" radius={[2, 2, 0, 0]} />
              <Bar dataKey="Ödev" fill="#10b981" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Insights */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-green-50 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-2">
              <i className="ri-trophy-line text-green-600 w-5 h-5"></i>
              <span className="text-sm font-medium text-green-700">
                En Verimli Kaynak
              </span>
            </div>
            <div className="text-lg font-bold text-green-600">Kaynak Kitap</div>
            <div className="text-sm text-gray-600">%86 doğruluk oranı</div>
          </div>
          <div className="bg-blue-50 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-2">
              <i className="ri-time-line text-blue-600 w-5 h-5"></i>
              <span className="text-sm font-medium text-blue-700">
                En Çok Kullanılan
              </span>
            </div>
            <div className="text-lg font-bold text-blue-600">Kaynak Kitap</div>
            <div className="text-sm text-gray-600">623 soru çözüldü</div>
          </div>
        </div>
      </div>
    </div>
  );
}
