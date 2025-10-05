-- Müfredat Verileri (5-6-7-8. Sınıflar)
-- Bu dosyayı Supabase Dashboard > SQL Editor'da çalıştırın
-- ÖNCELİKLE create-big-picture-schema.sql dosyasını çalıştırın!

-- ============================================
-- 8. SINIF - MATEMATİK
-- ============================================
DO $$
DECLARE
    math8_id UUID;
    turkce8_id UUID;
    fen8_id UUID;
    sosyal8_id UUID;
    ingilizce8_id UUID;
BEGIN
    -- Matematik 8
    INSERT INTO public.subjects (name, code, color, icon, grade)
    VALUES ('Matematik', 'MAT8', '#3B82F6', '📐', 8)
    ON CONFLICT (code) DO UPDATE SET grade = 8
    RETURNING id INTO math8_id;

    -- Matematik konuları
    INSERT INTO public.topics (subject_id, name, description, difficulty_level, importance_level, lgs_frequency) VALUES
    (math8_id, 'Çarpanlar ve Katlar', 'EBOB, EKOK, Asal Çarpanlar', 2, 2, 2.2),
    (math8_id, 'Üslü İfadeler', 'Üslü Sayılar ve Özellikleri', 2, 3, 3.0),
    (math8_id, 'Karekök ve Köklü İfadeler', 'Karekök Alma, Köklü Sayılarla İşlemler', 3, 3, 3.4),
    (math8_id, 'Veri Analizi', 'Merkezi Eğilim, Grafik Yorumlama', 2, 2, 1.8),
    (math8_id, 'Basit Olayların Olasılığı', 'Olasılık Hesaplama', 2, 2, 1.6),
    (math8_id, 'Cebirsel İfadeler ve Özdeşlikler', 'Çarpanlara Ayırma, Özdeşlikler', 3, 3, 2.8),
    (math8_id, 'Doğrusal Denklemler', 'Birinci Dereceden Denklemler', 2, 2, 2.2),
    (math8_id, 'Eşitsizlikler', 'Birinci Dereceden Eşitsizlikler', 2, 2, 1.2),
    (math8_id, 'Dönüşüm Geometrisi', 'Öteleme, Yansıma, Dönme', 3, 1, 0.6),
    (math8_id, 'Geometrik Cisimler', 'Prizma, Piramit, Silindir', 2, 1, 0.6),
    (math8_id, 'Üçgenler', 'Üçgen Çeşitleri, Açı-Kenar Bağıntıları', 3, 2, 1.4),
    (math8_id, 'Eşlik ve Benzerlik', 'Üçgenlerde Eşlik ve Benzerlik', 3, 1, 0.8)
    ON CONFLICT DO NOTHING;

    -- Türkçe 8
    INSERT INTO public.subjects (name, code, color, icon, grade)
    VALUES ('Türkçe', 'TUR8', '#8B5CF6', '📚', 8)
    ON CONFLICT (code) DO UPDATE SET grade = 8
    RETURNING id INTO turkce8_id;

    -- Türkçe konuları
    INSERT INTO public.topics (subject_id, name, description, difficulty_level, importance_level, lgs_frequency) VALUES
    (turkce8_id, 'Sözcükte Anlam', 'Gerçek-Mecaz-Yan Anlam, Eş-Zıt Anlam', 2, 2, 2.2),
    (turkce8_id, 'Deyimler ve Atasözleri', 'Deyim ve Atasözlerinin Anlamı', 1, 1, 0.6),
    (turkce8_id, 'Cümlede Anlam', 'Cümle Türleri, Anlatım Biçimleri', 2, 2, 2.2),
    (turkce8_id, 'Paragraf Anlama', 'Ana Düşünce, Yardımcı Düşünce, Paragraf Soruları', 3, 3, 6.0),
    (turkce8_id, 'Sözel Mantık ve Görsel Okuma', 'Mantıksal Çıkarım, Tablo-Grafik Yorumlama', 3, 3, 4.4),
    (turkce8_id, 'Metin Türleri', 'Bilgilendirici, Öyküleyici Metinler', 2, 1, 0.8),
    (turkce8_id, 'Noktalama İşaretleri', 'Virgül, Nokta, İki Nokta vb.', 1, 1, 0.8),
    (turkce8_id, 'Yazım Kuralları', 'Büyük-Küçük Harf, Birleşik Yazım', 1, 1, 0.8),
    (turkce8_id, 'Anlatım Bozukluğu', 'Cümlede Anlatım Hataları', 2, 1, 0.4),
    (turkce8_id, 'Cümle Türleri', 'Basit-Bileşik-Sıralı-İç İçe Cümleler', 2, 1, 0.4),
    (turkce8_id, 'Cümlenin Öğeleri', 'Özne, Yüklem, Nesne, Tümleç', 2, 1, 0.4)
    ON CONFLICT DO NOTHING;

    -- Fen Bilimleri 8
    INSERT INTO public.subjects (name, code, color, icon, grade)
    VALUES ('Fen Bilimleri', 'FEN8', '#10B981', '🔬', 8)
    ON CONFLICT (code) DO UPDATE SET grade = 8
    RETURNING id INTO fen8_id;

    -- Fen konuları
    INSERT INTO public.topics (subject_id, name, description, difficulty_level, importance_level, lgs_frequency) VALUES
    (fen8_id, 'Mevsimler ve İklim', 'Dünya Hareketleri, İklim Kuşakları', 2, 2, 2.0),
    (fen8_id, 'DNA ve Genetik Kod', 'DNA Yapısı, Kalıtım, Genetik', 3, 3, 5.8),
    (fen8_id, 'Basınç', 'Katı, Sıvı, Gaz Basıncı', 3, 3, 3.2),
    (fen8_id, 'Madde ve Endüstri', 'Kimyasal Tepkimeler, Asit-Baz', 3, 3, 4.6),
    (fen8_id, 'Basit Makineler', 'Kaldıraç, Makara, Eğik Düzlem', 2, 2, 1.6),
    (fen8_id, 'Enerji Dönüşümleri ve Çevre', 'Enerji Türleri, Çevre Sorunları', 2, 3, 3.2),
    (fen8_id, 'Elektrik Yükleri ve Enerjisi', 'Elektriklenme, Basit Devre', 3, 2, 1.6)
    ON CONFLICT DO NOTHING;

    -- Sosyal Bilgiler 8
    INSERT INTO public.subjects (name, code, color, icon, grade)
    VALUES ('Sosyal Bilgiler', 'SOS8', '#F59E0B', '🌍', 8)
    ON CONFLICT (code) DO UPDATE SET grade = 8
    RETURNING id INTO sosyal8_id;

    INSERT INTO public.topics (subject_id, name, description, difficulty_level, importance_level, lgs_frequency) VALUES
    (sosyal8_id, 'İnsan Hakları ve Demokrasi', 'Temel Haklar, Demokrasi İlkeleri', 2, 3, 3.0),
    (sosyal8_id, 'Atatürk İlkeleri', 'Cumhuriyetçilik, Laiklik, Milliyetçilik', 2, 3, 4.0),
    (sosyal8_id, 'Coğrafya', 'Türkiye ve Dünya Coğrafyası', 2, 2, 3.5),
    (sosyal8_id, 'Ekonomi', 'Ekonomik Kavramlar, Arz-Talep', 2, 2, 2.5),
    (sosyal8_id, 'Tarih', 'Osmanlı Tarihi, Kurtuluş Savaşı', 2, 2, 3.0)
    ON CONFLICT DO NOTHING;

    -- İngilizce 8
    INSERT INTO public.subjects (name, code, color, icon, grade)
    VALUES ('İngilizce', 'ENG8', '#EC4899', '🌐', 8)
    ON CONFLICT (code) DO UPDATE SET grade = 8
    RETURNING id INTO ingilizce8_id;

    INSERT INTO public.topics (subject_id, name, description, difficulty_level, importance_level, lgs_frequency) VALUES
    (ingilizce8_id, 'Friendship', 'Arkadaşlık, Sıfatlar', 1, 2, 1.5),
    (ingilizce8_id, 'Teen Life', 'Ergenlik, Günlük Rutinler', 1, 2, 1.5),
    (ingilizce8_id, 'In The Kitchen', 'Yemek Tarifleri, Mutfak', 2, 2, 1.5),
    (ingilizce8_id, 'Communication', 'İletişim Araçları', 2, 2, 1.5),
    (ingilizce8_id, 'The Internet', 'İnternet Kullanımı', 2, 2, 1.0),
    (ingilizce8_id, 'Adventures', 'Macera, Geçmiş Zaman', 2, 3, 2.0),
    (ingilizce8_id, 'Tourism', 'Turizm, Yer Tarifi', 2, 2, 1.5),
    (ingilizce8_id, 'Chores', 'Ev İşleri', 1, 1, 1.0)
    ON CONFLICT DO NOTHING;

    RAISE NOTICE '✅ 8. Sınıf müfredatı eklendi!';
