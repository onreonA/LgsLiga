-- Mevcut Derslere Grade Değeri Ata
-- Bu script mevcut dersleri kontrol edip grade atar

-- 1. Mevcut dersleri göster
SELECT 'MEVCUT DERSLER (GRADE DURUMU)' as baslik;
SELECT id, name, code, grade FROM public.subjects;

-- 2. NULL grade'leri düzelt
UPDATE public.subjects 
SET grade = 8 
WHERE grade IS NULL;

-- 3. Code kolonuna göre grade ata
UPDATE public.subjects SET grade = 8 WHERE code LIKE '%8';
UPDATE public.subjects SET grade = 7 WHERE code LIKE '%7';
UPDATE public.subjects SET grade = 6 WHERE code LIKE '%6';
UPDATE public.subjects SET grade = 5 WHERE code LIKE '%5';

-- 4. Eğer code'da rakam yoksa, varsayılan 8 yap
UPDATE public.subjects 
SET grade = 8 
WHERE grade IS NULL;

-- 5. Sonuç kontrolü
SELECT 'GÜNCELLENMIŞ DERSLER' as baslik;
SELECT grade, COUNT(*) as adet, STRING_AGG(name, ', ') as dersler
FROM public.subjects
GROUP BY grade
ORDER BY grade;

-- 6. Topics kontrolü
SELECT 'KONULAR (DERS BAZINDA)' as baslik;
SELECT 
    s.name as ders,
    s.grade,
    COUNT(t.id) as konu_sayisi
FROM public.subjects s
LEFT JOIN public.topics t ON t.subject_id = s.id
GROUP BY s.name, s.grade
ORDER BY s.grade, s.name;

