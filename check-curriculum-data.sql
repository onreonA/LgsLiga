-- Müfredat Verilerini Kontrol Et
-- Bu scripti Supabase SQL Editor'da çalıştırın

-- 1. subjects tablosunu kontrol et
SELECT 'SUBJECTS TABLOSU' as table_name;
SELECT 
    grade,
    COUNT(*) as ders_sayisi,
    STRING_AGG(name, ', ') as dersler
FROM public.subjects
GROUP BY grade
ORDER BY grade;

-- 2. grade kolonu var mı kontrol et
SELECT 'GRADE KOLONU KONTROLÜ' as check_name;
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'subjects' 
AND column_name = 'grade';

-- 3. topics tablosunda importance_level var mı
SELECT 'TOPICS KOLONLARI' as check_name;
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'topics' 
AND column_name IN ('importance_level', 'lgs_frequency');

-- 4. Toplam konu sayısı
SELECT 'TOPLAM KONU SAYISI' as stat_name;
SELECT COUNT(*) as toplam_konu FROM public.topics;

-- 5. Sınıf bazında konu sayısı
SELECT 'SINIF BAZINDA KONU SAYISI' as stat_name;
SELECT 
    s.grade,
    s.name as ders_adi,
    COUNT(t.id) as konu_sayisi
FROM public.subjects s
LEFT JOIN public.topics t ON t.subject_id = s.id
GROUP BY s.grade, s.name
ORDER BY s.grade, s.name;

-- 6. user_topic_planning tablosu var mı
SELECT 'USER_TOPIC_PLANNING KONTROLÜ' as check_name;
SELECT COUNT(*) as kayit_sayisi FROM public.user_topic_planning;

