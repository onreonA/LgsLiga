-- Favori videolar tablosu oluştur
CREATE TABLE IF NOT EXISTS public.user_favorite_videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  video_id UUID REFERENCES public.daily_videos(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, video_id)
);

-- Video izleme istatistikleri tablosu
CREATE TABLE IF NOT EXISTS public.video_watch_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  video_id UUID REFERENCES public.daily_videos(id) ON DELETE CASCADE,
  watched_at TIMESTAMPTZ DEFAULT NOW(),
  watch_duration_seconds INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE
);

-- RLS Policies
ALTER TABLE public.user_favorite_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_watch_stats ENABLE ROW LEVEL SECURITY;

-- Favori videolar için RLS policies
CREATE POLICY "Users can view their own favorite videos" ON public.user_favorite_videos
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own favorite videos" ON public.user_favorite_videos
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorite videos" ON public.user_favorite_videos
  FOR DELETE USING (auth.uid() = user_id);

-- Video izleme istatistikleri için RLS policies
CREATE POLICY "Users can view their own watch stats" ON public.video_watch_stats
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own watch stats" ON public.video_watch_stats
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own watch stats" ON public.video_watch_stats
  FOR UPDATE USING (auth.uid() = user_id);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_favorite_videos_user_id ON public.user_favorite_videos(user_id);
CREATE INDEX IF NOT EXISTS idx_user_favorite_videos_video_id ON public.user_favorite_videos(video_id);
CREATE INDEX IF NOT EXISTS idx_video_watch_stats_user_id ON public.video_watch_stats(user_id);
CREATE INDEX IF NOT EXISTS idx_video_watch_stats_video_id ON public.video_watch_stats(video_id);
CREATE INDEX IF NOT EXISTS idx_video_watch_stats_watched_at ON public.video_watch_stats(watched_at);

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Favori videolar ve izleme istatistikleri tabloları oluşturuldu!';
  RAISE NOTICE '✅ RLS policies ve indexler eklendi!';
END $$;
