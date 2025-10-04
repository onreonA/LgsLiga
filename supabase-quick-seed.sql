-- LgsLiga Hızlı Mock Data Ekleme
-- Bu script otomatik olarak mevcut ilk kullanıcıya mock data ekler

-- =====================================================
-- 1. SHOP REWARDS (Herkese açık, user_id gerektirmez)
-- =====================================================

INSERT INTO public.shop_rewards (title, description, image_url, coin_price, category, is_active, stock_quantity) VALUES
('Extra Molalar', '30 dakika ekstra mola hakkı', 'https://via.placeholder.com/400x300/FFB6C1/000000?text=Mola', 150, 'break', true, 10),
('Favori Yemek', 'En sevdiğin yemeği annenden isteme hakkı', 'https://via.placeholder.com/400x300/FFD700/000000?text=Yemek', 300, 'food', true, 5),
('Arkadaş Buluşması', '2 saatlik arkadaş buluşması izni', 'https://via.placeholder.com/400x300/87CEEB/000000?text=Arkadas', 250, 'social', true, 8),
('Oyun Zamanı', '1 saat ekstra oyun/telefon zamanı', 'https://via.placeholder.com/400x300/9370DB/000000?text=Oyun', 200, 'entertainment', true, 12),
('Film Gecesi', 'Aile film gecesi ve atıştırmalık', 'https://via.placeholder.com/400x300/FF6347/000000?text=Film', 180, 'entertainment', true, 10),
('Alışveriş', '100₺ kıyafet/kitap alışverişi', 'https://via.placeholder.com/400x300/32CD32/000000?text=Alisveris', 400, 'shopping', true, 5),
('Özel Ders Yok', '1 gün özel ders yapmama hakkı', 'https://via.placeholder.com/400x300/FFA500/000000?text=Ders+Yok', 350, 'break', true, 6),
('Gezi Günü', 'Ailece yarım günlük gezi', 'https://via.placeholder.com/400x300/20B2AA/000000?text=Gezi', 500, 'activity', true, 3)
ON CONFLICT DO NOTHING;

-- =====================================================
-- 2. TOPICS (Konular)
-- =====================================================

INSERT INTO public.topics (subject_id, name, description, difficulty_level, total_questions)
SELECT s.id, 'Çarpanlar ve Katlar', 'Asal sayılar, çarpanlar, katlar, EBOB-EKOK konuları', 2, 50
FROM public.subjects s WHERE s.code = 'MAT' LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO public.topics (subject_id, name, description, difficulty_level, total_questions)
SELECT s.id, 'Paragraf Anlama', 'Ana fikir, yan fikir, paragraf türleri', 2, 40
FROM public.subjects s WHERE s.code = 'TR' LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO public.topics (subject_id, name, description, difficulty_level, total_questions)
SELECT s.id, 'Kuvvet ve Hareket', 'Hız, ivme, kuvvet kavramları', 3, 45
FROM public.subjects s WHERE s.code = 'FEN' LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO public.topics (subject_id, name, description, difficulty_level, total_questions)
SELECT s.id, 'Kurtuluş Savaşı', 'Milli mücadele dönemi, Atatürk ilkeleri', 2, 35
FROM public.subjects s WHERE s.code = 'INK' LIMIT 1
ON CONFLICT DO NOTHING;

-- =====================================================
-- 3. KULLANICI VERİLERİ (Otomatik)
-- =====================================================

DO $$
DECLARE
    v_user_id UUID;
    v_mat_subject_id UUID;
    v_tr_subject_id UUID;
    v_fen_subject_id UUID;
    v_sos_subject_id UUID;
    v_mat_topic_id UUID;
    v_tr_topic_id UUID;
    v_fen_topic_id UUID;
