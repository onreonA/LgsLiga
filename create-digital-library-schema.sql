-- ================================================
-- Dijital Kütüphane Database Schema
-- ================================================
-- Bu script dijital kütüphane için gerekli tüm tabloları oluşturur

-- 1. Kitap Kategorileri Tablosu
CREATE TABLE IF NOT EXISTS public.book_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  color VARCHAR(50) NOT NULL, -- Tailwind rengi (bg-purple-500, bg-blue-500, vb.)
  icon VARCHAR(50) NOT NULL, -- Emoji veya icon class
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Kitaplar Tablosu
CREATE TABLE IF NOT EXISTS public.books (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL,
  category_id UUID REFERENCES public.book_categories(id) ON DELETE SET NULL,
  description TEXT,
  total_pages INTEGER NOT NULL,
  cover_image TEXT, -- URL veya path
  difficulty VARCHAR(50) NOT NULL, -- Kolay, Orta, Zor, Çok Zor, Uzman
  age_range VARCHAR(50) NOT NULL, -- örn: "8-12", "12-16", "16+"
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Kullanıcı Kitap İlerlemesi Tablosu
CREATE TABLE IF NOT EXISTS public.user_book_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  book_id UUID REFERENCES public.books(id) ON DELETE CASCADE NOT NULL,
  current_page INTEGER DEFAULT 0,
  status VARCHAR(50) NOT NULL DEFAULT 'not_started', -- not_started, reading, paused, completed
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  reading_time INTEGER DEFAULT 0, -- Toplam okuma süresi (saniye)
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, book_id)
);

-- 4. Kitap Değerlendirmeleri Tablosu
CREATE TABLE IF NOT EXISTS public.book_reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  book_id UUID REFERENCES public.books(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  summary TEXT NOT NULL, -- Zorunlu özet (min 100 kelime)
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, book_id)
);

-- 5. Kitap Notları Tablosu
CREATE TABLE IF NOT EXISTS public.book_notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  book_id UUID REFERENCES public.books(id) ON DELETE CASCADE NOT NULL,
  page_number INTEGER NOT NULL,
  note_text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Favori Alıntılar Tablosu
CREATE TABLE IF NOT EXISTS public.book_quotes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  book_id UUID REFERENCES public.books(id) ON DELETE CASCADE NOT NULL,
  quote_text TEXT NOT NULL,
  page_number INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================
-- Row Level Security (RLS) Policies
-- ================================================

-- Enable RLS
ALTER TABLE public.book_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_book_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.book_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.book_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.book_quotes ENABLE ROW LEVEL SECURITY;

-- book_categories policies (herkes okuyabilir, sadece admin yazabilir)
CREATE POLICY "Everyone can view categories" ON public.book_categories FOR SELECT USING (true);
CREATE POLICY "Admin can manage categories" ON public.book_categories FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- books policies (herkes aktif kitapları görebilir, sadece admin yönetir)
CREATE POLICY "Everyone can view active books" ON public.books FOR SELECT USING (is_active = true OR EXISTS (
  SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
));
CREATE POLICY "Admin can manage books" ON public.books FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- user_book_progress policies (kullanıcı sadece kendi kayıtlarını görebilir)
CREATE POLICY "Users can view own progress" ON public.user_book_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own progress" ON public.user_book_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own progress" ON public.user_book_progress FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own progress" ON public.user_book_progress FOR DELETE USING (auth.uid() = user_id);

-- book_reviews policies (kullanıcı sadece kendi değerlendirmelerini yönetir)
CREATE POLICY "Users can view own reviews" ON public.book_reviews FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own reviews" ON public.book_reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own reviews" ON public.book_reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own reviews" ON public.book_reviews FOR DELETE USING (auth.uid() = user_id);

-- book_notes policies (kullanıcı sadece kendi notlarını yönetir)
CREATE POLICY "Users can view own notes" ON public.book_notes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own notes" ON public.book_notes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own notes" ON public.book_notes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own notes" ON public.book_notes FOR DELETE USING (auth.uid() = user_id);

