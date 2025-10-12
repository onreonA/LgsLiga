"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface BookTestResult {
  id: string;
  book_title: string;
  author: string;
  total_questions: number;
  correct_answers: number;
  wrong_answers: number;
  score: number;
  completion_percentage: number;
  total_time_seconds: number;
  completed_at: string;
}

interface BookQuestionStats {
  book_title: string;
  total_tests: number;
  average_score: number;
  total_questions: number;
  total_correct: number;
  total_wrong: number;
}

export default function BookQuestionsReport() {
  const [testResults, setTestResults] = useState<BookTestResult[]>([]);
  const [bookStats, setBookStats] = useState<BookQuestionStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState("all");

  useEffect(() => {
    loadBookTestData();
  }, [selectedPeriod]);

  const loadBookTestData = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      let dateFilter = "";
      if (selectedPeriod === "week") {
        dateFilter = "completed_at >= NOW() - INTERVAL '7 days'";
      } else if (selectedPeriod === "month") {
        dateFilter = "completed_at >= NOW() - INTERVAL '30 days'";
      }

      // Load test results
      const { data: resultsData } = await supabase
        .from("book_test_sessions")
        .select(
          `
          *,
          book:books(title, author)
        `,
        )
        .eq("user_id", user.id)
        .eq("status", "completed")
        .not("completed_at", "is", null)
        .order("completed_at", { ascending: false });

      if (resultsData) {
        const formattedResults = resultsData.map((result: any) => ({
          id: result.id,
          book_title: result.book?.title || "Bilinmeyen Kitap",
          author: result.book?.author || "Bilinmeyen Yazar",
          total_questions: result.total_questions,
          correct_answers: result.correct_answers,
          wrong_answers: result.wrong_answers,
          score: result.score,
          completion_percentage: result.completion_percentage,
          total_time_seconds: result.total_time_seconds,
          completed_at: result.completed_at,
        }));
        setTestResults(formattedResults);

        // Calculate book statistics
        const statsMap = new Map<string, BookQuestionStats>();

        formattedResults.forEach((result) => {
          const key = result.book_title;
          if (!statsMap.has(key)) {
            statsMap.set(key, {
              book_title: result.book_title,
              total_tests: 0,
              average_score: 0,
              total_questions: 0,
              total_correct: 0,
              total_wrong: 0,
            });
          }

          const stats = statsMap.get(key)!;
          stats.total_tests += 1;
          stats.total_questions += result.total_questions;
          stats.total_correct += result.correct_answers;
          stats.total_wrong += result.wrong_answers;
          stats.average_score =
            (stats.average_score * (stats.total_tests - 1) + result.score) /
            stats.total_tests;
        });

        setBookStats(Array.from(statsMap.values()));
      }

      setLoading(false);
    } catch (error) {
      console.error("Error loading book test data:", error);
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Chart data
  const scoreChartData = bookStats.map((book) => ({
    name:
      book.book_title.length > 20
        ? book.book_title.substring(0, 20) + "..."
        : book.book_title,
    score: book.average_score,
    tests: book.total_tests,
  }));

  const timeChartData = testResults.slice(0, 10).map((result) => ({
    name: formatDate(result.completed_at),
    time: result.total_time_seconds / 60, // Convert to minutes
    score: result.score,
  }));

  const performanceData = [
    {
      name: "Doğru",
      value: bookStats.reduce((sum, book) => sum + book.total_correct, 0),
      color: "#10B981",
    },
    {
      name: "Yanlış",
      value: bookStats.reduce((sum, book) => sum + book.total_wrong, 0),
      color: "#EF4444",
    },
  ];

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-300 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-300 rounded w-full"></div>
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (testResults.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="ri-book-open-line text-2xl text-blue-600"></i>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Kitap Test Sonuçları
          </h3>
          <p className="text-gray-600 mb-6">
            Henüz kitap testi tamamlamamışsınız. Kitap okuduktan sonra teste
            katılabilirsiniz.
          </p>
          <div className="bg-blue-50 rounded-xl p-4">
            <p className="text-sm text-blue-800">
              <i className="ri-information-line mr-2"></i>
              Kitap okuma sonrası otomatik olarak test açılır ve sonuçlar burada
              görüntülenir.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Kitap Test Sonuçları
          </h2>
          <p className="text-gray-600">
            Okuduğunuz kitapların test performansınızı analiz edin
          </p>
        </div>
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">Tüm Zamanlar</option>
          <option value="week">Son 7 Gün</option>
          <option value="month">Son 30 Gün</option>
        </select>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <i className="ri-book-open-line text-xl text-blue-600"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Toplam Test</p>
              <p className="text-2xl font-bold text-gray-900">
                {testResults.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <i className="ri-trophy-line text-xl text-green-600"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Ortalama Skor</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round(
                  bookStats.reduce((sum, book) => sum + book.average_score, 0) /
                    bookStats.length || 0,
                )}
                %
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <i className="ri-question-answer-line text-xl text-purple-600"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Toplam Soru</p>
              <p className="text-2xl font-bold text-gray-900">
                {bookStats.reduce((sum, book) => sum + book.total_questions, 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <i className="ri-time-line text-xl text-orange-600"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Ortalama Süre</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatTime(
                  Math.round(
                    testResults.reduce(
                      (sum, result) => sum + result.total_time_seconds,
                      0,
                    ) / testResults.length || 0,
                  ),
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Book Performance Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Kitap Bazlı Performans
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={scoreChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip
                formatter={(value, name) => [
                  name === "score" ? `${value}%` : value,
                  name === "score" ? "Ortalama Skor" : "Test Sayısı",
                ]}
              />
              <Bar dataKey="score" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Performance Distribution */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Doğru/Yanlış Dağılımı
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={performanceData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                dataKey="value"
              >
                {performanceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value} soru`} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center space-x-6 mt-4">
            {performanceData.map((item) => (
              <div key={item.name} className="flex items-center">
                <div
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-sm text-gray-600">
                  {item.name}: {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Tests */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Son Test Sonuçları
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kitap
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tarih
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Skor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Doğru/Yanlış
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Süre
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {testResults.slice(0, 10).map((result) => (
                <tr key={result.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {result.book_title}
                      </div>
                      <div className="text-sm text-gray-500">
                        {result.author}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(result.completed_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        result.score >= 80
                          ? "bg-green-100 text-green-800"
                          : result.score >= 60
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {result.score}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {result.correct_answers} / {result.wrong_answers}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatTime(result.total_time_seconds)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
