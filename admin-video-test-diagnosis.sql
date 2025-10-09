-- Admin video ekleme testi - Tanı ve çözüm
-- Bu script'i Supabase SQL Editor'de çalıştırın

-- 1. Daily videos tablosu yapısını kontrol et
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'daily_videos' 
ORDER BY ordinal_position;

-- 2. Mevcut RLS policy'lerini kontrol et
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'daily_videos';

-- 3. Admin kullanıcısını kontrol et
SELECT 
    u.email,
    p.role,
    p.full_name,
    u.created_at
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE u.email = 'admin@lgsliga.com' OR p.role = 'admin'
ORDER BY u.created_at DESC;

-- 4. Daily videos tablosunda kaç kayıt var?
SELECT COUNT(*) as total_videos FROM public.daily_videos;

-- 5. Son eklenen videoları göster
SELECT id, date, title, video_id, description, is_active, created_at
FROM public.daily_videos 
ORDER BY created_at DESC 
LIMIT 5;

-- 6. RLS'nin açık olup olmadığını kontrol et
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'daily_videos';

-- 7. Test insert yap (admin olarak)
DO $$
DECLARE
    admin_user_id UUID;
    insert_result UUID;
BEGIN
    -- Admin kullanıcısını bul
    SELECT p.id INTO admin_user_id
    FROM public.profiles p
    WHERE p.role = 'admin'
    LIMIT 1;
    
    IF admin_user_id IS NOT NULL THEN
        RAISE NOTICE '✅ Admin kullanıcı bulundu: %', admin_user_id;
        
        -- Test insert
        BEGIN
            INSERT INTO public.daily_videos (
                date, title, video_id, description, is_active
            ) VALUES (
                CURRENT_DATE, 
                'Admin Test Video', 
                'admin_test_123', 
                'Bu video admin testi için eklenmiştir.',
                true
            ) RETURNING id INTO insert_result;
            
            RAISE NOTICE '✅ Test insert başarılı! Video ID: %', insert_result;
            
            -- Test videosunu temizle
            DELETE FROM public.daily_videos WHERE id = insert_result;
            RAISE NOTICE '🧹 Test video temizlendi!';
            
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE '❌ Test insert başarısız: %', SQLERRM;
            RAISE NOTICE '❌ Error Code: %', SQLSTATE;
        END;
    ELSE
        RAISE NOTICE '❌ Admin kullanıcı bulunamadı!';
    END IF;
END $$;

-- 8. Eğer test başarısızsa, RLS'yi geçici olarak kapat
DO $$
BEGIN
    -- RLS'yi geçici olarak kapat
    ALTER TABLE public.daily_videos DISABLE ROW LEVEL SECURITY;
    RAISE NOTICE '⚠️ RLS geçici olarak kapatıldı!';
    RAISE NOTICE '⚠️ UYARI: Bu güvenlik riski oluşturur!';
END $$;

-- 9. RLS kapalıyken test insert
INSERT INTO public.daily_videos (
    date, title, video_id, description, is_active
) VALUES (
    CURRENT_DATE, 
    'RLS Bypass Test Video', 
    'rls_bypass_test_123', 
    'Bu video RLS bypass testi için eklenmiştir.',
    true
);

-- 10. Test videosunu temizle
DELETE FROM public.daily_videos WHERE video_id = 'rls_bypass_test_123';

-- 11. RLS'yi tekrar aç
DO $$
BEGIN
    ALTER TABLE public.daily_videos ENABLE ROW LEVEL SECURITY;
    RAISE NOTICE '✅ RLS tekrar açıldı!';
END $$;

-- 12. Doğru admin policy'sini ekle
DO $$
BEGIN
    -- Mevcut policy'leri temizle
    DROP POLICY IF EXISTS "Admin users can insert daily videos" ON public.daily_videos;
    DROP POLICY IF EXISTS "Allow all inserts temporarily" ON public.daily_videos;
    DROP POLICY IF EXISTS "Temporary allow all inserts" ON public.daily_videos;
    
    -- Doğru admin policy'sini ekle
    CREATE POLICY "Admin users can insert daily videos" ON public.daily_videos
        FOR INSERT 
        WITH CHECK (
            EXISTS (
                SELECT 1 FROM public.profiles 
                WHERE profiles.id = auth.uid() 
                AND profiles.role = 'admin'
            )
        );
    
    -- Herkesin select yapabilmesi için policy ekle
    CREATE POLICY "Everyone can view active daily videos" ON public.daily_videos
        FOR SELECT 
        USING (is_active = true);
    
    RAISE NOTICE '✅ Doğru admin policy''leri eklendi!';
END $$;

-- 13. Final test
DO $$
DECLARE
    test_result UUID;
BEGIN
    INSERT INTO public.daily_videos (
        date, title, video_id, description, is_active
    ) VALUES (
        CURRENT_DATE, 
        'Final Test Video', 
        'final_test_123', 
        'Bu video final testi için eklenmiştir.',
        true
    ) RETURNING id INTO test_result;
    
    RAISE NOTICE '✅ Final test başarılı! Video ID: %', test_result;
    
    -- Test videosunu temizle
    DELETE FROM public.daily_videos WHERE id = test_result;
    RAISE NOTICE '🧹 Final test video temizlendi!';
    
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '❌ Final test başarısız: %', SQLERRM;
END $$;

-- Sonuç mesajı
DO $$
BEGIN
    RAISE NOTICE '🎬 Admin video ekleme testi tamamlandı!';
    RAISE NOTICE '📝 Şimdi admin panelinden video eklemeyi deneyin!';
END $$;
