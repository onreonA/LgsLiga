"use client";

import { useState, useEffect } from "react";
import { MOTIVATION_MESSAGES } from "../lib/constants";

export default function MotivationBox() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % MOTIVATION_MESSAGES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const currentMessage = MOTIVATION_MESSAGES[currentIndex];

  return (
    <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 text-white">
      <div className="flex items-center justify-between mb-4">
        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
          <i className="ri-heart-line text-xl"></i>
        </div>
        <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
          Motivasyon
        </span>
      </div>
      <p className="text-sm opacity-90 mb-3 leading-relaxed transition-all duration-500">
        {currentMessage.message}
      </p>
      <div className="flex items-center justify-between">
        <span className="text-xs opacity-75">— VolleLearn</span>
        <div className="flex space-x-1">
          {MOTIVATION_MESSAGES.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex ? "bg-white" : "bg-white/30"
              }`}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}
