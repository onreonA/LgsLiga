"use client";

import { useState } from "react";

const mockDailyData = [
  // Ocak ayı verileri
  { date: "2024-01-01", questions: 45, accuracy: 78, studyTime: 120 },
  { date: "2024-01-02", questions: 52, accuracy: 82, studyTime: 135 },
  { date: "2024-01-03", questions: 38, accuracy: 85, studyTime: 95 },
  { date: "2024-01-04", questions: 67, accuracy: 79, studyTime: 160 },
  { date: "2024-01-05", questions: 43, accuracy: 88, studyTime: 110 },
  { date: "2024-01-06", questions: 59, accuracy: 84, studyTime: 145 },
  { date: "2024-01-07", questions: 71, accuracy: 91, studyTime: 180 },
  { date: "2024-01-08", questions: 48, accuracy: 86, studyTime: 125 },
  { date: "2024-01-09", questions: 65, accuracy: 89, studyTime: 155 },
  { date: "2024-01-10", questions: 73, accuracy: 93, studyTime: 190 },
  { date: "2024-01-11", questions: 56, accuracy: 87, studyTime: 140 },
  { date: "2024-01-12", questions: 82, accuracy: 95, studyTime: 200 },
  { date: "2024-01-13", questions: 69, accuracy: 92, studyTime: 175 },
  { date: "2024-01-14", questions: 91, accuracy: 94, studyTime: 220 },
  { date: "2024-01-15", questions: 0, accuracy: 0, studyTime: 0 }, // Tatil
  { date: "2024-01-16", questions: 55, accuracy: 83, studyTime: 130 },
  { date: "2024-01-17", questions: 63, accuracy: 88, studyTime: 150 },
  { date: "2024-01-18", questions: 47, accuracy: 81, studyTime: 115 },
  { date: "2024-01-19", questions: 78, accuracy: 90, studyTime: 185 },
  { date: "2024-01-20", questions: 84, accuracy: 96, studyTime: 205 },
  { date: "2024-01-21", questions: 0, accuracy: 0, studyTime: 0 }, // Tatil
  { date: "2024-01-22", questions: 61, accuracy: 85, studyTime: 145 },
  { date: "2024-01-23", questions: 75, accuracy: 89, studyTime: 170 },
  { date: "2024-01-24", questions: 68, accuracy: 87, studyTime: 160 },
  { date: "2024-01-25", questions: 89, accuracy: 93, studyTime: 210 },
  { date: "2024-01-26", questions: 72, accuracy: 91, studyTime: 175 },
  { date: "2024-01-27", questions: 95, accuracy: 97, studyTime: 230 },
  { date: "2024-01-28", questions: 0, accuracy: 0, studyTime: 0 }, // Tatil
  { date: "2024-01-29", questions: 58, accuracy: 84, studyTime: 140 },
  { date: "2024-01-30", questions: 81, accuracy: 92, studyTime: 195 },
  { date: "2024-01-31", questions: 77, accuracy: 89, studyTime: 180 },
];

const weekDays = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];
const months = [
  "Ocak",
  "Şubat",
  "Mart",
  "Nisan",
  "Mayıs",
  "Haziran",
  "Temmuz",
  "Ağustos",
  "Eylül",
  "Ekim",
  "Kasım",
  "Aralık",
];

