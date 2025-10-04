-- LgsLiga Mock Data - Veritabanı Seed Data
-- Bu dosyayı Supabase Dashboard > SQL Editor'da çalıştırın
-- Not: Önce supabase-schema.sql dosyasını çalıştırmış olmalısınız

-- =====================================================
-- 1. PROFILES (Kullanıcılar)
-- =====================================================

-- Ana öğrenci profili (Zeynep ÜNSAL)
-- Not: Bu ID'yi kendi Supabase Auth User ID'niz ile değiştirin
-- INSERT INTO public.profiles (id, email, full_name, role, grade, target_score) VALUES
-- ('YOUR_USER_ID_HERE', 'zeynep@lgsl

iga.com', 'Zeynep ÜNSAL', 'student', 8, 450);

-- Demo öğrenciler (Admin paneli için)
-- Not: Bu kullanıcıları gerçek auth kullanıcıları olarak oluşturmanız gerekir
-- Şimdilik yorum satırı olarak bırakıyorum

-- =====================================================
-- 2. TOPICS (Konular) - EKSİK TABLO EKLEME
-- =====================================================

-- Önce topics tablosunu kontrol edelim, yoksa oluşturalım
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'topics') THEN
        -- Topics tablosu zaten supabase-schema.sql'de var
        RAISE NOTICE 'Topics table already exists';
    END IF;
END $$;

