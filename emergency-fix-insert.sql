-- ACİL DURUM: Video insert sorunu çözümü
-- Bu script'i Supabase SQL Editor'de çalıştırın!

-- 1. Mevcut INSERT policy'sini kaldır
DROP POLICY IF EXISTS "Admin users can insert daily videos" ON public.daily_videos;
DROP POLICY IF EXISTS "Temporary allow all inserts" ON public.daily_videos;

-- 2. Herkesin insert yapabilmesi için geçici policy ekle
CREATE POLICY "Allow all inserts temporarily" ON public.daily_videos
    FOR INSERT 
    WITH CHECK (true);

-- 3. Test insert yap
INSERT INTO public.daily_videos (
    date, 
    title, 
    video_id, 
    description, 
    is_active
) VALUES (
    '2024-10-10',
    'Test Video - Acil Durum Fix',
    'emergency_test_123',
    'Bu video acil durum fix testi için eklenmiştir.',
    true
);

-- 4. Başarı mesajı
DO $$
BEGIN
    RAISE NOTICE '✅ ACİL DURUM FİX TAMAMLANDI!';
    RAISE NOTICE '✅ Artık video ekleyebilirsiniz!';
    RAISE NOTICE '⚠️ Bu policy güvenli değil, test sonrası kaldırın!';
END $$;
