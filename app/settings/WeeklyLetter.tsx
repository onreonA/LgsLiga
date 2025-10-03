
'use client';

import { useState } from 'react';

const mockLetters = [
  {
    id: '1',
    letter_content: 'Bu hafta matematik konularında gerçekten ilerleme kaydettiğimi hissediyorum. Cebir artık eskisi kadar zor gelmiyor. Önümüzdeki hafta geometriye daha çok odaklanmak istiyorum.',
    week_number: 3,
    year: 2024,
    created_at: '2024-01-15'
  },
  {
    id: '2',
    letter_content: 'Geçen haftaki hedeflerimin çoğunu gerçekleştirdim. Özellikle Türkçe paragraf sorularında kendimi geliştirdiğimi görüyorum. Bu motivasyonumu korumalıyım.',
    week_number: 2,
    year: 2024,
    created_at: '2024-01-08'
  }
];

export default function WeeklyLetter() {
  const [letters, setLetters] = useState(mockLetters);
  const [showWriteForm, setShowWriteForm] = useState(false);
  const [newLetter, setNewLetter] = useState('');

  const getCurrentWeek = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const days = Math.floor((now - start) / (24 * 60 * 60 * 1000));
    return Math.ceil((days + start.getDay() + 1) / 7);
  };

  const handleWriteLetter = () => {
    if (newLetter.trim()) {
      const letter = {
        id: Date.now().toString(),
        letter_content: newLetter,
        week_number: getCurrentWeek(),
        year: new Date().getFullYear(),
        created_at: new Date().toISOString().split('T')[0]
      };
      setLetters([letter, ...letters]);
      setNewLetter('');
      setShowWriteForm(false);
    }
  };

  const deleteLetter = (letterId: string) => {
    setLetters(letters.filter(letter => letter.id !== letterId));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Kendime Mektuplar</h3>
            <p className="text-sm text-gray-600">Her hafta kendine bir mektup yaz, ilerlemeni takip et</p>
          </div>
          <button
            onClick={() => setShowWriteForm(!showWriteForm)}
            className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors cursor-pointer whitespace-nowrap"
          >
            <i className="ri-mail-line w-4 h-4 mr-2"></i>
            Bu Haftanın Mektubu
          </button>
        </div>

        {/* Write Form */}
        {showWriteForm && (
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 mb-6 border border-purple-200">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center mr-3">
                <i className="ri-quill-pen-line text-white text-lg"></i>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">
                  {new Date().getFullYear()} - {getCurrentWeek()}. Hafta Mektubu
                </h4>
                <p className="text-sm text-gray-600">{new Date().toLocaleDateString('tr-TR', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</p>
              </div>
            </div>
            
            <textarea
              value={newLetter}
              onChange={(e) => setNewLetter(e.target.value)}
              placeholder="Sevgili ben,&#10;&#10;Bu hafta nasıl geçti? Hangi başarıları elde ettin? Kendini nasıl hissediyorsun?&#10;&#10;Önümüzdeki hafta için planların neler?&#10;&#10;Kendine güven ve devam et!&#10;&#10;Sevgilerle,&#10;Bugünkü ben ❤️"
              rows={8}
              maxLength={500}
              className="w-full px-4 py-3 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none bg-white"
            />
            <div className="flex items-center justify-between mt-3">
              <div className="text-xs text-gray-500">{newLetter.length}/500 karakter</div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowWriteForm(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors cursor-pointer whitespace-nowrap"
                >
                  İptal
                </button>
                <button
                  onClick={handleWriteLetter}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors cursor-pointer whitespace-nowrap"
                >
                  Mektubu Kaydet
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Letters List */}
        <div className="space-y-4">
          {letters.map((letter) => (
            <div key={letter.id} className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                    <i className="ri-mail-line text-white text-sm"></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {letter.year} - {letter.week_number}. Hafta
                    </h4>
                    <p className="text-sm text-gray-600">{letter.created_at}</p>
                  </div>
                </div>
                <button
                  onClick={() => deleteLetter(letter.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                >
                  <i className="ri-delete-bin-line"></i>
                </button>
              </div>
              
              <div className="bg-white/70 rounded-lg p-4">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{letter.letter_content}</p>
              </div>
            </div>
          ))}
        </div>

        {letters.length === 0 && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-mail-line text-2xl text-gray-400"></i>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Henüz mektup yok</h3>
            <p className="text-gray-600">Bu haftanın mektubunu yazarak başla!</p>
          </div>
        )}
      </div>
    </div>
  );
}