export default function DailyStudyHeatmap() {
  const [selectedMetric, setSelectedMetric] = useState<
    "questions" | "accuracy" | "studyTime"
  >("questions");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const getIntensityColor = (value: number, metric: string) => {
    if (value === 0) return "bg-gray-100";

    let intensity = 0;
    switch (metric) {
      case "questions":
        if (value >= 80) intensity = 4;
        else if (value >= 60) intensity = 3;
        else if (value >= 40) intensity = 2;
        else intensity = 1;
        break;
      case "accuracy":
        if (value >= 90) intensity = 4;
        else if (value >= 80) intensity = 3;
        else if (value >= 70) intensity = 2;
        else intensity = 1;
        break;
      case "studyTime":
        if (value >= 180) intensity = 4;
        else if (value >= 120) intensity = 3;
        else if (value >= 60) intensity = 2;
        else intensity = 1;
        break;
    }

    const colors = {
      1: "bg-blue-200",
      2: "bg-blue-400",
      3: "bg-blue-600",
      4: "bg-blue-800",
    };

    return colors[intensity as keyof typeof colors];
  };

  const getDateInfo = (dateStr: string) => {
    const data = mockDailyData.find((d) => d.date === dateStr);
    return data || { questions: 0, accuracy: 0, studyTime: 0 };
  };

  const generateCalendarDays = () => {
    const year = 2024;
    const month = 0; // Ocak (0-indexed)
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay() + 1); // Pazartesi'den başla

    const days = [];
    const current = new Date(startDate);

    while (current <= lastDay || days.length % 7 !== 0) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    return days;
  };

  const calendarDays = generateCalendarDays();

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Günlük Çalışma Aktivite Haritası
          </h3>
          <p className="text-sm text-gray-600">Ocak 2024 çalışma yoğunluğu</p>
        </div>
        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
          <i className="ri-calendar-2-line text-blue-600 text-xl"></i>
        </div>
      </div>

      {/* Metric Selector */}
      <div className="flex space-x-1 mb-6 bg-gray-100 rounded-xl p-1">
        <button
          onClick={() => setSelectedMetric("questions")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
            selectedMetric === "questions"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Soru Sayısı
        </button>
        <button
          onClick={() => setSelectedMetric("accuracy")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
            selectedMetric === "accuracy"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Doğruluk Oranı
        </button>
        <button
          onClick={() => setSelectedMetric("studyTime")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
            selectedMetric === "studyTime"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Çalışma Süresi
        </button>
      </div>

      {/* Calendar Heatmap */}
      <div className="mb-6">
        {/* Week Days Header */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map((day) => (
            <div key={day} className="text-xs text-gray-500 text-center py-1">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((date, index) => {
            const dateStr = date.toISOString().split("T")[0];
            const dateInfo = getDateInfo(dateStr);
            const value = dateInfo[selectedMetric];
            const isCurrentMonth = date.getMonth() === 0;

            return (
              <div
                key={index}
                onClick={() => setSelectedDate(dateStr)}
                className={`
                  w-8 h-8 rounded-lg cursor-pointer transition-all hover:scale-110 border-2
                  ${getIntensityColor(value, selectedMetric)}
                  ${selectedDate === dateStr ? "border-blue-500" : "border-transparent"}
                  ${!isCurrentMonth ? "opacity-30" : ""}
                `}
                title={`${date.getDate()} Ocak - ${
                  selectedMetric === "questions"
                    ? `${value} soru`
                    : selectedMetric === "accuracy"
                      ? `%${value} doğruluk`
                      : `${value} dakika`
                }`}
              >
                <div className="w-full h-full flex items-center justify-center text-xs font-medium text-white">
                  {isCurrentMonth ? date.getDate() : ""}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Az</span>
          <div className="flex space-x-1">
            <div className="w-3 h-3 bg-gray-100 rounded"></div>
            <div className="w-3 h-3 bg-blue-200 rounded"></div>
            <div className="w-3 h-3 bg-blue-400 rounded"></div>
            <div className="w-3 h-3 bg-blue-600 rounded"></div>
            <div className="w-3 h-3 bg-blue-800 rounded"></div>
          </div>
          <span className="text-sm text-gray-600">Çok</span>
        </div>
      </div>

      {/* Selected Date Details */}
      {selectedDate && (
        <div className="bg-blue-50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-blue-900">
              {new Date(selectedDate).toLocaleDateString("tr-TR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </h4>
            <button
              onClick={() => setSelectedDate(null)}
              className="text-blue-600 hover:text-blue-800 cursor-pointer"
            >
              <i className="ri-close-line w-5 h-5"></i>
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {getDateInfo(selectedDate).questions}
              </div>
              <div className="text-sm text-gray-600">Soru</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                %{getDateInfo(selectedDate).accuracy}
              </div>
              <div className="text-sm text-gray-600">Doğruluk</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {Math.floor(getDateInfo(selectedDate).studyTime / 60)}s{" "}
                {getDateInfo(selectedDate).studyTime % 60}d
              </div>
              <div className="text-sm text-gray-600">Süre</div>
            </div>
          </div>
        </div>
      )}

      {/* Monthly Summary */}
      <div className="grid grid-cols-4 gap-4 mt-6 pt-4 border-t border-gray-100">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">28</div>
          <div className="text-xs text-gray-600">Aktif Gün</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">1,847</div>
          <div className="text-xs text-gray-600">Toplam Soru</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-600">88%</div>
          <div className="text-xs text-gray-600">Ort. Doğruluk</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">75h</div>
          <div className="text-xs text-gray-600">Toplam Süre</div>
        </div>
      </div>
    </div>
  );
}
