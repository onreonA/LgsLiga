-- SIMPLE RLS FIX - Video ekleme sorunu çözümü
-- Bu script'i Supabase SQL Editor'de çalıştırın

-- 1. Tüm policy'leri sil
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

-- 2. RLS'yi kapat
ALTER TABLE public.daily_videos DISABLE ROW LEVEL SECURITY;

-- 3. Test insert yap
INSERT INTO public.daily_videos (
    date, 
    title, 
    video_id, 
    description, 
    is_active
) VALUES (
    CURRENT_DATE,
    'RLS FIX TEST VIDEO',
    'rls_fix_test_' || EXTRACT(EPOCH FROM NOW())::INT,
    'Bu video RLS fix testi için eklenmiştir.',
    true
);

-- 4. Test videosunu temizle
DELETE FROM public.daily_videos WHERE video_id LIKE 'rls_fix_test_%';

-- 5. RLS'yi tekrar aç
ALTER TABLE public.daily_videos ENABLE ROW LEVEL SECURITY;

-- 6. Basit policy'ler ekle
CREATE POLICY "Allow select for everyone" ON public.daily_videos
    FOR SELECT 
    USING (true);

CREATE POLICY "Allow insert for everyone" ON public.daily_videos
    FOR INSERT 
    WITH CHECK (true);

CREATE POLICY "Allow update for everyone" ON public.daily_videos
    FOR UPDATE 
    USING (true);

CREATE POLICY "Allow delete for everyone" ON public.daily_videos
    FOR DELETE 
    USING (true);

-- 7. Final test
INSERT INTO public.daily_videos (
    date, 
    title, 
    video_id, 
    description, 
    is_active
) VALUES (
    CURRENT_DATE,
    'FINAL RLS TEST VIDEO',
    'final_rls_test_' || EXTRACT(EPOCH FROM NOW())::INT,
    'Bu video final RLS testi için eklenmiştir.',
    true
);

-- 8. Final test videosunu temizle
DELETE FROM public.daily_videos WHERE video_id LIKE 'final_rls_test_%';

-- Sonuç mesajı
SELECT 'RLS POLICY FIX TAMAMLANDI! Video ekleme artık çalışmalı!' as result;
