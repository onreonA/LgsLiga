-- Zeynep Kullanıcısının Şifresini Sıfırla
-- NOT: Bu script Supabase Dashboard > SQL Editor'da ÇALIŞMAZ!
-- Bunun yerine Supabase Dashboard > Authentication > Users'dan şifre resetleyin

-- Alternatif: Yeni kullanıcı oluşturmak için (eğer yoksa):
-- 1. Supabase Dashboard > Authentication > Users'a gidin
-- 2. "Add User" butonuna tıklayın
-- 3. Email: zeynep@lgsliga.com
-- 4. Password: LgsLiga_001
-- 5. "Create User" tıklayın

-- Kullanıcı oluşturulduktan sonra, profile'a eklemek için:
INSERT INTO public.profiles (id, email, full_name, role, grade, target_score)
SELECT 
    id,
    'zeynep@lgsliga.com',
    'Zeynep ÜNSAL',
    'student',
    8,
    450
FROM auth.users
WHERE email = 'zeynep@lgsliga.com'
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role,
    grade = EXCLUDED.grade,
    target_score = EXCLUDED.target_score;

-- User coins ekle
INSERT INTO public.user_coins (user_id, total_coins, earned_coins, spent_coins)
SELECT 
    id,
    450,
    450,
    0
FROM auth.users
WHERE email = 'zeynep@lgsliga.com'
ON CONFLICT (user_id) DO NOTHING;

SELECT 'Zeynep profili hazır!' as sonuc;
