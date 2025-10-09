-- Video güvenlik policy'sini geri yükle
-- Acil durum testinden sonra çalıştırın!

DO $$
BEGIN
    -- Geçici policy'yi kaldır
    DROP POLICY IF EXISTS "Temporary allow all inserts" ON public.daily_videos;
    
    -- Admin policy'sini geri yükle
    CREATE POLICY "Admin users can insert daily videos" ON public.daily_videos
        FOR INSERT 
        WITH CHECK (
            EXISTS (
                SELECT 1 FROM public.profiles 
                WHERE profiles.id = auth.uid() 
                AND profiles.role = 'admin'
            )
        );
    
    RAISE NOTICE '✅ Güvenlik policy''si geri yüklendi!';
    RAISE NOTICE '✅ Sadece admin kullanıcıları video ekleyebilir!';
END $$;

-- Test videosunu temizle
DELETE FROM public.daily_videos WHERE video_id = 'test123456';

-- Sonuç
DO $$
BEGIN
    RAISE NOTICE '🧹 Test video temizlendi!';
    RAISE NOTICE '🔒 Sistem güvenli durumda!';
END $$;
