-- Admin kullanıcısının rolünü ve mevcut durumunu kontrol et

-- Tüm kullanıcıları ve rollerini listele
SELECT 
    u.id,
    u.email,
    u.created_at,
    p.role,
    p.full_name,
    p.grade,
    p.target_score
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
ORDER BY u.created_at DESC;

-- Admin kullanıcıları
SELECT 
    u.email,
    p.role,
    p.full_name
FROM auth.users u
JOIN public.profiles p ON u.id = p.id
WHERE p.role = 'admin';

-- Eğer admin kullanıcı yoksa, mevcut kullanıcıları admin yap
DO $$
DECLARE
    user_record RECORD;
BEGIN
    -- İlk kullanıcıyı admin yap
    FOR user_record IN 
        SELECT u.id, u.email 
        FROM auth.users u 
        WHERE u.email = 'admin@lgsliga.com'
        LIMIT 1
    LOOP
        -- Profile'ı güncelle
        UPDATE public.profiles 
        SET role = 'admin' 
        WHERE id = user_record.id;
        
        RAISE NOTICE '✅ % kullanıcısı admin yapıldı!', user_record.email;
    END LOOP;
    
    -- Eğer admin@lgsliga.com yoksa, başka bir kullanıcıyı admin yap
    IF NOT FOUND THEN
        FOR user_record IN 
            SELECT u.id, u.email 
            FROM auth.users u 
            LIMIT 1
        LOOP
            UPDATE public.profiles 
            SET role = 'admin' 
            WHERE id = user_record.id;
            
            RAISE NOTICE '✅ % kullanıcısı admin yapıldı!', user_record.email;
        END LOOP;
    END IF;
END $$;

-- Son kontrol
SELECT 
    u.email,
    p.role,
    CASE 
        WHEN p.role = 'admin' THEN '✅ Admin'
        ELSE '❌ Student'
    END as status
FROM auth.users u
JOIN public.profiles p ON u.id = p.id
ORDER BY u.created_at DESC;
