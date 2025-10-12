"use client";

import { useState } from "react";
import RadarChart from "./RadarChart";
import WeeklyNetChart from "./WeeklyNetChart";
import TopicHeatmap from "./TopicHeatmap";
import StudyProgressChart from "./StudyProgressChart";
import ExamTrendChart from "./ExamTrendChart";
import SubjectComparisonChart from "./SubjectComparisonChart";
import DailyStudyHeatmap from "./DailyStudyHeatmap";
import PerformanceInsights from "./PerformanceInsights";
import StudySourceAnalysis from "./StudySourceAnalysis";
import BookReadingProgress from "./BookReadingProgress";
import BookReadingStats from "./BookReadingStats";
import BookQuestionsReport from "./BookQuestionsReport";

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { id: "overview", name: "Genel Bakış", icon: "ri-dashboard-line" },
    { id: "daily-study", name: "Günlük Çalışma", icon: "ri-book-line" },
    { id: "exam-analysis", name: "Sınav Analizi", icon: "ri-file-text-line" },
    {
      id: "subject-performance",
      name: "Ders Performansı",
      icon: "ri-pie-chart-line",
    },
    { id: "book-reading", name: "Kitap Okuma", icon: "ri-book-open-line" },
    {
      id: "book-questions",
      name: "Kitap Soruları",
      icon: "ri-question-answer-line",
    },
    {
      id: "progress-tracking",
      name: "İlerleme Takibi",
      icon: "ri-line-chart-line",
    },
    { id: "insights", name: "Akıllı Öneriler", icon: "ri-lightbulb-line" },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Gelişmiş Performans Raporları
        </h1>
        <p className="text-gray-600">
          Günlük çalışma, sınav ve kitap okuma verilerinizin detaylı analizi
        </p>
      </div>

      <div className="flex space-x-1 mb-8 bg-gray-100 rounded-xl p-1 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
              activeTab === tab.id
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <i className={`${tab.icon} w-4 h-4 mr-2`}></i>
            {tab.name}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RadarChart />
            <WeeklyNetChart />
            <StudyProgressChart />
            <ExamTrendChart />
          </div>
        )}

        {activeTab === "daily-study" && (
          <div className="space-y-6">
            <DailyStudyHeatmap />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <StudySourceAnalysis />
              <TopicHeatmap />
            </div>
          </div>
        )}

        {activeTab === "exam-analysis" && (
          <div className="space-y-6">
            <ExamTrendChart />
            <SubjectComparisonChart />
          </div>
        )}

        {activeTab === "subject-performance" && (
          <div className="space-y-6">
            <SubjectComparisonChart />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RadarChart />
              <TopicHeatmap />
            </div>
          </div>
        )}

        {activeTab === "book-reading" && (
          <div className="space-y-6">
            <BookReadingProgress />
            <BookReadingStats />
          </div>
        )}

        {activeTab === "book-questions" && (
          <div className="space-y-6">
            <BookQuestionsReport />
          </div>
        )}

        {activeTab === "progress-tracking" && (
          <div className="space-y-6">
            <StudyProgressChart />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <WeeklyNetChart />
              <ExamTrendChart />
            </div>
          </div>
        )}

        {activeTab === "insights" && (
          <div className="space-y-6">
            <PerformanceInsights />
          </div>
        )}
      </div>
    </div>
  );
}
