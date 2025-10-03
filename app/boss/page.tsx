
'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '../../components/ProtectedRoute';

interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
  subject: string;
}

const mockQuestions: Question[] = [
  {
    id: 1,
    question: "2x + 5 = 13 denkleminde x kaçtır?",
    options: ["2", "4", "6", "8"],
    correct: 1,
    subject: "Matematik"
  },
  {
    id: 2,
    question: "Aşağıdakilerden hangisi geçiş metali değildir?",
    options: ["Demir", "Bakır", "Sodyum", "Nikel"],
    correct: 2,
    subject: "Fen"
  },
  {
    id: 3,
    question: "Kurtuluş Savaşı hangi yıl başlamıştır?",
    options: ["1919", "1920", "1921", "1922"],
    correct: 0,
    subject: "İnkılap"
  }
];

export default function BossFightPage() {
  const [gameState, setGameState] = useState<'waiting' | 'playing' | 'finished'>('waiting');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(600);
  const [answers, setAnswers] = useState<{[key: number]: {answer: number | null, uncertain: boolean, time: number}}>({});
  const [startTime, setStartTime] = useState<number>(0);

  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setGameState('finished');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameState, timeLeft]);

  const startExam = () => {
    setGameState('playing');
    setStartTime(Date.now());
    setTimeLeft(600);
    setAnswers({});
    setCurrentQuestionIndex(0);
  };

  const selectAnswer = (answerIndex: number) => {
    const currentTime = Date.now();
    const questionTime = Math.floor((currentTime - startTime) / 1000);

    setAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: {
        answer: answerIndex,
        uncertain: prev[currentQuestionIndex]?.uncertain || false,
        time: questionTime
      }
    }));
  };

  const toggleUncertain = () => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: {
        ...prev[currentQuestionIndex],
        uncertain: !prev[currentQuestionIndex]?.uncertain,
        answer: prev[currentQuestionIndex]?.answer || null,
        time: prev[currentQuestionIndex]?.time || 0
      }
    }));
  };

  const goToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < mockQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const finishExam = () => {
    setGameState('finished');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const calculateResults = () => {
    let correct = 0;
    let wrong = 0;
    let empty = 0;
    let totalTime = 0;
    let uncertainQuestions: number[] = [];

    mockQuestions.forEach((question, index) => {
      const answer = answers[index];
      if (!answer || answer.answer === null) {
        empty++;
      } else if (answer.answer === question.correct) {
        correct++;
      } else {
        wrong++;
      }

      if (answer?.uncertain) {
        uncertainQuestions.push(index + 1);
      }

      totalTime += answer?.time || 0;
    });

    return { correct, wrong, empty, avgTime: totalTime / mockQuestions.length, uncertainQuestions };
  };

  if (gameState === 'waiting') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto p-8">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <i className="ri-sword-line text-white text-3xl w-8 h-8 flex items-center justify-center"></i>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Boss Fight</h1>
              <p className="text-gray-600">10 dakikalık zorlu sınav modu</p>
            </div>

            <div className="space-y-6 mb-8">
              <div className="flex items-center space-x-3 p-4 bg-red-50 rounded-xl">
                <i className="ri-time-line text-red-500 text-xl w-6 h-6 flex items-center justify-center"></i>
                <div>
                  <h3 className="font-semibold text-gray-900">Süre Sınırı</h3>
                  <p className="text-sm text-gray-600">10 dakikada 15 soru</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-xl">
                <i className="ri-question-line text-blue-500 text-xl w-6 h-6 flex items-center justify-center"></i>
                <div>
                  <h3 className="font-semibold text-gray-900">Emin Değilim</h3>
                  <p className="text-sm text-gray-600">Zorlandığın soruları işaretleyebilirsin</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-xl">
                <i className="ri-bar-chart-line text-green-500 text-xl w-6 h-6 flex items-center justify-center"></i>
                <div>
                  <h3 className="font-semibold text-gray-900">Detaylı Analiz</h3>
                  <p className="text-sm text-gray-600">Sınav sonunda performans raporu</p>
                </div>
              </div>
            </div>

            <button
              onClick={startExam}
              className="w-full bg-gradient-to-r from-red-500 to-pink-600 text-white py-4 px-6 rounded-xl text-lg font-semibold hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer whitespace-nowrap"
            >
              Boss Savaşını Başlat! 
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'finished') {
    const results = calculateResults();

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto p-8">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <i className="ri-trophy-line text-white text-3xl w-8 h-8 flex items-center justify-center"></i>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Boss Savaşı Tamamlandı!</h1>
              <p className="text-gray-600">İşte performans raporun</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-green-50 p-6 rounded-xl text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">{results.correct}</div>
                <div className="text-sm text-gray-600">Doğru</div>
              </div>
              <div className="bg-red-50 p-6 rounded-xl text-center">
                <div className="text-2xl font-bold text-red-600 mb-1">{results.wrong}</div>
                <div className="text-sm text-gray-600">Yanlış</div>
              </div>
              <div className="bg-gray-50 p-6 rounded-xl text-center">
                <div className="text-2xl font-bold text-gray-600 mb-1">{results.empty}</div>
                <div className="text-sm text-gray-600">Boş</div>
              </div>
              <div className="bg-blue-50 p-6 rounded-xl text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">{results.avgTime.toFixed(1)}s</div>
                <div className="text-sm text-gray-600">Ort. Süre</div>
              </div>
            </div>

            {results.uncertainQuestions.length > 0 && (
              <div className="bg-yellow-50 p-6 rounded-xl mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Emin Olmadığın Sorular:</h3>
                <div className="flex flex-wrap gap-2">
                  {results.uncertainQuestions.map(questionNum => (
                    <span key={questionNum} className="px-3 py-1 bg-yellow-200 text-yellow-800 rounded-full text-sm">
                      Soru {questionNum}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setGameState('waiting')}
                className="bg-blue-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-600 transition-colors cursor-pointer whitespace-nowrap"
              >
                Tekrar Dene
              </button>
              <button
                onClick={() => window.location.href = '/dashboard'}
                className="bg-gray-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-600 transition-colors cursor-pointer whitespace-nowrap"
              >
                Ana Panele Dön
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = mockQuestions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="grid grid-cols-12 gap-6 h-screen max-h-screen p-8">
        <div className="col-span-8 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Soru {currentQuestionIndex + 1} / {mockQuestions.length}
            </h2>
            <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
              {currentQuestion.subject}
            </span>
          </div>

          <div className="mb-8">
            <p className="text-gray-900 text-lg leading-relaxed mb-6">
              {currentQuestion.question}
            </p>

            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => selectAnswer(index)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all cursor-pointer ${
                    answers[currentQuestionIndex]?.answer === index
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="font-medium text-gray-700">
                    {String.fromCharCode(65 + index)}) {option}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={toggleUncertain}
              className={`px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
                answers[currentQuestionIndex]?.uncertain
                  ? 'bg-yellow-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {answers[currentQuestionIndex]?.uncertain ? '✓ Emin Değilim' : 'Emin Değilim?'}
            </button>

            <div className="flex space-x-3">
              <button
                onClick={prevQuestion}
                disabled={currentQuestionIndex === 0}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors cursor-pointer whitespace-nowrap"
              >
                ← Önceki
              </button>
              <button
                onClick={nextQuestion}
                disabled={currentQuestionIndex === mockQuestions.length - 1}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors cursor-pointer whitespace-nowrap"
              >
                Sonraki →
              </button>
            </div>
          </div>
        </div>

        <div className="col-span-4 space-y-6">
          <div className="bg-red-500 text-white p-6 rounded-xl text-center">
            <div className="text-3xl font-bold mb-2">{formatTime(timeLeft)}</div>
            <div className="text-red-100">Kalan Süre</div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4">Sorular</h3>
            <div className="grid grid-cols-5 gap-2 mb-4">
              {mockQuestions.map((_, index) => {
                const answer = answers[index];
                return (
                  <button
                    key={index}
                    onClick={() => goToQuestion(index)}
                    className={`aspect-square flex items-center justify-center text-sm font-medium rounded cursor-pointer transition-all ${
                      index === currentQuestionIndex
                        ? 'bg-blue-500 text-white ring-2 ring-blue-300'
                        : answer?.answer !== null && answer?.answer !== undefined
                        ? answer.uncertain
                          ? 'bg-yellow-500 text-white'
                          : 'bg-green-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {index + 1}
                  </button>
                );
              })}
            </div>

            <div className="text-xs text-gray-600 space-y-1 mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span>Cevaplanmış</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                <span>Emin değilim</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gray-200 rounded"></div>
                <span>Boş</span>
              </div>
            </div>

            <button
              onClick={finishExam}
              className="w-full bg-red-500 text-white py-3 rounded-lg font-medium hover:bg-red-600 transition-colors cursor-pointer whitespace-nowrap"
            >
              Sınavı Bitir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
