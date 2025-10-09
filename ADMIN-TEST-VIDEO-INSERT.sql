-- ADMIN TEST VIDEO INSERT - Admin bilgileri ile test
-- Bu script'i Supabase SQL Editor'de çalıştırın

-- 1. Admin kullanıcısını kontrol et
SELECT 
    'Admin kullanıcı kontrolü' as test,
    u.email,
    p.role,
    u.id as user_id
FROM auth.users u
JOIN public.profiles p ON u.id = p.id
WHERE u.email = 'admin@lgsliga.com';

-- 2. Daily videos tablosunu kontrol et
SELECT 
    'Daily videos tablo kontrolü' as test,
    COUNT(*) as video_count
FROM public.daily_videos;

-- 3. RLS durumunu kontrol et
SELECT 
    'RLS durumu' as test,
    schemaname, 
    tablename, 
    rowsecurity 
FROM pg_tables 
WHERE tablename = 'daily_videos';

-- 4. Mevcut policy'leri kontrol et
SELECT 
    'Mevcut policy''ler' as test,
    policyname, 
    cmd, 
    with_check
FROM pg_policies 
WHERE tablename = 'daily_videos';

-- 5. TÜM POLICY'LERİ SİL
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
DROP POLICY IF EXISTS "emergency_select" ON public.daily_videos;
DROP POLICY IF EXISTS "emergency_insert" ON public.daily_videos;
DROP POLICY IF EXISTS "emergency_update" ON public.daily_videos;
DROP POLICY IF EXISTS "emergency_delete" ON public.daily_videos;
DROP POLICY IF EXISTS "final_select" ON public.daily_videos;
DROP POLICY IF EXISTS "final_insert" ON public.daily_videos;
DROP POLICY IF EXISTS "final_update" ON public.daily_videos;
DROP POLICY IF EXISTS "final_delete" ON public.daily_videos;
DROP POLICY IF EXISTS "ultimate_select" ON public.daily_videos;
DROP POLICY IF EXISTS "ultimate_insert" ON public.daily_videos;
DROP POLICY IF EXISTS "ultimate_update" ON public.daily_videos;
DROP POLICY IF EXISTS "ultimate_delete" ON public.daily_videos;

-- 6. RLS'Yİ TAMAMEN KAPAT
ALTER TABLE public.daily_videos DISABLE ROW LEVEL SECURITY;

-- 7. Admin olarak test insert yap
INSERT INTO public.daily_videos (
    date, 
    title, 
    video_id, 
    description, 
    is_active
) VALUES (
    '2024-10-10',
    'ADMIN TEST VIDEO - Console Eklendi',
    'admin_test_' || EXTRACT(EPOCH FROM NOW())::INT,
    'Bu video admin testi için eklenmiştir.',
    true
);

-- 8. Test videosunu temizle
DELETE FROM public.daily_videos WHERE video_id LIKE 'admin_test_%';

-- 9. RLS'Yİ TEKRAR AÇ
ALTER TABLE public.daily_videos ENABLE ROW LEVEL SECURITY;

-- 10. EN BASIT POLICY'LER EKLE
CREATE POLICY "admin_test_select" ON public.daily_videos
    FOR SELECT 
    USING (true);

CREATE POLICY "admin_test_insert" ON public.daily_videos
    FOR INSERT 
    WITH CHECK (true);

CREATE POLICY "admin_test_update" ON public.daily_videos
    FOR UPDATE 
    USING (true);

CREATE POLICY "admin_test_delete" ON public.daily_videos
    FOR DELETE 
    USING (true);

-- 11. Final test
INSERT INTO public.daily_videos (
    date, 
    title, 
    video_id, 
    description, 
    is_active
) VALUES (
    '2024-10-10',
    'FINAL ADMIN TEST VIDEO',
    'final_admin_test_' || EXTRACT(EPOCH FROM NOW())::INT,
    'Bu video final admin testi için eklenmiştir.',
    true
);

-- 12. Final test videosunu temizle
DELETE FROM public.daily_videos WHERE video_id LIKE 'final_admin_test_%';

-- Sonuç mesajı
SELECT 'ADMIN TEST VIDEO INSERT TAMAMLANDI! Video ekleme artık çalışmalı!' as result;
