'use client';

import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { supabase } from '@/lib/supabase';

interface BookData {
  book_name: string;
  total_pages: number;
  pages_read_today: number;
  reading_date: string;
}

const mockBookData = [
  { book_name: 'Matematik Soru Bankası', total_pages: 450, pages_read_today: 25, reading_date: '2024-01-15' },
  { book_name: 'Türkçe Test Kitabı', total_pages: 320, pages_read_today: 18, reading_date: '2024-01-16' },
  { book_name: 'Fen Bilimleri Konu Anlatımı', total_pages: 280, pages_read_today: 22, reading_date: '2024-01-17' },
  { book_name: 'Matematik Soru Bankası', total_pages: 450, pages_read_today: 30, reading_date: '2024-01-18' },
  { book_name: 'Sosyal Bilgiler Atlası', total_pages: 200, pages_read_today: 15, reading_date: '2024-01-19' },
  { book_name: 'Türkçe Test Kitabı', total_pages: 320, pages_read_today: 20, reading_date: '2024-01-20' },
  { book_name: 'İngilizce Kelime Kitabı', total_pages: 150, pages_read_today: 12, reading_date: '2024-01-21' },
  { book_name: 'Matematik Soru Bankası', total_pages: 450, pages_read_today: 28, reading_date: '2024-01-22' },
  { book_name: 'Fen Bilimleri Konu Anlatımı', total_pages: 280, pages_read_today: 25, reading_date: '2024-01-23' },
  { book_name: 'Türkçe Test Kitabı', total_pages: 320, pages_read_today: 22, reading_date: '2024-01-24' }
];

