'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Student {
  id: string;
  name: string;
  email: string;
  level: number;
  totalXP: number;
  questsCompleted: number;
  lastActive: string;
  weeklyQuestions: number;
}

interface PurchaseRequest {
  id: string;
  studentName: string;
  reward: string;
  coinCost: number;
  status: 'pending' | 'approved' | 'rejected';
  requestDate: string;
}

interface DailyVideo {
  id: string;
  date: string;
  title: string;
  videoId: string;
  description: string;
  isActive: boolean;
}

const mockStudents: Student[] = [
  {
    id: '1',
    name: 'Ahmet Yılmaz',
    email: 'ahmet@demo.com',
    level: 15,
    totalXP: 3750,
    questsCompleted: 24,
    lastActive: '2 saat önce',
    weeklyQuestions: 87
  },
  {
    id: '2',
    name: 'Zeynep Kaya',
    email: 'zeynep@demo.com',
    level: 18,
    totalXP: 4200,
    questsCompleted: 31,
    lastActive: '5 dakika önce',
    weeklyQuestions: 102
  },
  {
    id: '3',
    name: 'Mehmet Demir',
    email: 'mehmet@demo.com',
    level: 12,
    totalXP: 2890,
    questsCompleted: 18,
    lastActive: '1 gün önce',
    weeklyQuestions: 65
  },
  {
    id: '4',
    name: 'Elif Öztürk',
    email: 'elif@demo.com',
    level: 20,
    totalXP: 5100,
    questsCompleted: 35,
    lastActive: '30 dakika önce',
    weeklyQuestions: 125
  }
];

const mockPurchaseRequests: PurchaseRequest[] = [
  {
    id: '1',
    studentName: 'Ahmet Yılmaz',
    reward: 'PlayStation 5 Oyun Kodu',
    coinCost: 500,
    status: 'pending',
    requestDate: '2024-01-15'
  },
  {
    id: '2',
    studentName: 'Zeynep Kaya',
    reward: 'Netflix Hediye Kartı',
    coinCost: 150,
    status: 'pending',
    requestDate: '2024-01-14'
  },
  {
    id: '3',
    studentName: 'Elif Öztürk',
    reward: 'Bluetooth Kulaklık',
    coinCost: 300,
    status: 'approved',
    requestDate: '2024-01-13'
  }
];

