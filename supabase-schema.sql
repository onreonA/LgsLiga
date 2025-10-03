-- LgsLiga Veritabanı Şeması
-- Bu dosyayı Supabase Dashboard > SQL Editor'da çalıştırın

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles tablosu (kullanıcı profilleri)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'admin')),
    volleyball_days TEXT[],
    grade INTEGER,
    target_score INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subjects tablosu (dersler)
CREATE TABLE IF NOT EXISTS public.subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    code TEXT NOT NULL UNIQUE,
    color TEXT NOT NULL,
    icon TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Topics tablosu (konular)
CREATE TABLE IF NOT EXISTS public.topics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    difficulty_level INTEGER NOT NULL DEFAULT 1,
    total_questions INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Study Sessions tablosu (çalışma oturumları)
CREATE TABLE IF NOT EXISTS public.study_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    topic_id UUID REFERENCES public.topics(id) ON DELETE SET NULL,
    questions_solved INTEGER NOT NULL DEFAULT 0,
    correct_answers INTEGER NOT NULL DEFAULT 0,
    xp_earned INTEGER NOT NULL DEFAULT 0,
    duration_minutes INTEGER NOT NULL DEFAULT 0,
    session_type TEXT NOT NULL DEFAULT 'practice' CHECK (session_type IN ('practice', 'quest', 'boss', 'exam')),
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Quests tablosu (görevler)
CREATE TABLE IF NOT EXISTS public.quests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    quest_type TEXT NOT NULL CHECK (quest_type IN ('daily', 'weekly', 'monthly', 'special')),
    target_value INTEGER NOT NULL,
    current_progress INTEGER NOT NULL DEFAULT 0,
    xp_reward INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'expired')),
    expires_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Achievements tablosu (başarılar)
CREATE TABLE IF NOT EXISTS public.achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    badge_icon TEXT,
    badge_color TEXT NOT NULL DEFAULT '#FFD700',
    category TEXT NOT NULL CHECK (category IN ('study', 'boss', 'streak', 'special')),
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Exams tablosu (sınavlar)
CREATE TABLE IF NOT EXISTS public.exams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    exam_type TEXT NOT NULL CHECK (exam_type IN ('practice', 'mock', 'boss_fight')),
    total_questions INTEGER NOT NULL,
    correct_answers INTEGER NOT NULL DEFAULT 0,
    score INTEGER NOT NULL DEFAULT 0,
    duration_minutes INTEGER,
    status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'abandoned')),
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Shop Rewards tablosu (ödüller)
CREATE TABLE IF NOT EXISTS public.shop_rewards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    coin_price INTEGER NOT NULL DEFAULT 0,
    category TEXT NOT NULL DEFAULT 'general',
    is_active BOOLEAN NOT NULL DEFAULT true,
    stock_quantity INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Purchase Requests tablosu (satın alma talepleri)
CREATE TABLE IF NOT EXISTS public.purchase_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    reward_id UUID NOT NULL REFERENCES public.shop_rewards(id) ON DELETE CASCADE,
    coin_cost INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    admin_notes TEXT,
    requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed_at TIMESTAMP WITH TIME ZONE
);

