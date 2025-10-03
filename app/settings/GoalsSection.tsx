
'use client';

import { useState } from 'react';

const mockGoals = [
  { id: '1', text: 'Matematik net sayımı 25\'e çıkarmak', type: 'weekly', completed: false, created_at: '2024-01-15' },
  { id: '2', text: 'Her gün en az 1 saat fen çalışmak', type: 'daily', completed: true, created_at: '2024-01-10' },
  { id: '3', text: 'Türkçe paragraf sorularında %80 başarı', type: 'monthly', completed: false, created_at: '2024-01-08' },
  { id: '4', text: 'LGS\'ye kadar 500 soru çözmek', type: 'yearly', completed: false, created_at: '2024-01-05' }
];

export default function GoalsSection() {
  const [goals, setGoals] = useState(mockGoals);
  const [newGoal, setNewGoal] = useState('');
  const [goalType, setGoalType] = useState('weekly');
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddGoal = () => {
    if (newGoal.trim()) {
      const goal = {
        id: Date.now().toString(),
        text: newGoal,
        type: goalType,
        completed: false,
        created_at: new Date().toISOString().split('T')[0]
      };
      setGoals([goal, ...goals]);
      setNewGoal('');
      setShowAddForm(false);
    }
  };

  const toggleGoal = (goalId: string) => {
    setGoals(goals.map(goal => 
      goal.id === goalId 
        ? { ...goal, completed: !goal.completed }
        : goal
    ));
  };

  const deleteGoal = (goalId: string) => {
    setGoals(goals.filter(goal => goal.id !== goalId));
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'daily': return 'bg-green-100 text-green-700';
      case 'weekly': return 'bg-blue-100 text-blue-700';
      case 'monthly': return 'bg-purple-100 text-purple-700';
      case 'yearly': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getTypeName = (type: string) => {
    switch (type) {
      case 'daily': return 'Günlük';
      case 'weekly': return 'Haftalık';
      case 'monthly': return 'Aylık';
      case 'yearly': return 'Yıllık';
      default: return type;
    }
  };

  return (
    <div className="space-y-6">
      {/* Add Goal Button */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Hedeflerim</h3>
            <p className="text-sm text-gray-600">Motivasyonunu artıracak hedefler belirle</p>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors cursor-pointer whitespace-nowrap"
          >
            <i className="ri-add-line w-4 h-4 mr-2"></i>
            Hedef Ekle
          </button>
        </div>

        {/* Add Form */}
        {showAddForm && (
          <div className="bg-gray-50 rounded-xl p-4 mb-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hedef Metni</label>
                <input
                  type="text"
                  value={newGoal}
                  onChange={(e) => setNewGoal(e.target.value)}
                  placeholder="Hedefini yaz..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hedef Türü</label>
                <select
                  value={goalType}
                  onChange={(e) => setGoalType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-8"
                >
                  <option value="daily">Günlük</option>
                  <option value="weekly">Haftalık</option>
                  <option value="monthly">Aylık</option>
                  <option value="yearly">Yıllık</option>
                </select>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleAddGoal}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer whitespace-nowrap"
                >
                  Ekle
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors cursor-pointer whitespace-nowrap"
                >
                  İptal
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Goals List */}
        <div className="space-y-3">
          {goals.map((goal) => (
            <div key={goal.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-xl">
              <button
                onClick={() => toggleGoal(goal.id)}
                className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors cursor-pointer ${
                  goal.completed 
                    ? 'bg-green-500 border-green-500 text-white' 
                    : 'border-gray-300 hover:border-green-500'
                }`}
              >
                {goal.completed && <i className="ri-check-line text-xs"></i>}
              </button>
              
              <div className="flex-1">
                <p className={`text-gray-900 ${goal.completed ? 'line-through opacity-60' : ''}`}>
                  {goal.text}
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getTypeColor(goal.type)}`}>
                    {getTypeName(goal.type)}
                  </span>
                  <span className="text-xs text-gray-500">{goal.created_at}</span>
                </div>
              </div>

              <button
                onClick={() => deleteGoal(goal.id)}
                className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
              >
                <i className="ri-delete-bin-line"></i>
              </button>
            </div>
          ))}
        </div>

        {goals.length === 0 && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-target-line text-2xl text-gray-400"></i>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Henüz hedef yok</h3>
            <p className="text-gray-600">İlk hedefini ekleyerek başla!</p>
          </div>
        )}
      </div>
    </div>
  );
}
