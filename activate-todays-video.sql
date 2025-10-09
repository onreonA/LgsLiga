-- Bugünün videosunu aktif hale getir
UPDATE daily_videos 
SET is_active = true 
WHERE date = '2025-10-10';

-- Kontrol et
SELECT date, title, video_id, is_active 
FROM daily_videos 
WHERE date = '2025-10-10';
