
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type QuestStatus = 'pending' | 'completed' | 'expired';

interface Quest {
  id: string;
  title: string;
  topic: string;
  targetQuestions: number;
  currentProgress: number;
  dueDate: string;
  xp: number;
  coins: number;
  status: QuestStatus;
}

interface StudySession {
  questId: string;
  questTitle: string;
  topic: string;
  targetQuestions: number;
  currentQuestion: number;
  questions: Array<{
    id: number;
    question: string;
    options: string[];
    correct: number;
  }>;
  answers: number[];
  startTime: number;
}

const mockQuestions = [
  {
    id: 1,
    question: "2x + 5 = 13 denkleminde x kaçtır?",
    options: ["2", "4", "6", "8"],
    correct: 1
  },
  {
    id: 2,
    question: "15 sayısının çarpanları hangileridir?",
    options: ["1, 3, 5, 15", "1, 5, 15", "3, 5, 15", "1, 3, 15"],
    correct: 0
  },
  {
    id: 3,
    question: "48 sayısının asal çarpanları toplamı kaçtır?",
    options: ["5", "7", "9", "11"],
    correct: 1
  },
  {
    id: 4,
    question: "EKOK(12, 18) kaçtır?",
    options: ["36", "54", "72", "108"],
    correct: 0
  },
  {
    id: 5,
    question: "EBOB(24, 36) kaçtır?",
    options: ["6", "8", "12", "18"],
    correct: 2
  }
];

const mockQuests: Quest[] = [
  {
    id: '1',
    title: 'Matematik Çarpanlar',
    topic: 'Çarpanlar ve Katlar',
    targetQuestions: 20,
    currentProgress: 12,
    dueDate: '2024-12-15',
    xp: 150,
    coins: 25,
    status: 'pending'
  },
  {
    id: '2',
    title: 'Türkçe Paragraf',
    topic: 'Paragraf Anlama',
    targetQuestions: 15,
    currentProgress: 8,
    dueDate: '2024-12-14',
    xp: 120,
    coins: 20,
    status: 'pending'
  },
  {
    id: '3',
    title: 'Fen Hareket',
    topic: 'Kuvvet ve Hareket',
    targetQuestions: 25,
    currentProgress: 25,
    dueDate: '2024-12-12',
    xp: 200,
    coins: 40,
    status: 'completed'
  },
  {
    id: '4',
    title: 'İnkılap Savaşları',
    topic: 'Kurtuluş Savaşı',
    targetQuestions: 18,
    currentProgress: 5,
    dueDate: '2024-12-10',
    xp: 140,
    coins: 22,
    status: 'expired'
  }
];