END $$;

-- ============================================
-- 7. SINIF - TEMEL DERSLER
-- ============================================
DO $$
DECLARE
    math7_id UUID;
    turkce7_id UUID;
    fen7_id UUID;
BEGIN
    -- Matematik 7
    INSERT INTO public.subjects (name, code, color, icon, grade)
    VALUES ('Matematik', 'MAT7', '#3B82F6', '📐', 7)
    ON CONFLICT (code) DO UPDATE SET grade = 7
    RETURNING id INTO math7_id;

    INSERT INTO public.topics (subject_id, name, description, difficulty_level, importance_level, lgs_frequency) VALUES
    (math7_id, 'Tam Sayılar', 'Tam Sayılarla İşlemler', 1, 2, 0),
    (math7_id, 'Rasyonel Sayılar', 'Kesirler, Ondalık Sayılar', 2, 3, 0),
    (math7_id, 'Oran ve Orantı', 'Doğru-Ters Orantı', 2, 2, 0),
    (math7_id, 'Yüzdeler', 'Yüzde Hesaplama, Problemler', 2, 3, 0),
    (math7_id, 'Cebirsel İfadeler', 'Değişken, Terim, Katsayı', 2, 2, 0),
    (math7_id, 'Denklemler', 'Birinci Dereceden Denklemler', 2, 3, 0),
    (math7_id, 'Çember ve Daire', 'Çember Özellikleri', 2, 2, 0),
    (math7_id, 'Veri Analizi', 'Merkezi Eğilim Ölçüleri', 2, 2, 0)
    ON CONFLICT DO NOTHING;

    -- Türkçe 7
    INSERT INTO public.subjects (name, code, color, icon, grade)
    VALUES ('Türkçe', 'TUR7', '#8B5CF6', '📚', 7)
    ON CONFLICT (code) DO UPDATE SET grade = 7
    RETURNING id INTO turkce7_id;

    INSERT INTO public.topics (subject_id, name, description, difficulty_level, importance_level, lgs_frequency) VALUES
    (turkce7_id, 'Sözcükte Anlam', 'Anlam İlişkileri', 2, 2, 0),
    (turkce7_id, 'Cümlede Anlam', 'Cümle Çeşitleri', 2, 2, 0),
    (turkce7_id, 'Paragraf', 'Ana Fikir, Yardımcı Fikir', 2, 3, 0),
    (turkce7_id, 'Metin Türleri', 'Anlatım Türleri', 2, 2, 0),
    (turkce7_id, 'Yazım Kuralları', 'İmlâ Kuralları', 1, 1, 0)
    ON CONFLICT DO NOTHING;

    -- Fen 7
    INSERT INTO public.subjects (name, code, color, icon, grade)
    VALUES ('Fen Bilimleri', 'FEN7', '#10B981', '🔬', 7)
    ON CONFLICT (code) DO UPDATE SET grade = 7
    RETURNING id INTO fen7_id;

    INSERT INTO public.topics (subject_id, name, description, difficulty_level, importance_level, lgs_frequency) VALUES
    (fen7_id, 'Güneş Sistemi', 'Gezegenler, Uzay', 2, 2, 0),
    (fen7_id, 'Hücre ve Bölünmeler', 'Hücre Yapısı, Mitoz', 2, 3, 0),
    (fen7_id, 'Kuvvet ve Hareket', 'Newton Yasaları', 2, 3, 0),
    (fen7_id, 'Maddenin Yapısı', 'Atom, Molekül', 2, 3, 0),
    (fen7_id, 'Işık', 'Işığın Yayılması, Aynalar', 2, 2, 0)
    ON CONFLICT DO NOTHING;

    RAISE NOTICE '✅ 7. Sınıf müfredatı eklendi!';
