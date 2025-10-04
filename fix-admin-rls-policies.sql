-- Admin RLS Politikalarını Düzeltme
-- Mevcut politikaları drop edip yenilerini ekliyoruz

-- =====================================================
-- PROFILES TABLOSU
-- =====================================================

-- Eski politikaları sil
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can delete profiles" ON public.profiles;

-- Yeni politikaları ekle
CREATE POLICY "Admins can view all profiles" ON public.profiles
    FOR SELECT USING (
        (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
        OR auth.uid() = id
    );

CREATE POLICY "Admins can update all profiles" ON public.profiles
    FOR UPDATE USING (
        (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
        OR auth.uid() = id
    );

CREATE POLICY "Admins can delete profiles" ON public.profiles
    FOR DELETE USING (
        (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
    );

-- =====================================================
-- STUDY SESSIONS
-- =====================================================

DROP POLICY IF EXISTS "Admins can view all study sessions" ON public.study_sessions;

CREATE POLICY "Admins can view all study sessions" ON public.study_sessions
    FOR SELECT USING (
        (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
        OR auth.uid() = user_id
    );

-- =====================================================
-- QUESTS
-- =====================================================

DROP POLICY IF EXISTS "Admins can view all quests" ON public.quests;

CREATE POLICY "Admins can view all quests" ON public.quests
    FOR SELECT USING (
        (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
        OR auth.uid() = user_id
    );

-- =====================================================
-- EXAMS
-- =====================================================

DROP POLICY IF EXISTS "Admins can view all exams" ON public.exams;

CREATE POLICY "Admins can view all exams" ON public.exams
    FOR SELECT USING (
        (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
        OR auth.uid() = user_id
    );

-- =====================================================
-- USER COINS
-- =====================================================

DROP POLICY IF EXISTS "Admins can view all user coins" ON public.user_coins;
DROP POLICY IF EXISTS "Admins can update all user coins" ON public.user_coins;

CREATE POLICY "Admins can view all user coins" ON public.user_coins
    FOR SELECT USING (
        (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
        OR auth.uid() = user_id
    );

CREATE POLICY "Admins can update all user coins" ON public.user_coins
    FOR UPDATE USING (
        (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
        OR auth.uid() = user_id
    );

-- =====================================================
-- PURCHASE REQUESTS
-- =====================================================

DROP POLICY IF EXISTS "Admins can view all purchase requests" ON public.purchase_requests;
DROP POLICY IF EXISTS "Admins can update purchase requests" ON public.purchase_requests;

CREATE POLICY "Admins can view all purchase requests" ON public.purchase_requests
    FOR SELECT USING (
        (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
        OR auth.uid() = user_id
    );

CREATE POLICY "Admins can update purchase requests" ON public.purchase_requests
    FOR UPDATE USING (
        (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
    );

-- =====================================================
-- KONTROL
-- =====================================================

-- Tüm profiles politikalarını listele
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'profiles'
ORDER BY policyname;

-- =====================================================
-- BAŞARIYLA TAMAMLANDI!
-- =====================================================
SELECT '✅ Admin RLS politikaları başarıyla güncellendi!' AS message;
SELECT '🔄 Sayfayı yenileyin ve tekrar deneyin.' AS info;