export default function QuestsPage() {
  const [quests, setQuests] = useState<Quest[]>(mockQuests);
  const [draggedQuest, setDraggedQuest] = useState<Quest | null>(null);
  const [studySession, setStudySession] = useState<StudySession | null>(null);
  const router = useRouter();

  const handleDragStart = (quest: Quest) => {
    setDraggedQuest(quest);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, newStatus: QuestStatus) => {
    e.preventDefault();
    if (draggedQuest) {
      setQuests(prev => prev.map(quest => 
        quest.id === draggedQuest.id 
          ? { ...quest, status: newStatus }
          : quest
      ));
      setDraggedQuest(null);
    }
  };

  const startQuest = (quest: Quest) => {
    const remainingQuestions = quest.targetQuestions - quest.currentProgress;
    const sessionQuestions = mockQuestions.slice(0, Math.min(remainingQuestions, 5));
    
    const newSession: StudySession = {
      questId: quest.id,
      questTitle: quest.title,
      topic: quest.topic,
      targetQuestions: remainingQuestions,
      currentQuestion: 0,
      questions: sessionQuestions,
      answers: [],
      startTime: Date.now()
    };
    
    setStudySession(newSession);
  };

  const selectAnswer = (answerIndex: number) => {
    if (!studySession) return;

    const newAnswers = [...studySession.answers];
    newAnswers[studySession.currentQuestion] = answerIndex;
    
    setStudySession(prev => prev ? {
      ...prev,
      answers: newAnswers
    } : null);
  };

  const nextQuestion = () => {
    if (!studySession) return;

    if (studySession.currentQuestion < studySession.questions.length - 1) {
      setStudySession(prev => prev ? {
        ...prev,
        currentQuestion: prev.currentQuestion + 1
      } : null);
    } else {
      finishSession();
    }
  };

  const finishSession = () => {
    if (!studySession) return;

    const correctAnswers = studySession.answers.filter((answer, index) => 
      answer === studySession.questions[index].correct
    ).length;

    const questId = studySession.questId;
    const questionsCompleted = studySession.questions.length;

    setQuests(prev => prev.map(quest => 
      quest.id === questId 
        ? { 
            ...quest, 
            currentProgress: Math.min(quest.currentProgress + questionsCompleted, quest.targetQuestions),
            status: quest.currentProgress + questionsCompleted >= quest.targetQuestions ? 'completed' : 'pending'
          }
        : quest
    ));

    // Başarı bildirimi göster
    const successMessage = `🎉 Tebrikler! ${correctAnswers}/${studySession.questions.length} doğru cevap verdin. +${correctAnswers * 10} XP kazandın!`;
    setTimeout(() => alert(successMessage), 100);

    setStudySession(null);
  };

  const getQuestsByStatus = (status: QuestStatus) => {
    return quests.filter(quest => quest.status === status);
  };

  const getStatusColor = (status: QuestStatus) => {
    switch (status) {
      case 'pending':
        return 'bg-blue-50 border-blue-200';
      case 'completed':
        return 'bg-green-50 border-green-200';
      case 'expired':
        return 'bg-red-50 border-red-200';
    }
  };

  const getStatusTitle = (status: QuestStatus) => {
    switch (status) {
      case 'pending':
        return 'Bekleyen Görevler';
      case 'completed':
        return 'Tamamlanan Görevler';
      case 'expired':
        return 'Süresi Dolmuş Görevler';
    }
  };

  if (studySession) {
    const currentQ = studySession.questions[studySession.currentQuestion];
    const isLastQuestion = studySession.currentQuestion === studySession.questions.length - 1;
    const hasAnswered = studySession.answers[studySession.currentQuestion] !== undefined;

    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{studySession.questTitle}</h1>
              <p className="text-gray-600">{studySession.topic}</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">Soru</div>
              <div className="text-xl font-bold text-blue-600">
                {studySession.currentQuestion + 1} / {studySession.questions.length}
              </div>
            </div>
          </div>

          <div className="mb-8">
            <p className="text-lg text-gray-900 mb-6 leading-relaxed">
              {currentQ.question}
            </p>

            <div className="space-y-3">
              {currentQ.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => selectAnswer(index)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all cursor-pointer ${
                    studySession.answers[studySession.currentQuestion] === index
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

          <div className="flex justify-between">
            <button
              onClick={() => setStudySession(null)}
              className="px-6 py-3 bg-gray-500 text-white rounded-xl font-medium hover:bg-gray-600 transition-colors cursor-pointer whitespace-nowrap"
            >
              ← Görevlere Dön
            </button>
            
            <button
              onClick={nextQuestion}
              disabled={!hasAnswered}
              className="px-6 py-3 bg-blue-500 text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors cursor-pointer whitespace-nowrap"
            >
              {isLastQuestion ? 'Bitir' : 'Sonraki Soru'} →
            </button>
          </div>
        </div>
      </div>
    );
  }

  const renderQuestCard = (quest: Quest) => (
    <div
      key={quest.id}
      draggable
      onDragStart={() => handleDragStart(quest)}
      className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-move"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 text-sm">{quest.title}</h3>
          <p className="text-xs text-gray-600 mt-1">{quest.topic}</p>
        </div>
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
          quest.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
          quest.status === 'completed' ? 'bg-green-100 text-green-700' :
          'bg-red-100 text-red-700'
        }`}>
          {quest.status === 'pending' ? 'Bekliyor' :
           quest.status === 'completed' ? 'Tamamlandı' : 'Süresi Doldu'}
        </div>
      </div>

      <div className="mb-3">
        <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
          <span>İlerleme</span>
          <span>{quest.currentProgress}/{quest.targetQuestions} soru</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(quest.currentProgress / quest.targetQuestions) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3 text-xs">
          <div className="flex items-center space-x-1">
            <span>⚡</span>
            <span className="text-purple-600 font-medium">{quest.xp} XP</span>
          </div>
          <div className="flex items-center space-x-1">
            <span>🪙</span>
            <span className="text-yellow-600 font-medium">{quest.coins}</span>
          </div>
        </div>
        <div className="text-xs text-gray-500">
          📅 {new Date(quest.dueDate).toLocaleDateString('tr-TR')}
        </div>
      </div>

      {quest.status === 'pending' && (
        <button
          onClick={() => startQuest(quest)}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors cursor-pointer whitespace-nowrap"
        >
          Başlat
        </button>
      )}
    </div>
  );

  return (
    <div className="grid grid-cols-3 gap-6">
      {(['pending', 'completed', 'expired'] as QuestStatus[]).map(status => (
        <div
          key={status}
          className={`rounded-xl border-2 border-dashed p-4 min-h-[600px] ${getStatusColor(status)}`}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, status)}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">{getStatusTitle(status)}</h3>
            <span className={`text-xs px-2 py-1 rounded-full ${
              status === 'pending' ? 'bg-blue-100 text-blue-700' :
              status === 'completed' ? 'bg-green-100 text-green-700' :
              'bg-red-100 text-red-700'
            }`}>
              {getQuestsByStatus(status).length}
            </span>
          </div>

          <div className="space-y-3">
            {getQuestsByStatus(status).map(renderQuestCard)}
          </div>

          {getQuestsByStatus(status).length === 0 && (
            <div className="text-center text-gray-400 py-8">
              <div className="text-3xl mb-2">
                {status === 'pending' ? '📋' :
                 status === 'completed' ? '✅' : '⏰'}
              </div>
              <p className="text-sm">
                {status === 'pending' ? 'Henüz bekleyen görev yok' :
                 status === 'completed' ? 'Tamamlanmış görev yok' :
                 'Süresi dolmuş görev yok'}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