const mockDailyVideos: DailyVideo[] = [
  {
    id: '1',
    date: '2024-01-15',
    title: 'LGS Matematik Motivasyonu',
    videoId: 'dQw4w9WgXcQ',
    description: 'Matematik sorularına yaklaşımın nasıl olmalı?',
    isActive: true
  },
  {
    id: '2',
    date: '2024-01-16',
    title: 'Başarı Hikayesi - Eski LGS Birincisi',
    videoId: 'dQw4w9WgXcQ',
    description: 'Geçen sene LGS birincisi olan öğrencinin deneyimleri',
    isActive: true
  },
  {
    id: '3',
    date: '2024-01-17',
    title: 'Etkili Çalışma Teknikleri',
    videoId: 'dQw4w9WgXcQ',
    description: 'Daha verimli nasıl çalışabilirsin?',
    isActive: true
  }
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'students' | 'purchases' | 'questions' | 'videos'>('dashboard');
  const [purchaseRequests, setPurchaseRequests] = useState<PurchaseRequest[]>(mockPurchaseRequests);
  const [dailyVideos, setDailyVideos] = useState<DailyVideo[]>(mockDailyVideos);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [editingVideo, setEditingVideo] = useState<DailyVideo | null>(null);
  const [videoForm, setVideoForm] = useState({
    date: '',
    title: '',
    videoId: '',
    description: ''
  });
  const router = useRouter();

  const handlePurchaseAction = (requestId: string, action: 'approved' | 'rejected') => {
    setPurchaseRequests(prev => 
      prev.map(request => 
        request.id === requestId 
          ? { ...request, status: action }
          : request
      )
    );
  };

  const handleSignOut = () => {
    router.push('/');
  };

  const extractVideoId = (url: string) => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : url;
  };

  const handleVideoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const videoId = extractVideoId(videoForm.videoId);
    
    if (editingVideo) {
      setDailyVideos(prev => 
        prev.map(video => 
          video.id === editingVideo.id 
            ? { ...video, ...videoForm, videoId }
            : video
        )
      );
    } else {
      const newVideo: DailyVideo = {
        id: Date.now().toString(),
        ...videoForm,
        videoId,
        isActive: true
      };
      setDailyVideos(prev => [...prev, newVideo]);
    }
    
    setShowVideoModal(false);
    setEditingVideo(null);
    setVideoForm({ date: '', title: '', videoId: '', description: '' });
  };

  const handleEditVideo = (video: DailyVideo) => {
    setEditingVideo(video);
    setVideoForm({
      date: video.date,
      title: video.title,
      videoId: video.videoId,
      description: video.description
    });
    setShowVideoModal(true);
  };

  const handleDeleteVideo = (videoId: string) => {
    setDailyVideos(prev => prev.filter(video => video.id !== videoId));
  };

  const totalStudents = mockStudents.length;
  const activeStudents = mockStudents.filter(s => s.lastActive.includes('saat') || s.lastActive.includes('dakika')).length;
  const pendingRequests = purchaseRequests.filter(r => r.status === 'pending').length;
  const totalQuestions = mockStudents.reduce((sum, student) => sum + student.weeklyQuestions, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
              <i className="ri-settings-line text-white text-xl w-6 h-6 flex items-center justify-center"></i>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Paneli</h1>
              <p className="text-gray-600">LGS Liga Yönetim Merkezi</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors cursor-pointer whitespace-nowrap"
          >
            <i className="ri-logout-box-line mr-2 w-5 h-5 flex items-center justify-center"></i>
            Çıkış Yap
          </button>
        </div>
      </div>

      <div className="flex">
        <div className="w-64 bg-white border-r border-gray-200 min-h-screen">
          <nav className="p-4 space-y-2">
            {[
              { id: 'dashboard', name: 'Genel Bakış', icon: 'ri-dashboard-line' },
              { id: 'students', name: 'Öğrenci Listesi', icon: 'ri-user-line' },
              { id: 'purchases', name: 'Satın Alma İstekleri', icon: 'ri-shopping-cart-line' },
              { id: 'questions', name: 'Soru Havuzu', icon: 'ri-question-line' },
              { id: 'videos', name: 'Günlük Videolar', icon: 'ri-play-circle-line' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center px-4 py-3 text-left rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === item.id
                    ? 'bg-purple-50 text-purple-600 border border-purple-200'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <i className={`${item.icon} mr-3 w-5 h-5 flex items-center justify-center`}></i>
                {item.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex-1 p-8">
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              <h2 className="text-2xl font-bold text-gray-900">Genel Bakış</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <i className="ri-user-line text-2xl text-blue-500 w-8 h-8 flex items-center justify-center"></i>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">{totalStudents}</div>
                  <div className="text-sm text-gray-600">Toplam Öğrenci</div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <i className="ri-pulse-line text-2xl text-green-500 w-8 h-8 flex items-center justify-center"></i>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">{activeStudents}</div>
                  <div className="text-sm text-gray-600">Aktif Öğrenci</div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <i className="ri-shopping-bag-line text-2xl text-orange-500 w-8 h-8 flex items-center justify-center"></i>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">{pendingRequests}</div>
                  <div className="text-sm text-gray-600">Bekleyen İstek</div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <i className="ri-question-line text-2xl text-purple-500 w-8 h-8 flex items-center justify-center"></i>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">{totalQuestions}</div>
                  <div className="text-sm text-gray-600">Bu Hafta Çözülen</div>
                </div>
              </div>

              {/* ... existing dashboard content ... */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-6">En Aktif Öğrenciler</h3>
                  <div className="space-y-4">
                    {mockStudents
                      .sort((a, b) => b.weeklyQuestions - a.weeklyQuestions)
                      .slice(0, 5)
                      .map((student, index) => (
                      <div key={student.id} className="flex items-center space-x-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                          index === 0 ? 'bg-yellow-500' :
                          index === 1 ? 'bg-gray-400' :
                          index === 2 ? 'bg-orange-500' : 'bg-blue-500'
                        }`}>
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{student.name}</p>
                          <p className="text-sm text-gray-600">Level {student.level} • {student.weeklyQuestions} soru</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">{student.totalXP} XP</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-6">Son Satın Alma İstekleri</h3>
                  <div className="space-y-4">
                    {purchaseRequests.slice(0, 5).map((request) => (
                      <div key={request.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{request.studentName}</p>
                          <p className="text-sm text-gray-600">{request.reward}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">{request.coinCost} coin</p>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            request.status === 'approved' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {request.status === 'pending' ? 'Bekliyor' :
                             request.status === 'approved' ? 'Onaylandı' : 'Reddedildi'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'videos' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Günlük Motivasyon Videoları</h2>
                <button 
                  onClick={() => setShowVideoModal(true)}
                  className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors cursor-pointer whitespace-nowrap flex items-center"
                >
                  <i className="ri-add-line mr-2 w-5 h-5 flex items-center justify-center"></i>
                  Video Ekle
                </button>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Tarih</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Video</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Başlık</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Durum</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">İşlemler</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {dailyVideos.map((video) => (
                        <tr key={video.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {new Date(video.date).toLocaleDateString('tr-TR')}
                          </td>
                          <td className="px-6 py-4">
                            <div className="w-20 h-12 bg-gray-100 rounded overflow-hidden">
                              <img 
                                src={`https://img.youtube.com/vi/${video.videoId}/mqdefault.jpg`}
                                alt={video.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-medium text-gray-900">{video.title}</p>
                              <p className="text-sm text-gray-600">{video.description}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              video.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {video.isActive ? 'Aktif' : 'Pasif'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEditVideo(video)}
                                className="text-blue-600 hover:text-blue-800 cursor-pointer"
                              >
                                <i className="ri-edit-line w-5 h-5 flex items-center justify-center"></i>
                              </button>
                              <button
                                onClick={() => handleDeleteVideo(video.id)}
                                className="text-red-600 hover:text-red-800 cursor-pointer"
                              >
                                <i className="ri-delete-bin-line w-5 h-5 flex items-center justify-center"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ... existing tabs content ... */}
          {activeTab === 'students' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Öğrenci Listesi</h2>
              
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Öğrenci</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Level</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">XP</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Görevler</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Bu Hafta</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Son Aktivite</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {mockStudents.map((student) => (
                        <tr key={student.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-medium text-gray-900">{student.name}</p>
                              <p className="text-sm text-gray-600">{student.email}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              Level {student.level}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">{student.totalXP}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">{student.questsCompleted}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">{student.weeklyQuestions} soru</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{student.lastActive}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'purchases' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Satın Alma İstekleri</h2>
              
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6">
                  <div className="space-y-4">
                    {purchaseRequests.map((request) => (
                      <div key={request.id} className="flex items-center justify-between p-6 border border-gray-200 rounded-xl">
                        <div className="flex-1">
                          <div className="flex items-center space-x-4 mb-3">
                            <h3 className="font-semibold text-gray-900">{request.studentName}</h3>
                            <span className={`px-3 py-1 rounded-full text-sm ${
                              request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              request.status === 'approved' ? 'bg-green-100 text-green-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {request.status === 'pending' ? 'Bekliyor' :
                               request.status === 'approved' ? 'Onaylandı' : 'Reddedildi'}
                            </span>
                          </div>
                          <p className="text-gray-700 mb-2">{request.reward}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span>{request.coinCost} coin</span>
                            <span>•</span>
                            <span>{request.requestDate}</span>
                          </div>
                        </div>
                        
                        {request.status === 'pending' && (
                          <div className="flex space-x-3">
                            <button
                              onClick={() => handlePurchaseAction(request.id, 'approved')}
                              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors cursor-pointer whitespace-nowrap"
                            >
                              Onayla
                            </button>
                            <button
                              onClick={() => handlePurchaseAction(request.id, 'rejected')}
                              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors cursor-pointer whitespace-nowrap"
                            >
                              Reddet
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'questions' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Soru Havuzu Yönetimi</h2>
                <button className="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition-colors cursor-pointer whitespace-nowrap">
                  Yeni Soru Ekle
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { subject: 'Matematik', total: 1250, recent: 45, color: 'blue' },
                  { subject: 'Fen Bilimleri', total: 980, recent: 32, color: 'green' },
                  { subject: 'Türkçe', total: 875, recent: 28, color: 'purple' },
                  { subject: 'Sosyal Bilgiler', total: 650, recent: 18, color: 'orange' }
                ].map((subject) => (
                  <div key={subject.subject} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <i className={`ri-book-line text-2xl text-${subject.color}-500 w-8 h-8 flex items-center justify-center`}></i>
                      <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                        +{subject.recent} bu ay
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{subject.subject}</h3>
                    <div className="text-2xl font-bold text-gray-900 mb-1">{subject.total}</div>
                    <div className="text-sm text-gray-600">Toplam soru</div>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Son Eklenen Sorular</h3>
                <div className="space-y-4">
                  {[
                    { subject: 'Matematik', question: 'İki basamaklı bir sayının rakamları toplamı 12, rakamları farkı 4 ise...', date: '15 Ocak 2024' },
                    { subject: 'Fen', question: 'Canlıların çevresel koşullara uyum sağlama özelliğine ne denir?', date: '14 Ocak 2024' },
                    { subject: 'Türkçe', question: 'Aşağıdaki cümlelerin hangisinde mecaz anlam kullanılmıştır?', date: '13 Ocak 2024' },
                    { subject: 'Sosyal', question: 'Osmanlı İmparatorluğu\'nun kuruluş dönemi hangi yüzyılda...', date: '12 Ocak 2024' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {item.subject}
                      </span>
                      <div className="flex-1">
                        <p className="text-gray-900 text-sm">{item.question}</p>
                        <p className="text-xs text-gray-600 mt-1">{item.date}</p>
                      </div>
                      <button className="text-gray-400 hover:text-gray-600 cursor-pointer">
                        <i className="ri-edit-line w-5 h-5 flex items-center justify-center"></i>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Video Modal */}
      {showVideoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">
                {editingVideo ? 'Video Düzenle' : 'Yeni Video Ekle'}
              </h3>
              <button
                onClick={() => {
                  setShowVideoModal(false);
                  setEditingVideo(null);
                  setVideoForm({ date: '', title: '', videoId: '', description: '' });
                }}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <i className="ri-close-line w-6 h-6 flex items-center justify-center"></i>
              </button>
            </div>

            <form onSubmit={handleVideoSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tarih
                </label>
                <input
                  type="date"
                  value={videoForm.date}
                  onChange={(e) => setVideoForm(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Video Başlığı
                </label>
                <input
                  type="text"
                  value={videoForm.title}
                  onChange={(e) => setVideoForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Motivasyon video başlığı"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  YouTube URL veya Video ID
                </label>
                <input
                  type="text"
                  value={videoForm.videoId}
                  onChange={(e) => setVideoForm(prev => ({ ...prev, videoId: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="https://youtube.com/watch?v=... veya video ID"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Açıklama
                </label>
                <textarea
                  value={videoForm.description}
                  onChange={(e) => setVideoForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  rows={3}
                  placeholder="Video hakkında kısa açıklama"
                  required
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors cursor-pointer whitespace-nowrap"
                >
                  {editingVideo ? 'Güncelle' : 'Ekle'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowVideoModal(false);
                    setEditingVideo(null);
                    setVideoForm({ date: '', title: '', videoId: '', description: '' });
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors cursor-pointer whitespace-nowrap"
                >
                  İptal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
