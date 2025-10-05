-- ================================================
-- LGS Sınav Formatı için Database Güncelleme
-- ================================================
-- Bu script exams tablosuna subject_scores kolonu ekler
-- Her ders için doğru/yanlış/boş sayılarını JSON formatında saklar

-- Yeni kolon ekle
ALTER TABLE public.exams 
ADD COLUMN IF NOT EXISTS subject_scores JSONB;

-- Açıklama ekle
COMMENT ON COLUMN public.exams.subject_scores IS 'Her ders için sınav sonuçları: {"Türkçe": {"correct": 8, "wrong": 2, "empty": 0}, ...}';

-- Örnek veri yapısı:
-- {
--   "Türkçe": { "correct": 8, "wrong": 2, "empty": 0 },
--   "Tarih": { "correct": 7, "wrong": 2, "empty": 1 },
--   "Din Kültürü": { "correct": 9, "wrong": 1, "empty": 0 },
--   "İngilizce": { "correct": 8, "wrong": 1, "empty": 1 },
--   "Matematik": { "correct": 15, "wrong": 4, "empty": 1 },
--   "Fen": { "correct": 16, "wrong": 3, "empty": 1 }
-- }

-- Test: Yeni kolon kontrolü
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'exams' 
      AND column_name = 'subject_scores'
  ) THEN
    RAISE NOTICE '✅ subject_scores kolonu başarıyla eklendi!';
  ELSE
    RAISE EXCEPTION '❌ subject_scores kolonu eklenemedi!';
  END IF;
END $$;