-- book_quotes policies (kullanıcı sadece kendi alıntılarını yönetir)
CREATE POLICY "Users can view own quotes" ON public.book_quotes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own quotes" ON public.book_quotes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own quotes" ON public.book_quotes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own quotes" ON public.book_quotes FOR DELETE USING (auth.uid() = user_id);

-- ================================================
-- Örnek Kategoriler ve Kitaplar
-- ================================================

-- Kategorileri ekle
INSERT INTO public.book_categories (name, color, icon, order_index) VALUES
('Roman', 'bg-purple-500', '📖', 1),
('Bilim', 'bg-blue-500', '🔬', 2),
('Tarih', 'bg-orange-500', '📜', 3),
('Fantastik', 'bg-violet-500', '⚡', 4),
('Eğitim', 'bg-green-500', '🎓', 5),
('Çocuk', 'bg-pink-500', '🧸', 6)
ON CONFLICT (name) DO NOTHING;

-- Örnek kitaplar ekle
DO $$
DECLARE
  roman_id UUID;
  bilim_id UUID;
  fantastik_id UUID;
BEGIN
  -- Kategori ID'lerini al
  SELECT id INTO roman_id FROM public.book_categories WHERE name = 'Roman' LIMIT 1;
  SELECT id INTO bilim_id FROM public.book_categories WHERE name = 'Bilim' LIMIT 1;
  SELECT id INTO fantastik_id FROM public.book_categories WHERE name = 'Fantastik' LIMIT 1;

  -- Örnek kitaplar
  INSERT INTO public.books (title, author, category_id, description, total_pages, cover_image, difficulty, age_range, is_active) VALUES
  (
    'Simyacı', 
    'Paulo Coelho', 
    roman_id,
    'Hayallerinin peşinden giden bir çobanın hikayesi. Kişisel efsane kavramını anlatan muhteşem bir eser.',
    163,
    'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400',
    'Zor',
    '12-18',
    true
  ),
  (
    'Sapiens', 
    'Yuval Noah Harari', 
    bilim_id,
    'İnsanlığın kısa tarihi. Homo sapiens''in dünyayı nasıl ele geçirdiğini anlatan çok satan bilim kitabı.',
    512,
    'https://images.unsplash.com/photo-1589998059171-988d887df646?w=400',
    'Çok Zor',
    '16+',
    true
  ),
  (
    'Harry Potter ve Felsefe Taşı', 
    'J.K. Rowling', 
    fantastik_id,
    'Genç büyücü Harry Potter''ın Hogwarts macerası başlıyor!',
    309,
    'https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=400',
    'Zor',
    '10-16',
    true
  ),
  (
    'Küçük Prens', 
    'Antoine de Saint-Exupéry', 
    roman_id,
    'Bir pilot çölde düşer ve küçük bir prensle tanışır. Felsefi ve duygusal bir başyapıt.',
    96,
    'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400',
    'Orta',
    '8-16',
    true
  ),
  (
    'Matematik Olimpiyatları', 
    'Prof. Dr. Ali Nesin', 
    bilim_id,
    'Matematik problemleri ve çözümleri. Olimpiyat seviyesi matematik konularını içerir.',
    256,
    'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400',
    'Çok Zor',
    '14-18',
    true
  ),
  (
    'Suç ve Ceza', 
    'Fyodor Dostoyevski', 
    roman_id,
    'Klasik Rus edebiyatının başyapıtı. İnsan psikolojisinin derinliklerine inen bir roman.',
    671,
    'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400',
    'Uzman',
    '16+',
    true
  );

  RAISE NOTICE '✅ Dijital Kütüphane tabloları başarıyla oluşturuldu!';
  RAISE NOTICE '✅ 6 kategori ve 6 örnek kitap eklendi!';
END $$;
