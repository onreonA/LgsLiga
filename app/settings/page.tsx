"use client";

import { useState } from "react";
import GoalsSection from "./GoalsSection";
import FamilyMessages from "./FamilyMessages";
import WeeklyLetter from "./WeeklyLetter";
import StreakMessages from "./StreakMessages";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("goals");

  const tabs = [
    { id: "goals", name: "Hedeflerim", icon: "ri-target-line" },
    { id: "family", name: "Aile Mesajları", icon: "ri-heart-line" },
    { id: "letters", name: "Kendime Mektuplar", icon: "ri-mail-line" },
    { id: "streaks", name: "Seri Mesajları", icon: "ri-fire-line" },
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Motivasyon Ayarları
        </h1>
        <p className="text-gray-600">
          Hedeflerini belirle, aile mesajlarını yönet ve kendine mektuplar yaz
        </p>
      </div>

      <div className="flex space-x-1 mb-8 bg-gray-100 rounded-xl p-1">
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
        {activeTab === "goals" && <GoalsSection />}
        {activeTab === "family" && <FamilyMessages />}
        {activeTab === "letters" && <WeeklyLetter />}
        {activeTab === "streaks" && <StreakMessages />}
      </div>
    </div>
  );
}
