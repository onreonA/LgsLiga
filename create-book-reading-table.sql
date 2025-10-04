-- Book Reading Tablosu Oluşturma
-- Study-tracker sayfası için kitap okuma takibi

-- =====================================================
-- BOOK_READING TABLOSU
-- =====================================================

CREATE TABLE IF NOT EXISTS public.book_reading (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    book_name TEXT NOT NULL,
    total_pages INTEGER NOT NULL,
    pages_read_today INTEGER NOT NULL DEFAULT 0,
    remaining_pages INTEGER NOT NULL DEFAULT 0,
    reading_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- İndeksler (performans için)
CREATE INDEX IF NOT EXISTS idx_book_reading_user_id ON public.book_reading(user_id);
CREATE INDEX IF NOT EXISTS idx_book_reading_date ON public.book_reading(reading_date);
CREATE INDEX IF NOT EXISTS idx_book_reading_book_name ON public.book_reading(book_name);

-- Row Level Security (RLS)
ALTER TABLE public.book_reading ENABLE ROW LEVEL SECURITY;

-- Kullanıcılar kendi kitap kayıtlarını görebilir
CREATE POLICY "Users can view own book reading" ON public.book_reading
    FOR SELECT USING (auth.uid() = user_id);

-- Kullanıcılar kendi kitap kayıtlarını ekleyebilir
CREATE POLICY "Users can insert own book reading" ON public.book_reading
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Kullanıcılar kendi kitap kayıtlarını güncelleyebilir
CREATE POLICY "Users can update own book reading" ON public.book_reading
    FOR UPDATE USING (auth.uid() = user_id);

-- Kullanıcılar kendi kitap kayıtlarını silebilir
CREATE POLICY "Users can delete own book reading" ON public.book_reading
    FOR DELETE USING (auth.uid() = user_id);

-- =====================================================
-- Database Type'ı Güncelleme (TypeScript için)
-- =====================================================

-- Not: lib/supabase.ts dosyasına book_reading type'ı eklenmelidir

-- =====================================================
-- Başarıyla Tamamlandı!
-- =====================================================
SELECT '✅ Book reading tablosu başarıyla oluşturuldu!' AS message;
SELECT '📚 Artık kitap okuma takibi yapabilirsiniz.' AS info;

