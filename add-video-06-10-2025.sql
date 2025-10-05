-- ================================================
-- 06.10.2025 Tarihli Video Ekleme
-- ================================================
-- Video: Çalışma İsteğinizi Geri Getirecek Motivasyon Videosu!
-- Link: https://www.youtube.com/watch?v=RaS51sG3b50

-- Video ekle (eğer tarih mevcutsa güncelle)
INSERT INTO public.daily_videos (date, title, video_id, description, is_active)
VALUES (
  '2025-10-06',
  'Çalışma İsteğinizi Geri Getirecek Motivasyon Videosu!',
  'RaS51sG3b50',
  'Seni çok seviyorum kızımmmm...',
  true
)
ON CONFLICT (date) 
DO UPDATE SET
  title = EXCLUDED.title,
  video_id = EXCLUDED.video_id,
  description = EXCLUDED.description,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();

-- Kontrol: Video eklendiğini doğrula
DO $$
DECLARE
  video_count INTEGER;
  video_title TEXT;
BEGIN
  SELECT COUNT(*), MAX(title) INTO video_count, video_title
  FROM public.daily_videos
  WHERE date = '2025-10-06';
  
  IF video_count > 0 THEN
    RAISE NOTICE '✅ Video başarıyla eklendi!';
    RAISE NOTICE '📅 Tarih: 06.10.2025';
    RAISE NOTICE '🎬 Başlık: %', video_title;
    RAISE NOTICE '🆔 Video ID: RaS51sG3b50';
  ELSE
    RAISE NOTICE '❌ Video eklenemedi!';
  END IF;
END $$;

-- Tüm videoları listele
SELECT 
  to_char(date, 'DD.MM.YYYY') as "Tarih",
  title as "Başlık",
  video_id as "Video ID",
  CASE WHEN is_active THEN 'Aktif' ELSE 'Pasif' END as "Durum"
FROM public.daily_videos
ORDER BY date DESC
LIMIT 10;
