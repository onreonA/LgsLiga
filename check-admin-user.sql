-- Admin kullanıcısının role'ünü kontrol et

SELECT 
  id,
  email,
  full_name,
  role,
  created_at
FROM public.profiles
WHERE email = 'admin@lgsliga.com';

-- Eğer role 'admin' değilse, güncelle
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'admin@lgsliga.com' AND role != 'admin';

-- Kontrol: Admin user bilgileri
DO $$
DECLARE
  admin_role TEXT;
BEGIN
  SELECT role INTO admin_role 
  FROM public.profiles 
  WHERE email = 'admin@lgsliga.com';
  
  IF admin_role = 'admin' THEN
    RAISE NOTICE '✅ Admin kullanıcısının role''ü doğru: admin';
  ELSE
    RAISE NOTICE '❌ Admin kullanıcısının role''ü yanlış: %', admin_role;
  END IF;
END $$;
