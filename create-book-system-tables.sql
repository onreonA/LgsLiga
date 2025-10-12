-- Kitap Okuma Sistemi Tabloları
-- Bu dosyayı Supabase Dashboard > SQL Editor'da çalıştırın

-- =====================================================
-- BOOK_PAGES TABLOSU (Kitap Sayfaları)
-- =====================================================

CREATE TABLE IF NOT EXISTS public.book_pages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    book_id UUID NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
    page_number INTEGER NOT NULL,
    content TEXT NOT NULL,
    summary TEXT, -- Sayfa özeti
    key_points TEXT[], -- Önemli noktalar
    vocabulary TEXT[], -- Yeni kelimeler
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(book_id, page_number)
);

-- İndeksler
CREATE INDEX IF NOT EXISTS idx_book_pages_book_id ON public.book_pages(book_id);
CREATE INDEX IF NOT EXISTS idx_book_pages_page_number ON public.book_pages(page_number);

-- =====================================================
-- BOOK_CHAPTERS TABLOSU (Kitap Bölümleri)
-- =====================================================

CREATE TABLE IF NOT EXISTS public.book_chapters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    book_id UUID NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
    chapter_number INTEGER NOT NULL,
    title TEXT NOT NULL,
    start_page INTEGER NOT NULL,
    end_page INTEGER NOT NULL,
    summary TEXT, -- Bölüm özeti
    key_themes TEXT[], -- Ana temalar
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(book_id, chapter_number)
);

-- İndeksler
CREATE INDEX IF NOT EXISTS idx_book_chapters_book_id ON public.book_chapters(book_id);
CREATE INDEX IF NOT EXISTS idx_book_chapters_chapter_number ON public.book_chapters(chapter_number);

-- =====================================================
-- BOOK_SUMMARY TABLOSU (Kitap Özetleri)
-- =====================================================

CREATE TABLE IF NOT EXISTS public.book_summary (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    book_id UUID NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
    summary_type TEXT NOT NULL CHECK (summary_type IN ('detailed', 'brief', 'chapter', 'character_analysis')),
    content TEXT NOT NULL,
    language TEXT NOT NULL DEFAULT 'tr',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(book_id, summary_type, language)
);

-- İndeksler
CREATE INDEX IF NOT EXISTS idx_book_summary_book_id ON public.book_summary(book_id);
CREATE INDEX IF NOT EXISTS idx_book_summary_type ON public.book_summary(summary_type);

-- =====================================================
-- BOOK_ANNOTATIONS TABLOSU (Kitap Notları)
-- =====================================================

CREATE TABLE IF NOT EXISTS public.book_annotations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    book_id UUID NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
    page_number INTEGER NOT NULL,
    annotation_type TEXT NOT NULL CHECK (annotation_type IN ('note', 'highlight', 'bookmark', 'question')),
    content TEXT NOT NULL,
    position_start INTEGER, -- Metin içinde başlangıç pozisyonu
    position_end INTEGER,   -- Metin içinde bitiş pozisyonu
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- İndeksler
CREATE INDEX IF NOT EXISTS idx_book_annotations_user_id ON public.book_annotations(user_id);
CREATE INDEX IF NOT EXISTS idx_book_annotations_book_id ON public.book_annotations(book_id);
CREATE INDEX IF NOT EXISTS idx_book_annotations_page_number ON public.book_annotations(page_number);

-- =====================================================
-- BOOK_READING_SESSIONS TABLOSU (Okuma Oturumları)
-- =====================================================

