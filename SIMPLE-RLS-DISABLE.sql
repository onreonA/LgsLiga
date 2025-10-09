-- BASIT RLS KAPATMA
ALTER TABLE daily_videos DISABLE ROW LEVEL SECURITY;

-- KONTROL
SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'daily_videos';
