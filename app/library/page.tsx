'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
}

interface Book {
  id: string;
  title: string;
  author: string;
  category_id: string;
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
  progress?: {
    current_page: number;
    status: string;
  };
}

export default function LibraryPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
    loadBooks();
  }, []);

  const loadCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('book_categories')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadBooks = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      // Fetch books with categories
      const { data: booksData, error: booksError } = await supabase
        .from('books')
        .select(`
          *,
          category:book_categories(name, color, icon)
        `)
        .eq('is_active', true)
        .order('title', { ascending: true });

      if (booksError) throw booksError;

      // If user is logged in, fetch their progress
      if (user) {
        const { data: progressData, error: progressError } = await supabase
          .from('user_book_progress')
          .select('book_id, current_page, status')
          .eq('user_id', user.id);

        if (!progressError && progressData) {
          const progressMap = new Map(
            progressData.map(p => [p.book_id, { current_page: p.current_page, status: p.status }])
          );

          const booksWithProgress = (booksData || []).map(book => ({
            ...book,
            progress: progressMap.get(book.id)
          }));

          setBooks(booksWithProgress);
        } else {
          setBooks(booksData || []);
        }
      } else {
        setBooks(booksData || []);
      }
    } catch (error) {
      console.error('Error loading books:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBooks = books.filter(book => {
    const matchesCategory = selectedCategory === 'all' || book.category_id === selectedCategory;
    const matchesSearch = 
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getStatusBadge = (status?: string) => {
    if (!status || status === 'not_started') return null;
    
    const badges = {
      reading: { text: 'Okunuyor', color: 'bg-blue-100 text-blue-600' },
      paused: { text: 'Duraklatıldı', color: 'bg-orange-100 text-orange-600' },
      completed: { text: 'Tamamlandı', color: 'bg-green-100 text-green-600' }
    };

    const badge = badges[status as keyof typeof badges];
    return badge ? (
      <span className={`absolute top-3 left-3 px-2 py-1 text-xs font-medium rounded-full ${badge.color}`}>
        {badge.text}
      </span>
    ) : null;
  };

  const getProgressPercentage = (book: Book) => {
    if (!book.progress || !book.progress.current_page) return 0;
    return Math.round((book.progress.current_page / book.total_pages) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dijital Kütüphane</h1>
          <p className="text-gray-600 mt-1">Kitaplarınızı keşfedin, okuyun ve değerlendirin</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-xl">
            <span className="font-bold">{books.length}</span>
            <span className="text-sm ml-1">Toplam Kitap</span>
          </div>
          <div className="bg-gradient-to-r from-green-500 to-teal-600 text-white px-4 py-2 rounded-xl">
            <span className="font-bold">{books.filter(b => b.progress?.status === 'reading').length}</span>
            <span className="text-sm ml-1">Okunuyor</span>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <i className="ri-search-line absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <input
                type="text"
                placeholder="Kitap veya yazar ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all ${
                selectedCategory === 'all'
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <i className="ri-apps-line mr-2"></i>
              Tümü
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all ${
                  selectedCategory === category.id
                    ? `${category.color} text-white`
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Books Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            {selectedCategory === 'all' ? 'Şu An Okuduklarım' : categories.find(c => c.id === selectedCategory)?.name}
          </h2>
          <span className="text-sm text-gray-600">{filteredBooks.length} kitap</span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-200 animate-pulse rounded-2xl h-96"></div>
            ))}
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-200">
            <i className="ri-book-line text-6xl text-gray-300 mb-4"></i>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Kitap Bulunamadı</h3>
            <p className="text-gray-600">Farklı bir kategori veya arama terimi deneyin.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredBooks.map((book) => {
              const percentage = getProgressPercentage(book);
              const colorClass = book.category?.color || 'bg-gray-500';
              
              return (
                <Link
                  key={book.id}
                  href={`/library/${book.id}`}
                  className="group"
                >
                  <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-xl transition-all duration-300 cursor-pointer">
                    {/* Cover Image */}
                    <div className="relative h-56 overflow-hidden">
                      {getStatusBadge(book.progress?.status)}
                      <div className={`absolute inset-0 ${colorClass} opacity-10`}></div>
                      <img
                        src={book.cover_image || '/placeholder-book.jpg'}
                        alt={book.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                        <div className="flex items-center text-white text-xs">
                          <i className="ri-book-line mr-1"></i>
                          <span>{book.total_pages} sayfa</span>
                          <span className="mx-2">•</span>
                          <span>{book.difficulty}</span>
                        </div>
                      </div>
                    </div>

                    {/* Book Info */}
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1 group-hover:text-blue-600 transition-colors">
                            {book.title}
                          </h3>
                          <p className="text-sm text-gray-600">{book.author}</p>
                        </div>
                      </div>

                      {/* Category Badge */}
                      {book.category && (
                        <div className="flex items-center mb-3">
                          <span className={`${colorClass} text-white text-xs px-2 py-1 rounded-full`}>
                            {book.category.icon} {book.category.name}
                          </span>
                        </div>
                      )}

                      {/* Progress Bar */}
                      {book.progress && book.progress.current_page > 0 && (
                        <div className="mb-3">
                          <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                            <span>Sayfa {book.progress.current_page}/{book.total_pages}</span>
                            <span className="font-semibold">{percentage}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`${colorClass} h-2 rounded-full transition-all`}
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      )}

                      {/* Action Button */}
                      <button className={`w-full ${colorClass} text-white py-2 rounded-xl font-medium hover:opacity-90 transition-all flex items-center justify-center`}>
                        {!book.progress || book.progress.status === 'not_started' ? (
                          <>
                            <i className="ri-play-circle-line mr-2"></i>
                            Okumaya Başla
                          </>
                        ) : book.progress.status === 'completed' ? (
                          <>
                            <i className="ri-check-line mr-2"></i>
                            Detayları Gör
                          </>
                        ) : (
                          <>
                            <i className="ri-book-open-line mr-2"></i>
                            Okumaya Devam Et
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Reading Status Sections */}
      {selectedCategory === 'all' && (
        <>
          {/* Duraklatılanlar */}
          {books.filter(b => b.progress?.status === 'paused').length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <i className="ri-pause-circle-line text-orange-500 mr-2"></i>
                Duraklatılanlar
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {books
                  .filter(b => b.progress?.status === 'paused')
                  .slice(0, 4)
                  .map(book => (
                    <div key={book.id} className="bg-orange-50 rounded-xl p-4 border border-orange-200">
                      <h3 className="font-semibold text-gray-900 mb-1">{book.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{book.author}</p>
                      <Link
                        href={`/library/${book.id}`}
                        className="text-sm text-orange-600 hover:text-orange-700 font-medium flex items-center"
                      >
                        Devam Et <i className="ri-arrow-right-line ml-1"></i>
                      </Link>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
