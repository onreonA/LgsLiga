-- PERMANENT RLS FIX - Video ekleme sorunu kalıcı çözümü
-- Bu script'i Supabase SQL Editor'de çalıştırın

-- 1. Mevcut durumu kontrol et
SELECT 'PERMANENT RLS FIX BAŞLIYOR...' as status;

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

-- 3. RLS'yi kapat
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
    'PERMANENT FIX TEST VIDEO',
    'permanent_fix_test_' || EXTRACT(EPOCH FROM NOW())::INT,
    'Bu video permanent fix testi için eklenmiştir.',
    true
);

-- 5. Test videosunu temizle
DELETE FROM public.daily_videos WHERE video_id LIKE 'permanent_fix_test_%';

-- 6. RLS'yi tekrar aç
ALTER TABLE public.daily_videos ENABLE ROW LEVEL SECURITY;

-- 7. KALICI POLICY'LER EKLE
-- Herkesin SELECT yapabilmesi için
CREATE POLICY "permanent_select_policy" ON public.daily_videos
    FOR SELECT 
    USING (true);

-- Herkesin INSERT yapabilmesi için (KALICI)
CREATE POLICY "permanent_insert_policy" ON public.daily_videos
    FOR INSERT 
    WITH CHECK (true);

-- Herkesin UPDATE yapabilmesi için (KALICI)
CREATE POLICY "permanent_update_policy" ON public.daily_videos
    FOR UPDATE 
    USING (true);

-- Herkesin DELETE yapabilmesi için (KALICI)
CREATE POLICY "permanent_delete_policy" ON public.daily_videos
    FOR DELETE 
    USING (true);

-- 8. Final test - INSERT
INSERT INTO public.daily_videos (
    date, 
    title, 
    video_id, 
    description, 
    is_active
) VALUES (
    CURRENT_DATE,
    'FINAL INSERT TEST VIDEO',
    'final_insert_test_' || EXTRACT(EPOCH FROM NOW())::INT,
    'Bu video final insert testi için eklenmiştir.',
    true
);

-- 9. Final test - UPDATE
UPDATE public.daily_videos 
SET title = 'UPDATED TITLE - Final Test Video'
WHERE video_id LIKE 'final_insert_test_%';

-- 10. Final test - DELETE
DELETE FROM public.daily_videos WHERE video_id LIKE 'final_insert_test_%';

-- Sonuç mesajı
SELECT 'PERMANENT RLS FIX TAMAMLANDI! Artık video ekleme, güncelleme ve silme çalışmalı!' as result;
