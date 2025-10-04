'use client';

import { useState } from 'react';

interface TopbarProps {
  title: string;
  showStats?: boolean;
}

export default function Topbar({ title, showStats = true }: TopbarProps) {
  const [notifications, setNotifications] = useState(3);

  return (
    <div className="bg-white border-b border-gray-200 px-8 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        {/* Left Side - Title */}
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {showStats && (
            <div className="flex items-center space-x-6 ml-8">
              {/* Daily Streak */}
              <div className="flex items-center space-x-2 px-3 py-1 bg-orange-50 rounded-full">
                <span className="text-orange-500">🔥</span>
                <span className="text-sm font-medium text-orange-700">12 Gün</span>
              </div>
              
              {/* Weekly Goal */}
              <div className="flex items-center space-x-2 px-3 py-1 bg-blue-50 rounded-full">
                <span className="text-blue-500">🎯</span>
                <span className="text-sm font-medium text-blue-700">5/7 Hedef</span>
              </div>
              
              {/* Study Time */}
              <div className="flex items-center space-x-2 px-3 py-1 bg-purple-50 rounded-full">
                <span className="text-purple-500">⏱️</span>
                <span className="text-sm font-medium text-purple-700">2sa 15dk</span>
              </div>
            </div>
          )}
        </div>

        {/* Right Side - Actions */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
            <input
              type="text"
              placeholder="Konu ara..."
              className="pl-10 pr-4 py-2 w-64 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>

          {/* Notifications */}
          <div className="relative cursor-pointer">
            <div className="w-10 h-10 bg-gray-50 hover:bg-gray-100 rounded-xl flex items-center justify-center transition-colors">
              <span className="text-gray-600">🔔</span>
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </div>
          </div>

          {/* Profile */}
          <div className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 px-3 py-2 rounded-xl transition-colors">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white font-medium text-sm">ZÜ</span>
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-gray-900">Zeynep ÜNSAL</p>
              <p className="text-xs text-gray-500">8. Sınıf Hazırlık</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}