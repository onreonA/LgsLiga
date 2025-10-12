-- Book Summary RLS Policy Düzeltmesi
-- Bu dosyayı Supabase Dashboard > SQL Editor'da çalıştırın

-- Önce mevcut policy'leri silelim
DROP POLICY IF EXISTS "Anyone can view book summary" ON public.book_summary;

-- Yeni policy'leri ekleyelim
CREATE POLICY "Anyone can view book summary" ON public.book_summary
    FOR SELECT USING (true);

CREATE POLICY "Anyone can insert book summary" ON public.book_summary
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update book summary" ON public.book_summary
    FOR UPDATE USING (true);

CREATE POLICY "Anyone can delete book summary" ON public.book_summary
    FOR DELETE USING (true);

-- Test için mevcut veriyi kontrol edelim
SELECT * FROM public.book_summary LIMIT 1;
