-- ================================================
-- Admin için daily_videos INSERT yetkisi ekle
-- ================================================

-- Önce mevcut policy'leri kontrol et
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'daily_videos';

-- Admin için INSERT policy ekle (eğer yoksa)
DO $$
BEGIN
  -- Önce var olan admin INSERT policy'sini sil
  DROP POLICY IF EXISTS "Admin can insert videos" ON public.daily_videos;
  
  -- Yeni policy oluştur
  CREATE POLICY "Admin can insert videos" 
  ON public.daily_videos 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
  
  RAISE NOTICE '✅ Admin INSERT policy eklendi!';
  
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE '⚠️ Policy zaten mevcut veya hata: %', SQLERRM;
END $$;

-- Admin için UPDATE policy ekle (eğer yoksa)
DO $$
BEGIN
  DROP POLICY IF EXISTS "Admin can update videos" ON public.daily_videos;
  
  CREATE POLICY "Admin can update videos" 
  ON public.daily_videos 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
  
  RAISE NOTICE '✅ Admin UPDATE policy eklendi!';
  
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE '⚠️ Policy zaten mevcut veya hata: %', SQLERRM;
END $$;

-- Kontrol: Güncel policy'leri listele
SELECT 
  policyname as "Policy Adı",
  cmd as "İşlem",
  roles as "Roller"
FROM pg_policies 
WHERE tablename = 'daily_videos'
ORDER BY policyname;
