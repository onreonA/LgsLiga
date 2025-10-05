-- Basitleştirilmiş Müfredat Seed Script
-- Önce mevcut verileri temizle, sonra ekle

-- Önce subjects tablosuna unique constraint ekle (yoksa)
ALTER TABLE public.subjects DROP CONSTRAINT IF EXISTS subjects_code_key;
ALTER TABLE public.subjects ADD CONSTRAINT subjects_code_key UNIQUE (code);

-- Şimdi 8. sınıf verilerini ekle
-- NOT: Eğer kod zaten varsa, güncelleme yap

-- Matematik 8
INSERT INTO public.subjects (name, code, color, icon, grade)
VALUES ('Matematik', 'MAT8', '#3B82F6', '📐', 8)
ON CONFLICT (code) DO UPDATE SET 
    name = EXCLUDED.name,
    color = EXCLUDED.color,
    icon = EXCLUDED.icon,
    grade = EXCLUDED.grade
RETURNING id;

-- Türkçe 8
INSERT INTO public.subjects (name, code, color, icon, grade)
VALUES ('Türkçe', 'TUR8', '#8B5CF6', '📚', 8)
ON CONFLICT (code) DO UPDATE SET 
    name = EXCLUDED.name,
    color = EXCLUDED.color,
    icon = EXCLUDED.icon,
    grade = EXCLUDED.grade
RETURNING id;

-- Fen Bilimleri 8
INSERT INTO public.subjects (name, code, color, icon, grade)
VALUES ('Fen Bilimleri', 'FEN8', '#10B981', '🔬', 8)
ON CONFLICT (code) DO UPDATE SET 
    name = EXCLUDED.name,
    color = EXCLUDED.color,
    icon = EXCLUDED.icon,
    grade = EXCLUDED.grade
RETURNING id;

-- Sosyal Bilgiler 8
INSERT INTO public.subjects (name, code, color, icon, grade)
VALUES ('Sosyal Bilgiler', 'SOS8', '#F59E0B', '🌍', 8)
ON CONFLICT (code) DO UPDATE SET 
    name = EXCLUDED.name,
    color = EXCLUDED.color,
    icon = EXCLUDED.icon,
    grade = EXCLUDED.grade
RETURNING id;

-- İngilizce 8
INSERT INTO public.subjects (name, code, color, icon, grade)
VALUES ('İngilizce', 'ENG8', '#EC4899', '🌐', 8)
ON CONFLICT (code) DO UPDATE SET 
    name = EXCLUDED.name,
    color = EXCLUDED.color,
    icon = EXCLUDED.icon,
    grade = EXCLUDED.grade
RETURNING id;

-- Din Kültürü 8
INSERT INTO public.subjects (name, code, color, icon, grade)
VALUES ('Din Kültürü', 'DIN8', '#6366F1', '📖', 8)
ON CONFLICT (code) DO UPDATE SET 
    name = EXCLUDED.name,
    color = EXCLUDED.color,
    icon = EXCLUDED.icon,
    grade = EXCLUDED.grade
RETURNING id;

-- 8. sınıf konularını ekle
DO $$
DECLARE
    v_subject_id UUID;
