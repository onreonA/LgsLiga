"use client";

import { useState, useEffect, use } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Book {
  id: string;
  title: string;
  author: string;
  total_pages: number;
  category?: { name: string; color: string };
  difficulty: string;
}

export default function ReadingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const unwrappedParams = use(params);
  const bookId = unwrappedParams.id;

  const [book, setBook] = useState<Book | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [readingTime, setReadingTime] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [noteText, setNoteText] = useState("");

  useEffect(() => {
    loadBookAndProgress();
  }, [bookId]);

  // Reading timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setReadingTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  // Auto-save progress every 30 seconds
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      if (currentPage > 0) {
        saveProgress();
      }
    }, 30000);

    return () => clearInterval(autoSaveInterval);
  }, [currentPage, readingTime]);

  const loadBookAndProgress = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/");
        return;
      }

      // Load book
      const { data: bookData, error: bookError } = await supabase
        .from("books")
        .select(
          "id, title, author, total_pages, difficulty, category:book_categories(name, color)",
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

      // Load progress
      const { data: progressData } = await supabase
        .from("user_book_progress")
        .select("current_page, reading_time")
        .eq("user_id", user.id)
        .eq("book_id", bookId)
        .single();

      if (progressData) {
        setCurrentPage(progressData.current_page || 1);
        setReadingTime(progressData.reading_time || 0);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error loading book:", error);
      setLoading(false);
    }
  };

  const saveProgress = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase.from("user_book_progress").upsert(
        {
          user_id: user.id,
          book_id: bookId,
          current_page: currentPage,
          status: "reading",
          reading_time: readingTime,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "user_id,book_id",
        },
      );

      if (error) throw error;
    } catch (error) {
      console.error("Error saving progress:", error);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (book && currentPage < book.total_pages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handleFinishBook = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      // Save final progress
      await supabase.from("user_book_progress").upsert(
        {
          user_id: user.id,
          book_id: bookId,
          current_page: book?.total_pages || currentPage,
          status: "completed",
          reading_time: readingTime,
          completed_at: new Date().toISOString(),
        },
        {
          onConflict: "user_id,book_id",
        },
      );

      // Redirect to review page
      router.push(`/library/${bookId}/review`);
    } catch (error) {
      console.error("Error finishing book:", error);
      alert("Kitap tamamlanırken bir hata oluştu!");
    }
  };

  const handlePauseBook = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      await supabase
        .from("user_book_progress")
        .update({
          status: "paused",
          current_page: currentPage,
          reading_time: readingTime,
        })
        .eq("user_id", user.id)
        .eq("book_id", bookId);

      router.push(`/library/${bookId}`);
    } catch (error) {
      console.error("Error pausing book:", error);
    }
  };

  const handleAddNote = async () => {
    if (!noteText.trim()) return;

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase.from("book_notes").insert({
        user_id: user.id,
        book_id: bookId,
        page_number: currentPage,
        note_text: noteText,
      });

      if (error) throw error;

      alert("Not başarıyla eklendi!");
      setNoteText("");
      setShowNoteModal(false);
    } catch (error) {
      console.error("Error adding note:", error);
      alert("Not eklenirken bir hata oluştu!");
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}`;
    }
    return `0:${minutes.toString().padStart(2, "0")}`;
  };

  if (loading || !book) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const progressPercentage = Math.round((currentPage / book.total_pages) * 100);
  const remainingPages = book.total_pages - currentPage;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href={`/library/${bookId}`}
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            <i className="ri-arrow-left-line text-xl"></i>
          </Link>

          <div className="text-center">
            <h1 className="text-lg font-bold text-gray-900">{book.title}</h1>
            <p className="text-sm text-gray-600">{book.author}</p>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center bg-blue-100 text-blue-600 px-3 py-1 rounded-full">
              <i className="ri-time-line mr-1"></i>
              <span className="text-sm font-medium">
                {formatTime(readingTime)}
              </span>
            </div>
            <button
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className={`p-2 rounded-lg ${isTimerRunning ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-600"}`}
            >
              <i
                className={isTimerRunning ? "ri-play-fill" : "ri-pause-fill"}
              ></i>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Reading Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Page Content */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-12 shadow-sm border border-amber-200 min-h-[600px] relative">
            {/* Page Number */}
            <div className="absolute top-6 left-6 flex items-center space-x-4">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className="p-2 bg-white rounded-lg shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <i className="ri-arrow-left-line text-gray-700"></i>
              </button>

              <div className="bg-white px-6 py-2 rounded-xl shadow-sm">
                <span className="text-lg font-bold text-gray-900">
                  {currentPage}
                </span>
                <span className="text-gray-500 mx-1">/</span>
                <span className="text-gray-600">{book.total_pages}</span>
              </div>

              <button
                onClick={handleNextPage}
                disabled={currentPage === book.total_pages}
                className="p-2 bg-white rounded-lg shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <i className="ri-arrow-right-line text-gray-700"></i>
              </button>
            </div>

            {/* Reading Content */}
            <div className="mt-20 prose prose-lg max-w-none text-gray-800">
              <p className="text-justify leading-relaxed">
                Bu sayfa {book.title} kitabının {currentPage}. sayfasını temsil
                etmektedir. Gerçek bir uygulamada burada kitabın içeriği
                görüntülenecektir.
              </p>
              <p className="text-justify leading-relaxed mt-4">
                Kitap okuma deneyiminizi geliştirmek için çeşitli özellikler
                sunulmaktadır: not alma, ilerleme takibi, okuma süresi ölçümü ve
                daha fazlası.
              </p>
              <blockquote className="border-l-4 border-blue-500 pl-4 italic my-6 text-gray-700">
                "Okumak, zihnin en güzel egzersizlerindendir. Her sayfa yeni bir
                keşiftir." - Paulo Coelho
              </blockquote>
              <p className="text-justify leading-relaxed">
                Okuma sürecinizde karşılaştığınız önemli noktaları not alabilir
                ve favori alıntılarınızı kaydedebilirsiniz. Bu özellikler
                sayesinde kitabı daha iyi anlamanız ve hatırlamanız mümkün
                olacaktır.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setShowNoteModal(true)}
              className="flex-1 bg-blue-500 text-white py-3 px-6 rounded-xl font-medium hover:bg-blue-600 transition-all flex items-center justify-center"
            >
              <i className="ri-sticky-note-line mr-2"></i>
              Not Ekle
            </button>

            <button
              onClick={handlePauseBook}
              className="bg-orange-500 text-white py-3 px-6 rounded-xl font-medium hover:bg-orange-600 transition-all flex items-center justify-center"
            >
              <i className="ri-pause-circle-line mr-2"></i>
              Duraklat
            </button>

            {currentPage >= book.total_pages * 0.9 && (
              <button
                onClick={handleFinishBook}
                className="flex-1 bg-green-500 text-white py-3 px-6 rounded-xl font-medium hover:bg-green-600 transition-all flex items-center justify-center"
              >
                <i className="ri-check-line mr-2"></i>
                Kitabı Bitirdim
              </button>
            )}
          </div>
        </div>

        {/* Sidebar Stats */}
        <div className="space-y-6">
          {/* Reading Stats */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 sticky top-24">
            <h3 className="font-bold text-gray-900 mb-4">
              Okuma İstatistikleri
            </h3>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600">İlerleme</span>
                  <span className="font-bold text-gray-900">
                    {progressPercentage}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm py-3 border-b border-gray-100">
                <span className="text-gray-600">Kalan Sayfa</span>
                <span className="font-bold text-gray-900">
                  {remainingPages}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm py-3 border-b border-gray-100">
                <span className="text-gray-600">Okuma Süresi</span>
                <span className="font-bold text-gray-900">
                  {formatTime(readingTime)}
                </span>
              </div>
            </div>

            {/* Mood Selection */}
            <div className="mt-6">
              <h4 className="font-semibold text-gray-900 mb-3">
                Okuma Ruh Hali
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {[
                  {
                    icon: "😊",
                    label: "Mutlu",
                    color: "bg-yellow-100 text-yellow-700",
                  },
                  {
                    icon: "🎯",
                    label: "Odaklanmış",
                    color: "bg-blue-100 text-blue-700",
                  },
                  {
                    icon: "😴",
                    label: "Yorgun",
                    color: "bg-gray-100 text-gray-700",
                  },
                  {
                    icon: "🔥",
                    label: "Heyecanlı",
                    color: "bg-red-100 text-red-700",
                  },
                ].map((mood) => (
                  <button
                    key={mood.label}
                    className={`${mood.color} py-2 rounded-lg text-xs font-medium hover:opacity-80 transition-opacity`}
                  >
                    {mood.icon} {mood.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Book Info */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <h4 className="font-bold text-gray-900 mb-4">Kitap Bilgileri</h4>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Kategori:</span>
                <span className="font-semibold text-gray-900">
                  {book.category?.name || "Roman"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Toplam Sayfa:</span>
                <span className="font-semibold text-gray-900">
                  {book.total_pages}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Zorluk:</span>
                <span className="font-semibold text-gray-900">
                  {book.difficulty}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Note Modal */}
      {showNoteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Not Ekle</h3>
            <p className="text-sm text-gray-600 mb-4">
              Sayfa {currentPage} için not ekle
            </p>
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Notunuzu buraya yazın..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={5}
            ></textarea>
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setShowNoteModal(false)}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors"
              >
                İptal
              </button>
              <button
                onClick={handleAddNote}
                disabled={!noteText.trim()}
                className="flex-1 bg-blue-500 text-white py-3 rounded-xl font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Kaydet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
