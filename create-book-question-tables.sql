-- Kitap Soruları Sistemi için Veritabanı Tabloları
-- Bu script kitap okuma sonrası test sistemi için gerekli tabloları oluşturur

-- 1. Kitap Soruları Tablosu
CREATE TABLE IF NOT EXISTS public.book_questions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    book_id UUID NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    option_a TEXT NOT NULL,
    option_b TEXT NOT NULL,
    option_c TEXT NOT NULL,
    option_d TEXT NOT NULL,
    correct_answer CHAR(1) NOT NULL CHECK (correct_answer IN ('A', 'B', 'C', 'D')),
    explanation TEXT,
    difficulty_level VARCHAR(20) DEFAULT 'medium' CHECK (difficulty_level IN ('easy', 'medium', 'hard')),
    question_order INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Kitap Soru Denemeleri Tablosu
CREATE TABLE IF NOT EXISTS public.book_question_attempts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    book_id UUID NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES public.book_questions(id) ON DELETE CASCADE,
    selected_answer CHAR(1) CHECK (selected_answer IN ('A', 'B', 'C', 'D')),
    is_correct BOOLEAN NOT NULL,
    time_spent_seconds INTEGER DEFAULT 0,
    attempted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Kitap Test Oturumları Tablosu
CREATE TABLE IF NOT EXISTS public.book_test_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    book_id UUID NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
    total_questions INTEGER NOT NULL,
    correct_answers INTEGER NOT NULL DEFAULT 0,
    wrong_answers INTEGER NOT NULL DEFAULT 0,
    score INTEGER NOT NULL DEFAULT 0,
    completion_percentage DECIMAL(5,2) NOT NULL DEFAULT 0,
    total_time_seconds INTEGER DEFAULT 0,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'abandoned'))
);

-- İndeksler
CREATE INDEX IF NOT EXISTS idx_book_questions_book_id ON public.book_questions(book_id);
CREATE INDEX IF NOT EXISTS idx_book_questions_order ON public.book_questions(book_id, question_order);
CREATE INDEX IF NOT EXISTS idx_book_question_attempts_user_id ON public.book_question_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_book_question_attempts_book_id ON public.book_question_attempts(book_id);
CREATE INDEX IF NOT EXISTS idx_book_question_attempts_attempted_at ON public.book_question_attempts(attempted_at);
CREATE INDEX IF NOT EXISTS idx_book_test_sessions_user_id ON public.book_test_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_book_test_sessions_book_id ON public.book_test_sessions(book_id);
CREATE INDEX IF NOT EXISTS idx_book_test_sessions_completed_at ON public.book_test_sessions(completed_at);

-- RLS (Row Level Security) Politikaları
ALTER TABLE public.book_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.book_question_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.book_test_sessions ENABLE ROW LEVEL SECURITY;

-- Book Questions Policies
CREATE POLICY "Users can view book questions" ON public.book_questions
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage book questions" ON public.book_questions
    FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'))
    WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Book Question Attempts Policies
CREATE POLICY "Users can view own attempts" ON public.book_question_attempts
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own attempts" ON public.book_question_attempts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all attempts" ON public.book_question_attempts
    FOR SELECT USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Book Test Sessions Policies
CREATE POLICY "Users can view own test sessions" ON public.book_test_sessions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own test sessions" ON public.book_test_sessions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own test sessions" ON public.book_test_sessions
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all test sessions" ON public.book_test_sessions
    FOR SELECT USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Trigger fonksiyonu - updated_at otomatik güncelleme
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Updated_at trigger'ları
CREATE TRIGGER update_book_questions_updated_at BEFORE UPDATE ON public.book_questions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Örnek veri ekleme (Suç ve Ceza kitabı için)
INSERT INTO public.book_questions (book_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, question_order, difficulty_level)
VALUES 
(
    '3807e4cb-25a6-4349-bffe-683689097a05', -- Suç ve Ceza kitap ID'si
    'Raskolnikov''un tefeci kadını öldürme planının temel nedeni nedir?',
    'Parasız kaldığı için',
    'Ahlaki üstünlük teorisini test etmek için',
    'Ailesine yardım etmek için',
    'Kız kardeşini kurtarmak için',
    'B',
    'Raskolnikov, sıradan insanlardan üstün olan "olağanüstü" insanların ahlak kurallarından muaf olduğuna inanır ve bu teoriyi test etmek ister.',
    1,
    'medium'
),
(
    '3807e4cb-25a6-4349-bffe-683689097a05',
    'Marmeladov karakterinin hikayedeki rolü nedir?',
    'Raskolnikov''un suç ortağıdır',
    'Raskolnikov''un vicdanını temsil eder',
    'Sadece yan karakterdir',
    'Polis memurudur',
    'B',
    'Marmeladov, Raskolnikov''un iç çatışmalarını ve vicdan azabını yansıtan önemli bir karakterdir.',
    2,
    'hard'
),
(
    '3807e4cb-25a6-4349-bffe-683689097a05',
    'Raskolnikov''un psikolojik durumu kitap boyunca nasıl değişir?',
    'Sürekli kötüleşir',
    'İlk başta kötüleşir, sonra iyileşir',
    'Hiç değişmez',
    'Sürekli iyileşir',
    'B',
    'Raskolnikov, suç işledikten sonra psikolojik çöküntü yaşar, ancak sonunda pişmanlık ve kabul süreci başlar.',
    3,
    'hard'
);

-- Başarılı mesaj
SELECT 'Kitap soruları sistemi tabloları başarıyla oluşturuldu!' as message;
