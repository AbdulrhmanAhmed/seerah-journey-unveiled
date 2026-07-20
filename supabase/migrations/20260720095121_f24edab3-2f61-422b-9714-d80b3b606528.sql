
CREATE TABLE public.battles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  name_en text,
  kind text NOT NULL DEFAULT 'ghazwah',
  sequence_number integer,
  hijri_year integer,
  hijri_month text,
  gregorian_date text,
  location_name text,
  location_name_en text,
  lat double precision,
  lng double precision,
  commander_muslim text,
  commander_muslim_en text,
  commander_enemy text,
  commander_enemy_en text,
  opponents text,
  opponents_en text,
  muslim_forces integer,
  enemy_forces integer,
  muslim_casualties integer,
  enemy_casualties integer,
  enemy_captured integer,
  outcome text,
  cause text,
  cause_en text,
  summary text,
  summary_en text,
  full_story text,
  full_story_en text,
  key_events jsonb DEFAULT '[]'::jsonb,
  quran_references jsonb DEFAULT '[]'::jsonb,
  hadith_references jsonb DEFAULT '[]'::jsonb,
  related_event_ids jsonb DEFAULT '[]'::jsonb,
  image_url text,
  is_major boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  display_order integer,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.battles TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.battles TO authenticated;
GRANT ALL ON public.battles TO service_role;

ALTER TABLE public.battles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active battles"
  ON public.battles FOR SELECT
  USING (is_active = true OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert battles"
  ON public.battles FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update battles"
  ON public.battles FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete battles"
  ON public.battles FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER battles_set_updated_at
  BEFORE UPDATE ON public.battles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX battles_kind_idx ON public.battles(kind);
CREATE INDEX battles_hijri_year_idx ON public.battles(hijri_year);
CREATE INDEX battles_is_major_idx ON public.battles(is_major);
