"use client";

import { useState } from "react";
import { STREAK_MESSAGES, ACHIEVEMENT_MESSAGES } from "../../lib/constants";

const defaultStreakMessages = [
  ...STREAK_MESSAGES.daily.map((streak) => ({
    id: `streak_${streak.days}`,
    streak_days: streak.days,
    title: `${streak.days} Gün Seri! ${streak.emoji}`,
    message: streak.message,
    message_type: "achievement",
    is_active: true,
  })),
  {
    id: "broken_1",
    streak_days: 0,
    title: STREAK_MESSAGES.broken[0].message.split("!")[0] + "! 💔",
    message: STREAK_MESSAGES.broken[0].encouragement,
    message_type: "motivation",
    is_active: true,
  },
  {
    id: "restart_1",
    streak_days: 1,
    title: "Yeniden Başla! 💪",
    message: STREAK_MESSAGES.motivation[2].message,
    message_type: "encouragement",
    is_active: true,
  },
];

const reminderMessages = [
  {
    id: "r1",
    title: "Seri Korunma Hatırlatması",
    message: STREAK_MESSAGES.motivation[0].message,
    message_type: "reminder",
    trigger_time: "20:00",
    is_active: true,
  },
  {
    id: "r2",
    title: "Son Şans Uyarısı",
    message:
      "Gece yarısına 2 saat var! Serini kaybetme, hemen küçük bir çalışma başlat!",
    message_type: "urgent",
    trigger_time: "22:00",
    is_active: true,
  },
];

