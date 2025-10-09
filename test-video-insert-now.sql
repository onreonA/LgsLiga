-- ŞİMDİ TEST EDİLECEK: Video ekleme işlemi
-- Bu script'i Supabase SQL Editor'de çalıştırın

-- 1. Mevcut durumu kontrol et
SELECT 
    'Mevcut video sayısı' as info,
    COUNT(*) as count
FROM public.daily_videos;

-- 2. Son 5 videoyu göster
SELECT 
    'Son videolar' as info,
    id, date, title, video_id, is_active, created_at
FROM public.daily_videos 
ORDER BY created_at DESC 
LIMIT 5;

-- 3. Admin kullanıcısını kontrol et
SELECT 
    'Admin kullanıcı' as info,
    u.email,
    p.role,
    u.id as user_id
FROM auth.users u
JOIN public.profiles p ON u.id = p.id
WHERE p.role = 'admin'
LIMIT 1;

-- 4. RLS policy'lerini kontrol et
SELECT 
    'RLS Policy' as info,
    policyname, cmd, with_check
FROM pg_policies 
WHERE tablename = 'daily_videos';

-- 5. Test video ekle (admin olarak)
DO $$
DECLARE
    test_video_id UUID;
    admin_user_id UUID;
BEGIN
    -- Admin kullanıcısını bul
    SELECT p.id INTO admin_user_id
    FROM public.profiles p
    WHERE p.role = 'admin'
    LIMIT 1;
    
    IF admin_user_id IS NOT NULL THEN
        RAISE NOTICE '✅ Admin kullanıcı bulundu: %', admin_user_id;
        
        -- Test video ekle
        INSERT INTO public.daily_videos (
            date, title, video_id, description, is_active
        ) VALUES (
            CURRENT_DATE, 
            'TEST VIDEO - Admin Eklendi', 
            'test_admin_' || EXTRACT(EPOCH FROM NOW())::INT, 
            'Bu video admin testi için eklenmiştir. Tarih: ' || NOW(),
            true
        ) RETURNING id INTO test_video_id;
        
        RAISE NOTICE '✅ Test video başarıyla eklendi!';
        RAISE NOTICE '📹 Video ID: %', test_video_id;
        RAISE NOTICE '📅 Tarih: %', CURRENT_DATE;
        RAISE NOTICE '📝 Başlık: TEST VIDEO - Admin Eklendi';
        
        -- Video ID'yi döndür
        PERFORM test_video_id;
        
    ELSE
        RAISE NOTICE '❌ Admin kullanıcı bulunamadı!';
    END IF;
END $$;

-- 6. Sonuç kontrolü
SELECT 
    'Test sonrası video sayısı' as info,
    COUNT(*) as count
FROM public.daily_videos;

-- 7. Son eklenen videoyu göster
SELECT 
    'Son eklenen video' as info,
    id, date, title, video_id, description, is_active, created_at
FROM public.daily_videos 
ORDER BY created_at DESC 
LIMIT 1;

-- Final mesajı
DO $$
BEGIN
    RAISE NOTICE '🎬 Video ekleme testi tamamlandı!';
    RAISE NOTICE '📝 Şimdi admin panelinden video eklemeyi deneyin!';
    RAISE NOTICE '🔍 Console loglarını kontrol edin!';
END $$;
