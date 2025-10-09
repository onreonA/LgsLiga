-- Test: Function var mı kontrol et
SELECT 
    routine_name,
    routine_type,
    data_type,
    security_type
FROM information_schema.routines 
WHERE routine_name = 'insert_daily_video';

-- Test: Function'ı çağır
SELECT insert_daily_video(
  '2025-01-01',
  'Test Video',
  'dQw4w9WgXcQ',
  'Test açıklama',
  true
);