export default function StreakMessages() {
  const [streakMessages, setStreakMessages] = useState(defaultStreakMessages);
  const [reminders, setReminders] = useState(reminderMessages);
  const [activeTab, setActiveTab] = useState("streaks");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMessage, setNewMessage] = useState({
    streak_days: 7,
    title: "",
    message: "",
    message_type: "achievement",
  });

  const handleAddMessage = () => {
    if (newMessage.title.trim() && newMessage.message.trim()) {
      const message = {
        id: Date.now().toString(),
        ...newMessage,
        is_active: true,
      };
      setStreakMessages([...streakMessages, message]);
      setNewMessage({
        streak_days: 7,
        title: "",
        message: "",
        message_type: "achievement",
      });
      setShowAddForm(false);
    }
  };

  const toggleMessage = (messageId: string, isReminder = false) => {
    if (isReminder) {
      setReminders(
        reminders.map((msg) =>
          msg.id === messageId ? { ...msg, is_active: !msg.is_active } : msg,
        ),
      );
    } else {
      setStreakMessages(
        streakMessages.map((msg) =>
          msg.id === messageId ? { ...msg, is_active: !msg.is_active } : msg,
        ),
      );
    }
  };

  const getMessageTypeColor = (type: string) => {
    switch (type) {
      case "achievement":
        return "bg-green-100 text-green-700 border-green-200";
      case "motivation":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "encouragement":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "reminder":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "urgent":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getMessageTypeIcon = (type: string) => {
    switch (type) {
      case "achievement":
        return "ri-trophy-line";
      case "motivation":
        return "ri-heart-line";
      case "encouragement":
        return "ri-thumb-up-line";
      case "reminder":
        return "ri-alarm-line";
      case "urgent":
        return "ri-alert-line";
      default:
        return "ri-message-line";
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Seri Mesajları
            </h3>
            <p className="text-sm text-gray-600">
              Çalışma serilerinde gösterilecek motivasyon mesajları
            </p>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors cursor-pointer whitespace-nowrap"
          >
            <i className="ri-add-line w-4 h-4 mr-2"></i>
            Mesaj Ekle
          </button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6 bg-gray-100 rounded-xl p-1">
          <button
            onClick={() => setActiveTab("streaks")}
            className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
              activeTab === "streaks"
                ? "bg-white text-orange-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <i className="ri-fire-line w-4 h-4 mr-2"></i>
            Seri Mesajları
          </button>
          <button
            onClick={() => setActiveTab("reminders")}
            className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
              activeTab === "reminders"
                ? "bg-white text-orange-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <i className="ri-alarm-line w-4 h-4 mr-2"></i>
            Hatırlatmalar
          </button>
        </div>

        {/* Add Form */}
        {showAddForm && activeTab === "streaks" && (
          <div className="bg-gray-50 rounded-xl p-4 mb-4">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Seri Gün Sayısı
                  </label>
                  <input
                    type="number"
                    value={newMessage.streak_days}
                    onChange={(e) =>
                      setNewMessage({
                        ...newMessage,
                        streak_days: parseInt(e.target.value) || 0,
                      })
                    }
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mesaj Türü
                  </label>
                  <select
                    value={newMessage.message_type}
                    onChange={(e) =>
                      setNewMessage({
                        ...newMessage,
                        message_type: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 pr-8"
                  >
                    <option value="achievement">Başarı</option>
                    <option value="motivation">Motivasyon</option>
                    <option value="encouragement">Teşvik</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Başlık
                </label>
                <input
                  type="text"
                  value={newMessage.title}
                  onChange={(e) =>
                    setNewMessage({ ...newMessage, title: e.target.value })
                  }
                  placeholder="Mesaj başlığı..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mesaj
                </label>
                <textarea
                  value={newMessage.message}
                  onChange={(e) =>
                    setNewMessage({ ...newMessage, message: e.target.value })
                  }
                  placeholder="Motivasyon mesajını yaz..."
                  rows={3}
                  maxLength={500}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
                />
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleAddMessage}
                  className="flex-1 bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 transition-colors cursor-pointer whitespace-nowrap"
                >
                  Ekle
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors cursor-pointer whitespace-nowrap"
                >
                  İptal
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        {activeTab === "streaks" && (
          <div className="space-y-4">
            {streakMessages.map((message) => (
              <div
                key={message.id}
                className={`p-4 rounded-xl border ${message.is_active ? "bg-white shadow-sm" : "bg-gray-50 opacity-60"}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center border ${getMessageTypeColor(message.message_type)}`}
                    >
                      <i
                        className={`${getMessageTypeIcon(message.message_type)} text-sm`}
                      ></i>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-semibold text-gray-900">
                          {message.title}
                        </h4>
                        {message.streak_days > 0 && (
                          <span className="bg-orange-100 text-orange-700 px-2 py-0.5 text-xs font-medium rounded-full">
                            {message.streak_days} gün
                          </span>
                        )}
                        {message.streak_days === 0 && (
                          <span className="bg-red-100 text-red-700 px-2 py-0.5 text-xs font-medium rounded-full">
                            Seri kırıldı
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleMessage(message.id)}
                    className={`text-sm px-3 py-1 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                      message.is_active
                        ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        : "bg-green-100 text-green-600 hover:bg-green-200"
                    }`}
                  >
                    {message.is_active ? "Pasif" : "Aktif"}
                  </button>
                </div>
                <p className="text-gray-700">{message.message}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === "reminders" && (
          <div className="space-y-4">
            {reminders.map((reminder) => (
              <div
                key={reminder.id}
                className={`p-4 rounded-xl border ${reminder.is_active ? "bg-white shadow-sm" : "bg-gray-50 opacity-60"}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center border ${getMessageTypeColor(reminder.message_type)}`}
                    >
                      <i
                        className={`${getMessageTypeIcon(reminder.message_type)} text-sm`}
                      ></i>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {reminder.title}
                      </h4>
                      <span className="text-xs text-gray-500">
                        Saat: {reminder.trigger_time}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleMessage(reminder.id, true)}
                    className={`text-sm px-3 py-1 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                      reminder.is_active
                        ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        : "bg-green-100 text-green-600 hover:bg-green-200"
                    }`}
                  >
                    {reminder.is_active ? "Pasif" : "Aktif"}
                  </button>
                </div>
                <p className="text-gray-700">{reminder.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
