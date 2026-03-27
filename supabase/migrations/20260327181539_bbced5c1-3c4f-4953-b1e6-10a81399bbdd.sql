
-- Companions table
CREATE TABLE public.companions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  name_en text NOT NULL,
  nickname text DEFAULT '',
  nickname_en text DEFAULT '',
  bio text DEFAULT '',
  bio_en text DEFAULT '',
  category text NOT NULL DEFAULT 'other',
  birth_year text DEFAULT '',
  death_year text DEFAULT '',
  image_url text,
  notable_roles jsonb NOT NULL DEFAULT '[]'::jsonb,
  related_event_ids jsonb NOT NULL DEFAULT '[]'::jsonb,
  family_relation text DEFAULT '',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.companions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read companions" ON public.companions
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Admins manage companions" ON public.companions
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Family members table
CREATE TABLE public.family_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  name_en text NOT NULL,
  relation_type text NOT NULL DEFAULT 'other',
  parent_id uuid REFERENCES public.family_members(id) ON DELETE SET NULL,
  companion_id uuid REFERENCES public.companions(id) ON DELETE SET NULL,
  birth_year text DEFAULT '',
  death_year text DEFAULT '',
  bio text DEFAULT '',
  bio_en text DEFAULT '',
  image_url text,
  display_order integer NOT NULL DEFAULT 0,
  gender text NOT NULL DEFAULT 'male',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.family_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read family_members" ON public.family_members
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Admins manage family_members" ON public.family_members
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Quiz questions table
CREATE TABLE public.quiz_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  era text NOT NULL DEFAULT 'makkah',
  question text NOT NULL,
  question_en text NOT NULL,
  options jsonb NOT NULL DEFAULT '[]'::jsonb,
  explanation text DEFAULT '',
  explanation_en text DEFAULT '',
  difficulty text NOT NULL DEFAULT 'easy',
  related_event_id uuid,
  display_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read quiz_questions" ON public.quiz_questions
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Admins manage quiz_questions" ON public.quiz_questions
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Quiz scores table
CREATE TABLE public.quiz_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  era text NOT NULL,
  score integer NOT NULL DEFAULT 0,
  total_questions integer NOT NULL DEFAULT 0,
  completed_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.quiz_scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own scores" ON public.quiz_scores
  FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE POLICY "Users insert own scores" ON public.quiz_scores
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
