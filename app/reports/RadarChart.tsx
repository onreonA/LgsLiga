
'use client';

import { Radar, RadarChart as RechartsRadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

const mockData = [
  { subject: 'Matematik', current: 85, target: 95 },
  { subject: 'Türkçe', current: 78, target: 90 },
  { subject: 'Fen Bilimleri', current: 82, target: 88 },
  { subject: 'T.C. İnkılap', current: 70, target: 85 },
  { subject: 'Din Kültürü', current: 88, target: 92 },
  { subject: 'İngilizce', current: 75, target: 85 }
];

export default function RadarChart() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Branş Yetkinlik Haritası</h3>
          <p className="text-sm text-gray-600">Mevcut performans vs hedef skorlar</p>
        </div>
        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
          <i className="ri-radar-line text-blue-600 text-xl"></i>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsRadarChart data={mockData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
            <PolarGrid />
            <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12 }} />
            <PolarRadiusAxis 
              angle={90} 
              domain={[0, 100]} 
              tick={{ fontSize: 10 }} 
            />
            <Radar
              name="Hedef"
              dataKey="target"
              stroke="#e5e7eb"
              fill="#e5e7eb"
              fillOpacity={0.3}
              strokeDasharray="5 5"
            />
            <Radar
              name="Mevcut"
              dataKey="current"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.2}
              strokeWidth={2}
            />
          </RechartsRadarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center space-x-6 mt-4">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span className="text-sm text-gray-600">Mevcut Performans</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-1 bg-gray-300 rounded"></div>
          <span className="text-sm text-gray-600">Hedef Skor</span>
        </div>
      </div>
    </div>
  );
}
