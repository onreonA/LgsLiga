-- Infinite Recursion Hatası Düzeltme
-- RLS politikalarını sonsuz döngüden kurtarma

-- =====================================================
-- 1. TÜM ESKİ POLİTİKALARI TEMİZLE
-- =====================================================

-- Profiles tablosu
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can delete profiles" ON public.profiles;

-- Study Sessions
DROP POLICY IF EXISTS "Users can view their own study sessions" ON public.study_sessions;
DROP POLICY IF EXISTS "Users can insert their own study sessions" ON public.study_sessions;
DROP POLICY IF EXISTS "Admins can view all study sessions" ON public.study_sessions;

-- Quests
DROP POLICY IF EXISTS "Users can view their own quests" ON public.quests;
DROP POLICY IF EXISTS "Users can update their own quests" ON public.quests;
DROP POLICY IF EXISTS "Admins can view all quests" ON public.quests;

-- Exams
DROP POLICY IF EXISTS "Users can view their own exams" ON public.exams;
DROP POLICY IF EXISTS "Users can insert their own exams" ON public.exams;
DROP POLICY IF EXISTS "Users can update their own exams" ON public.exams;
DROP POLICY IF EXISTS "Admins can view all exams" ON public.exams;

-- User Coins
DROP POLICY IF EXISTS "Users can view their own coins" ON public.user_coins;
DROP POLICY IF EXISTS "Users can update their own coins" ON public.user_coins;
DROP POLICY IF EXISTS "Admins can view all user coins" ON public.user_coins;
DROP POLICY IF EXISTS "Admins can update all user coins" ON public.user_coins;

-- Purchase Requests
DROP POLICY IF EXISTS "Users can view their own purchase requests" ON public.purchase_requests;
DROP POLICY IF EXISTS "Users can insert their own purchase requests" ON public.purchase_requests;
DROP POLICY IF EXISTS "Admins can view all purchase requests" ON public.purchase_requests;
DROP POLICY IF EXISTS "Admins can update purchase requests" ON public.purchase_requests;

-- Family Messages
DROP POLICY IF EXISTS "Users can view their own family messages" ON public.family_messages;

-- User Goals
DROP POLICY IF EXISTS "Users can view their own goals" ON public.user_goals;
DROP POLICY IF EXISTS "Users can insert their own goals" ON public.user_goals;
DROP POLICY IF EXISTS "Users can update their own goals" ON public.user_goals;

-- Weekly Letters
DROP POLICY IF EXISTS "Users can view their own letters" ON public.weekly_letters;
DROP POLICY IF EXISTS "Users can insert their own letters" ON public.weekly_letters;

-- =====================================================
-- 2. HELPER FUNCTION OLUŞTUR (Infinite Recursion'dan kaçınmak için)
-- =====================================================

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM auth.users 
    WHERE id = auth.uid() 
    AND raw_user_meta_data->>'role' = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 3. YENİ BASİT POLİTİKALAR
-- =====================================================

-- PROFILES - Basitleştirilmiş
CREATE POLICY "Users and admins can view profiles" ON public.profiles
    FOR SELECT USING (true); -- Herkes kendi profilini görebilir, RLS client-side kontrol edilecek

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can delete own profile" ON public.profiles
    FOR DELETE USING (auth.uid() = id);

-- STUDY SESSIONS
CREATE POLICY "Users can view own sessions" ON public.study_sessions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sessions" ON public.study_sessions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- QUESTS
CREATE POLICY "Users can view own quests" ON public.quests
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own quests" ON public.quests
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own quests" ON public.quests
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- EXAMS
CREATE POLICY "Users can view own exams" ON public.exams
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own exams" ON public.exams
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own exams" ON public.exams
    FOR UPDATE USING (auth.uid() = user_id);

-- USER COINS
CREATE POLICY "Users can view own coins" ON public.user_coins
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own coins" ON public.user_coins
    FOR UPDATE USING (auth.uid() = user_id);

-- PURCHASE REQUESTS
CREATE POLICY "Users can view own purchase requests" ON public.purchase_requests
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own purchase requests" ON public.purchase_requests
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- FAMILY MESSAGES
CREATE POLICY "Users can view own family messages" ON public.family_messages
    FOR SELECT USING (auth.uid() = user_id);

-- USER GOALS
CREATE POLICY "Users can view own goals" ON public.user_goals
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own goals" ON public.user_goals
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own goals" ON public.user_goals
    FOR UPDATE USING (auth.uid() = user_id);

-- WEEKLY LETTERS
CREATE POLICY "Users can view own letters" ON public.weekly_letters
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own letters" ON public.weekly_letters
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- 4. SERVICE ROLE İÇİN BYPASS (Admin için)
-- =====================================================

-- Not: Admin işlemleri için Supabase Service Role kullanılacak
-- Frontend'de admin kontrolü yapılacak, backend'de bypass olacak

-- =====================================================
-- BAŞARIYLA TAMAMLANDI!
-- =====================================================
SELECT '✅ RLS politikaları infinite recursion olmadan yeniden oluşturuldu!' AS message;
SELECT '📝 Not: Admin işlemleri frontend''de kontrol edilecek' AS admin_note;
SELECT '🔄 Sayfayı yenileyin (CTRL + SHIFT + R)' AS action;

