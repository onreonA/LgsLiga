-- Admin RLS Politikaları Güncelleme
-- Admin kullanıcılarının tüm verileri görebilmesi için

-- =====================================================
-- PROFILES - Admin tüm profilleri görebilir/düzenleyebilir
-- =====================================================

-- Admin'ler tüm profilleri görebilir
CREATE POLICY "Admins can view all profiles" ON public.profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Admin'ler tüm profilleri güncelleyebilir
CREATE POLICY "Admins can update all profiles" ON public.profiles
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Admin'ler profil silebilir
CREATE POLICY "Admins can delete profiles" ON public.profiles
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- =====================================================
-- STUDY SESSIONS - Admin tüm oturumları görebilir
-- =====================================================

CREATE POLICY "Admins can view all study sessions" ON public.study_sessions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- =====================================================
-- QUESTS - Admin tüm görevleri görebilir
-- =====================================================

CREATE POLICY "Admins can view all quests" ON public.quests
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- =====================================================
-- EXAMS - Admin tüm sınavları görebilir
-- =====================================================

CREATE POLICY "Admins can view all exams" ON public.exams
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- =====================================================
-- USER COINS - Admin tüm coinleri görebilir/düzenleyebilir
-- =====================================================

CREATE POLICY "Admins can view all user coins" ON public.user_coins
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Admins can update all user coins" ON public.user_coins
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- =====================================================
-- PURCHASE REQUESTS - Admin tüm talepleri görebilir/güncelleyebilir
-- =====================================================

CREATE POLICY "Admins can view all purchase requests" ON public.purchase_requests
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Admins can update purchase requests" ON public.purchase_requests
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- =====================================================
-- BAŞARIYLA TAMAMLANDI!
-- =====================================================
SELECT '✅ Admin RLS politikaları başarıyla eklendi!' AS message;
SELECT 'Admin kullanıcıları artık tüm verileri görüntüleyebilir.' AS info;

