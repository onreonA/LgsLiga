"use client";

import { useState, useEffect, use } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

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

interface BookSummary {
  id: string;
  book_id: string;
  summary_type: string;
  content: string;
  language: string;
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

export default function BookDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const unwrappedParams = use(params);
  const bookId = unwrappedParams.id;

  const [book, setBook] = useState<Book | null>(null);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [review, setReview] = useState<Review | null>(null);
  const [bookSummary, setBookSummary] = useState<BookSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    loadBookDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookId]);

  const loadBookDetails = async () => {
    try {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // Fetch book details
      const { data: bookData, error: bookError } = await supabase
        .from("books")
        .select(
          `
          *,
          category:book_categories(name, color, icon)
        `,
        )
        .eq("id", bookId)
        .single();

      if (bookError) throw bookError;

      // Fix category type (comes as array, we need single object)
      const formattedBook: Book = {
        ...bookData,
        category:
          Array.isArray(bookData.category) && bookData.category.length > 0
            ? bookData.category[0]
            : undefined,
      };

      setBook(formattedBook);

      if (user) {
        // Fetch user progress
        const { data: progressData } = await supabase
          .from("user_book_progress")
          .select("current_page, status, reading_time")
          .eq("user_id", user.id)
          .eq("book_id", bookId)
          .single();

        if (progressData) {
          setProgress(progressData);
        }

        // Fetch review if completed
        const { data: reviewData } = await supabase
          .from("book_reviews")
          .select("rating, summary, created_at")
          .eq("user_id", user.id)
          .eq("book_id", bookId)
          .single();

        if (reviewData) {
          setReview(reviewData);
        }
      }

      // Fetch book summary
      const { data: summaryData } = await supabase
        .from("book_summary")
        .select("*")
        .eq("book_id", bookId)
        .eq("summary_type", "detailed")
        .eq("language", "tr")
        .single();

      if (summaryData) {
        setBookSummary(summaryData);
      }
    } catch (error) {
      console.error("Error loading book details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartReading = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        alert("Lütfen önce giriş yapın!");
        return;
      }

      // Create or update progress
      const { error } = await supabase.from("user_book_progress").upsert(
        {
          user_id: user.id,
          book_id: bookId,
          current_page: progress?.current_page || 0,
          status: "reading",
          started_at: new Date().toISOString(),
        },
        {
          onConflict: "user_id,book_id",
        },
      );

      if (error) throw error;

      // Navigate to reading page
      router.push(`/library/${bookId}/read`);
    } catch (error) {
      console.error("Error starting book:", error);
      alert("Kitap başlatılırken bir hata oluştu!");
    }
  };

  const handleResetBook = async () => {
    try {
      setResetting(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        alert("Lütfen önce giriş yapın!");
        return;
      }

      // Delete user book progress
      await supabase
        .from("user_book_progress")
        .delete()
        .eq("user_id", user.id)
        .eq("book_id", bookId);

      // Delete book question attempts
      await supabase
        .from("book_question_attempts")
        .delete()
        .eq("user_id", user.id)
        .eq("book_id", bookId);

      // Delete book test sessions
      await supabase
        .from("book_test_sessions")
        .delete()
        .eq("user_id", user.id)
        .eq("book_id", bookId);

      // Delete book reviews
      await supabase
        .from("book_reviews")
        .delete()
        .eq("user_id", user.id)
        .eq("book_id", bookId);

      // Reload book details to refresh the UI
      await loadBookDetails();

      setShowResetModal(false);
      alert(
        "Kitap verileri başarıyla sıfırlandı! Artık yeniden okuyabilirsiniz.",
      );
    } catch (error) {
      console.error("Error resetting book:", error);
      alert("Veri sıfırlanırken bir hata oluştu!");
    } finally {
      setResetting(false);
    }
  };

  if (loading || !book) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const progressPercentage = progress?.current_page
    ? Math.round((progress.current_page / book.total_pages) * 100)
    : 0;
  const colorClass = book.category?.color || "bg-gray-500";

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
            <div className="relative rounded-xl overflow-hidden shadow-lg h-96">
              <div
                className={`absolute inset-0 ${colorClass} opacity-10 z-10`}
              ></div>
              <Image
                src={book.cover_image || "/placeholder-book.jpg"}
                alt={book.title}
                fill
                className="object-cover"
              />
              {progress?.status === "completed" && (
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {book.title}
              </h1>
              <p className="text-xl text-gray-600">{book.author}</p>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <p className="text-sm text-gray-600 mb-1">Kategori</p>
                <div className="flex items-center justify-center">
                  <span
                    className={`${colorClass} text-white text-xs px-3 py-1 rounded-full`}
                  >
                    {book.category?.icon} {book.category?.name}
                  </span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <p className="text-sm text-gray-600 mb-1">Sayfa</p>
                <p className="text-lg font-bold text-gray-900">
                  {book.total_pages}
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <p className="text-sm text-gray-600 mb-1">Zorluk</p>
                <p className="text-sm font-semibold text-gray-900">
                  {book.difficulty}
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <p className="text-sm text-gray-600 mb-1">Yaş</p>
                <p className="text-sm font-semibold text-gray-900">
                  {book.age_range}
                </p>
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
                    <span className="text-gray-600">
                      Sayfa {progress.current_page} / {book.total_pages}
                    </span>
                    <span className="font-bold text-blue-600">
                      {progressPercentage}% tamamlandı
                    </span>
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
                      Toplam okuma süresi:{" "}
                      {Math.floor(progress.reading_time / 60)} dakika
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              {(!progress || progress.status !== "completed") && (
                <button
                  onClick={handleStartReading}
                  className={`flex-1 ${colorClass} text-white py-4 rounded-xl font-semibold hover:opacity-90 transition-all flex items-center justify-center text-lg shadow-lg`}
                >
                  {!progress || progress.status === "not_started" ? (
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

              {progress?.status === "completed" && (
                <div className="flex flex-col sm:flex-row gap-3 flex-1">
                  {review && (
                    <Link
                      href={`/library/${bookId}/review`}
                      className="flex-1 bg-green-500 text-white py-4 rounded-xl font-semibold hover:bg-green-600 transition-all flex items-center justify-center text-lg shadow-lg"
                    >
                      <i className="ri-star-line mr-2 text-2xl"></i>
                      Değerlendirmeni Gör
                    </Link>
                  )}
                  <button
                    onClick={() => setShowResetModal(true)}
                    className="flex-1 bg-orange-500 text-white py-4 rounded-xl font-semibold hover:bg-orange-600 transition-all flex items-center justify-center text-lg shadow-lg"
                  >
                    <i className="ri-refresh-line mr-2 text-2xl"></i>
                    Yeniden Oku
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Book Description */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Kitap Özeti</h2>
        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
          {book.description || "Bu kitap için henüz bir özet eklenmemiş."}
        </p>
      </div>

      {/* Detailed Summary */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <i className="ri-file-text-line text-blue-500 mr-2"></i>
          Detaylı Kitap Özeti
        </h2>
        <div id="detailed-summary-content">
          {bookSummary ? (
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {bookSummary.content}
              </p>
            </div>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center">
                <i className="ri-information-line text-yellow-600 text-xl mr-3"></i>
                <div>
                  <h3 className="font-semibold text-yellow-800">
                    Özet Henüz Eklenmemiş
                  </h3>
                  <p className="text-yellow-700 text-sm mt-1">
                    Bu kitap için detaylı özet henüz admin tarafından
                    eklenmemiş. Kısa süre içinde eklenecektir.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
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
                    star <= review.rating
                      ? "ri-star-fill text-yellow-500"
                      : "ri-star-line text-gray-300"
                  } text-2xl`}
                ></i>
              ))}
            </div>
            <span className="ml-3 text-lg font-bold text-gray-900">
              {review.rating}/5
            </span>
          </div>

          {/* Summary */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Özetin:</h3>
            <p className="text-gray-700 whitespace-pre-line">
              {review.summary}
            </p>
          </div>
        </div>
      )}

      {/* Reset Confirmation Modal */}
      {showResetModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-alert-line text-2xl text-orange-600"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Kitabı Yeniden Okumak İstiyor Musunuz?
              </h3>
              <p className="text-gray-600 mb-6">
                Bu işlem sonucunda:
                <br />
                • Okuma ilerlemeniz sıfırlanacak
                <br />
                • Test sonuçlarınız silinecek
                <br />
                • Değerlendirmeniz kaldırılacak
                <br />
                <br />
                <strong>Bu işlem geri alınamaz!</strong>
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowResetModal(false)}
                  className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-xl font-medium hover:bg-gray-300 transition-colors"
                >
                  İptal
                </button>
                <button
                  onClick={handleResetBook}
                  disabled={resetting}
                  className="flex-1 bg-orange-500 text-white py-3 px-6 rounded-xl font-medium hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {resetting ? (
                    <>
                      <i className="ri-loader-4-line animate-spin mr-2"></i>
                      Sıfırlanıyor...
                    </>
                  ) : (
                    <>
                      <i className="ri-refresh-line mr-2"></i>
                      Yeniden Oku
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
