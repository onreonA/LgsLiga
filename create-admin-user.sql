-- Admin Kullanıcısı Oluşturma Scripti
-- Email: admin@lgsliga.com
-- Şifre: LgsLiga_001

-- =====================================================
-- ADIM 1: Bu scripti çalıştırmadan ÖNCE yapılacaklar
-- =====================================================
-- Supabase Dashboard > Authentication > Users bölümüne gidin
-- "Add User" > "Create New User" butonuna tıklayın
-- Email: admin@lgsliga.com
-- Password: LgsLiga_001
-- Auto Confirm User: TRUE (işaretleyin)
-- "Create User" butonuna basın
-- Oluşturulan kullanıcının UUID'sini kopyalayın

-- =====================================================
-- ADIM 2: Aşağıdaki scripti çalıştırın
-- =====================================================

-- Admin kullanıcısının profiles tablosuna eklenmesi ve role güncellenmesi
-- Not: Bu script otomatik olarak en son oluşturulan kullanıcıyı admin yapar

DO $$
DECLARE
    v_admin_id UUID;
    v_admin_email TEXT := 'admin@lgsliga.com';
BEGIN
    -- Admin kullanıcısının ID'sini auth.users tablosundan al
    SELECT id INTO v_admin_id 
    FROM auth.users 
    WHERE email = v_admin_email 
    LIMIT 1;
    
    IF v_admin_id IS NULL THEN
        RAISE EXCEPTION 'Admin kullanıcısı bulunamadı! Önce Supabase Dashboard''dan admin@lgsliga.com kullanıcısını oluşturun.';
    END IF;
    
    -- Profiles tablosunda admin kullanıcısı var mı kontrol et
    IF EXISTS (SELECT 1 FROM public.profiles WHERE id = v_admin_id) THEN
        -- Varsa güncelle
        UPDATE public.profiles 
        SET 
            role = 'admin',
            full_name = 'Admin',
            grade = NULL,
            target_score = NULL,
            updated_at = NOW()
        WHERE id = v_admin_id;
        
        RAISE NOTICE '✅ Admin kullanıcısı güncellendi! ID: %', v_admin_id;
    ELSE
        -- Yoksa oluştur
        INSERT INTO public.profiles (id, email, full_name, role, grade, target_score)
        VALUES (v_admin_id, v_admin_email, 'Admin', 'admin', NULL, NULL);
        
        RAISE NOTICE '✅ Admin kullanıcısı oluşturuldu! ID: %', v_admin_id;
    END IF;
    
    -- Admin için coins oluştur (opsiyonel)
    INSERT INTO public.user_coins (user_id, total_coins, spent_coins, earned_coins)
    VALUES (v_admin_id, 9999, 0, 9999)
    ON CONFLICT (user_id) DO UPDATE SET
        total_coins = 9999,
        earned_coins = 9999;
    
    RAISE NOTICE '✅ Admin yetkisi verildi!';
    RAISE NOTICE '📧 Email: %', v_admin_email;
    RAISE NOTICE '🔑 Şifre: LgsLiga_001';
    RAISE NOTICE '👤 Role: admin';
    
END $$;

-- Kontrol: Admin kullanıcısını görüntüle
SELECT 
    p.id,
    p.email,
    p.full_name,
    p.role,
    p.created_at,
    u.email_confirmed_at,
    u.last_sign_in_at
FROM public.profiles p
LEFT JOIN auth.users u ON p.id = u.id
WHERE p.email = 'admin@lgsliga.com';