CREATE TABLE IF NOT EXISTS public.book_reading_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    book_id UUID NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
    session_date DATE NOT NULL DEFAULT CURRENT_DATE,
    pages_read INTEGER NOT NULL DEFAULT 0,
    reading_time_minutes INTEGER NOT NULL DEFAULT 0,
    mood TEXT CHECK (mood IN ('happy', 'focused', 'tired', 'excited')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- İndeksler
CREATE INDEX IF NOT EXISTS idx_book_reading_sessions_user_id ON public.book_reading_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_book_reading_sessions_book_id ON public.book_reading_sessions(book_id);
CREATE INDEX IF NOT EXISTS idx_book_reading_sessions_date ON public.book_reading_sessions(session_date);

-- =====================================================
-- Row Level Security (RLS) Policies
-- =====================================================

-- Book Pages - Herkes okuyabilir
ALTER TABLE public.book_pages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view book pages" ON public.book_pages
    FOR SELECT USING (true);

-- Book Chapters - Herkes okuyabilir
ALTER TABLE public.book_chapters ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view book chapters" ON public.book_chapters
    FOR SELECT USING (true);

-- Book Summary - Herkes okuyabilir
ALTER TABLE public.book_summary ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view book summary" ON public.book_summary
    FOR SELECT USING (true);

-- Book Annotations - Kullanıcılar sadece kendi notlarını görebilir
ALTER TABLE public.book_annotations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own annotations" ON public.book_annotations
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own annotations" ON public.book_annotations
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own annotations" ON public.book_annotations
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own annotations" ON public.book_annotations
    FOR DELETE USING (auth.uid() = user_id);

-- Book Reading Sessions - Kullanıcılar sadece kendi oturumlarını görebilir
ALTER TABLE public.book_reading_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own reading sessions" ON public.book_reading_sessions
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own reading sessions" ON public.book_reading_sessions
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own reading sessions" ON public.book_reading_sessions
    FOR UPDATE USING (auth.uid() = user_id);

-- =====================================================
-- Functions
-- =====================================================

-- Kitap sayfa sayısını güncelle
CREATE OR REPLACE FUNCTION update_book_total_pages()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.books 
    SET total_pages = (
        SELECT COALESCE(MAX(page_number), 0) 
        FROM public.book_pages 
        WHERE book_id = NEW.book_id
    ),
    updated_at = NOW()
    WHERE id = NEW.book_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger
DROP TRIGGER IF EXISTS trigger_update_book_total_pages ON public.book_pages;
CREATE TRIGGER trigger_update_book_total_pages
    AFTER INSERT OR UPDATE OR DELETE ON public.book_pages
    FOR EACH ROW EXECUTE FUNCTION update_book_total_pages();

-- =====================================================
-- Sample Data for Suç ve Ceza
-- =====================================================

-- Suç ve Ceza için örnek sayfalar ekle
INSERT INTO public.book_pages (book_id, page_number, content, summary, key_points) VALUES
(
    '3807e4cb-25a6-4349-bffe-683689097a05',
    1,
    'Temmuz ayının çok sıcak bir akşamında, Petersburg''da S. Sokağı''ndaki bir pansiyonun beşinci katında, genç bir adam yavaş yavaş merdivenleri çıkıyordu. Raskolnikov, üniversite öğrencisi, ama artık derslere gitmiyordu. Parasızlık yüzünden okulu bırakmıştı. Şimdi pansiyonda kalıyor, annesinden gelen azıcık parayla geçiniyordu. Bu akşam, özellikle sinirliydi. Kafasında bir plan vardı, ama henüz emin değildi.',
    'Raskolnikov''un pansiyona dönüşü ve iç dünyasındaki karışıklık',
    ARRAY['Raskolnikov''un karakteri', 'Parasızlık durumu', 'Gizli plan']
),
(
    '3807e4cb-25a6-4349-bffe-683689097a05',
    2,
    'Merdivenler karanlık ve nemliydi. Raskolnikov, her adımda kendi düşüncelerini dinliyordu. "Yapmalı mıyım?" sorusu sürekli kafasında dönüyordu. Üçüncü katta, Alyona Ivanovna''nın kapısının önünde durdu. Bu yaşlı kadın, tefecilik yapıyordu. Raskolnikov ona borçluydu, ama daha önemlisi, onun evinde değerli eşyalar olduğunu biliyordu.',
    'Raskolnikov''un tefeci kadının evine yaklaşması',
    ARRAY['Tefeci kadın', 'Borç durumu', 'Değerli eşyalar']
);

-- Suç ve Ceza için bölüm bilgileri
INSERT INTO public.book_chapters (book_id, chapter_number, title, start_page, end_page, summary, key_themes) VALUES
(
    '3807e4cb-25a6-4349-bffe-683689097a05',
    1,
    'Raskolnikov''un Kararı',
    1,
    50,
    'Raskolnikov''un tefeci kadını öldürme planını yapması ve ilk adımları',
    ARRAY['Ahlak', 'Suç', 'Psikoloji', 'Toplumsal adalet']
),
(
    '3807e4cb-25a6-4349-bffe-683689097a05',
    2,
    'Suçun İşlenmesi',
    51,
    100,
    'Raskolnikov''un tefeci kadını öldürmesi ve suçun işlenmesi',
    ARRAY['Suç', 'Şiddet', 'Pişmanlık', 'Korku']
);

-- Suç ve Ceza için detaylı özet
INSERT INTO public.book_summary (book_id, summary_type, content, language) VALUES
(
    '3807e4cb-25a6-4349-bffe-683689097a05',
    'detailed',
    'Suç ve Ceza, Fyodor Dostoyevski''nin 1866 yılında yazdığı psikolojik romandır. Eser, genç üniversite öğrencisi Raskolnikov''un, parasızlık ve umutsuzluk içinde bir tefeci kadını öldürmesi ve sonrasında yaşadığı psikolojik çöküntüyü konu alır.

Roman, insan psikolojisinin derinliklerine iner ve suç, ahlak, toplumsal adalet gibi temaları işler. Raskolnikov, kendini olağanüstü bir insan olarak görür ve bu nedenle toplumsal kuralları aşabileceğini düşünür. Ancak suç işledikten sonra yaşadığı pişmanlık ve korku, onu derin bir bunalıma sürükler.

Eser, 19. yüzyıl Rus toplumunun sosyal ve ekonomik sorunlarını da yansıtır. Petersburg''daki yoksul mahalleler, pansiyonlar ve tefeciler, dönemin toplumsal yapısını gösterir.

Roman, sadece bir suç hikayesi değil, aynı zamanda insan doğasının karmaşıklığını ve ahlaki ikilemleri ele alan derin bir psikolojik analizdir.',
    'tr'
),
(
    '3807e4cb-25a6-4349-bffe-683689097a05',
    'brief',
    'Genç üniversite öğrencisi Raskolnikov, parasızlık yüzünden bir tefeci kadını öldürür. Suç işledikten sonra yaşadığı pişmanlık ve korku, onu derin bir bunalıma sürükler. Roman, insan psikolojisinin derinliklerine iner ve suç, ahlak, toplumsal adalet gibi temaları işler.',
    'tr'
);

-- =====================================================
-- TypeScript Types için Database Schema
-- =====================================================

-- Bu kısım lib/supabase.ts dosyasına eklenecek:

/*
export type Database = {
  public: {
    Tables: {
      book_pages: {
        Row: {
          id: string;
          book_id: string;
          page_number: number;
          content: string;
          summary: string | null;
          key_points: string[] | null;
          vocabulary: string[] | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          book_id: string;
          page_number: number;
          content: string;
          summary?: string | null;
          key_points?: string[] | null;
          vocabulary?: string[] | null;
        };
        Update: {
          content?: string;
          summary?: string | null;
          key_points?: string[] | null;
          vocabulary?: string[] | null;
          updated_at?: string;
        };
      };
      book_chapters: {
        Row: {
          id: string;
          book_id: string;
          chapter_number: number;
          title: string;
          start_page: number;
          end_page: number;
          summary: string | null;
          key_themes: string[] | null;
          created_at: string;
        };
        Insert: {
          book_id: string;
          chapter_number: number;
          title: string;
          start_page: number;
          end_page: number;
          summary?: string | null;
          key_themes?: string[] | null;
        };
        Update: {
          title?: string;
          start_page?: number;
          end_page?: number;
          summary?: string | null;
          key_themes?: string[] | null;
        };
      };
      book_summary: {
        Row: {
          id: string;
          book_id: string;
          summary_type: 'detailed' | 'brief' | 'chapter' | 'character_analysis';
          content: string;
          language: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          book_id: string;
          summary_type: 'detailed' | 'brief' | 'chapter' | 'character_analysis';
          content: string;
          language?: string;
        };
        Update: {
          content?: string;
          updated_at?: string;
        };
      };
      book_annotations: {
        Row: {
          id: string;
          user_id: string;
          book_id: string;
          page_number: number;
          annotation_type: 'note' | 'highlight' | 'bookmark' | 'question';
          content: string;
          position_start: number | null;
          position_end: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          book_id: string;
          page_number: number;
          annotation_type: 'note' | 'highlight' | 'bookmark' | 'question';
          content: string;
          position_start?: number | null;
          position_end?: number | null;
        };
        Update: {
          content?: string;
          updated_at?: string;
        };
      };
      book_reading_sessions: {
        Row: {
          id: string;
          user_id: string;
          book_id: string;
          session_date: string;
          pages_read: number;
          reading_time_minutes: number;
          mood: 'happy' | 'focused' | 'tired' | 'excited' | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          user_id: string;
          book_id: string;
          session_date?: string;
          pages_read?: number;
          reading_time_minutes?: number;
          mood?: 'happy' | 'focused' | 'tired' | 'excited' | null;
          notes?: string | null;
        };
        Update: {
          pages_read?: number;
          reading_time_minutes?: number;
          mood?: 'happy' | 'focused' | 'tired' | 'excited' | null;
          notes?: string | null;
        };
      };
    };
  };
};
*/
