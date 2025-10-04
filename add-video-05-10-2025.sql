-- 05.10.2025 Tarihli Video Ekle
-- Video ID: NYOIoxH-Qoo

INSERT INTO public.daily_videos (date, title, video_id, description, is_active)
VALUES 
    ('2025-10-05', 'Günün Motivasyon Videosu', 'NYOIoxH-Qoo', 'Bugün kendini motive edecek özel bir video!', true)
ON CONFLICT (date) DO UPDATE SET
    title = EXCLUDED.title,
    video_id = EXCLUDED.video_id,
    description = EXCLUDED.description,
    is_active = EXCLUDED.is_active,
    updated_at = NOW();

-- Başarı mesajı
DO $$
BEGIN
    RAISE NOTICE '✅ 05.10.2025 tarihli video başarıyla eklendi!';
    RAISE NOTICE '📹 Video ID: NYOIoxH-Qoo';
END $$;

