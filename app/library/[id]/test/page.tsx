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

interface BookQuestion {
  id: string;
  book_id: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
  explanation: string | null;
  difficulty_level: string;
  question_order: number;
}

interface TestSession {
  id: string;
  user_id: string;
  book_id: string;
  total_questions: number;
  correct_answers: number;
  wrong_answers: number;
  score: number;
  completion_percentage: number;
  total_time_seconds: number;
  status: string;
}

export default function BookTestPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const unwrappedParams = use(params);
  const bookId = unwrappedParams.id;

  const [book, setBook] = useState<Book | null>(null);
  const [questions, setQuestions] = useState<BookQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{
    [key: string]: string;
  }>({});
  const [timeSpent, setTimeSpent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [testStarted, setTestStarted] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [testSession, setTestSession] = useState<TestSession | null>(null);
  const [questionStartTime, setQuestionStartTime] = useState<number>(0);

  useEffect(() => {
    loadBookAndQuestions();
  }, [bookId]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (testStarted && !testCompleted) {
      interval = setInterval(() => {
        setTimeSpent((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [testStarted, testCompleted]);

  const loadBookAndQuestions = async () => {
    try {
      // Load book details
      const { data: bookData } = await supabase
        .from("books")
        .select(
          `
          *,
          category:book_categories(name, color)
        `,
        )
        .eq("id", bookId)
        .single();

      if (bookData) {
        setBook(bookData);
      }

      // Load questions for this book
      const { data: questionsData } = await supabase
        .from("book_questions")
        .select("*")
        .eq("book_id", bookId)
        .order("question_order");

      if (questionsData && questionsData.length > 0) {
        setQuestions(questionsData);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error loading book and questions:", error);
      setLoading(false);
    }
  };

  const startTest = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      // Create test session
      const { data: sessionData } = await supabase
        .from("book_test_sessions")
        .insert({
          user_id: user.id,
          book_id: bookId,
          total_questions: questions.length,
          status: "in_progress",
        })
        .select()
        .single();

      if (sessionData) {
        setTestSession(sessionData);
        setTestStarted(true);
        setQuestionStartTime(Date.now());
      }
    } catch (error) {
      console.error("Error starting test:", error);
    }
  };

  const handleAnswerSelect = (answer: string) => {
    const currentQuestion = questions[currentQuestionIndex];
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: answer,
    }));
  };

  const handleNextQuestion = async () => {
    const currentQuestion = questions[currentQuestionIndex];
    const selectedAnswer = selectedAnswers[currentQuestion.id];
    const timeForThisQuestion = Math.round(
      (Date.now() - questionStartTime) / 1000,
    );

    if (selectedAnswer) {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user || !testSession) return;

        // Save answer attempt
        await supabase.from("book_question_attempts").insert({
          user_id: user.id,
          book_id: bookId,
          question_id: currentQuestion.id,
          selected_answer: selectedAnswer,
          is_correct: selectedAnswer === currentQuestion.correct_answer,
          time_spent_seconds: timeForThisQuestion,
        });

        // Move to next question
        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
          setQuestionStartTime(Date.now());
        } else {
          // Test completed
          await completeTest();
        }
      } catch (error) {
        console.error("Error saving answer:", error);
      }
    }
  };

  const completeTest = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user || !testSession) return;

      // Calculate results
      let correctCount = 0;
      let wrongCount = 0;

      for (const question of questions) {
        const selectedAnswer = selectedAnswers[question.id];
        if (selectedAnswer === question.correct_answer) {
          correctCount++;
        } else {
          wrongCount++;
        }
      }

      const score = Math.round((correctCount / questions.length) * 100);
      const completionPercentage = 100;

      // Update test session
      const { data: updatedSession } = await supabase
        .from("book_test_sessions")
        .update({
          correct_answers: correctCount,
          wrong_answers: wrongCount,
          score: score,
          completion_percentage: completionPercentage,
          total_time_seconds: timeSpent,
          completed_at: new Date().toISOString(),
          status: "completed",
        })
        .eq("id", testSession.id)
        .select()
        .single();

      if (updatedSession) {
        setTestSession(updatedSession);
        setTestCompleted(true);
      }
    } catch (error) {
      console.error("Error completing test:", error);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!book || questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Test Bulunamadı
          </h1>
          <p className="text-gray-600 mb-6">
            Bu kitap için henüz test soruları hazırlanmamış.
          </p>
          <Link
            href={`/library/${bookId}`}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Kütüphaneye Dön
          </Link>
        </div>
      </div>
    );
  }

  if (testCompleted && testSession) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link
              href={`/library/${bookId}`}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              <i className="ri-arrow-left-line text-xl"></i>
            </Link>
            <h1 className="text-lg font-bold text-gray-900">Test Tamamlandı</h1>
            <div className="w-6"></div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-check-line text-3xl text-green-600"></i>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Tebrikler! Test Tamamlandı
              </h2>
              <p className="text-gray-600">
                {book.title} kitabı için test sonuçlarınız
              </p>
            </div>

            {/* Results */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-blue-50 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {testSession.score}%
                </div>
                <div className="text-sm text-blue-700">Genel Başarı</div>
              </div>
              <div className="bg-green-50 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {testSession.correct_answers}
                </div>
                <div className="text-sm text-green-700">Doğru Cevap</div>
              </div>
              <div className="bg-red-50 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-red-600 mb-2">
                  {testSession.wrong_answers}
                </div>
                <div className="text-sm text-red-700">Yanlış Cevap</div>
              </div>
            </div>

            {/* Time */}
            <div className="bg-gray-50 rounded-xl p-6 text-center mb-8">
              <div className="text-2xl font-bold text-gray-800 mb-2">
                {formatTime(testSession.total_time_seconds)}
              </div>
              <div className="text-sm text-gray-600">Toplam Süre</div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/reports"
                className="bg-blue-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-600 transition-colors flex items-center justify-center"
              >
                <i className="ri-bar-chart-line mr-2"></i>
                Raporları Görüntüle
              </Link>
              <Link
                href={`/library/${bookId}`}
                className="bg-gray-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-600 transition-colors flex items-center justify-center"
              >
                <i className="ri-book-open-line mr-2"></i>
                Kitap Detayları
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!testStarted) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link
              href={`/library/${bookId}`}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              <i className="ri-arrow-left-line text-xl"></i>
            </Link>
            <h1 className="text-lg font-bold text-gray-900">Kitap Testi</h1>
            <div className="w-6"></div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-question-answer-line text-3xl text-blue-600"></i>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {book.title} Testi
              </h2>
              <p className="text-gray-600 mb-6">
                Kitabı okuduktan sonra anlayışınızı test edin
              </p>
            </div>

            {/* Test Info */}
            <div className="bg-blue-50 rounded-xl p-6 mb-8">
              <h3 className="font-semibold text-blue-900 mb-4">
                Test Bilgileri:
              </h3>
              <div className="space-y-2 text-sm text-blue-800">
                <div className="flex justify-between">
                  <span>Toplam Soru:</span>
                  <span className="font-medium">{questions.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tahmini Süre:</span>
                  <span className="font-medium">
                    {questions.length * 2} dakika
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Soru Türü:</span>
                  <span className="font-medium">Çoktan Seçmeli</span>
                </div>
                <div className="flex justify-between">
                  <span>Zorluk:</span>
                  <span className="font-medium">LGS Seviyesi</span>
                </div>
              </div>
            </div>

            {/* Start Button */}
            <div className="text-center">
              <button
                onClick={startTest}
                className="bg-blue-500 text-white px-8 py-4 rounded-xl font-medium hover:bg-blue-600 transition-colors text-lg"
              >
                <i className="ri-play-line mr-2"></i>
                Teste Başla
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const selectedAnswer = selectedAnswers[currentQuestion.id];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Soru {currentQuestionIndex + 1} / {questions.length}
          </div>
          <div className="text-sm text-gray-600">
            <i className="ri-time-line mr-1"></i>
            {formatTime(timeSpent)}
          </div>
          <div className="text-sm text-gray-600">
            {Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}%
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>İlerleme</span>
              <span>
                {currentQuestionIndex + 1} / {questions.length}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
                }}
              ></div>
            </div>
          </div>

          {/* Question */}
          <div className="mb-8">
            <div className="bg-blue-50 rounded-xl p-6 mb-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">
                {currentQuestion.question_text}
              </h3>
            </div>

            {/* Options */}
            <div className="space-y-3">
              {[
                { key: "A", value: currentQuestion.option_a },
                { key: "B", value: currentQuestion.option_b },
                { key: "C", value: currentQuestion.option_c },
                { key: "D", value: currentQuestion.option_d },
              ].map((option) => (
                <button
                  key={option.key}
                  onClick={() => handleAnswerSelect(option.key)}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                    selectedAnswer === option.key
                      ? "border-blue-500 bg-blue-50 text-blue-900"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center">
                    <div
                      className={`w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center ${
                        selectedAnswer === option.key
                          ? "border-blue-500 bg-blue-500"
                          : "border-gray-300"
                      }`}
                    >
                      {selectedAnswer === option.key && (
                        <i className="ri-check-line text-white text-sm"></i>
                      )}
                    </div>
                    <div>
                      <span className="font-medium">{option.key}.</span>
                      <span className="ml-2">{option.value}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Next Button */}
          <div className="text-center">
            <button
              onClick={handleNextQuestion}
              disabled={!selectedAnswer}
              className={`px-8 py-4 rounded-xl font-medium transition-colors ${
                selectedAnswer
                  ? "bg-blue-500 text-white hover:bg-blue-600"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              {currentQuestionIndex < questions.length - 1
                ? "Sonraki Soru"
                : "Testi Bitir"}
              <i className="ri-arrow-right-line ml-2"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
