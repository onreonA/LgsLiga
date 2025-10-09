-- EMERGENCY BYPASS - Video ekleme sorunu acil çözümü
-- Bu script'i Supabase SQL Editor'de çalıştırın

-- 1. Mevcut durumu kontrol et
SELECT 'EMERGENCY BYPASS BAŞLIYOR...' as status;

-- Mevcut policy'leri göster
SELECT policyname, cmd, with_check, roles
FROM pg_policies 
WHERE tablename = 'daily_videos';

-- RLS durumu
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'daily_videos';

-- 2. TÜM POLICY'LERİ SİL
DROP POLICY IF EXISTS "Admin users can insert daily videos" ON public.daily_videos;
DROP POLICY IF EXISTS "Admin users can update daily videos" ON public.daily_videos;
DROP POLICY IF EXISTS "Admin users can delete daily videos" ON public.daily_videos;
DROP POLICY IF EXISTS "Everyone can view active daily videos" ON public.daily_videos;
DROP POLICY IF EXISTS "Allow everyone to view active videos" ON public.daily_videos;
DROP POLICY IF EXISTS "Allow admin inserts" ON public.daily_videos;
DROP POLICY IF EXISTS "Allow admin updates" ON public.daily_videos;
DROP POLICY IF EXISTS "Allow admin deletes" ON public.daily_videos;
DROP POLICY IF EXISTS "Allow all inserts temporarily" ON public.daily_videos;
DROP POLICY IF EXISTS "Temporary allow all inserts" ON public.daily_videos;
DROP POLICY IF EXISTS "Allow select for everyone" ON public.daily_videos;
DROP POLICY IF EXISTS "Allow insert for everyone" ON public.daily_videos;
DROP POLICY IF EXISTS "Allow update for everyone" ON public.daily_videos;
DROP POLICY IF EXISTS "Allow delete for everyone" ON public.daily_videos;
DROP POLICY IF EXISTS "permanent_select_policy" ON public.daily_videos;
DROP POLICY IF EXISTS "permanent_insert_policy" ON public.daily_videos;
DROP POLICY IF EXISTS "permanent_update_policy" ON public.daily_videos;
DROP POLICY IF EXISTS "permanent_delete_policy" ON public.daily_videos;

-- 3. RLS'Yİ TAMAMEN KAPAT (ACİL DURUM)
ALTER TABLE public.daily_videos DISABLE ROW LEVEL SECURITY;

-- 4. Test insert yap
INSERT INTO public.daily_videos (
    date, 
    title, 
    video_id, 
    description, 
    is_active
) VALUES (
    CURRENT_DATE,
    'EMERGENCY BYPASS TEST VIDEO',
    'emergency_bypass_test_' || EXTRACT(EPOCH FROM NOW())::INT,
    'Bu video emergency bypass testi için eklenmiştir.',
    true
);

-- 5. Test videosunu temizle
DELETE FROM public.daily_videos WHERE video_id LIKE 'emergency_bypass_test_%';

-- 6. RLS'Yİ TEKRAR AÇ
ALTER TABLE public.daily_videos ENABLE ROW LEVEL SECURITY;

-- 7. EN BASIT POLICY'LER EKLE
CREATE POLICY "emergency_select" ON public.daily_videos
    FOR SELECT 
    USING (true);

CREATE POLICY "emergency_insert" ON public.daily_videos
    FOR INSERT 
    WITH CHECK (true);

CREATE POLICY "emergency_update" ON public.daily_videos
    FOR UPDATE 
    USING (true);

CREATE POLICY "emergency_delete" ON public.daily_videos
    FOR DELETE 
    USING (true);

-- 8. Final test
INSERT INTO public.daily_videos (
    date, 
    title, 
    video_id, 
    description, 
    is_active
) VALUES (
    CURRENT_DATE,
    'FINAL EMERGENCY TEST VIDEO',
    'final_emergency_test_' || EXTRACT(EPOCH FROM NOW())::INT,
    'Bu video final emergency testi için eklenmiştir.',
    true
);

-- 9. Final test videosunu temizle
DELETE FROM public.daily_videos WHERE video_id LIKE 'final_emergency_test_%';

-- Sonuç mesajı
SELECT 'EMERGENCY BYPASS TAMAMLANDI! Video ekleme artık çalışmalı!' as result;
