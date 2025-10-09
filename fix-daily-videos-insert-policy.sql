-- Daily videos tablosu için INSERT policy kontrolü ve düzeltme

-- Mevcut policy'leri göster
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'daily_videos';

-- Eğer INSERT policy yoksa, admin kullanıcıları için ekle
DO $$
BEGIN
    -- Admin kullanıcıları için INSERT policy ekle
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'daily_videos' 
        AND cmd = 'INSERT'
        AND policyname = 'Admin users can insert daily videos'
    ) THEN
        CREATE POLICY "Admin users can insert daily videos" ON public.daily_videos
            FOR INSERT 
            WITH CHECK (
                EXISTS (
                    SELECT 1 FROM public.profiles 
                    WHERE profiles.id = auth.uid() 
                    AND profiles.role = 'admin'
                )
            );
        
        RAISE NOTICE '✅ Admin INSERT policy eklendi!';
    ELSE
        RAISE NOTICE '⚠️ Admin INSERT policy zaten mevcut!';
    END IF;
    
    -- Admin kullanıcıları için UPDATE policy ekle
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'daily_videos' 
        AND cmd = 'UPDATE'
        AND policyname = 'Admin users can update daily videos'
    ) THEN
        CREATE POLICY "Admin users can update daily videos" ON public.daily_videos
            FOR UPDATE 
            USING (
                EXISTS (
                    SELECT 1 FROM public.profiles 
                    WHERE profiles.id = auth.uid() 
                    AND profiles.role = 'admin'
                )
            );
        
        RAISE NOTICE '✅ Admin UPDATE policy eklendi!';
    ELSE
        RAISE NOTICE '⚠️ Admin UPDATE policy zaten mevcut!';
    END IF;
    
    -- Admin kullanıcıları için DELETE policy ekle
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'daily_videos' 
        AND cmd = 'DELETE'
        AND policyname = 'Admin users can delete daily videos'
    ) THEN
        CREATE POLICY "Admin users can delete daily videos" ON public.daily_videos
            FOR DELETE 
            USING (
                EXISTS (
                    SELECT 1 FROM public.profiles 
                    WHERE profiles.id = auth.uid() 
                    AND profiles.role = 'admin'
                )
            );
        
        RAISE NOTICE '✅ Admin DELETE policy eklendi!';
    ELSE
        RAISE NOTICE '⚠️ Admin DELETE policy zaten mevcut!';
    END IF;
END $$;

-- Herkes için SELECT policy ekle (videoları görüntülemek için)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'daily_videos' 
        AND cmd = 'SELECT'
        AND policyname = 'Everyone can view active daily videos'
    ) THEN
        CREATE POLICY "Everyone can view active daily videos" ON public.daily_videos
            FOR SELECT 
            USING (is_active = true);
        
        RAISE NOTICE '✅ SELECT policy eklendi!';
    ELSE
        RAISE NOTICE '⚠️ SELECT policy zaten mevcut!';
    END IF;
END $$;

-- Admin kullanıcısının mevcut olup olmadığını kontrol et
SELECT 
    u.email,
    p.role,
    p.full_name
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE p.role = 'admin'
ORDER BY u.created_at DESC;

-- Test için admin kullanıcısının video ekleyebilir mi kontrol et
DO $$
DECLARE
    admin_user_id UUID;
BEGIN
    -- Admin kullanıcısını bul
    SELECT p.id INTO admin_user_id
    FROM public.profiles p
    WHERE p.role = 'admin'
    LIMIT 1;
    
    IF admin_user_id IS NOT NULL THEN
        RAISE NOTICE '✅ Admin kullanıcı bulundu: %', admin_user_id;
        
        -- Test insert işlemi (rollback ile)
        BEGIN
            INSERT INTO public.daily_videos (
                date, title, video_id, description, is_active
            ) VALUES (
                CURRENT_DATE, 'Test Video', 'test123', 'Test açıklama', true
            );
            
            -- Eğer buraya gelirse, insert başarılı
            RAISE NOTICE '✅ Test insert başarılı!';
            
            -- Test kaydını sil
            DELETE FROM public.daily_videos WHERE video_id = 'test123';
            RAISE NOTICE '✅ Test kaydı temizlendi!';
            
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE '❌ Test insert başarısız: %', SQLERRM;
        END;
    ELSE
        RAISE NOTICE '❌ Admin kullanıcı bulunamadı!';
    END IF;
END $$;

-- Sonuç mesajı
DO $$
BEGIN
    RAISE NOTICE '🎬 Daily videos RLS policy kontrolü tamamlandı!';
    RAISE NOTICE '📝 Admin kullanıcıları artık video ekleyebilir!';
END $$;
