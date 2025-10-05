
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface Subject {
  id: string;
  name: string;
  code: string;
  color: string;
  icon: string;
}

interface Topic {
  id: string;
  subject_id: string;
  name: string;
  description: string | null;
  difficulty_level: number;
}

interface StudyEntry {
  date: string;
  subject: string;
  topic: string;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  emptyAnswers: number;
  source: string;
}

interface ExamEntry {
  examDate: string;
  examType: string;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  emptyAnswers: number;
  net: number;
  score: number;
}

interface BookEntry {
  date: string;
  bookName: string;
  totalPages: number;
  pagesReadToday: number;
  remainingPages: number;
}

const sources = ['Doping', 'Kaynak Kitap', 'Okul', 'Ödev', 'Özel Ders', 'Kurs'];
const examTypes = ['Okul', 'Kaynak', 'Kurs', 'Doping', 'Deneme'];

interface StudyHistoryItem {
  id: string;
  date: string;
  subject_name: string;
  topic_name: string | null;
  questions_solved: number;
  correct_answers: number;
  wrong_answers: number;
  empty_answers: number;
  xp_earned: number;
}

interface ExamHistoryItem {
  id: string;
  exam_date: string;
  exam_type: string;
  total_questions: number;
  correct_answers: number;
  wrong_answers: number;
  empty_answers: number;
  score: number;
  net: number;
}

interface BookHistoryItem {
  id: string;
  reading_date: string;
  book_name: string;
  total_pages: number;
  pages_read_today: number;
  remaining_pages: number;
  completion_percentage: number;
}

