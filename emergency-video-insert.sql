-- Acil durum: Video ekleme için admin kontrolünü bypass et
-- Bu script'i sadece acil durumlarda kullanın!

-- Daily videos tablosuna direkt insert yapabilmek için geçici policy
DO $$
BEGIN
    -- Mevcut admin INSERT policy'sini geçici olarak kaldır
    DROP POLICY IF EXISTS "Admin users can insert daily videos" ON public.daily_videos;
    
    -- Herkesin insert yapabilmesi için geçici policy ekle
    CREATE POLICY "Temporary allow all inserts" ON public.daily_videos
        FOR INSERT 
        WITH CHECK (true);
    
    RAISE NOTICE '⚠️ GEÇICI: Herkes video ekleyebilir!';
    RAISE NOTICE '⚠️ UYARI: Bu policy güvenli değil, test sonrası kaldırın!';
END $$;

-- Test video ekle
INSERT INTO public.daily_videos (
    date, 
    title, 
    video_id, 
    description, 
    is_active
) VALUES (
    '2024-10-10',
    'Test Video - Acil Durum',
    'test123456',
    'Bu video acil durum testi için eklenmiştir.',
    true
);

-- Başarı mesajı
DO $$
BEGIN
    RAISE NOTICE '✅ Test video eklendi!';
    RAISE NOTICE '📝 Şimdi admin panelinden video eklemeyi deneyin!';
    RAISE NOTICE '⚠️ Test sonrası güvenlik policy''sini geri yükleyin!';
END $$;
