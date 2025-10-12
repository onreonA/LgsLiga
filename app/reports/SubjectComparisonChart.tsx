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
  Cell,
} from "recharts";

interface SubjectData {
  subject: string;
  examAverage: number;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  emptyAnswers: number;
  netScore: number;
  color: string;
}

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

const subjectColors: { [key: string]: string } = {
  Matematik: "#ef4444",
  Türkçe: "#f97316",
  "Fen Bilimleri": "#eab308",
  Fen: "#eab308",
  Tarih: "#10b981",
  "İnkılap Tarihi": "#10b981",
  "Din Kültürü": "#8b5cf6",
  İngilizce: "#06b6d4",
};

export default function SubjectComparisonChart() {
  const [subjectData, setSubjectData] = useState<SubjectData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSubjectData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadSubjectData = async () => {
    try {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setSubjectData(mockSubjectData as any);
        setLoading(false);
        return;
      }

      // Fetch all exams for this user
      const { data: exams, error } = await supabase
        .from("exams")
        .select("*")
        .eq("user_id", user.id);

      if (error) throw error;

      if (!exams || exams.length === 0) {
        setSubjectData(mockSubjectData as any);
        setLoading(false);
        return;
      }

      // Aggregate data by subject
      const subjectStats: {
        [key: string]: {
          correct: number;
          wrong: number;
          empty: number;
          count: number;
        };
      } = {};

      exams.forEach((exam: any) => {
        if (exam.subject_scores && typeof exam.subject_scores === "object") {
          Object.keys(exam.subject_scores).forEach((subject) => {
            const score = exam.subject_scores[subject];
            if (!subjectStats[subject]) {
              subjectStats[subject] = {
                correct: 0,
                wrong: 0,
                empty: 0,
                count: 0,
              };
            }
            subjectStats[subject].correct += score.correct || 0;
            subjectStats[subject].wrong += score.wrong || 0;
            subjectStats[subject].empty += score.empty || 0;
            subjectStats[subject].count += 1;
          });
        }
      });

      // Convert to chart data
      const chartData: SubjectData[] = Object.keys(subjectStats).map(
        (subject) => {
          const stats = subjectStats[subject];
          const totalQuestions = stats.correct + stats.wrong + stats.empty;
          const netScore = stats.correct - stats.wrong * 0.25;
          const examAverage =
            totalQuestions > 0
              ? Math.round((stats.correct / totalQuestions) * 100)
              : 0;

          return {
            subject,
            examAverage,
            totalQuestions,
            correctAnswers: stats.correct,
            wrongAnswers: stats.wrong,
            emptyAnswers: stats.empty,
            netScore: Math.round(netScore * 10) / 10,
            color: subjectColors[subject] || "#6b7280",
          };
        },
      );

      // Sort by exam average descending
      chartData.sort((a, b) => b.examAverage - a.examAverage);

      setSubjectData(chartData);
      setLoading(false);
    } catch (error) {
      console.error("Error loading subject data:", error);
      setSubjectData(mockSubjectData as any);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Ders Bazında Performans Karşılaştırması
          </h3>
          <p className="text-sm text-gray-600">
            Sınavlardaki ders bazlı başarı oranları ({subjectData.length} ders)
          </p>
        </div>
        <div className="w-10 h-10 bg-cyan-100 rounded-xl flex items-center justify-center">
          <i className="ri-bar-chart-2-line text-cyan-600 text-xl"></i>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={subjectData}
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
                if (name === "examAverage")
                  return [`${value}%`, "Başarı Oranı"];
                return [value, name];
              }}
            />
            <Bar
              dataKey="examAverage"
              name="Sınav Başarı %"
              radius={[4, 4, 0, 0]}
            >
              {subjectData.map((entry, index) => (
                <Cell key={`exam-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Subject Details */}
      <div className="mt-6 space-y-3">
        {subjectData.map((subject, index) => (
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
                  {subject.correctAnswers}/{subject.totalQuestions} doğru • Net:{" "}
                  {subject.netScore}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex flex-col items-end">
                <span className="text-lg font-bold text-gray-900">
                  {subject.examAverage}%
                </span>
                <span className="text-xs text-gray-500">
                  Net: {subject.netScore}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Performance Insights */}
      {subjectData.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-100">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-50 rounded-xl p-4">
              <div className="flex items-center space-x-2 mb-2">
                <i className="ri-star-line text-green-600 w-5 h-5"></i>
                <span className="text-sm font-medium text-green-700">
                  En Başarılı Ders
                </span>
              </div>
              <div className="text-lg font-bold text-green-600">
                {subjectData[0].subject}
              </div>
              <div className="text-sm text-gray-600">
                {subjectData[0].examAverage}% başarı
              </div>
            </div>
            <div className="bg-orange-50 rounded-xl p-4">
              <div className="flex items-center space-x-2 mb-2">
                <i className="ri-focus-line text-orange-600 w-5 h-5"></i>
                <span className="text-sm font-medium text-orange-700">
                  Geliştirilmeli
                </span>
              </div>
              <div className="text-lg font-bold text-orange-600">
                {subjectData[subjectData.length - 1].subject}
              </div>
              <div className="text-sm text-gray-600">
                {subjectData[subjectData.length - 1].examAverage}% başarı
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