BEGIN
    -- İlk kullanıcının ID'sini al
    SELECT id INTO v_user_id FROM public.profiles ORDER BY created_at DESC LIMIT 1;
    
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Kullanıcı bulunamadı! Önce giriş yapıp profil oluşturun.';
    END IF;
    
    -- Subject ID'lerini al
    SELECT id INTO v_mat_subject_id FROM public.subjects WHERE code = 'MAT' LIMIT 1;
    SELECT id INTO v_tr_subject_id FROM public.subjects WHERE code = 'TR' LIMIT 1;
    SELECT id INTO v_fen_subject_id FROM public.subjects WHERE code = 'FEN' LIMIT 1;
    SELECT id INTO v_sos_subject_id FROM public.subjects WHERE code = 'SOS' LIMIT 1;
    
    -- Topic ID'lerini al
    SELECT id INTO v_mat_topic_id FROM public.topics WHERE name = 'Çarpanlar ve Katlar' LIMIT 1;
    SELECT id INTO v_tr_topic_id FROM public.topics WHERE name = 'Paragraf Anlama' LIMIT 1;
    SELECT id INTO v_fen_topic_id FROM public.topics WHERE name = 'Kuvvet ve Hareket' LIMIT 1;
    
    -- USER COINS
    INSERT INTO public.user_coins (user_id, total_coins, spent_coins, earned_coins) VALUES
    (v_user_id, 1250, 350, 1600)
    ON CONFLICT (user_id) DO UPDATE SET
        total_coins = EXCLUDED.total_coins,
        spent_coins = EXCLUDED.spent_coins,
        earned_coins = EXCLUDED.earned_coins;
    
    -- USER GOALS
    DELETE FROM public.user_goals WHERE user_id = v_user_id;
    INSERT INTO public.user_goals (user_id, goal_text, goal_type, is_completed) VALUES
    (v_user_id, 'Matematik net sayımı 25''e çıkarmak', 'weekly', false),
    (v_user_id, 'Her gün en az 1 saat fen çalışmak', 'daily', true),
    (v_user_id, 'Türkçe paragraf sorularında %80 başarı', 'monthly', false),
    (v_user_id, 'LGS''ye kadar 500 soru çözmek', 'yearly', false);
    
    -- FAMILY MESSAGES
    DELETE FROM public.family_messages WHERE user_id = v_user_id;
    INSERT INTO public.family_messages (user_id, sender_name, message, message_type, is_active) VALUES
    (v_user_id, 'Anne', 'Seninle gurur duyuyoruz! Her gün biraz daha büyüyorsun. ❤️', 'motivation', true),
    (v_user_id, 'Baba', 'Bu yolculukta yalnız değilsin! Biz hep yanındayız. 🤝', 'motivation', true),
    (v_user_id, 'Abla', 'Küçük kardeşim ama büyük hedefler! Sen yaparsın! 🌟', 'congratulation', true),
    (v_user_id, 'Dede', 'Sabır ve çalışkanlık, her kapıyı açar. Sen de açacaksın! 🗝️', 'motivation', false);
    
    -- WEEKLY LETTERS
    DELETE FROM public.weekly_letters WHERE user_id = v_user_id;
    INSERT INTO public.weekly_letters (user_id, letter_content, week_number, year) VALUES
    (v_user_id, 'Bu hafta matematik konularında gerçekten ilerleme kaydettiğimi hissediyorum. Cebir artık eskisi kadar zor gelmiyor. Önümüzdeki hafta geometriye daha çok odaklanmak istiyorum.', 3, 2024),
    (v_user_id, 'Geçen haftaki hedeflerimin çoğunu gerçekleştirdim. Özellikle Türkçe paragraf sorularında kendimi geliştirdiğimi görüyorum. Bu motivasyonumu korumalıyım.', 2, 2024);
    
    -- QUESTS
    DELETE FROM public.quests WHERE user_id = v_user_id;
    INSERT INTO public.quests (user_id, title, description, quest_type, target_value, current_progress, xp_reward, status, expires_at) VALUES
    (v_user_id, 'Matematik Çarpanlar', 'Çarpanlar ve Katlar konusunda 20 soru çöz', 'weekly', 20, 12, 150, 'active', NOW() + INTERVAL '5 days'),
    (v_user_id, 'Türkçe Paragraf', 'Paragraf Anlama sorularını çöz', 'weekly', 15, 8, 120, 'active', NOW() + INTERVAL '4 days'),
    (v_user_id, 'Fen Hareket', 'Kuvvet ve Hareket konusunda pratik yap', 'weekly', 25, 25, 200, 'completed', NOW() - INTERVAL '2 days'),
    (v_user_id, 'İnkılap Savaşları', 'Kurtuluş Savaşı konusunu pekiştir', 'daily', 18, 5, 140, 'expired', NOW() - INTERVAL '4 days');
    
    -- STUDY SESSIONS (Son 7 günlük veri)
    DELETE FROM public.study_sessions WHERE user_id = v_user_id;
    INSERT INTO public.study_sessions (user_id, subject_id, topic_id, questions_solved, correct_answers, xp_earned, duration_minutes, session_type, completed_at) VALUES
    -- Bugün
    (v_user_id, v_mat_subject_id, v_mat_topic_id, 25, 22, 220, 45, 'practice', NOW()),
    (v_user_id, v_tr_subject_id, v_tr_topic_id, 18, 16, 160, 30, 'practice', NOW() - INTERVAL '2 hours'),
    -- Dün
    (v_user_id, v_fen_subject_id, v_fen_topic_id, 22, 20, 200, 40, 'quest', NOW() - INTERVAL '1 day'),
    (v_user_id, v_mat_subject_id, v_mat_topic_id, 30, 25, 250, 50, 'practice', NOW() - INTERVAL '1 day' - INTERVAL '3 hours'),
    -- 2 gün önce
    (v_user_id, v_tr_subject_id, v_tr_topic_id, 20, 18, 180, 35, 'practice', NOW() - INTERVAL '2 days'),
    (v_user_id, v_sos_subject_id, NULL, 15, 13, 130, 25, 'practice', NOW() - INTERVAL '2 days' - INTERVAL '4 hours'),
    -- 3 gün önce
    (v_user_id, v_mat_subject_id, v_mat_topic_id, 28, 24, 240, 48, 'practice', NOW() - INTERVAL '3 days'),
    -- 4 gün önce
    (v_user_id, v_fen_subject_id, v_fen_topic_id, 25, 22, 220, 42, 'quest', NOW() - INTERVAL '4 days'),
    (v_user_id, v_tr_subject_id, v_tr_topic_id, 22, 20, 200, 38, 'practice', NOW() - INTERVAL '4 days' - INTERVAL '2 hours'),
    -- 5 gün önce
    (v_user_id, v_mat_subject_id, v_mat_topic_id, 32, 28, 280, 55, 'practice', NOW() - INTERVAL '5 days'),
    -- 6 gün önce
    (v_user_id, v_sos_subject_id, NULL, 18, 15, 150, 30, 'practice', NOW() - INTERVAL '6 days'),
    -- 7 gün önce
    (v_user_id, v_mat_subject_id, v_mat_topic_id, 26, 23, 230, 47, 'practice', NOW() - INTERVAL '7 days');
    
    -- EXAMS
    DELETE FROM public.exams WHERE user_id = v_user_id;
    INSERT INTO public.exams (user_id, title, exam_type, total_questions, correct_answers, score, duration_minutes, status, started_at, completed_at) VALUES
    (v_user_id, 'Türkçe Konu Sınavı', 'practice', 15, 13, 85, 30, 'completed', NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days' + INTERVAL '30 minutes'),
    (v_user_id, 'Matematik Deneme Sınavı', 'practice', 20, 0, 0, 40, 'in_progress', NOW(), NULL),
    (v_user_id, 'Genel Deneme Sınavı #1', 'mock', 90, 0, 0, 120, 'in_progress', NOW(), NULL);
    
    RAISE NOTICE '✅ Mock data başarıyla eklendi! User ID: %', v_user_id;
    RAISE NOTICE '✅ Ödüller: 8 adet';
    RAISE NOTICE '✅ Hedefler: 4 adet';
    RAISE NOTICE '✅ Aile Mesajları: 4 adet';
    RAISE NOTICE '✅ Görevler: 4 adet';
    RAISE NOTICE '✅ Çalışma Oturumları: 12 adet';
    RAISE NOTICE '✅ Sınavlar: 3 adet';
    RAISE NOTICE '✅ Coinler: 1250 coin';
    
END $$;

SELECT '🎉 Mock data ekleme tamamlandı! Uygulamayı yenileyip kontrol edin.' AS message;

