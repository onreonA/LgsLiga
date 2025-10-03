
'use client';

import { useState } from 'react';

interface Exam {
  id: string;
  title: string;
  type: 'practice' | 'mock' | 'real';
  duration: number;
  questionCount: number;
  subjects: string[];
  status: 'upcoming' | 'available' | 'completed';
  score?: number;
  date: string;
}

const mockExams: Exam[] = [
  {
    id: '1',
    title: 'Matematik Deneme Sınavı',
    type: 'practice',
    duration: 40,
    questionCount: 20,
    subjects: ['Matematik'],
    status: 'available',
    date: '2024-12-15'
  },
  {
    id: '2',
    title: 'Genel Deneme Sınavı #1',
    type: 'mock',
    duration: 120,
    questionCount: 90,
    subjects: ['Matematik', 'Türkçe', 'Fen', 'Sosyal', 'İnkılap', 'Din'],
    status: 'available',
    date: '2024-12-18'
  },
  {
    id: '3',
    title: 'Türkçe Konu Sınavı',
    type: 'practice',
    duration: 30,
    questionCount: 15,
    subjects: ['Türkçe'],
    status: 'completed',
    score: 85,
    date: '2024-12-10'
  },
  {
    id: '4',
    title: 'LGS Genel Deneme',
    type: 'real',
    duration: 120,
    questionCount: 90,
    subjects: ['Matematik', 'Türkçe', 'Fen', 'Sosyal', 'İnkılap', 'Din'],
    status: 'upcoming',
    date: '2024-12-25'
  }
];

export default function ExamsPage() {
  const [selectedType, setSelectedType] = useState<'all' | 'practice' | 'mock' | 'real'>('all');

  const examTypes = [
    { id: 'all', name: 'Tümü', icon: '📝' },
    { id: 'practice', name: 'Konu Sınavı', icon: '📖' },
    { id: 'mock', name: 'Deneme', icon: '🎯' },
    { id: 'real', name: 'Gerçek Sınav', icon: '🏆' }
  ];

  const filteredExams = selectedType === 'all' 
    ? mockExams 
    : mockExams.filter(exam => exam.type === selectedType);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-700';
      case 'upcoming': return 'bg-blue-100 text-blue-700';
      case 'completed': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'practice': return 'bg-blue-500';
      case 'mock': return 'bg-purple-500';
      case 'real': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const startExam = (examId: string) => {
    alert(`${examId} numaralı sınav başlatılıyor...`);
  };

  return (
    <div className="space-y-6">
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {examTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => setSelectedType(type.id as any)}
            className={`flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
              selectedType === type.id
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <span className="mr-2">{type.icon}</span>
            {type.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExams.map((exam) => (
          <div key={exam.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <div className={`w-3 h-3 rounded-full ${getTypeColor(exam.type)}`}></div>
                  <span className="text-xs text-gray-500 uppercase font-medium">
                    {exam.type === 'practice' ? 'Konu Sınavı' :
                     exam.type === 'mock' ? 'Deneme' : 'Gerçek Sınav'}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{exam.title}</h3>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(exam.status)}`}>
                {exam.status === 'available' ? 'Müsait' :
                 exam.status === 'upcoming' ? 'Yaklaşan' : 'Tamamlandı'}
              </span>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Süre:</span>
                <span className="font-medium">{exam.duration} dakika</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Soru Sayısı:</span>
                <span className="font-medium">{exam.questionCount} soru</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Tarih:</span>
                <span className="font-medium">{new Date(exam.date).toLocaleDateString('tr-TR')}</span>
              </div>
              {exam.score && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Puan:</span>
                  <span className="font-bold text-green-600">{exam.score}/100</span>
                </div>
              )}
            </div>

            <div className="mb-4">
              <div className="text-xs text-gray-600 mb-2">Dersler:</div>
              <div className="flex flex-wrap gap-1">
                {exam.subjects.map((subject, index) => (
                  <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs">
                    {subject}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              {exam.status === 'available' && (
                <button
                  onClick={() => startExam(exam.id)}
                  className="w-full bg-blue-500 text-white py-2.5 px-4 rounded-xl font-medium hover:bg-blue-600 transition-colors cursor-pointer"
                >
                  Sınava Başla
                </button>
              )}
              {exam.status === 'completed' && (
                <button className="w-full bg-gray-500 text-white py-2.5 px-4 rounded-xl font-medium hover:bg-gray-600 transition-colors cursor-pointer">
                  Sonuçları Görüntüle
                </button>
              )}
              {exam.status === 'upcoming' && (
                <button 
                  disabled
                  className="w-full bg-gray-200 text-gray-500 py-2.5 px-4 rounded-xl font-medium cursor-not-allowed"
                >
                  Henüz Başlamadı
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredExams.length === 0 && (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl text-gray-400">📝</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Bu kategoride sınav yok</h3>
          <p className="text-gray-600">Farklı bir kategori seçmeyi deneyin</p>
        </div>
      )}
    </div>
  );
}