BEGIN
    -- Matematik konuları
    SELECT id INTO v_subject_id FROM public.subjects WHERE code = 'MAT8';
    
    INSERT INTO public.topics (subject_id, name, description, difficulty_level, importance_level, lgs_frequency, total_questions)
    VALUES 
        (v_subject_id, 'Çarpanlar ve Katlar', 'EBOB, EKOK, Asal Çarpanlar', 2, 2, 2.2, 0),
        (v_subject_id, 'Üslü İfadeler', 'Üslü Sayılar ve Özellikleri', 2, 3, 3.0, 0),
        (v_subject_id, 'Karekök ve Köklü İfadeler', 'Karekök Alma, Köklü Sayılarla İşlemler', 3, 3, 3.4, 0),
        (v_subject_id, 'Veri Analizi', 'Merkezi Eğilim, Grafik Yorumlama', 2, 2, 1.8, 0),
        (v_subject_id, 'Basit Olayların Olasılığı', 'Olasılık Hesaplama', 2, 2, 1.6, 0),
        (v_subject_id, 'Cebirsel İfadeler ve Özdeşlikler', 'Çarpanlara Ayırma, Özdeşlikler', 3, 3, 2.8, 0),
        (v_subject_id, 'Doğrusal Denklemler', 'Birinci Dereceden Denklemler', 2, 2, 2.2, 0),
        (v_subject_id, 'Eşitsizlikler', 'Birinci Dereceden Eşitsizlikler', 2, 2, 1.2, 0),
        (v_subject_id, 'Dönüşüm Geometrisi', 'Öteleme, Yansıma, Dönme', 3, 1, 0.6, 0),
        (v_subject_id, 'Geometrik Cisimler', 'Prizma, Piramit, Silindir', 2, 1, 0.6, 0),
        (v_subject_id, 'Üçgenler', 'Üçgen Çeşitleri, Açı-Kenar Bağıntıları', 3, 2, 1.4, 0),
        (v_subject_id, 'Eşlik ve Benzerlik', 'Üçgenlerde Eşlik ve Benzerlik', 3, 1, 0.8, 0)
    ON CONFLICT DO NOTHING;

    -- Türkçe konuları
    SELECT id INTO v_subject_id FROM public.subjects WHERE code = 'TUR8';
    
    INSERT INTO public.topics (subject_id, name, description, difficulty_level, importance_level, lgs_frequency, total_questions)
    VALUES 
        (v_subject_id, 'Sözcükte Anlam', 'Gerçek-Mecaz-Yan Anlam, Eş-Zıt Anlam', 2, 2, 2.2, 0),
        (v_subject_id, 'Deyimler ve Atasözleri', 'Deyim ve Atasözlerinin Anlamı', 1, 1, 0.6, 0),
        (v_subject_id, 'Cümlede Anlam', 'Cümle Türleri, Anlatım Biçimleri', 2, 2, 2.2, 0),
        (v_subject_id, 'Paragraf Anlama', 'Ana Düşünce, Yardımcı Düşünce, Paragraf Soruları', 3, 3, 6.0, 0),
        (v_subject_id, 'Sözel Mantık ve Görsel Okuma', 'Mantıksal Çıkarım, Tablo-Grafik Yorumlama', 3, 3, 4.4, 0),
        (v_subject_id, 'Metin Türleri', 'Bilgilendirici, Öyküleyici Metinler', 2, 1, 0.8, 0),
        (v_subject_id, 'Noktalama İşaretleri', 'Virgül, Nokta, İki Nokta vb.', 1, 1, 0.8, 0),
        (v_subject_id, 'Yazım Kuralları', 'Büyük-Küçük Harf, Birleşik Yazım', 1, 1, 0.8, 0),
        (v_subject_id, 'Anlatım Bozukluğu', 'Cümlede Anlatım Hataları', 2, 1, 0.4, 0),
        (v_subject_id, 'Cümle Türleri', 'Basit-Bileşik-Sıralı-İç İçe Cümleler', 2, 1, 0.4, 0),
        (v_subject_id, 'Cümlenin Öğeleri', 'Özne, Yüklem, Nesne, Tümleç', 2, 1, 0.4, 0)
    ON CONFLICT DO NOTHING;

    -- Fen Bilimleri konuları
    SELECT id INTO v_subject_id FROM public.subjects WHERE code = 'FEN8';
    
    INSERT INTO public.topics (subject_id, name, description, difficulty_level, importance_level, lgs_frequency, total_questions)
    VALUES 
        (v_subject_id, 'Mevsimler ve İklim', 'Dünya Hareketleri, İklim Kuşakları', 2, 2, 2.0, 0),
        (v_subject_id, 'DNA ve Genetik Kod', 'DNA Yapısı, Kalıtım, Genetik', 3, 3, 5.8, 0),
        (v_subject_id, 'Basınç', 'Katı, Sıvı, Gaz Basıncı', 3, 3, 3.2, 0),
        (v_subject_id, 'Madde ve Endüstri', 'Kimyasal Tepkimeler, Asit-Baz', 3, 3, 4.6, 0),
        (v_subject_id, 'Basit Makineler', 'Kaldıraç, Makara, Eğik Düzlem', 2, 2, 1.6, 0),
        (v_subject_id, 'Enerji Dönüşümleri ve Çevre', 'Enerji Türleri, Çevre Sorunları', 2, 3, 3.2, 0),
        (v_subject_id, 'Elektrik Yükleri ve Enerjisi', 'Elektriklenme, Basit Devre', 3, 2, 1.6, 0)
    ON CONFLICT DO NOTHING;

    -- Sosyal Bilgiler konuları
    SELECT id INTO v_subject_id FROM public.subjects WHERE code = 'SOS8';
    
    INSERT INTO public.topics (subject_id, name, description, difficulty_level, importance_level, lgs_frequency, total_questions)
    VALUES 
        (v_subject_id, 'İnsan Hakları ve Demokrasi', 'Temel Haklar, Demokrasi İlkeleri', 2, 3, 3.0, 0),
        (v_subject_id, 'Atatürk İlkeleri', 'Cumhuriyetçilik, Laiklik, Milliyetçilik', 2, 3, 4.0, 0),
        (v_subject_id, 'Coğrafya', 'Türkiye ve Dünya Coğrafyası', 2, 2, 3.5, 0),
        (v_subject_id, 'Ekonomi', 'Ekonomik Kavramlar, Arz-Talep', 2, 2, 2.5, 0),
        (v_subject_id, 'Tarih', 'Osmanlı Tarihi, Kurtuluş Savaşı', 2, 2, 3.0, 0)
    ON CONFLICT DO NOTHING;

    -- İngilizce konuları
    SELECT id INTO v_subject_id FROM public.subjects WHERE code = 'ENG8';
    
    INSERT INTO public.topics (subject_id, name, description, difficulty_level, importance_level, lgs_frequency, total_questions)
    VALUES 
        (v_subject_id, 'Friendship', 'Arkadaşlık, Sıfatlar', 1, 2, 1.5, 0),
        (v_subject_id, 'Teen Life', 'Ergenlik, Günlük Rutinler', 1, 2, 1.5, 0),
        (v_subject_id, 'In The Kitchen', 'Yemek Tarifleri, Mutfak', 2, 2, 1.5, 0),
        (v_subject_id, 'Communication', 'İletişim Araçları', 2, 2, 1.5, 0),
        (v_subject_id, 'The Internet', 'İnternet Kullanımı', 2, 2, 1.0, 0),
        (v_subject_id, 'Adventures', 'Macera, Geçmiş Zaman', 2, 3, 2.0, 0),
        (v_subject_id, 'Tourism', 'Turizm, Yer Tarifi', 2, 2, 1.5, 0),
        (v_subject_id, 'Chores', 'Ev İşleri', 1, 1, 1.0, 0)
    ON CONFLICT DO NOTHING;

    -- Din Kültürü konuları
    SELECT id INTO v_subject_id FROM public.subjects WHERE code = 'DIN8';
    
    IF v_subject_id IS NOT NULL THEN
        INSERT INTO public.topics (subject_id, name, description, difficulty_level, importance_level, lgs_frequency, total_questions)
        VALUES 
            (v_subject_id, 'İslam Dini', 'Temel İbadetler', 1, 2, 2.0, 0),
            (v_subject_id, 'Peygamber Efendimiz', 'Hz. Muhammed''in Hayatı', 2, 2, 2.0, 0),
            (v_subject_id, 'Kuran ve Meal', 'Kuran Okuması', 1, 2, 1.5, 0)
        ON CONFLICT DO NOTHING;
    END IF;

    RAISE NOTICE '8. Sinif verileri eklendi!';
END $$;

-- Sonuç kontrolü
SELECT 
    '8. SINIF DERSLERİ' as baslik,
    COUNT(*) as toplam_ders
FROM public.subjects 
WHERE grade = 8;

SELECT 
    s.name as ders,
    COUNT(t.id) as konu_sayisi
FROM public.subjects s
LEFT JOIN public.topics t ON t.subject_id = s.id
WHERE s.grade = 8
GROUP BY s.name
ORDER BY s.name;