export default function BookReadingProgress() {
  const [bookData, setBookData] = useState<BookData[]>([]);
  const [selectedBook, setSelectedBook] = useState<string>('all');

  useEffect(() => {
    loadBookData();
  }, []);

  const loadBookData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setBookData(mockBookData);
        return;
      }

      const { data, error } = await supabase
        .from('book_reading')
        .select('*')
        .eq('user_id', user.id)
        .order('reading_date', { ascending: true });

      if (error) throw error;
      setBookData(data || mockBookData);
    } catch (error) {
      console.error('Error loading book data:', error);
      setBookData(mockBookData);
    }
  };

  const getUniqueBooks = () => {
    const books = [...new Set(bookData.map(item => item.book_name))];
    return books;
  };

  const getBookProgress = () => {
    const books = getUniqueBooks();
    return books.map(bookName => {
      const bookEntries = bookData.filter(item => item.book_name === bookName);
      const totalPagesRead = bookEntries.reduce((sum, entry) => sum + entry.pages_read_today, 0);
      const totalPages = bookEntries[0]?.total_pages || 0;
      const progress = totalPages > 0 ? (totalPagesRead / totalPages) * 100 : 0;
      const remainingPages = Math.max(0, totalPages - totalPagesRead);
      
      return {
        bookName,
        totalPages,
        pagesRead: totalPagesRead,
        progress: Math.min(progress, 100),
        remainingPages,
        lastReadDate: bookEntries[bookEntries.length - 1]?.reading_date || '',
        readingDays: bookEntries.length
      };
    });
  };

  const getDailyReadingTrend = () => {
    const filteredData = selectedBook === 'all' 
      ? bookData 
      : bookData.filter(item => item.book_name === selectedBook);

    const dailyTotals = filteredData.reduce((acc, item) => {
      const date = item.reading_date;
      if (!acc[date]) {
        acc[date] = { date, pages: 0, books: new Set() };
      }
      acc[date].pages += item.pages_read_today;
      acc[date].books.add(item.book_name);
      return acc;
    }, {} as Record<string, { date: string; pages: number; books: Set<string> }>);

    return Object.values(dailyTotals)
      .map(item => ({
        date: new Date(item.date).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit' }),
        pages: item.pages,
        bookCount: item.books.size
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-14); // Son 14 gün
  };

  const bookProgress = getBookProgress();
  const dailyTrend = getDailyReadingTrend();
  const totalPagesRead = bookData.reduce((sum, item) => sum + item.pages_read_today, 0);
  const totalBooks = getUniqueBooks().length;
  const completedBooks = bookProgress.filter(book => book.progress >= 100).length;
  const avgDailyPages = dailyTrend.length > 0 
    ? Math.round(dailyTrend.reduce((sum, day) => sum + day.pages, 0) / dailyTrend.length)
    : 0;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Kitap Okuma İlerlemesi</h3>
          <p className="text-sm text-gray-600">Kitap okuma alışkanlığınızın detaylı analizi</p>
        </div>
        <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
          <i className="ri-book-open-line text-green-600 text-xl"></i>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-green-50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{totalPagesRead}</div>
          <div className="text-sm text-gray-600">Toplam Sayfa</div>
        </div>
        <div className="bg-blue-50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{totalBooks}</div>
          <div className="text-sm text-gray-600">Kitap Sayısı</div>
        </div>
        <div className="bg-purple-50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">{completedBooks}</div>
          <div className="text-sm text-gray-600">Tamamlanan</div>
        </div>
        <div className="bg-amber-50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-amber-600">{avgDailyPages}</div>
          <div className="text-sm text-gray-600">Günlük Ort.</div>
        </div>
      </div>

      {/* Book Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Kitap Seçin
        </label>
        <select
          value={selectedBook}
          onChange={(e) => setSelectedBook(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent pr-8"
        >
          <option value="all">Tüm Kitaplar</option>
          {getUniqueBooks().map((book) => (
            <option key={book} value={book}>{book}</option>
          ))}
        </select>
      </div>

      {/* Daily Reading Trend */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-900 mb-4">Günlük Okuma Trendi (Son 14 Gün)</h4>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dailyTrend} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis 
                dataKey="date" 
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
                formatter={(value, name) => [
                  name === 'pages' ? `${value} sayfa` : `${value} kitap`,
                  name === 'pages' ? 'Okunan Sayfa' : 'Kitap Sayısı'
                ]}
                labelFormatter={(label) => `Tarih: ${label}`}
              />
              <Line 
                type="monotone" 
                dataKey="pages" 
                stroke="#10b981" 
                strokeWidth={3}
                dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Book Progress List */}
      <div className="space-y-4">
        <h4 className="font-semibold text-gray-900">Kitap İlerleme Durumu</h4>
        {bookProgress.map((book, index) => (
          <div key={index} className="border border-gray-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h5 className="font-semibold text-gray-900">{book.bookName}</h5>
                <p className="text-sm text-gray-600">
                  {book.pagesRead} / {book.totalPages} sayfa • {book.readingDays} gün
                </p>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-green-600">
                  {book.progress.toFixed(1)}%
                </div>
                <div className="text-xs text-gray-500">
                  {book.remainingPages} sayfa kaldı
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
              <div 
                className="bg-green-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(book.progress, 100)}%` }}
              ></div>
            </div>

            <div className="flex justify-between items-center">
              <div className="text-xs text-gray-500">
                Son okuma: {new Date(book.lastReadDate).toLocaleDateString('tr-TR')}
              </div>
              <div className="flex items-center space-x-2">
                {book.progress >= 100 && (
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    <i className="ri-check-line w-3 h-3 mr-1"></i>
                    Tamamlandı
                  </span>
                )}
                {book.progress >= 75 && book.progress < 100 && (
                  <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full">
                    <i className="ri-time-line w-3 h-3 mr-1"></i>
                    Bitmek üzere
                  </span>
                )}
                {book.progress < 25 && (
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    <i className="ri-play-line w-3 h-3 mr-1"></i>
                    Başlangıç
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Reading Insights */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-green-50 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-2">
              <i className="ri-trophy-line text-green-600 w-5 h-5"></i>
              <span className="text-sm font-medium text-green-700">En Çok Okunan</span>
            </div>
            <div className="text-lg font-bold text-green-600">
              {bookProgress.length > 0 ? bookProgress.reduce((prev, current) => 
                prev.pagesRead > current.pagesRead ? prev : current
              ).bookName.substring(0, 20) + '...' : 'Henüz veri yok'}
            </div>
          </div>
          <div className="bg-blue-50 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-2">
              <i className="ri-calendar-line text-blue-600 w-5 h-5"></i>
              <span className="text-sm font-medium text-blue-700">Okuma Sıklığı</span>
            </div>
            <div className="text-lg font-bold text-blue-600">
              {dailyTrend.length > 0 ? `${dailyTrend.length} gün` : 'Henüz veri yok'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}