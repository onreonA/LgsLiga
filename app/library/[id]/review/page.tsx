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
  category?: { name: string; color: string; icon: string };
}

export default function ReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const unwrappedParams = use(params);
  const bookId = unwrappedParams.id;
  
  const [book, setBook] = useState<Book | null>(null);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [existingReview, setExistingReview] = useState(false);

  useEffect(() => {
    loadBookAndReview();
  }, [bookId]);

  const loadBookAndReview = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/');
        return;
      }

      // Load book
      const { data: bookData, error: bookError } = await supabase
        .from('books')
        .select('id, title, author, total_pages, cover_image, category:book_categories(name, color, icon)')
        .eq('id', bookId)
        .single();

      if (bookError) throw bookError;
      
      // Fix category type (comes as array, we need single object)
      const formattedBook: Book = {
        ...bookData,
        category: Array.isArray(bookData.category) && bookData.category.length > 0 
          ? bookData.category[0] 
          : undefined
      };
      
      setBook(formattedBook);

      // Check for existing review
      const { data: reviewData } = await supabase
        .from('book_reviews')
        .select('rating, summary')
        .eq('user_id', user.id)
        .eq('book_id', bookId)
        .single();

      if (reviewData) {
        setRating(reviewData.rating);
        setSummary(reviewData.summary);
        setExistingReview(true);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error loading book:', error);
      setLoading(false);
    }
  };

  const countWords = (text: string) => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const wordCount = countWords(summary);
  const minWords = 100;
  const isValid = rating > 0 && wordCount >= minWords;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValid) {
      alert(`Lütfen en az ${minWords} kelimelik bir özet yazın ve kitabı puanlayın!`);
      return;
    }

    try {
      setSubmitting(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('book_reviews')
        .upsert({
          user_id: user.id,
          book_id: bookId,
          rating,
          summary,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,book_id'
        });

      if (error) throw error;

      alert('Değerlendirme başarıyla kaydedildi! 🎉');
      router.push(`/library/${bookId}`);
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Değerlendirme kaydedilirken bir hata oluştu!');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !book) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const colorClass = book.category?.color || 'bg-purple-500';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          href={`/library/${bookId}`}
          className="text-gray-600 hover:text-gray-900 transition-colors"
        >
          <i className="ri-arrow-left-line mr-2"></i>
          Geri Dön
        </Link>
        {existingReview && (
          <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-sm font-medium flex items-center">
            <i className="ri-trophy-line mr-1"></i>
            Tamamlandı!
          </span>
        )}
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className={`${colorClass} p-6 text-white`}>
          <h1 className="text-2xl font-bold mb-2">Kitap Özeti ve Değerlendirme</h1>
          <p className="text-white/90">"{book.title}" - {book.author}</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Book Summary Card */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200">
            <div className="md:col-span-1">
              <div className="relative rounded-xl overflow-hidden shadow-lg">
                <img
                  src={book.cover_image || '/placeholder-book.jpg'}
                  alt={book.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 right-2 bg-green-500 text-white p-2 rounded-full">
                  <i className="ri-check-line"></i>
                </div>
              </div>
            </div>

            <div className="md:col-span-3 space-y-3">
              <h3 className="text-lg font-bold text-gray-900">{book.title}</h3>
              <p className="text-gray-600">{book.author}</p>
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center">
                  <span className="text-gray-600 mr-2">Kategori:</span>
                  <span className={`${colorClass} text-white px-2 py-1 rounded-full text-xs`}>
                    {book.category?.icon} {book.category?.name || 'Roman'}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-600 mr-2">Toplam Sayfa:</span>
                  <span className="font-semibold text-gray-900">{book.total_pages}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-600 mr-2">Okuma Süresi:</span>
                  <span className="font-semibold text-gray-900">0dk</span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-600 mr-2">Tamamlanma:</span>
                  <span className="font-semibold text-green-600">Bugün</span>
                </div>
              </div>
            </div>
          </div>

          {/* Rating Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900">Kitabı Değerlendirin</h3>
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-medium text-gray-700">
                  Puanınız: <span className="text-red-500">*</span>
                </label>
                <span className="text-sm text-gray-600">
                  {rating === 0 ? 'Puan verin' : `${rating}/5 - ${
                    rating === 5 ? 'Muhteşem!' :
                    rating === 4 ? 'Çok İyi!' :
                    rating === 3 ? 'İyi' :
                    rating === 2 ? 'Orta' : 'Zayıf'
                  }`}
                </span>
              </div>

              <div className="flex items-center justify-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="transition-all duration-150 hover:scale-110"
                  >
                    <i
                      className={`${
                        star <= (hoveredRating || rating)
                          ? 'ri-star-fill text-yellow-500'
                          : 'ri-star-line text-gray-300'
                      } text-5xl cursor-pointer`}
                    ></i>
                  </button>
                ))}
              </div>

              {rating > 0 && (
                <p className="text-center text-xs text-gray-600 mt-4">
                  Bu puanınız diğer okuculara yardımcı olacak...
                </p>
              )}
            </div>
          </div>

          {/* Summary Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900">Kitap Özeti</h3>
            <div className="bg-gray-50 rounded-xl p-6 space-y-4">
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Kitabın ana konusunu, karakterleri, olayları, ve sonucunu kendi kelimelerinizle özetleyin. Bu özet hem size hem de diğer okuculara faydalı olacak..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                rows={10}
                required
              ></textarea>

              <div className="flex items-center justify-between text-sm">
                <span className={`font-medium ${
                  wordCount < minWords ? 'text-red-600' : 'text-green-600'
                }`}>
                  {wordCount}/{minWords} kelime
                  {wordCount < minWords && ` (${minWords - wordCount} kelime daha gerekli)`}
                </span>
                <span className="text-gray-500">{summary.length}/1000 karakter</span>
              </div>

              <p className="text-xs text-gray-600 bg-blue-50 border border-blue-200 rounded-lg p-3">
                <i className="ri-information-line mr-1"></i>
                Minimum {minWords} kelime gerekli. Bu özet hem sizin hem de diğer okuyucuların bu kitabı hatırlaması 
                ve anlaması için önemlidir.
              </p>
            </div>
          </div>

          {/* Favorite Quotes Section (Optional) */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900">Favori Alıntılar</h3>
            <div className="bg-gray-50 rounded-xl p-6">
              <textarea
                placeholder="Kitaptan beğendiğiniz bir alıntı yazın..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                rows={3}
              ></textarea>
              <button
                type="button"
                className="mt-3 text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center"
              >
                <i className="ri-add-line mr-1"></i>
                Alıntı Ekle
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
            <Link
              href={`/library/${bookId}`}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
            >
              İptal
            </Link>
            <button
              type="submit"
              disabled={!isValid || submitting}
              className={`px-8 py-3 ${colorClass} text-white rounded-xl font-semibold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center`}
            >
              {submitting ? (
                <>
                  <i className="ri-loader-4-line animate-spin mr-2"></i>
                  Kaydediliyor...
                </>
              ) : existingReview ? (
                <>
                  <i className="ri-save-line mr-2"></i>
                  Güncelle
                </>
              ) : (
                <>
                  <i className="ri-check-line mr-2"></i>
                  Değerlendirmeyi Tamamla
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