END $$;

-- ============================================
-- 6. SINIF - TEMEL DERSLER
-- ============================================
DO $$
DECLARE
    math6_id UUID;
    turkce6_id UUID;
    fen6_id UUID;
BEGIN
    -- Matematik 6
    INSERT INTO public.subjects (name, code, color, icon, grade)
    VALUES ('Matematik', 'MAT6', '#3B82F6', '📐', 6)
    ON CONFLICT (code) DO UPDATE SET grade = 6
    RETURNING id INTO math6_id;

    INSERT INTO public.topics (subject_id, name, description, difficulty_level, importance_level, lgs_frequency) VALUES
    (math6_id, 'Doğal Sayılar', 'Doğal Sayılarla İşlemler', 1, 2, 0),
    (math6_id, 'Kesirler', 'Kesir Türleri, İşlemler', 2, 3, 0),
    (math6_id, 'Ondalık Gösterim', 'Ondalık Sayılar', 2, 3, 0),
    (math6_id, 'Oran', 'Oran Kavramı', 2, 2, 0),
    (math6_id, 'Açılar', 'Açı Çeşitleri, Ölçme', 2, 2, 0),
    (math6_id, 'Alan Ölçme', 'Dikdörtgen, Kare Alanı', 2, 2, 0)
    ON CONFLICT DO NOTHING;

    -- Türkçe 6
    INSERT INTO public.subjects (name, code, color, icon, grade)
    VALUES ('Türkçe', 'TUR6', '#8B5CF6', '📚', 6)
    ON CONFLICT (code) DO UPDATE SET grade = 6
    RETURNING id INTO turkce6_id;

    INSERT INTO public.topics (subject_id, name, description, difficulty_level, importance_level, lgs_frequency) VALUES
    (turkce6_id, 'Sözcük Türleri', 'İsim, Fiil, Sıfat', 2, 2, 0),
    (turkce6_id, 'Anlamca İlişkili Sözcükler', 'Eş-Zıt Anlam', 1, 2, 0),
    (turkce6_id, 'Cümle Bilgisi', 'Cümle Öğeleri', 2, 2, 0),
    (turkce6_id, 'Okuduğunu Anlama', 'Metin Anlama', 2, 3, 0)
    ON CONFLICT DO NOTHING;

    -- Fen 6
    INSERT INTO public.subjects (name, code, color, icon, grade)
    VALUES ('Fen Bilimleri', 'FEN6', '#10B981', '🔬', 6)
    ON CONFLICT (code) DO UPDATE SET grade = 6
    RETURNING id INTO fen6_id;

    INSERT INTO public.topics (subject_id, name, description, difficulty_level, importance_level, lgs_frequency) VALUES
    (fen6_id, 'Vücudumuz', 'Sistemler, Organlar', 2, 2, 0),
    (fen6_id, 'Kuvvet ve Hareket', 'Temel Kavramlar', 2, 2, 0),
    (fen6_id, 'Madde ve Değişim', 'Fiziksel-Kimyasal Değişim', 2, 3, 0),
    (fen6_id, 'Dünya ve Evren', 'Dünya, Ay, Güneş', 2, 2, 0)
    ON CONFLICT DO NOTHING;

    RAISE NOTICE '✅ 6. Sınıf müfredatı eklendi!';
