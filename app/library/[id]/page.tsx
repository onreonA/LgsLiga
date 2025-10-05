'use client';

import { useState, useEffect, use } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Book {
  id: string;
  title: string;
  author: string;
  total_pages: number;
  cover_image: string;
  difficulty: string;
  age_range: string;
  description: string;
  category?: {
    name: string;
    color: string;
    icon: string;
  };
}

interface UserProgress {
  current_page: number;
  status: string;
  reading_time: number;
}

interface Review {
  rating: number;
  summary: string;
  created_at: string;
}

export default function BookDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const unwrappedParams = use(params);
  const bookId = unwrappedParams.id;
  
  const [book, setBook] = useState<Book | null>(null);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [review, setReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookDetails();
  }, [bookId]);

  const loadBookDetails = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      // Fetch book details
      const { data: bookData, error: bookError } = await supabase
        .from('books')
        .select(`
          *,
          category:book_categories(name, color, icon)
        `)
        .eq('id', bookId)
        .single();

      if (bookError) throw bookError;
      setBook(bookData);

      if (user) {
        // Fetch user progress
        const { data: progressData } = await supabase
          .from('user_book_progress')
          .select('current_page, status, reading_time')
          .eq('user_id', user.id)
          .eq('book_id', bookId)
          .single();

        if (progressData) {
          setProgress(progressData);
        }

        // Fetch review if completed
        const { data: reviewData } = await supabase
          .from('book_reviews')
          .select('rating, summary, created_at')
          .eq('user_id', user.id)
          .eq('book_id', bookId)
          .single();

        if (reviewData) {
          setReview(reviewData);
        }
      }
    } catch (error) {
      console.error('Error loading book details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartReading = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert('Lütfen önce giriş yapın!');
        return;
      }

      // Create or update progress
      const { error } = await supabase
        .from('user_book_progress')
        .upsert({
          user_id: user.id,
          book_id: bookId,
          current_page: progress?.current_page || 0,
          status: 'reading',
          started_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,book_id'
        });

      if (error) throw error;

      // Navigate to reading page
      router.push(`/library/${bookId}/read`);
    } catch (error) {
      console.error('Error starting book:', error);
      alert('Kitap başlatılırken bir hata oluştu!');
    }
  };

  if (loading || !book) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const progressPercentage = progress?.current_page ? Math.round((progress.current_page / book.total_pages) * 100) : 0;
  const colorClass = book.category?.color || 'bg-gray-500';

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link
        href="/library"
        className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
      >
        <i className="ri-arrow-left-line mr-2"></i>
        Kütüphaneye Dön
      </Link>

      {/* Book Header Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
          {/* Book Cover */}
          <div className="lg:col-span-1">
            <div className="relative rounded-xl overflow-hidden shadow-lg">
              <div className={`absolute inset-0 ${colorClass} opacity-10`}></div>
              <img
                src={book.cover_image || '/placeholder-book.jpg'}
                alt={book.title}
                className="w-full h-96 object-cover"
              />
              {progress?.status === 'completed' && (
                <div className="absolute top-4 right-4 bg-green-500 text-white p-3 rounded-full shadow-lg">
                  <i className="ri-check-line text-xl"></i>
                </div>
              )}
            </div>
          </div>

          {/* Book Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title and Author */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{book.title}</h1>
              <p className="text-xl text-gray-600">{book.author}</p>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <p className="text-sm text-gray-600 mb-1">Kategori</p>
                <div className="flex items-center justify-center">
                  <span className={`${colorClass} text-white text-xs px-3 py-1 rounded-full`}>
                    {book.category?.icon} {book.category?.name}
                  </span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <p className="text-sm text-gray-600 mb-1">Sayfa</p>
                <p className="text-lg font-bold text-gray-900">{book.total_pages}</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <p className="text-sm text-gray-600 mb-1">Zorluk</p>
                <p className="text-sm font-semibold text-gray-900">{book.difficulty}</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <p className="text-sm text-gray-600 mb-1">Yaş</p>
                <p className="text-sm font-semibold text-gray-900">{book.age_range}</p>
              </div>
            </div>

            {/* Reading Progress */}
            {progress && progress.current_page > 0 && (
              <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <i className="ri-book-open-line text-blue-600 mr-2"></i>
                  Okuma İlerlemen
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Sayfa {progress.current_page} / {book.total_pages}</span>
                    <span className="font-bold text-blue-600">{progressPercentage}% tamamlandı</span>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-3">
                    <div 
                      className="bg-blue-600 h-3 rounded-full transition-all"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                  {progress.reading_time > 0 && (
                    <p className="text-xs text-gray-600">
                      <i className="ri-time-line mr-1"></i>
                      Toplam okuma süresi: {Math.floor(progress.reading_time / 60)} dakika
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              {(!progress || progress.status !== 'completed') && (
                <button
                  onClick={handleStartReading}
                  className={`flex-1 ${colorClass} text-white py-4 rounded-xl font-semibold hover:opacity-90 transition-all flex items-center justify-center text-lg shadow-lg`}
                >
                  {!progress || progress.status === 'not_started' ? (
                    <>
                      <i className="ri-play-circle-line mr-2 text-2xl"></i>
                      Okumaya Başla
                    </>
                  ) : (
                    <>
                      <i className="ri-book-open-line mr-2 text-2xl"></i>
                      Okumaya Devam Et
                    </>
                  )}
                </button>
              )}

              {progress?.status === 'completed' && review && (
                <Link
                  href={`/library/${bookId}/review`}
                  className="flex-1 bg-green-500 text-white py-4 rounded-xl font-semibold hover:bg-green-600 transition-all flex items-center justify-center text-lg shadow-lg"
                >
                  <i className="ri-star-line mr-2 text-2xl"></i>
                  Değerlendirmeni Gör
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Book Description */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Kitap Özeti</h2>
        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
          {book.description || 'Bu kitap için henüz bir özet eklenmemiş.'}
        </p>
      </div>

      {/* Review Section */}
      {review && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <i className="ri-star-fill text-yellow-500 mr-2"></i>
            Değerlendirmen
          </h2>
          
          {/* Star Rating */}
          <div className="flex items-center mb-4">
            <span className="text-sm text-gray-600 mr-3">Puanın:</span>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <i
                  key={star}
                  className={`${
                    star <= review.rating ? 'ri-star-fill text-yellow-500' : 'ri-star-line text-gray-300'
                  } text-2xl`}
                ></i>
              ))}
            </div>
            <span className="ml-3 text-lg font-bold text-gray-900">{review.rating}/5</span>
          </div>

          {/* Summary */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Özetin:</h3>
            <p className="text-gray-700 whitespace-pre-line">{review.summary}</p>
          </div>
        </div>
      )}
    </div>
  );
}
