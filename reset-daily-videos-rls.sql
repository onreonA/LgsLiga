-- ================================================
-- daily_videos RLS Policy'lerini Sıfırla ve Yeniden Oluştur
-- ================================================

-- 1. Tüm mevcut policy'leri sil
DROP POLICY IF EXISTS "Allow all users to read daily_videos" ON public.daily_videos;
DROP POLICY IF EXISTS "Allow admin to insert daily_videos" ON public.daily_videos;
DROP POLICY IF EXISTS "Allow admin to update daily_videos" ON public.daily_videos;
DROP POLICY IF EXISTS "Allow admin to delete daily_videos" ON public.daily_videos;
DROP POLICY IF EXISTS "Admin can insert videos" ON public.daily_videos;
DROP POLICY IF EXISTS "Admin can update videos" ON public.daily_videos;
DROP POLICY IF EXISTS "Admin can delete videos" ON public.daily_videos;
DROP POLICY IF EXISTS "Everyone can view videos" ON public.daily_videos;

-- 2. RLS'i aktif et
ALTER TABLE public.daily_videos ENABLE ROW LEVEL SECURITY;

-- 3. Basit ve güvenli policy'ler oluştur

-- Herkes aktif videoları görebilir
CREATE POLICY "Public read active videos" 
ON public.daily_videos 
FOR SELECT 
USING (is_active = true);

-- Admin tüm videoları görebilir
CREATE POLICY "Admin read all videos" 
ON public.daily_videos 
FOR SELECT 
USING (
  auth.uid() IN (
    SELECT id FROM public.profiles WHERE role = 'admin'
  )
);

-- Admin video ekleyebilir
CREATE POLICY "Admin insert videos" 
ON public.daily_videos 
FOR INSERT 
WITH CHECK (
  auth.uid() IN (
    SELECT id FROM public.profiles WHERE role = 'admin'
  )
);

-- Admin video güncelleyebilir
CREATE POLICY "Admin update videos" 
ON public.daily_videos 
FOR UPDATE 
USING (
  auth.uid() IN (
    SELECT id FROM public.profiles WHERE role = 'admin'
  )
);

-- Admin video silebilir
CREATE POLICY "Admin delete videos" 
ON public.daily_videos 
FOR DELETE 
USING (
  auth.uid() IN (
    SELECT id FROM public.profiles WHERE role = 'admin'
  )
);

-- 4. Test ve Mesaj
DO $$
BEGIN
  RAISE NOTICE '✅ daily_videos RLS policy''leri yeniden oluşturuldu!';
  RAISE NOTICE '✅ Artık admin kullanıcıları video ekleyebilir!';
END $$;

-- 5. Policy'leri listele (kontrol için)
SELECT 
  policyname as "Policy",
  cmd as "İşlem",
  CASE 
    WHEN qual IS NOT NULL THEN 'USING var'
    WHEN with_check IS NOT NULL THEN 'WITH CHECK var'
    ELSE 'Yok'
  END as "Koşul"
FROM pg_policies 
WHERE tablename = 'daily_videos'
ORDER BY cmd, policyname;
