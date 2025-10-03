'use client';

import { useState } from 'react';
import { FAMILY_MESSAGES } from '../../lib/constants';

const mockMessages = [
  ...FAMILY_MESSAGES.support.slice(0, 3).map((msg, index) => ({
    id: `demo_${index + 1}`,
    sender_name: msg.sender,
    message: msg.message,
    message_type: msg.type,
    created_at: new Date(Date.now() - (index + 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    is_active: true
  })),
  {
    id: '4',
    sender_name: 'Dede',
    message: FAMILY_MESSAGES.reminders[0].message,
    message_type: 'reminder',
    created_at: '2024-01-08',
    is_active: false
  }
];

export default function FamilyMessages() {
  const [messages, setMessages] = useState(mockMessages);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMessage, setNewMessage] = useState({
    sender_name: '',
    message: '',
    message_type: 'motivation'
  });

  const handleAddMessage = () => {
    if (newMessage.sender_name.trim() && newMessage.message.trim()) {
      const message = {
        id: Date.now().toString(),
        ...newMessage,
        created_at: new Date().toISOString().split('T')[0],
        is_active: true
      };
      setMessages([message, ...messages]);
      setNewMessage({ sender_name: '', message: '', message_type: 'motivation' });
      setShowAddForm(false);
    }
  };

  const toggleMessage = (messageId: string) => {
    setMessages(messages.map(msg => 
      msg.id === messageId 
        ? { ...msg, is_active: !msg.is_active }
        : msg
    ));
  };

  const deleteMessage = (messageId: string) => {
    setMessages(messages.filter(msg => msg.id !== messageId));
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'motivation': return 'bg-blue-100 text-blue-700';
      case 'congratulation': return 'bg-green-100 text-green-700';
      case 'reminder': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'motivation': return 'ri-heart-line';
      case 'congratulation': return 'ri-trophy-line';
      case 'reminder': return 'ri-alarm-line';
      default: return 'ri-message-line';
    }
  };

  const getTypeName = (type: string) => {
    switch (type) {
      case 'motivation': return 'Motivasyon';
      case 'congratulation': return 'Tebrik';
      case 'reminder': return 'Hatırlatma';
      default: return type;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Aile Mesajları</h3>
            <p className="text-sm text-gray-600">Ailenin sana olan desteğini hissettiren mesajlar</p>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center px-4 py-2 bg-pink-600 text-white rounded-xl hover:bg-pink-700 transition-colors cursor-pointer whitespace-nowrap"
          >
            <i className="ri-add-line w-4 h-4 mr-2"></i>
            Mesaj Ekle
          </button>
        </div>

        {/* Add Form */}
        {showAddForm && (
          <div className="bg-gray-50 rounded-xl p-4 mb-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gönderen</label>
                <input
                  type="text"
                  value={newMessage.sender_name}
                  onChange={(e) => setNewMessage({ ...newMessage, sender_name: e.target.value })}
                  placeholder="Anne, Baba, Abla, vb."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mesaj</label>
                <textarea
                  value={newMessage.message}
                  onChange={(e) => setNewMessage({ ...newMessage, message: e.target.value })}
                  placeholder="Motivasyon mesajını yaz..."
                  rows={3}
                  maxLength={500}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 resize-none"
                />
                <div className="text-xs text-gray-500 mt-1">{newMessage.message.length}/500 karakter</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mesaj Türü</label>
                <select
                  value={newMessage.message_type}
                  onChange={(e) => setNewMessage({ ...newMessage, message_type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 pr-8"
                >
                  <option value="motivation">Motivasyon</option>
                  <option value="congratulation">Tebrik</option>
                  <option value="reminder">Hatırlatma</option>
                </select>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleAddMessage}
                  className="flex-1 bg-pink-600 text-white py-2 rounded-lg hover:bg-pink-700 transition-colors cursor-pointer whitespace-nowrap"
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

        {/* Messages List */}
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`p-4 rounded-xl border-l-4 ${message.is_active ? 'bg-white border-l-pink-500 shadow-sm' : 'bg-gray-50 border-l-gray-300 opacity-60'}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getTypeColor(message.message_type)}`}>
                    <i className={`${getTypeIcon(message.message_type)} text-sm`}></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{message.sender_name}</h4>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getTypeColor(message.message_type)}`}>
                        {getTypeName(message.message_type)}
                      </span>
                      <span className="text-xs text-gray-500">{message.created_at}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleMessage(message.id)}
                    className={`text-sm px-3 py-1 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                      message.is_active 
                        ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' 
                        : 'bg-green-100 text-green-600 hover:bg-green-200'
                    }`}
                  >
                    {message.is_active ? 'Pasifleştir' : 'Aktifleştir'}
                  </button>
                  <button
                    onClick={() => deleteMessage(message.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                  >
                    <i className="ri-delete-bin-line"></i>
                  </button>
                </div>
              </div>
              
              <p className="text-gray-700 leading-relaxed">{message.message}</p>
            </div>
          ))}
        </div>

        {messages.length === 0 && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-heart-line text-2xl text-gray-400"></i>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Henüz mesaj yok</h3>
            <p className="text-gray-600">İlk aile mesajını ekleyerek başla!</p>
          </div>
        )}
      </div>
    </div>
  );
}