export default function StudyTrackerPage() {
  const [activeTab, setActiveTab] = useState<'daily' | 'exam' | 'book'>('daily');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [bookList, setBookList] = useState<string[]>([]);
  const [showNewBookInput, setShowNewBookInput] = useState(false);
  const [newBookName, setNewBookName] = useState('');
  
  // Dynamic data from Supabase
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [allTopics, setAllTopics] = useState<Topic[]>([]);
  const [filteredTopics, setFilteredTopics] = useState<Topic[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  
  // History data
  const [studyHistory, setStudyHistory] = useState<StudyHistoryItem[]>([]);
  const [examHistory, setExamHistory] = useState<ExamHistoryItem[]>([]);
  const [bookHistory, setBookHistory] = useState<BookHistoryItem[]>([]);

  // Daily Study Form State
  const [studyForm, setStudyForm] = useState<StudyEntry>({
    date: new Date().toISOString().split('T')[0],
    subject: '',
    topic: '',
    totalQuestions: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
    emptyAnswers: 0,
    source: ''
  });

  // Exam Form State
  const [examForm, setExamForm] = useState<ExamEntry>({
    examDate: new Date().toISOString().split('T')[0],
    examType: '',
    totalQuestions: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
    emptyAnswers: 0,
    net: 0,
    score: 0
  });

  // Book Form State
  const [bookForm, setBookForm] = useState<BookEntry>({
    date: new Date().toISOString().split('T')[0],
    bookName: '',
    totalPages: 0,
    pagesReadToday: 0,
    remainingPages: 0
  });

  // Load data on component mount
  useEffect(() => {
    loadSubjects();
    loadTopics();
    loadBookList();
    loadStudyHistory();
    loadExamHistory();
    loadBookHistory();
  }, []);

  // Filter topics when subject changes
  useEffect(() => {
    if (studyForm.subject) {
      const filtered = allTopics.filter(topic => topic.subject_id === studyForm.subject);
      setFilteredTopics(filtered);
    } else {
      setFilteredTopics([]);
    }
  }, [studyForm.subject, allTopics]);

  const loadSubjects = async () => {
    try {
      // Get current user's grade
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('grade')
        .eq('id', user.id)
        .single();

      const userGrade = profile?.grade || 8;

      // Fetch subjects for user's grade only
      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .eq('grade', userGrade)
        .order('name');

      if (error) throw error;
      setSubjects(data || []);
    } catch (error) {
      console.error('Error loading subjects:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const loadTopics = async () => {
    try {
      const { data, error } = await supabase
        .from('topics')
        .select('*')
        .order('name');

      if (error) throw error;
      setAllTopics(data || []);
    } catch (error) {
      console.error('Error loading topics:', error);
    }
  };

  const loadBookList = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('book_reading')
        .select('book_name')
        .eq('user_id', user.id);

      if (error) throw error;

      const uniqueBooks = [...new Set(data?.map(item => item.book_name) || [])];
      setBookList(uniqueBooks);
    } catch (error) {
      console.error('Error loading book list:', error);
    }
  };

  const loadStudyHistory = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('study_sessions')
        .select(`
          id,
          completed_at,
          questions_solved,
          correct_answers,
          xp_earned,
          subjects:subject_id (name),
          topics:topic_id (name)
        `)
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      const formattedData = data?.map((item: any) => ({
        id: item.id,
        date: item.completed_at,
        subject_name: item.subjects?.name || 'Bilinmiyor',
        topic_name: item.topics?.name || null,
        questions_solved: item.questions_solved,
        correct_answers: item.correct_answers,
        wrong_answers: item.questions_solved - item.correct_answers,
        empty_answers: 0,
        xp_earned: item.xp_earned
      })) || [];

      setStudyHistory(formattedData);
    } catch (error) {
      console.error('Error loading study history:', error);
    }
  };

  const loadExamHistory = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('exams')
        .select('*')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      const formattedData = data?.map((item: any) => ({
        id: item.id,
        exam_date: item.completed_at || item.started_at,
        exam_type: item.title || 'Sınav',
        total_questions: item.total_questions,
        correct_answers: item.correct_answers,
        wrong_answers: item.total_questions - item.correct_answers,
        empty_answers: 0,
        score: item.score,
        net: item.correct_answers - ((item.total_questions - item.correct_answers) * 0.25)
      })) || [];

      setExamHistory(formattedData);
    } catch (error) {
      console.error('Error loading exam history:', error);
    }
  };

  const loadBookHistory = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('book_reading')
        .select('*')
        .eq('user_id', user.id)
        .order('reading_date', { ascending: false })
        .limit(20);

      if (error) throw error;

      const formattedData = data?.map((item: any) => ({
        id: item.id,
        reading_date: item.reading_date,
        book_name: item.book_name,
        total_pages: item.total_pages,
        pages_read_today: item.pages_read_today,
        remaining_pages: item.remaining_pages,
        completion_percentage: item.total_pages > 0 
          ? Math.round((item.pages_read_today / item.total_pages) * 100) 
          : 0
      })) || [];

      setBookHistory(formattedData);
    } catch (error) {
      console.error('Error loading book history:', error);
    }
  };

  const handleAddNewBook = () => {
    if (newBookName.trim() && !bookList.includes(newBookName.trim())) {
      const updatedList = [...bookList, newBookName.trim()];
      setBookList(updatedList);
      setBookForm({ ...bookForm, bookName: newBookName.trim() });
      setNewBookName('');
      setShowNewBookInput(false);
    }
  };

  const handleStudySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🔵 Form submitted!', studyForm);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      console.log('👤 User:', user?.email);
      
      if (!user) {
        console.error('❌ No user found! Please login.');
        alert('Lütfen önce giriş yapın!');
        return;
      }

      // Calculate XP: 10 XP per correct answer
      const xpEarned = studyForm.correctAnswers * 10;

      console.log('💾 Saving to database...');
      const { error } = await supabase
        .from('study_sessions')
        .insert({
          user_id: user.id,
          subject_id: studyForm.subject,
          topic_id: studyForm.topic || null,
          questions_solved: studyForm.totalQuestions,
          correct_answers: studyForm.correctAnswers,
          xp_earned: xpEarned,
          session_type: 'practice',
          duration_minutes: Math.ceil(studyForm.totalQuestions * 1.5), // Estimate: 1.5 min per question
          completed_at: new Date(studyForm.date).toISOString()
        });

      if (error) {
        console.error('❌ Database error:', error);
        throw error;
      }
      
      console.log('✅ Study session saved successfully!');

      // Update user coins (1 coin per 10 XP)
      const coinsEarned = Math.floor(xpEarned / 10);
      console.log('🪙 Coins earned:', coinsEarned);
      
      if (coinsEarned > 0) {
        const { data: currentCoins } = await supabase
          .from('user_coins')
          .select('total_coins, earned_coins')
          .eq('user_id', user.id)
          .single();

        console.log('💰 Current coins:', currentCoins);

        if (currentCoins) {
          await supabase
            .from('user_coins')
            .update({
              total_coins: (currentCoins.total_coins || 0) + coinsEarned,
              earned_coins: (currentCoins.earned_coins || 0) + coinsEarned
            })
            .eq('user_id', user.id);
          console.log('✅ Coins updated!');
        }
      }

      console.log('🎉 All done! Showing success message...');
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);

      // Reload study history
      loadStudyHistory();

      // Reset form
      setStudyForm({
        date: new Date().toISOString().split('T')[0],
        subject: '',
        topic: '',
        totalQuestions: 0,
        correctAnswers: 0,
        wrongAnswers: 0,
        emptyAnswers: 0,
        source: ''
      });
    } catch (error) {
      console.error('❌ HATA! Error saving study data:', error);
      alert('Çalışma kaydedilirken bir hata oluştu: ' + (error as Error).message);
    }
  };

  const handleExamSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('📝 Exam form submitted!', examForm);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert('Lütfen önce giriş yapın!');
        return;
      }

      const { error } = await supabase
        .from('exams')
        .insert({
          user_id: user.id,
          title: `${examForm.examType} Sınavı`,
          exam_type: 'practice',
          total_questions: examForm.totalQuestions,
          correct_answers: examForm.correctAnswers,
          score: examForm.score,
          status: 'completed',
          started_at: examForm.examDate,
          completed_at: examForm.examDate
        });

      if (error) throw error;

      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);

      // Reload exam history
      loadExamHistory();

      // Reset form
      setExamForm({
        examDate: new Date().toISOString().split('T')[0],
        examType: '',
        totalQuestions: 0,
        correctAnswers: 0,
        wrongAnswers: 0,
        emptyAnswers: 0,
        net: 0,
        score: 0
      });
    } catch (error) {
      console.error('Error saving exam data:', error);
    }
  };

  const handleBookSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('📚 Book form submitted!', bookForm);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert('Lütfen önce giriş yapın!');
        return;
      }

      const { error } = await supabase
        .from('book_reading')
        .insert({
          user_id: user.id,
          book_name: bookForm.bookName,
          total_pages: bookForm.totalPages,
          pages_read_today: bookForm.pagesReadToday,
          remaining_pages: bookForm.remainingPages,
          reading_date: bookForm.date
        });

      if (error) throw error;

      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);

      // Reload book list to include new book
      await loadBookList();
      
      // Reload book history
      loadBookHistory();

      // Reset form
      setBookForm({
        date: new Date().toISOString().split('T')[0],
        bookName: '',
        totalPages: 0,
        pagesReadToday: 0,
        remainingPages: 0
      });
    } catch (error) {
      console.error('Error saving book data:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Çalışma Takibi</h1>
          <p className="text-gray-600">Günlük çalışma, sınav ve kitap okuma verilerinizi kaydedin</p>
        </div>
      </div>

      {showSuccessMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-xl animate-pulse">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <i className="ri-check-line w-5 h-5 mr-2"></i>
              <span className="font-medium">Veriler başarıyla kaydedildi!</span>
            </div>
            {activeTab === 'daily' && studyForm.correctAnswers > 0 && (
              <div className="flex items-center space-x-2 text-sm">
                <span>+{studyForm.correctAnswers * 10} XP</span>
                <span>•</span>
                <span>+{Math.floor((studyForm.correctAnswers * 10) / 10)} Coin</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 rounded-xl p-1">
        <button
          onClick={() => setActiveTab('daily')}
          className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'daily'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <i className="ri-book-line w-4 h-4 mr-2"></i>
          Günlük Çalışma
        </button>
        <button
          onClick={() => setActiveTab('exam')}
          className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'exam'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <i className="ri-file-text-line w-4 h-4 mr-2"></i>
          Sınav Sonuçları
        </button>
        <button
          onClick={() => setActiveTab('book')}
          className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'book'
              ? 'bg-white text-green-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <i className="ri-book-open-line w-4 h-4 mr-2"></i>
          Kitap Serüveni
        </button>
      </div>

      {/* Daily Study Form */}
      {activeTab === 'daily' && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mr-3">
              <i className="ri-book-line text-blue-600 text-xl"></i>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Günlük Çalışma Kaydı</h2>
              <p className="text-sm text-gray-600">Çözdüğünüz soruları kaydedin</p>
            </div>
          </div>

          <form onSubmit={handleStudySubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tarih
                </label>
                <input
                  type="date"
                  value={studyForm.date}
                  onChange={(e) => setStudyForm({ ...studyForm, date: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ders
                </label>
                <select
                  value={studyForm.subject}
                  onChange={(e) => setStudyForm({ ...studyForm, subject: e.target.value, topic: '' })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-8"
                  required
                  disabled={loadingData}
                >
                  <option value="">Ders Seçin</option>
                  {subjects.map((subject) => (
                    <option key={subject.id} value={subject.id}>{subject.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Konu {!studyForm.subject && <span className="text-xs text-gray-500">(Önce ders seçin)</span>}
                </label>
                <select
                  value={studyForm.topic}
                  onChange={(e) => setStudyForm({ ...studyForm, topic: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-8"
                  disabled={!studyForm.subject || filteredTopics.length === 0}
                >
                  <option value="">Konu Seçin (Opsiyonel)</option>
                  {filteredTopics.map((topic) => (
                    <option key={topic.id} value={topic.id}>{topic.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kaynak
                </label>
                <select
                  value={studyForm.source}
                  onChange={(e) => setStudyForm({ ...studyForm, source: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-8"
                  required
                >
                  <option value="">Kaynak Seçin</option>
                  {sources.map((source) => (
                    <option key={source} value={source}>{source}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Toplam Soru Sayısı
                </label>
                <input
                  type="number"
                  min="0"
                  value={studyForm.totalQuestions}
                  onChange={(e) => setStudyForm({ ...studyForm, totalQuestions: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Doğru Sayısı
                </label>
                <input
                  type="number"
                  min="0"
                  max={studyForm.totalQuestions}
                  value={studyForm.correctAnswers}
                  onChange={(e) => {
                    const correct = parseInt(e.target.value) || 0;
                    const total = studyForm.totalQuestions;
                    const empty = studyForm.emptyAnswers;
                    const wrong = Math.max(0, total - correct - empty);
                    setStudyForm({
                      ...studyForm,
                      correctAnswers: correct,
                      wrongAnswers: wrong
                    });
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Yanlış Sayısı
                </label>
                <input
                  type="number"
                  min="0"
                  max={studyForm.totalQuestions}
                  value={studyForm.wrongAnswers}
                  onChange={(e) => {
                    const wrong = parseInt(e.target.value) || 0;
                    const total = studyForm.totalQuestions;
                    const correct = studyForm.correctAnswers;
                    const empty = Math.max(0, total - correct - wrong);
                    setStudyForm({
                      ...studyForm,
                      wrongAnswers: wrong,
                      emptyAnswers: empty
                    });
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Boş Sayısı
                </label>
                <input
                  type="number"
                  min="0"
                  max={studyForm.totalQuestions}
                  value={studyForm.emptyAnswers}
                  onChange={(e) => {
                    const empty = parseInt(e.target.value) || 0;
                    const total = studyForm.totalQuestions;
                    const correct = studyForm.correctAnswers;
                    const wrong = Math.max(0, total - correct - empty);
                    setStudyForm({
                      ...studyForm,
                      emptyAnswers: empty,
                      wrongAnswers: wrong
                    });
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-600 transition-colors cursor-pointer whitespace-nowrap"
              >
                Çalışmayı Kaydet
              </button>
            </div>
          </form>

          {/* Study History Table */}
          <div className="mt-8 border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Son Çözülen Sorular (Son 20 Kayıt)</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Tarih</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Ders</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Konu</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Toplam Soru</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Doğru</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Yanlış</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Boş</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Kazanılan XP</th>
                  </tr>
                </thead>
                <tbody>
                  {studyHistory.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center py-8 text-gray-500">
                        Henüz çalışma kaydı yok. İlk kaydınızı ekleyin! 📚
                      </td>
                    </tr>
                  ) : (
                    studyHistory.map((item) => (
                      <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-4 text-sm text-gray-900">
                          {new Date(item.date).toLocaleDateString('tr-TR')}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-900 font-medium">{item.subject_name}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">{item.topic_name || '-'}</td>
                        <td className="py-3 px-4 text-sm text-gray-900 text-center">{item.questions_solved}</td>
                        <td className="py-3 px-4 text-sm text-green-600 text-center font-medium">{item.correct_answers}</td>
                        <td className="py-3 px-4 text-sm text-red-600 text-center font-medium">{item.wrong_answers}</td>
                        <td className="py-3 px-4 text-sm text-gray-500 text-center">{item.empty_answers}</td>
                        <td className="py-3 px-4 text-sm text-blue-600 text-center font-semibold">{item.xp_earned}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Exam Form */}
      {activeTab === 'exam' && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center mr-3">
              <i className="ri-file-text-line text-purple-600 text-xl"></i>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Sınav Sonucu Kaydı</h2>
              <p className="text-sm text-gray-600">Sınav sonuçlarınızı kaydedin</p>
            </div>
          </div>

          <form onSubmit={handleExamSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sınav Tarihi
                </label>
                <input
                  type="date"
                  value={examForm.examDate}
                  onChange={(e) => setExamForm({ ...examForm, examDate: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sınav Türü
                </label>
                <select
                  value={examForm.examType}
                  onChange={(e) => setExamForm({ ...examForm, examType: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent pr-8"
                  required
                >
                  <option value="">Sınav Türü Seçin</option>
                  {examTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Toplam Soru Sayısı
                </label>
                <input
                  type="number"
                  min="0"
                  value={examForm.totalQuestions}
                  onChange={(e) => setExamForm({ ...examForm, totalQuestions: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Doğru Sayısı
                </label>
                <input
                  type="number"
                  min="0"
                  value={examForm.correctAnswers}
                  onChange={(e) => {
                    const correct = parseInt(e.target.value) || 0;
                    const wrong = examForm.wrongAnswers;
                    const net = correct - (wrong * 0.25);
                    setExamForm({
                      ...examForm,
                      correctAnswers: correct,
                      net: Math.max(0, net)
                    });
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Yanlış Sayısı
                </label>
                <input
                  type="number"
                  min="0"
                  value={examForm.wrongAnswers}
                  onChange={(e) => {
                    const wrong = parseInt(e.target.value) || 0;
                    const correct = examForm.correctAnswers;
                    const net = correct - (wrong * 0.25);
                    setExamForm({
                      ...examForm,
                      wrongAnswers: wrong,
                      net: Math.max(0, net)
                    });
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Boş Sayısı
                </label>
                <input
                  type="number"
                  min="0"
                  value={examForm.emptyAnswers}
                  onChange={(e) => setExamForm({ ...examForm, emptyAnswers: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Net
                </label>
                <input
                  type="number"
                  step="0.25"
                  value={examForm.net}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50"
                  readOnly
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Puan
                </label>
                <input
                  type="number"
                  min="0"
                  max="500"
                  value={examForm.score}
                  onChange={(e) => setExamForm({ ...examForm, score: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-purple-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-purple-600 transition-colors cursor-pointer whitespace-nowrap"
              >
                Sınav Sonucunu Kaydet
              </button>
            </div>
          </form>

          {/* Exam History Table */}
          <div className="mt-8 border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Son Sınav Sonuçları (Son 20 Kayıt)</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Tarih</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Sınav Türü</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Toplam Soru</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Doğru</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Yanlış</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Boş</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Net</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Puan</th>
                  </tr>
                </thead>
                <tbody>
                  {examHistory.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center py-8 text-gray-500">
                        Henüz sınav kaydı yok. İlk kaydınızı ekleyin! 📝
                      </td>
                    </tr>
                  ) : (
                    examHistory.map((item) => (
                      <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-4 text-sm text-gray-900">
                          {new Date(item.exam_date).toLocaleDateString('tr-TR')}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-900 font-medium">{item.exam_type}</td>
                        <td className="py-3 px-4 text-sm text-gray-900 text-center">{item.total_questions}</td>
                        <td className="py-3 px-4 text-sm text-green-600 text-center font-medium">{item.correct_answers}</td>
                        <td className="py-3 px-4 text-sm text-red-600 text-center font-medium">{item.wrong_answers}</td>
                        <td className="py-3 px-4 text-sm text-gray-500 text-center">{item.empty_answers}</td>
                        <td className="py-3 px-4 text-sm text-blue-600 text-center font-semibold">{item.net.toFixed(2)}</td>
                        <td className="py-3 px-4 text-sm text-purple-600 text-center font-semibold">{item.score}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Book Reading Form */}
      {activeTab === 'book' && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mr-3">
              <i className="ri-book-open-line text-green-600 text-xl"></i>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Kitap Okuma Kaydı</h2>
              <p className="text-sm text-gray-600">Günlük kitap okuma ilerlemenizi kaydedin</p>
            </div>
          </div>

          <form onSubmit={handleBookSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tarih
                </label>
                <input
                  type="date"
                  value={bookForm.date}
                  onChange={(e) => setBookForm({ ...bookForm, date: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kitap Adı
                </label>
                <div className="space-y-2">
                  <select
                    value={bookForm.bookName}
                    onChange={(e) => {
                      if (e.target.value === 'new_book') {
                        setShowNewBookInput(true);
                        setBookForm({ ...bookForm, bookName: '' });
                      } else {
                        setBookForm({ ...bookForm, bookName: e.target.value });
                        setShowNewBookInput(false);
                      }
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent pr-8"
                    required={!showNewBookInput}
                  >
                    <option value="">Kitap Seçin</option>
                    {bookList.map((book) => (
                      <option key={book} value={book}>{book}</option>
                    ))}
                    <option value="new_book">+ Yeni Kitap Ekle</option>
                  </select>

                  {showNewBookInput && (
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={newBookName}
                        onChange={(e) => setNewBookName(e.target.value)}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Yeni kitap adını girin"
                        required
                      />
                      <button
                        type="button"
                        onClick={handleAddNewBook}
                        className="bg-green-500 text-white px-4 py-3 rounded-xl hover:bg-green-600 transition-colors cursor-pointer whitespace-nowrap"
                      >
                        <i className="ri-add-line w-4 h-4"></i>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowNewBookInput(false);
                          setNewBookName('');
                        }}
                        className="bg-gray-500 text-white px-4 py-3 rounded-xl hover:bg-gray-600 transition-colors cursor-pointer whitespace-nowrap"
                      >
                        <i className="ri-close-line w-4 h-4"></i>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Toplam Sayfa
                </label>
                <input
                  type="number"
                  min="1"
                  value={bookForm.totalPages}
                  onChange={(e) => {
                    const total = parseInt(e.target.value) || 0;
                    const readToday = bookForm.pagesReadToday;
                    const remaining = Math.max(0, total - readToday);
                    setBookForm({
                      ...bookForm,
                      totalPages: total,
                      remainingPages: remaining
                    });
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bugün Okunan Sayfa Sayısı
                </label>
                <input
                  type="number"
                  min="0"
                  max={bookForm.totalPages}
                  value={bookForm.pagesReadToday}
                  onChange={(e) => {
                    const readToday = parseInt(e.target.value) || 0;
                    const total = bookForm.totalPages;
                    const remaining = Math.max(0, total - readToday);
                    setBookForm({
                      ...bookForm,
                      pagesReadToday: readToday,
                      remainingPages: remaining
                    });
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kitabın Bitmesi İçin Kalan Sayfa Sayısı
                </label>
                <input
                  type="number"
                  value={bookForm.remainingPages}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50"
                  readOnly
                />
              </div>
            </div>

            {/* Progress Bar */}
            {bookForm.totalPages > 0 && (
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Okuma İlerlemesi</span>
                  <span className="text-sm text-gray-600">
                    {Math.round((bookForm.pagesReadToday / bookForm.totalPages) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-green-500 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min((bookForm.pagesReadToday / bookForm.totalPages) * 100, 100)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0 sayfa</span>
                  <span>{bookForm.totalPages} sayfa</span>
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-green-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-green-600 transition-colors cursor-pointer whitespace-nowrap"
                disabled={showNewBookInput}
              >
                Kitap Kaydını Kaydet
              </button>
            </div>
          </form>

          {/* Book History Table */}
          <div className="mt-8 border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Kitap Okuma Geçmişi (Son 20 Kayıt)</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Tarih</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Kitap Adı</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Toplam Sayfa</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Okunan Sayfa</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Kalan Sayfa</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">İlerleme</th>
                  </tr>
                </thead>
                <tbody>
                  {bookHistory.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-gray-500">
                        Henüz kitap kaydı yok. İlk kaydınızı ekleyin! 📖
                      </td>
                    </tr>
                  ) : (
                    bookHistory.map((item) => (
                      <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-4 text-sm text-gray-900">
                          {new Date(item.reading_date).toLocaleDateString('tr-TR')}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-900 font-medium">{item.book_name}</td>
                        <td className="py-3 px-4 text-sm text-gray-900 text-center">{item.total_pages}</td>
                        <td className="py-3 px-4 text-sm text-green-600 text-center font-medium">{item.pages_read_today}</td>
                        <td className="py-3 px-4 text-sm text-gray-600 text-center">{item.remaining_pages}</td>
                        <td className="py-3 px-4 text-sm text-center">
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-green-500 rounded-full transition-all"
                                style={{ width: `${item.completion_percentage}%` }}
                              ></div>
                            </div>
                            <span className="text-xs font-medium text-gray-700">{item.completion_percentage}%</span>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
