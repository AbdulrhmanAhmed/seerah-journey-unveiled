
-- Timeline events for the Interactive Journey page
CREATE TABLE public.timeline_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  year_ce integer NOT NULL,
  year_hijri text,
  era text NOT NULL DEFAULT 'makkah' CHECK (era IN ('makkah', 'madinah')),
  title text NOT NULL,
  title_en text NOT NULL,
  description text DEFAULT '',
  description_en text DEFAULT '',
  category text NOT NULL DEFAULT 'milestone',
  location_id text,
  path_id uuid REFERENCES public.paths(id) ON DELETE SET NULL,
  image_url text,
  map_x double precision NOT NULL DEFAULT 38.5,
  map_y double precision NOT NULL DEFAULT 62,
  is_major boolean NOT NULL DEFAULT false,
  timeline_visible boolean NOT NULL DEFAULT true,
  is_active boolean NOT NULL DEFAULT true,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.timeline_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active timeline events"
ON public.timeline_events FOR SELECT USING (true);

CREATE POLICY "Admins can manage timeline events"
ON public.timeline_events FOR ALL TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
