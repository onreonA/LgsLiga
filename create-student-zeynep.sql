-- Zeynep Ünsal Öğrencisi Oluşturma Scripti
-- Email: zeyno@zeynepunsal.com.tr
-- Şifre: Zeyno001

-- =====================================================
-- ADIM 1: Supabase Dashboard'dan kullanıcı oluşturun
-- =====================================================
-- Authentication > Users > Add User > Create New User
-- Email: zeyno@zeynepunsal.com.tr
-- Password: Zeyno001
-- Auto Confirm User: ✅

-- =====================================================
-- ADIM 2: Bu scripti çalıştırın
-- =====================================================

DO $$
DECLARE
    v_student_id UUID;
    v_student_email TEXT := 'zeyno@zeynepunsal.com.tr';
BEGIN
    -- Öğrenci ID'sini auth.users tablosundan al
    SELECT id INTO v_student_id 
    FROM auth.users 
    WHERE email = v_student_email 
    LIMIT 1;
    
    IF v_student_id IS NULL THEN
        RAISE EXCEPTION 'Öğrenci bulunamadı! Önce Supabase Dashboard''dan % kullanıcısını oluşturun.', v_student_email;
    END IF;
    
    -- Profile oluştur/güncelle
    INSERT INTO public.profiles (id, email, full_name, role, grade, target_score)
    VALUES (v_student_id, v_student_email, 'Zeynep Ünsal', 'student', 8, 450)
    ON CONFLICT (id) DO UPDATE SET
        full_name = 'Zeynep Ünsal',
        role = 'student',
        grade = 8,
        target_score = 450,
        updated_at = NOW();
    
    -- User coins başlat
    INSERT INTO public.user_coins (user_id, total_coins, spent_coins, earned_coins)
    VALUES (v_student_id, 0, 0, 0)
    ON CONFLICT (user_id) DO UPDATE SET
        total_coins = 0,
        spent_coins = 0,
        earned_coins = 0;
    
    RAISE NOTICE '✅ Öğrenci başarıyla oluşturuldu!';
    RAISE NOTICE '👤 Ad: Zeynep Ünsal';
    RAISE NOTICE '📧 Email: %', v_student_email;
    RAISE NOTICE '🔑 Şifre: Zeyno001';
    RAISE NOTICE '🎓 Sınıf: 8. Sınıf';
    RAISE NOTICE '🎯 Hedef: 450 puan';
    RAISE NOTICE '💰 Coin: 0';
    
END $$;

-- Kontrol: Öğrenci bilgilerini görüntüle
SELECT 
    p.id,
    p.email,
    p.full_name,
    p.role,
    p.grade,
    p.target_score,
    c.total_coins,
    p.created_at
FROM public.profiles p
LEFT JOIN public.user_coins c ON p.id = c.user_id
WHERE p.email = 'zeyno@zeynepunsal.com.tr';

