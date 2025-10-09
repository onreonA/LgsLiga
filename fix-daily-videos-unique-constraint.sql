-- FIX: Remove unique constraint on date to allow multiple videos per day
-- Bu constraint her gün için sadece 1 video olmasını zorunlu kılıyordu
-- Artık aynı gün için birden fazla video eklenebilecek

-- 1. Mevcut unique constraint'i kaldır
ALTER TABLE daily_videos 
DROP CONSTRAINT IF EXISTS daily_videos_date_key;

-- 2. Index'i koruyalım ama unique olmasın (performans için)
DROP INDEX IF EXISTS daily_videos_date_idx;
CREATE INDEX IF NOT EXISTS daily_videos_date_idx ON daily_videos(date);

-- 3. Kontrol
SELECT 
    conname as constraint_name,
    contype as constraint_type
FROM pg_constraint
WHERE conrelid = 'daily_videos'::regclass
ORDER BY conname;

-- Başarılı mesaj
DO $$ 
BEGIN 
    RAISE NOTICE '✅ Unique constraint kaldırıldı! Artık aynı gün için birden fazla video eklenebilir.';
END $$;

