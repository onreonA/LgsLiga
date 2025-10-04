-- Daily Videos Tablosu
-- Bu dosyayı Supabase Dashboard > SQL Editor'da çalıştırın

-- daily_videos tablosunu oluştur
CREATE TABLE IF NOT EXISTS public.daily_videos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE NOT NULL UNIQUE,
    title TEXT NOT NULL,
    video_id TEXT NOT NULL,
    description TEXT,
    thumbnail_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- İndeksler oluştur (performans için)
CREATE INDEX IF NOT EXISTS idx_daily_videos_date ON public.daily_videos(date DESC);
CREATE INDEX IF NOT EXISTS idx_daily_videos_active ON public.daily_videos(is_active) WHERE is_active = true;

-- RLS (Row Level Security) politikalarını etkinleştir
ALTER TABLE public.daily_videos ENABLE ROW LEVEL SECURITY;

-- Herkes okuyabilir
CREATE POLICY "Allow all users to read daily_videos"
    ON public.daily_videos
    FOR SELECT
    USING (true);

-- Sadece admin ekleyebilir
CREATE POLICY "Allow admin to insert daily_videos"
    ON public.daily_videos
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Sadece admin güncelleyebilir
CREATE POLICY "Allow admin to update daily_videos"
    ON public.daily_videos
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Sadece admin silebilir
CREATE POLICY "Allow admin to delete daily_videos"
    ON public.daily_videos
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Örnek video ekle (04.10.2025)
INSERT INTO public.daily_videos (date, title, video_id, description, is_active)
VALUES 
    ('2025-10-04', 'Hayallerine Ulaşmak İstiyorsan İzle', 'cc3Hy3Ptsao', 'Hayallerine ulaşmak için gereken motivasyonu bu videoda bulacaksın!', true)
ON CONFLICT (date) DO UPDATE SET
    title = EXCLUDED.title,
    video_id = EXCLUDED.video_id,
    description = EXCLUDED.description,
    is_active = EXCLUDED.is_active,
    updated_at = NOW();

-- Başarı mesajı
DO $$
BEGIN
    RAISE NOTICE '✅ daily_videos tablosu başarıyla oluşturuldu!';
    RAISE NOTICE '✅ RLS politikaları eklendi!';
    RAISE NOTICE '✅ 04.10.2025 tarihli video eklendi!';
END $$;

