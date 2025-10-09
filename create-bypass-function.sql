-- BYPASS FUNCTION: RLS'yi tamamen bypass eden function
CREATE OR REPLACE FUNCTION insert_daily_video(
  p_date text,
  p_title text,
  p_video_id text,
  p_description text,
  p_is_active boolean DEFAULT true
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER  -- Bu function'ı çalıştıran kişi, function'ın owner'ının yetkilerine sahip olur
AS $$
DECLARE
  result_id uuid;
BEGIN
  -- Direkt insert (RLS bypass)
  INSERT INTO daily_videos (
    date,
    title,
    video_id,
    description,
    is_active,
    created_at,
    updated_at
  ) VALUES (
    p_date::date,
    p_title,
    p_video_id,
    p_description,
    p_is_active,
    NOW(),
    NOW()
  ) RETURNING id INTO result_id;
  
  -- Başarılı response
  RETURN json_build_object(
    'success', true,
    'id', result_id,
    'message', 'Video başarıyla eklendi'
  );
EXCEPTION
  WHEN OTHERS THEN
    -- Hata durumunda
    RETURN json_build_object(
      'success', false,
      'error', SQLERRM,
      'message', 'Video eklenirken hata oluştu'
    );
END;
$$;

-- Function'ı herkese execute yetkisi ver
GRANT EXECUTE ON FUNCTION insert_daily_video TO authenticated;
GRANT EXECUTE ON FUNCTION insert_daily_video TO anon;

-- Test
SELECT insert_daily_video('2025-01-01', 'Test Video', 'dQw4w9WgXcQ', 'Test açıklama', true);
