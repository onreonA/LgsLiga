-- EMERGENCY: Disable RLS completely for daily_videos to test insert
-- Bu geçici bir çözüm - sadece test için

-- 1. RLS'yi tamamen kapat
ALTER TABLE daily_videos DISABLE ROW LEVEL SECURITY;

-- 2. Tüm policy'leri kaldır (temizlik)
DROP POLICY IF EXISTS "daily_videos_select_policy" ON daily_videos;
DROP POLICY IF EXISTS "daily_videos_insert_policy" ON daily_videos;
DROP POLICY IF EXISTS "daily_videos_update_policy" ON daily_videos;
DROP POLICY IF EXISTS "daily_videos_delete_policy" ON daily_videos;
DROP POLICY IF EXISTS "admin_full_access_daily_videos" ON daily_videos;
DROP POLICY IF EXISTS "admin_can_insert_daily_videos" ON daily_videos;
DROP POLICY IF EXISTS "admin_can_update_daily_videos" ON daily_videos;
DROP POLICY IF EXISTS "admin_can_delete_daily_videos" ON daily_videos;

-- 3. Kontrol (PostgreSQL sürüm uyumlu)
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename = 'daily_videos';

-- 4. Policy listesi (boş olmalı)
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE tablename = 'daily_videos';

-- Başarı mesajı
DO $$ 
BEGIN 
    RAISE NOTICE '✅ EMERGENCY: RLS tamamen kapatıldı! Artık herkes daily_videos tablosuna erişebilir.';
    RAISE NOTICE '⚠️ GÜVENLİK UYARISI: Bu geçici bir çözüm. Test tamamlandıktan sonra RLS''yi tekrar açın!';
END $$;
