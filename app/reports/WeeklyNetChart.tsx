
'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockWeeklyData = [
  { week: 'Hafta 1', matematik: 15, turkce: 12, fen: 10, tarih: 8, din: 6, ingilizce: 5 },
  { week: 'Hafta 2', matematik: 18, turkce: 14, fen: 12, tarih: 10, din: 8, ingilizce: 7 },
  { week: 'Hafta 3', matematik: 22, turkce: 16, fen: 14, tarih: 12, din: 9, ingilizce: 8 },
  { week: 'Hafta 4', matematik: 25, turkce: 18, fen: 16, tarih: 14, din: 11, ingilizce: 10 },
  { week: 'Bu Hafta', matematik: 28, turkce: 20, fen: 18, tarih: 16, din: 13, ingilizce: 12 }
];

export default function WeeklyNetChart() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Haftalık Net Gelişimi</h3>
          <p className="text-sm text-gray-600">Son 5 haftalık doğru net sayıları</p>
        </div>
        <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
          <i className="ri-bar-chart-line text-green-600 text-xl"></i>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={mockWeeklyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis 
              dataKey="week" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6b7280' }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6b7280' }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Bar dataKey="matematik" fill="#ef4444" name="Matematik" radius={[2, 2, 0, 0]} />
            <Bar dataKey="turkce" fill="#f97316" name="Türkçe" radius={[2, 2, 0, 0]} />
            <Bar dataKey="fen" fill="#eab308" name="Fen Bilimleri" radius={[2, 2, 0, 0]} />
            <Bar dataKey="tarih" fill="#22c55e" name="T.C. İnkılap" radius={[2, 2, 0, 0]} />
            <Bar dataKey="din" fill="#3b82f6" name="Din Kültürü" radius={[2, 2, 0, 0]} />
            <Bar dataKey="ingilizce" fill="#8b5cf6" name="İngilizce" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        {[
          { name: 'Matematik', color: '#ef4444' },
          { name: 'Türkçe', color: '#f97316' },
          { name: 'Fen Bilimleri', color: '#eab308' },
          { name: 'T.C. İnkılap', color: '#22c55e' },
          { name: 'Din Kültürü', color: '#3b82f6' },
          { name: 'İngilizce', color: '#8b5cf6' }
        ].map((item) => (
          <div key={item.name} className="flex items-center space-x-2">
            <div 
              className="w-3 h-3 rounded-sm" 
              style={{ backgroundColor: item.color }}
            ></div>
            <span className="text-sm text-gray-600">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
