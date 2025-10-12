"use client";

import { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { supabase } from "@/lib/supabase";

interface BookStats {
  book_name: string;
  total_pages: number;
  pages_read: number;
  reading_days: number;
  completion_rate: number;
  avg_daily_pages: number;
}

const mockBookStats = [
  {
    book_name: "Matematik Soru Bankası",
    total_pages: 450,
    pages_read: 283,
    reading_days: 12,
    completion_rate: 63,
    avg_daily_pages: 24,
  },
  {
    book_name: "Türkçe Test Kitabı",
    total_pages: 320,
    pages_read: 260,
    reading_days: 13,
    completion_rate: 81,
    avg_daily_pages: 20,
  },
  {
    book_name: "Fen Bilimleri Konu Anlatımı",
    total_pages: 280,
    pages_read: 147,
    reading_days: 7,
    completion_rate: 53,
    avg_daily_pages: 21,
  },
  {
    book_name: "Sosyal Bilgiler Atlası",
    total_pages: 200,
    pages_read: 200,
    reading_days: 10,
    completion_rate: 100,
    avg_daily_pages: 20,
  },
  {
    book_name: "İngilizce Kelime Kitabı",
    total_pages: 150,
    pages_read: 72,
    reading_days: 6,
    completion_rate: 48,
    avg_daily_pages: 12,
  },
];

const readingHabits = [
  { day: "Pazartesi", pages: 45, books: 3 },
  { day: "Salı", pages: 52, books: 2 },
  { day: "Çarşamba", pages: 38, books: 4 },
  { day: "Perşembe", pages: 67, books: 3 },
  { day: "Cuma", pages: 43, books: 2 },
  { day: "Cumartesi", pages: 78, books: 4 },
  { day: "Pazar", pages: 65, books: 3 },
];

const COLORS = ["#10b981", "#3b82f6", "#8b5cf6", "#f59e0b", "#ef4444"];

export default function BookReadingStats() {
  const [bookStats, setBookStats] = useState<BookStats[]>([]);
  const [selectedView, setSelectedView] = useState<
    "completion" | "daily" | "category"
  >("completion");

  useEffect(() => {
    loadBookStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadBookStats = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setBookStats(mockBookStats);
        return;
      }

      const { data, error } = await supabase
        .from("book_reading")
        .select("*")
        .eq("user_id", user.id);

      if (error) throw error;

      // Process real data into stats format
      const processedStats = processBookData(data || []);
      setBookStats(processedStats.length > 0 ? processedStats : mockBookStats);
    } catch (error) {
      console.error("Error loading book stats:", error);
      setBookStats(mockBookStats);
    }
  };

  const processBookData = (data: any[]) => {
    const bookGroups = data.reduce(
      (acc, item) => {
        if (!acc[item.book_name]) {
          acc[item.book_name] = [];
        }
        acc[item.book_name].push(item);
        return acc;
      },
      {} as Record<string, any[]>,
    );

    return (Object.entries(bookGroups) as [string, any[]][]).map(
      ([bookName, entries]) => {
        const totalPagesRead = entries.reduce(
          (sum, entry) => sum + entry.pages_read_today,
          0,
        );
        const totalPages = entries[0]?.total_pages || 0;
        const readingDays = entries.length;
        const completionRate =
          totalPages > 0 ? (totalPagesRead / totalPages) * 100 : 0;
        const avgDailyPages =
          readingDays > 0 ? Math.round(totalPagesRead / readingDays) : 0;

        return {
          book_name: bookName,
          total_pages: totalPages,
          pages_read: totalPagesRead,
          reading_days: readingDays,
          completion_rate: Math.min(completionRate, 100),
          avg_daily_pages: avgDailyPages,
        };
      },
    );
  };

  const getCompletionData = () => {
    return bookStats.map((book, index) => ({
      name:
        book.book_name.length > 15
          ? book.book_name.substring(0, 15) + "..."
          : book.book_name,
      value: book.completion_rate,
      pages: book.pages_read,
      total: book.total_pages,
      color: COLORS[index % COLORS.length],
    }));
  };

  const getCategoryData = () => {
    const categories = {
      Matematik: { pages: 0, books: 0, color: "#3b82f6" },
      Türkçe: { pages: 0, books: 0, color: "#10b981" },
      "Fen Bilimleri": { pages: 0, books: 0, color: "#8b5cf6" },
      "Sosyal Bilgiler": { pages: 0, books: 0, color: "#f59e0b" },
      İngilizce: { pages: 0, books: 0, color: "#ef4444" },
      Diğer: { pages: 0, books: 0, color: "#6b7280" },
    };

    type CategoryKey = keyof typeof categories;

    bookStats.forEach((book) => {
      let category: CategoryKey = "Diğer";
      if (book.book_name.toLowerCase().includes("matematik"))
        category = "Matematik";
      else if (book.book_name.toLowerCase().includes("türkçe"))
        category = "Türkçe";
      else if (book.book_name.toLowerCase().includes("fen"))
        category = "Fen Bilimleri";
      else if (book.book_name.toLowerCase().includes("sosyal"))
        category = "Sosyal Bilgiler";
      else if (book.book_name.toLowerCase().includes("ingilizce"))
        category = "İngilizce";

      categories[category].pages += book.pages_read;
      categories[category].books += 1;
    });

    return Object.entries(categories)
      .filter(([_, data]) => data.pages > 0)
      .map(([name, data]) => ({
        name,
        pages: data.pages,
        books: data.books,
        color: data.color,
      }));
  };

  const totalPagesRead = bookStats.reduce(
    (sum, book) => sum + book.pages_read,
    0,
  );
  const totalBooks = bookStats.length;
  const completedBooks = bookStats.filter(
    (book) => book.completion_rate >= 100,
  ).length;
  const avgCompletion =
    bookStats.length > 0
      ? Math.round(
          bookStats.reduce((sum, book) => sum + book.completion_rate, 0) /
            bookStats.length,
        )
      : 0;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Kitap Okuma İstatistikleri
          </h3>
          <p className="text-sm text-gray-600">
            Kitap okuma alışkanlıklarınızın detaylı analizi
          </p>
        </div>
        <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
          <i className="ri-bar-chart-line text-emerald-600 text-xl"></i>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-green-50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            {totalPagesRead}
          </div>
          <div className="text-sm text-gray-600">Toplam Sayfa</div>
        </div>
        <div className="bg-blue-50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{totalBooks}</div>
          <div className="text-sm text-gray-600">Kitap Sayısı</div>
        </div>
        <div className="bg-purple-50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">
            {completedBooks}
          </div>
          <div className="text-sm text-gray-600">Tamamlanan</div>
        </div>
        <div className="bg-amber-50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-amber-600">
            {avgCompletion}%
          </div>
          <div className="text-sm text-gray-600">Ort. Tamamlama</div>
        </div>
      </div>

      {/* View Selector */}
      <div className="flex space-x-1 mb-6 bg-gray-100 rounded-xl p-1">
        <button
          onClick={() => setSelectedView("completion")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
            selectedView === "completion"
              ? "bg-white text-green-600 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Tamamlama Oranları
        </button>
        <button
          onClick={() => setSelectedView("daily")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
            selectedView === "daily"
              ? "bg-white text-green-600 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Günlük Alışkanlıklar
        </button>
        <button
          onClick={() => setSelectedView("category")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
            selectedView === "category"
              ? "bg-white text-green-600 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Kategori Analizi
        </button>
      </div>

      {/* Completion Rates View */}
      {selectedView === "completion" && (
        <div className="space-y-6">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={getCompletionData()}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {getCompletionData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name, props) => [
                    `%${(value as number).toFixed(1)} (${props.payload.pages}/${props.payload.total} sayfa)`,
                    props.payload.name,
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-3">
            {bookStats.map((book, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {book.book_name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {book.pages_read} / {book.total_pages} sayfa
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-900">
                    {book.completion_rate.toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-600">
                    {book.reading_days} gün
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Daily Habits View */}
      {selectedView === "daily" && (
        <div className="space-y-6">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={readingHabits}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                />
                <Tooltip
                  formatter={(value, name) => [
                    `${value} ${name === "pages" ? "sayfa" : "kitap"}`,
                    name === "pages" ? "Okunan Sayfa" : "Kitap Sayısı",
                  ]}
                />
                <Bar dataKey="pages" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-50 rounded-xl p-4">
              <div className="flex items-center space-x-2 mb-2">
                <i className="ri-calendar-check-line text-green-600 w-5 h-5"></i>
                <span className="text-sm font-medium text-green-700">
                  En Verimli Gün
                </span>
              </div>
              <div className="text-lg font-bold text-green-600">Cumartesi</div>
              <div className="text-sm text-gray-600">78 sayfa ortalama</div>
            </div>
            <div className="bg-blue-50 rounded-xl p-4">
              <div className="flex items-center space-x-2 mb-2">
                <i className="ri-time-line text-blue-600 w-5 h-5"></i>
                <span className="text-sm font-medium text-blue-700">
                  Haftalık Ortalama
                </span>
              </div>
              <div className="text-lg font-bold text-blue-600">55 sayfa</div>
              <div className="text-sm text-gray-600">Günlük okuma</div>
            </div>
          </div>
        </div>
      )}

      {/* Category Analysis View */}
      {selectedView === "category" && (
        <div className="space-y-6">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={getCategoryData()}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                />
                <Tooltip
                  formatter={(value, name) => [
                    `${value} sayfa`,
                    "Okunan Sayfa",
                  ]}
                />
                <Bar dataKey="pages" radius={[4, 4, 0, 0]}>
                  {getCategoryData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {getCategoryData().map((category, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-xl p-4"
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: category.color }}
                  ></div>
                  <h4 className="font-semibold text-gray-900">
                    {category.name}
                  </h4>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900">
                      {category.pages}
                    </div>
                    <div className="text-xs text-gray-600">Sayfa</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900">
                      {category.books}
                    </div>
                    <div className="text-xs text-gray-600">Kitap</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
