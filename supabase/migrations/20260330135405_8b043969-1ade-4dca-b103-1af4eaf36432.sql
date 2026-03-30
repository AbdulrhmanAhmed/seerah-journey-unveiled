
CREATE TABLE public.feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL DEFAULT 'suggestion',
  name text,
  email text,
  message text NOT NULL,
  page_url text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- Anyone can submit feedback
CREATE POLICY "Anyone can insert feedback"
ON public.feedback
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Only admins can read feedback
CREATE POLICY "Admins can read feedback"
ON public.feedback
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can delete feedback
CREATE POLICY "Admins can delete feedback"
ON public.feedback
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));
