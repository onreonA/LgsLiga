-- Direkt video ekleme script'i
-- Bu script'i Supabase SQL Editor'de çalıştırarak video ekleyebilirsiniz

-- Bugünün tarihi için video ekle
INSERT INTO public.daily_videos (
    date, 
    title, 
    video_id, 
    description, 
    is_active,
    created_at,
    updated_at
) VALUES (
    '2024-10-10',
    'Admin Tarafından Eklenen Test Video',
    'admin_direct_test_123',
    'Bu video admin paneli sorunu nedeniyle direkt SQL ile eklenmiştir.',
    true,
    NOW(),
    NOW()
);

-- Başarı mesajı
DO $$
BEGIN
    RAISE NOTICE '✅ Video başarıyla eklendi!';
    RAISE NOTICE '📹 Video ID: admin_direct_test_123';
    RAISE NOTICE '📅 Tarih: 2024-10-10';
    RAISE NOTICE '📝 Başlık: Admin Tarafından Eklenen Test Video';
END $$;