-- User Coins tablosu (kullanıcı coinleri)
CREATE TABLE IF NOT EXISTS public.user_coins (
    user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    total_coins INTEGER NOT NULL DEFAULT 0,
    spent_coins INTEGER NOT NULL DEFAULT 0,
    earned_coins INTEGER NOT NULL DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Family Messages tablosu (aile mesajları)
CREATE TABLE IF NOT EXISTS public.family_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    sender_name TEXT NOT NULL,
    message TEXT NOT NULL,
    message_type TEXT NOT NULL DEFAULT 'motivation' CHECK (message_type IN ('motivation', 'congratulation', 'reminder')),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Goals tablosu (kullanıcı hedefleri)
CREATE TABLE IF NOT EXISTS public.user_goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    goal_text TEXT NOT NULL,
    goal_type TEXT NOT NULL DEFAULT 'daily' CHECK (goal_type IN ('daily', 'weekly', 'monthly', 'yearly')),
    is_completed BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Weekly Letters tablosu (haftalık mektuplar)
CREATE TABLE IF NOT EXISTS public.weekly_letters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    letter_content TEXT NOT NULL,
    week_number INTEGER NOT NULL,
    year INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- İndeksler (performans için)
CREATE INDEX IF NOT EXISTS idx_study_sessions_user_id ON public.study_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_study_sessions_completed_at ON public.study_sessions(completed_at);
CREATE INDEX IF NOT EXISTS idx_quests_user_id ON public.quests(user_id);
CREATE INDEX IF NOT EXISTS idx_quests_status ON public.quests(status);
CREATE INDEX IF NOT EXISTS idx_exams_user_id ON public.exams(user_id);
CREATE INDEX IF NOT EXISTS idx_purchase_requests_user_id ON public.purchase_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_purchase_requests_status ON public.purchase_requests(status);

-- Row Level Security (RLS) Politikaları

-- Profiles tablosu için RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Subjects tablosu herkese açık (okuma)
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view subjects" ON public.subjects
    FOR SELECT USING (true);

-- Topics tablosu herkese açık (okuma)
ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view topics" ON public.topics
    FOR SELECT USING (true);

-- Study Sessions - kullanıcılar sadece kendi verilerini görebilir
ALTER TABLE public.study_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own study sessions" ON public.study_sessions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own study sessions" ON public.study_sessions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Quests - kullanıcılar sadece kendi görevlerini görebilir
ALTER TABLE public.quests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own quests" ON public.quests
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own quests" ON public.quests
    FOR UPDATE USING (auth.uid() = user_id);

-- Achievements - kullanıcılar sadece kendi başarılarını görebilir
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own achievements" ON public.achievements
    FOR SELECT USING (auth.uid() = user_id);

-- Exams - kullanıcılar sadece kendi sınavlarını görebilir
ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own exams" ON public.exams
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own exams" ON public.exams
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own exams" ON public.exams
    FOR UPDATE USING (auth.uid() = user_id);

-- Shop Rewards herkese açık (okuma)
ALTER TABLE public.shop_rewards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view shop rewards" ON public.shop_rewards
    FOR SELECT USING (true);

-- Purchase Requests - kullanıcılar sadece kendi taleplerini görebilir
ALTER TABLE public.purchase_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own purchase requests" ON public.purchase_requests
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own purchase requests" ON public.purchase_requests
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User Coins - kullanıcılar sadece kendi coinlerini görebilir
ALTER TABLE public.user_coins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own coins" ON public.user_coins
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own coins" ON public.user_coins
    FOR UPDATE USING (auth.uid() = user_id);

-- Family Messages - kullanıcılar sadece kendi mesajlarını görebilir
ALTER TABLE public.family_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own family messages" ON public.family_messages
    FOR SELECT USING (auth.uid() = user_id);

-- User Goals - kullanıcılar sadece kendi hedeflerini görebilir
ALTER TABLE public.user_goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own goals" ON public.user_goals
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own goals" ON public.user_goals
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own goals" ON public.user_goals
    FOR UPDATE USING (auth.uid() = user_id);

-- Weekly Letters - kullanıcılar sadece kendi mektuplarını görebilir
ALTER TABLE public.weekly_letters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own letters" ON public.weekly_letters
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own letters" ON public.weekly_letters
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Örnek Ders Verileri Ekleme
INSERT INTO public.subjects (name, code, color, icon) VALUES
    ('Türkçe', 'TR', '#FF6B6B', '📚'),
    ('Matematik', 'MAT', '#4ECDC4', '🔢'),
    ('Fen Bilimleri', 'FEN', '#95E1D3', '🔬'),
    ('Sosyal Bilgiler', 'SOS', '#FFE66D', '🌍'),
    ('İngilizce', 'ING', '#A8E6CF', '🗣️'),
    ('Din Kültürü', 'DIN', '#FFD3B6', '📖'),
    ('İnkılap Tarihi', 'INK', '#FFAAA5', '🏛️')
ON CONFLICT (code) DO NOTHING;

-- Trigger: updated_at otomatik güncellemesi
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_coins_updated_at BEFORE UPDATE ON public.user_coins
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger: Yeni kullanıcı oluşturulduğunda profile ve user_coins oluştur
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, role)
    VALUES (NEW.id, NEW.email, 'student');
    
    INSERT INTO public.user_coins (user_id, total_coins, spent_coins, earned_coins)
    VALUES (NEW.id, 0, 0, 0);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Başarıyla tamamlandı!
SELECT 'Veritabanı şeması başarıyla oluşturuldu! 🎉' AS message;

