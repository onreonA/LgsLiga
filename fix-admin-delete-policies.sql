-- Admin DELETE Politikalarını Ekle
-- Admin kullanıcıları subjects ve topics tablosundan silme yapabilsin

-- Subjects tablosu için admin DELETE politikası
CREATE POLICY "Allow admin to delete subjects"
    ON public.subjects
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Topics tablosu için admin DELETE politikası
CREATE POLICY "Allow admin to delete topics"
    ON public.topics
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Diğer tablolar için de admin DELETE ekle
CREATE POLICY "Allow admin to delete study_sessions"
    ON public.study_sessions
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Allow admin to delete quests"
    ON public.quests
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Allow admin to delete user_topic_planning"
    ON public.user_topic_planning
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Test query
DO $$
BEGIN
    RAISE NOTICE '✅ Admin DELETE politikaları eklendi!';
    RAISE NOTICE '✅ Admin artık subjects, topics ve diğer tabloları silebilir';
END $$;

