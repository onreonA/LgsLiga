-- Büyük Resim (Big Picture) Özelliği için Database Şeması
-- Bu dosyayı Supabase Dashboard > SQL Editor'da çalıştırın

-- 1. subjects tablosuna grade kolonu ekle (hangi sınıf için)
ALTER TABLE public.subjects 
ADD COLUMN IF NOT EXISTS grade INTEGER DEFAULT 8 CHECK (grade IN (5, 6, 7, 8));

-- 2. topics tablosuna importance_level kolonu ekle (1-3 yıldız)
ALTER TABLE public.topics 
ADD COLUMN IF NOT EXISTS importance_level INTEGER DEFAULT 2 CHECK (importance_level BETWEEN 1 AND 3);

-- 3. topics tablosuna LGS sıklığı ekle (yılda kaç soru çıkıyor)
ALTER TABLE public.topics 
ADD COLUMN IF NOT EXISTS lgs_frequency DECIMAL(3,1) DEFAULT 0;

-- 4. topics tablosuna açıklama ekle
ALTER TABLE public.topics 
ADD COLUMN IF NOT EXISTS notes TEXT;

-- 5. user_topic_planning tablosu oluştur (kullanıcının aylık planlaması)
CREATE TABLE IF NOT EXISTS public.user_topic_planning (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    topic_id UUID NOT NULL REFERENCES public.topics(id) ON DELETE CASCADE,
    planned_month INTEGER NOT NULL CHECK (planned_month BETWEEN 1 AND 12),
    planned_year INTEGER NOT NULL DEFAULT 2025,
    test_accuracy DECIMAL(5,2) DEFAULT 0 CHECK (test_accuracy BETWEEN 0 AND 100),
    exam_accuracy DECIMAL(5,2) DEFAULT 0 CHECK (exam_accuracy BETWEEN 0 AND 100),
    is_completed BOOLEAN DEFAULT false,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, topic_id, planned_month, planned_year)
);

-- İndeksler oluştur
CREATE INDEX IF NOT EXISTS idx_subjects_grade ON public.subjects(grade);
CREATE INDEX IF NOT EXISTS idx_topics_importance ON public.topics(importance_level);
CREATE INDEX IF NOT EXISTS idx_user_planning_user ON public.user_topic_planning(user_id);
CREATE INDEX IF NOT EXISTS idx_user_planning_month ON public.user_topic_planning(planned_month);
CREATE INDEX IF NOT EXISTS idx_user_planning_topic ON public.user_topic_planning(topic_id);

-- RLS (Row Level Security) politikalarını etkinleştir
ALTER TABLE public.user_topic_planning ENABLE ROW LEVEL SECURITY;

-- Kullanıcı kendi planlamasını görebilir
CREATE POLICY "Users can view their own planning"
    ON public.user_topic_planning
    FOR SELECT
    USING (auth.uid() = user_id);

-- Kullanıcı kendi planlamasını ekleyebilir
CREATE POLICY "Users can insert their own planning"
    ON public.user_topic_planning
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Kullanıcı kendi planlamasını güncelleyebilir
CREATE POLICY "Users can update their own planning"
    ON public.user_topic_planning
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Kullanıcı kendi planlamasını silebilir
CREATE POLICY "Users can delete their own planning"
    ON public.user_topic_planning
    FOR DELETE
    USING (auth.uid() = user_id);

-- Admin herkesin planlamasını görebilir
CREATE POLICY "Admin can view all planning"
    ON public.user_topic_planning
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Başarı mesajı
DO $$
BEGIN
    RAISE NOTICE '✅ Büyük Resim database şeması başarıyla oluşturuldu!';
    RAISE NOTICE '✅ subjects tablosuna grade kolonu eklendi';
    RAISE NOTICE '✅ topics tablosuna importance_level ve lgs_frequency eklendi';
    RAISE NOTICE '✅ user_topic_planning tablosu oluşturuldu';
    RAISE NOTICE '✅ RLS politikaları eklendi';
END $$;