-- Konular ekleme (subject_id'leri subjects tablosundan alacağız)
INSERT INTO public.topics (subject_id, name, description, difficulty_level, total_questions)
SELECT 
    s.id,
    'Çarpanlar ve Katlar',
    'Asal sayılar, çarpanlar, katlar, EBOB-EKOK konuları',
    2,
    50
FROM public.subjects s WHERE s.code = 'MAT'
ON CONFLICT DO NOTHING;

INSERT INTO public.topics (subject_id, name, description, difficulty_level, total_questions)
SELECT 
    s.id,
    'Paragraf Anlama',
    'Ana fikir, yan fikir, paragraf türleri',
    2,
    40
FROM public.subjects s WHERE s.code = 'TR'
ON CONFLICT DO NOTHING;

INSERT INTO public.topics (subject_id, name, description, difficulty_level, total_questions)
SELECT 
    s.id,
    'Kuvvet ve Hareket',
    'Hız, ivme, kuvvet kavramları',
    3,
    45
FROM public.subjects s WHERE s.code = 'FEN'
ON CONFLICT DO NOTHING;

INSERT INTO public.topics (subject_id, name, description, difficulty_level, total_questions)
SELECT 
    s.id,
    'Kurtuluş Savaşı',
    'Milli mücadele dönemi, Atatürk ilkeleri',
    2,
    35
FROM public.subjects s WHERE s.code = 'INK'
ON CONFLICT DO NOTHING;

-- =====================================================
-- 3. SHOP_REWARDS (Ödüller)
-- =====================================================

INSERT INTO public.shop_rewards (title, description, image_url, coin_price, category, is_active, stock_quantity) VALUES
('Extra Molalar', '30 dakika ekstra mola hakkı', 'https://readdy.ai/api/search-image?query=comfortable%20rest%20break%20chair%20with%20soft%20pillows%20and%20relaxing%20atmosphere%20in%20modern%20study%20room&width=400&height=300&seq=1&orientation=landscape', 150, 'break', true, 10),
('Favori Yemek', 'En sevdiğin yemeği annenden isteme hakkı', 'https://readdy.ai/api/search-image?query=delicious%20homemade%20Turkish%20food%20on%20beautiful%20dinner%20table%20family%20meal%20atmosphere&width=400&height=300&seq=2&orientation=landscape', 300, 'food', true, 5),
('Arkadaş Buluşması', '2 saatlik arkadaş buluşması izni', 'https://readdy.ai/api/search-image?query=happy%20teenagers%20friends%20meeting%20together%20in%20park%20playing%20games%20laughing%20outdoor%20activity&width=400&height=300&seq=3&orientation=landscape', 250, 'social', true, 8),
('Oyun Zamanı', '1 saat ekstra oyun/telefon zamanı', 'https://readdy.ai/api/search-image?query=gaming%20setup%20with%20colorful%20LED%20lights%20modern%20gaming%20chair%20and%20multiple%20monitors%20entertainment&width=400&height=300&seq=4&orientation=landscape', 200, 'entertainment', true, 12),
('Film Gecesi', 'Aile film gecesi ve atıştırmalık', 'https://readdy.ai/api/search-image?query=cozy%20movie%20night%20family%20watching%20film%20together%20with%20popcorn%20and%20snacks%20in%20living%20room&width=400&height=300&seq=5&orientation=landscape', 180, 'entertainment', true, 10),
('Alışveriş', '100₺ kıyafet/kitap alışverişi', 'https://readdy.ai/api/search-image?query=shopping%20mall%20with%20teenage%20clothes%20and%20books%20colorful%20display%20modern%20retail%20environment&width=400&height=300&seq=6&orientation=landscape', 400, 'shopping', true, 5),
('Özel Ders Yok', '1 gün özel ders yapmama hakkı', 'https://readdy.ai/api/search-image?query=peaceful%20empty%20study%20desk%20with%20books%20closed%20student%20taking%20break%20from%20lessons&width=400&height=300&seq=7&orientation=landscape', 350, 'break', true, 6),
('Gezi Günü', 'Ailece yarım günlük gezi', 'https://readdy.ai/api/search-image?query=family%20day%20trip%20outdoor%20beautiful%20natural%20scenery%20parents%20and%20teenager%20enjoying%20nature%20together&width=400&height=300&seq=8&orientation=landscape', 500, 'activity', true, 3)
ON CONFLICT DO NOTHING;

-- =====================================================
-- 4. USER_GOALS (Hedefler)
-- =====================================================

-- Not: user_id'yi kendi kullanıcı ID'niz ile değiştirin
-- Örnek komut:
/*
INSERT INTO public.user_goals (user_id, goal_text, goal_type, is_completed) VALUES
('YOUR_USER_ID', 'Matematik net sayımı 25''e çıkarmak', 'weekly', false),
('YOUR_USER_ID', 'Her gün en az 1 saat fen çalışmak', 'daily', true),
('YOUR_USER_ID', 'Türkçe paragraf sorularında %80 başarı', 'monthly', false),
('YOUR_USER_ID', 'LGS''ye kadar 500 soru çözmek', 'yearly', false);
*/

-- =====================================================
-- 5. FAMILY_MESSAGES (Aile Mesajları)
-- =====================================================

-- Not: user_id'yi kendi kullanıcı ID'niz ile değiştirin
/*
INSERT INTO public.family_messages (user_id, sender_name, message, message_type, is_active) VALUES
('YOUR_USER_ID', 'Anne', 'Seninle gurur duyuyoruz! Her gün biraz daha büyüyorsun. ❤️', 'motivation', true),
('YOUR_USER_ID', 'Baba', 'Bu yolculukta yalnız değilsin! Biz hep yanındayız. 🤝', 'motivation', true),
('YOUR_USER_ID', 'Abla', 'Küçük kardeşim ama büyük hedefler! Sen yaparsın! 🌟', 'congratulation', true),
('YOUR_USER_ID', 'Dede', 'Sabır ve çalışkanlık, her kapıyı açar. Sen de açacaksın! 🗝️', 'motivation', false);
*/

-- =====================================================
-- 6. WEEKLY_LETTERS (Haftalık Mektuplar)
-- =====================================================

-- Not: user_id'yi kendi kullanıcı ID'niz ile değiştirin
/*
INSERT INTO public.weekly_letters (user_id, letter_content, week_number, year) VALUES
('YOUR_USER_ID', 'Bu hafta matematik konularında gerçekten ilerleme kaydettiğimi hissediyorum. Cebir artık eskisi kadar zor gelmiyor. Önümüzdeki hafta geometriye daha çok odaklanmak istiyorum.', 3, 2024),
('YOUR_USER_ID', 'Geçen haftaki hedeflerimin çoğunu gerçekleştirdim. Özellikle Türkçe paragraf sorularında kendimi geliştirdiğimi görüyorum. Bu motivasyonumu korumalıyım.', 2, 2024);
*/

-- =====================================================
-- 7. USER_COINS (Coin Sistemi)
-- =====================================================

-- Not: user_id'yi kendi kullanıcı ID'niz ile değiştirin
/*
INSERT INTO public.user_coins (user_id, total_coins, spent_coins, earned_coins) VALUES
('YOUR_USER_ID', 1250, 350, 1600)
ON CONFLICT (user_id) DO UPDATE SET
    total_coins = 1250,
    spent_coins = 350,
    earned_coins = 1600;
*/

-- =====================================================
-- 8. QUESTS (Görevler)
-- =====================================================

-- Not: user_id ve topic_id'leri düzeltmeniz gerekir
/*
DO $$
DECLARE
    v_user_id UUID := 'YOUR_USER_ID';
    v_mat_topic_id UUID;
    v_tr_topic_id UUID;
    v_fen_topic_id UUID;
    v_ink_topic_id UUID;
BEGIN
    -- Topic ID'lerini al
    SELECT id INTO v_mat_topic_id FROM public.topics WHERE name = 'Çarpanlar ve Katlar' LIMIT 1;
    SELECT id INTO v_tr_topic_id FROM public.topics WHERE name = 'Paragraf Anlama' LIMIT 1;
    SELECT id INTO v_fen_topic_id FROM public.topics WHERE name = 'Kuvvet ve Hareket' LIMIT 1;
    SELECT id INTO v_ink_topic_id FROM public.topics WHERE name = 'Kurtuluş Savaşı' LIMIT 1;
    
    -- Görevleri ekle
    INSERT INTO public.quests (user_id, title, description, quest_type, target_value, current_progress, xp_reward, status, expires_at) VALUES
    (v_user_id, 'Matematik Çarpanlar', 'Çarpanlar ve Katlar konusunda 20 soru çöz', 'weekly', 20, 12, 150, 'active', NOW() + INTERVAL '5 days'),
    (v_user_id, 'Türkçe Paragraf', 'Paragraf Anlama sorularını çöz', 'weekly', 15, 8, 120, 'active', NOW() + INTERVAL '4 days'),
    (v_user_id, 'Fen Hareket', 'Kuvvet ve Hareket konusunda pratik yap', 'weekly', 25, 25, 200, 'completed', NOW() - INTERVAL '2 days'),
    (v_user_id, 'İnkılap Savaşları', 'Kurtuluş Savaşı konusunu pekiştir', 'daily', 18, 5, 140, 'expired', NOW() - INTERVAL '4 days');
END $$;
*/

-- =====================================================
-- 9. EXAMS (Sınavlar)
-- =====================================================

-- Not: user_id'yi kendi kullanıcı ID'niz ile değiştirin
/*
INSERT INTO public.exams (user_id, title, exam_type, total_questions, correct_answers, score, duration_minutes, status, started_at, completed_at) VALUES
('YOUR_USER_ID', 'Matematik Deneme Sınavı', 'practice', 20, 0, 0, 40, 'in_progress', NOW(), NULL),
('YOUR_USER_ID', 'Genel Deneme Sınavı #1', 'mock', 90, 0, 0, 120, 'in_progress', NOW(), NULL),
('YOUR_USER_ID', 'Türkçe Konu Sınavı', 'practice', 15, 13, 85, 30, 'completed', NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days' + INTERVAL '30 minutes'),
('YOUR_USER_ID', 'LGS Genel Deneme', 'boss_fight', 90, 0, 0, 120, 'in_progress', NOW() + INTERVAL '10 days', NULL);
*/

-- =====================================================
-- 10. STUDY_SESSIONS (Çalışma Oturumları) - Örnek Veri
-- =====================================================

-- Not: Bu veriler raporlarda grafik oluşturmak için önemli
/*
DO $$
DECLARE
    v_user_id UUID := 'YOUR_USER_ID';
    v_mat_subject_id UUID;
    v_tr_subject_id UUID;
    v_fen_subject_id UUID;
    v_sos_subject_id UUID;
BEGIN
    -- Subject ID'lerini al
    SELECT id INTO v_mat_subject_id FROM public.subjects WHERE code = 'MAT' LIMIT 1;
    SELECT id INTO v_tr_subject_id FROM public.subjects WHERE code = 'TR' LIMIT 1;
    SELECT id INTO v_fen_subject_id FROM public.subjects WHERE code = 'FEN' LIMIT 1;
    SELECT id INTO v_sos_subject_id FROM public.subjects WHERE code = 'SOS' LIMIT 1;
    
    -- Son 7 günlük çalışma oturumları
    INSERT INTO public.study_sessions (user_id, subject_id, questions_solved, correct_answers, xp_earned, duration_minutes, session_type, completed_at) VALUES
    -- Bugün
    (v_user_id, v_mat_subject_id, 25, 22, 220, 45, 'practice', NOW()),
    (v_user_id, v_tr_subject_id, 18, 16, 160, 30, 'practice', NOW() - INTERVAL '2 hours'),
    
    -- Dün
    (v_user_id, v_fen_subject_id, 22, 20, 200, 40, 'quest', NOW() - INTERVAL '1 day'),
    (v_user_id, v_mat_subject_id, 30, 25, 250, 50, 'practice', NOW() - INTERVAL '1 day' - INTERVAL '3 hours'),
    
    -- 2 gün önce
    (v_user_id, v_tr_subject_id, 20, 18, 180, 35, 'practice', NOW() - INTERVAL '2 days'),
    (v_user_id, v_sos_subject_id, 15, 13, 130, 25, 'practice', NOW() - INTERVAL '2 days' - INTERVAL '4 hours'),
    
    -- 3 gün önce
    (v_user_id, v_mat_subject_id, 28, 24, 240, 48, 'practice', NOW() - INTERVAL '3 days'),
    
    -- 4 gün önce
    (v_user_id, v_fen_subject_id, 25, 22, 220, 42, 'quest', NOW() - INTERVAL '4 days'),
    (v_user_id, v_tr_subject_id, 22, 20, 200, 38, 'practice', NOW() - INTERVAL '4 days' - INTERVAL '2 hours'),
    
    -- 5 gün önce
    (v_user_id, v_mat_subject_id, 32, 28, 280, 55, 'practice', NOW() - INTERVAL '5 days'),
    
    -- 6 gün önce
    (v_user_id, v_sos_subject_id, 18, 15, 150, 30, 'practice', NOW() - INTERVAL '6 days');
END $$;
*/

-- =====================================================
-- KULLANIM TALİMATLARI
-- =====================================================

-- 1. Önce Supabase Dashboard'a gidin
-- 2. Authentication > Users bölümünden kendi user ID'nizi kopyalayın
-- 3. Bu dosyada 'YOUR_USER_ID' yazan yerleri kendi ID'nizle değiştirin
-- 4. Yorum satırlarını (/* */) kaldırın
-- 5. SQL Editor'da çalıştırın

-- =====================================================
-- OTOMATIK USER_ID BULMA (OPSIYONEL)
-- =====================================================

-- Eğer sadece bir kullanıcı varsa, otomatik olarak ID'yi bulup kullanabilirsiniz:
/*
DO $$
DECLARE
    v_user_id UUID;
BEGIN
    -- İlk kullanıcının ID'sini al
    SELECT id INTO v_user_id FROM public.profiles ORDER BY created_at DESC LIMIT 1;
    
    IF v_user_id IS NOT NULL THEN
        -- Hedefler ekle
        INSERT INTO public.user_goals (user_id, goal_text, goal_type, is_completed) VALUES
        (v_user_id, 'Matematik net sayımı 25''e çıkarmak', 'weekly', false),
        (v_user_id, 'Her gün en az 1 saat fen çalışmak', 'daily', true),
        (v_user_id, 'Türkçe paragraf sorularında %80 başarı', 'monthly', false),
        (v_user_id, 'LGS''ye kadar 500 soru çözmek', 'yearly', false);
        
        -- Aile mesajları ekle
        INSERT INTO public.family_messages (user_id, sender_name, message, message_type, is_active) VALUES
        (v_user_id, 'Anne', 'Seninle gurur duyuyoruz! Her gün biraz daha büyüyorsun. ❤️', 'motivation', true),
        (v_user_id, 'Baba', 'Bu yolculukta yalnız değilsin! Biz hep yanındayız. 🤝', 'motivation', true),
        (v_user_id, 'Abla', 'Küçük kardeşim ama büyük hedefler! Sen yaparsın! 🌟', 'congratulation', true),
        (v_user_id, 'Dede', 'Sabır ve çalışkanlık, her kapıyı açar. Sen de açacaksın! 🗝️', 'motivation', false);
        
        -- Haftalık mektuplar ekle
        INSERT INTO public.weekly_letters (user_id, letter_content, week_number, year) VALUES
        (v_user_id, 'Bu hafta matematik konularında gerçekten ilerleme kaydettiğimi hissediyorum. Cebir artık eskisi kadar zor gelmiyor. Önümüzdeki hafta geometriye daha çok odaklanmak istiyorum.', 3, 2024),
        (v_user_id, 'Geçen haftaki hedeflerimin çoğunu gerçekleştirdim. Özellikle Türkçe paragraf sorularında kendimi geliştirdiğimi görüyorum. Bu motivasyonumu korumalıyım.', 2, 2024);
        
        -- Coin sistemi
        INSERT INTO public.user_coins (user_id, total_coins, spent_coins, earned_coins) VALUES
        (v_user_id, 1250, 350, 1600)
        ON CONFLICT (user_id) DO UPDATE SET
            total_coins = 1250,
            spent_coins = 350,
            earned_coins = 1600;
            
        RAISE NOTICE 'Mock data başarıyla eklendi! User ID: %', v_user_id;
    ELSE
        RAISE EXCEPTION 'Kullanıcı bulunamadı! Önce bir kullanıcı oluşturun.';
    END IF;
END $$;
*/

-- =====================================================
-- BAŞARIYLA TAMAMLANDI!
-- =====================================================
SELECT 'Mock data SQL scripti hazır! Yorum satırlarını açıp YOUR_USER_ID değerlerini güncelleyin.' AS message;