END $$;

-- ============================================
-- 5. SINIF - TEMEL DERSLER
-- ============================================
DO $$
DECLARE
    math5_id UUID;
    turkce5_id UUID;
    fen5_id UUID;
BEGIN
    -- Matematik 5
    INSERT INTO public.subjects (name, code, color, icon, grade)
    VALUES ('Matematik', 'MAT5', '#3B82F6', '📐', 5)
    ON CONFLICT (code) DO UPDATE SET grade = 5
    RETURNING id INTO math5_id;

    INSERT INTO public.topics (subject_id, name, description, difficulty_level, importance_level, lgs_frequency) VALUES
    (math5_id, 'Doğal Sayılar', 'Temel İşlemler', 1, 2, 0),
    (math5_id, 'Kesirler', 'Basit Kesirler', 2, 2, 0),
    (math5_id, 'Geometrik Şekiller', 'Temel Şekiller', 1, 2, 0),
    (math5_id, 'Ölçme', 'Uzunluk, Ağırlık, Zaman', 1, 2, 0)
    ON CONFLICT DO NOTHING;

    -- Türkçe 5
    INSERT INTO public.subjects (name, code, color, icon, grade)
    VALUES ('Türkçe', 'TUR5', '#8B5CF6', '📚', 5)
    ON CONFLICT (code) DO UPDATE SET grade = 5
    RETURNING id INTO turkce5_id;

    INSERT INTO public.topics (subject_id, name, description, difficulty_level, importance_level, lgs_frequency) VALUES
    (turkce5_id, 'Sözcük Bilgisi', 'Temel Kelimeler', 1, 2, 0),
    (turkce5_id, 'Metin Okuma', 'Okuduğunu Anlama', 2, 3, 0),
    (turkce5_id, 'Yazım Kuralları', 'Temel Kurallar', 1, 1, 0)
    ON CONFLICT DO NOTHING;

    -- Fen 5
    INSERT INTO public.subjects (name, code, color, icon, grade)
    VALUES ('Fen Bilimleri', 'FEN5', '#10B981', '🔬', 5)
    ON CONFLICT (code) DO UPDATE SET grade = 5
    RETURNING id INTO fen5_id;

    INSERT INTO public.topics (subject_id, name, description, difficulty_level, importance_level, lgs_frequency) VALUES
    (fen5_id, 'Canlılar Dünyası', 'Bitkiler, Hayvanlar', 1, 2, 0),
    (fen5_id, 'Madde ve Değişim', 'Temel Kavramlar', 2, 2, 0),
    (fen5_id, 'Dünya ve Evren', 'Temel Bilgiler', 1, 2, 0)
    ON CONFLICT DO NOTHING;

    RAISE NOTICE '✅ 5. Sınıf müfredatı eklendi!';
END $$;

-- Başarı mesajı
DO $$
BEGIN
    RAISE NOTICE '🎉 Tüm sınıf müfredatları başarıyla eklendi!';
    RAISE NOTICE '📚 5. Sınıf: 4+3+3 = 10 konu';
    RAISE NOTICE '📚 6. Sınıf: 6+4+4 = 14 konu';
    RAISE NOTICE '📚 7. Sınıf: 8+5+5 = 18 konu';
    RAISE NOTICE '📚 8. Sınıf: 12+11+7+5+8 = 43 konu (tam detay)';
    RAISE NOTICE '💡 Toplam: 85+ konu eklendi!';
END $$;

