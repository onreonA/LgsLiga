-- ================================================
-- Dijital Kütüphane Database Test Script
-- ================================================
-- Bu script tüm tabloların doğru oluşturulduğunu kontrol eder

-- 1. Tabloları kontrol et
DO $$
DECLARE
  table_count INTEGER;
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE '📊 DATABASE TABLOLARI KONTROLU';
  RAISE NOTICE '========================================';
  
  -- book_categories
  SELECT COUNT(*) INTO table_count FROM information_schema.tables 
  WHERE table_schema = 'public' AND table_name = 'book_categories';
  IF table_count > 0 THEN
    RAISE NOTICE '✅ book_categories tablosu mevcut';
  ELSE
    RAISE NOTICE '❌ book_categories tablosu bulunamadi';
  END IF;
  
  -- books
  SELECT COUNT(*) INTO table_count FROM information_schema.tables 
  WHERE table_schema = 'public' AND table_name = 'books';
  IF table_count > 0 THEN
    RAISE NOTICE '✅ books tablosu mevcut';
  ELSE
    RAISE NOTICE '❌ books tablosu bulunamadi';
  END IF;
  
  -- user_book_progress
  SELECT COUNT(*) INTO table_count FROM information_schema.tables 
  WHERE table_schema = 'public' AND table_name = 'user_book_progress';
  IF table_count > 0 THEN
    RAISE NOTICE '✅ user_book_progress tablosu mevcut';
  ELSE
    RAISE NOTICE '❌ user_book_progress tablosu bulunamadi';
  END IF;
  
  -- book_reviews
  SELECT COUNT(*) INTO table_count FROM information_schema.tables 
  WHERE table_schema = 'public' AND table_name = 'book_reviews';
  IF table_count > 0 THEN
    RAISE NOTICE '✅ book_reviews tablosu mevcut';
  ELSE
    RAISE NOTICE '❌ book_reviews tablosu bulunamadi';
  END IF;
  
  -- book_notes
  SELECT COUNT(*) INTO table_count FROM information_schema.tables 
  WHERE table_schema = 'public' AND table_name = 'book_notes';
  IF table_count > 0 THEN
    RAISE NOTICE '✅ book_notes tablosu mevcut';
  ELSE
    RAISE NOTICE '❌ book_notes tablosu bulunamadi';
  END IF;
  
  -- book_quotes
  SELECT COUNT(*) INTO table_count FROM information_schema.tables 
  WHERE table_schema = 'public' AND table_name = 'book_quotes';
  IF table_count > 0 THEN
    RAISE NOTICE '✅ book_quotes tablosu mevcut';
  ELSE
    RAISE NOTICE '❌ book_quotes tablosu bulunamadi';
  END IF;
END $$;

-- 2. Veri kontrolü
DO $$
DECLARE
  cat_count INTEGER;
  book_count INTEGER;
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE '📚 VERI KONTROLU';
  RAISE NOTICE '========================================';
  
  SELECT COUNT(*) INTO cat_count FROM public.book_categories;
  RAISE NOTICE '📂 Kategori sayisi: %', cat_count;
  
  SELECT COUNT(*) INTO book_count FROM public.books;
  RAISE NOTICE '📖 Kitap sayisi: %', book_count;
END $$;

-- 3. Kategorileri listele
SELECT 
  name as "Kategori",
  icon as "Icon",
  color as "Renk",
  order_index as "Sira"
FROM public.book_categories
ORDER BY order_index;

-- 4. Kitapları listele
SELECT 
  b.title as "Kitap",
  b.author as "Yazar",
  c.name as "Kategori",
  b.total_pages as "Sayfa",
  b.difficulty as "Zorluk",
  b.age_range as "Yas",
  b.is_active as "Aktif"
FROM public.books b
LEFT JOIN public.book_categories c ON b.category_id = c.id
ORDER BY b.title;

RAISE NOTICE '========================================';
RAISE NOTICE '✅ Database kontrolu tamamlandi!';
RAISE NOTICE '========================================';
