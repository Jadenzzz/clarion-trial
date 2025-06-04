ALTER TABLE public.call
ALTER COLUMN assistant_id TYPE TEXT USING assistant_id::text;
