
-- Create app_role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- user_roles policies
CREATE POLICY "Users can view own roles" ON public.user_roles
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can manage roles" ON public.user_roles
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- paths table
CREATE TABLE public.paths (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    name_en TEXT NOT NULL,
    description TEXT DEFAULT '',
    description_en TEXT DEFAULT '',
    line_color TEXT NOT NULL DEFAULT '200, 70%, 50%',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.paths ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active paths" ON public.paths
  FOR SELECT USING (true);
CREATE POLICY "Admins can manage paths" ON public.paths
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- path_steps table
CREATE TABLE public.path_steps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    path_id UUID NOT NULL REFERENCES public.paths(id) ON DELETE CASCADE,
    step_order INTEGER NOT NULL DEFAULT 0,
    label TEXT NOT NULL,
    label_en TEXT NOT NULL,
    description TEXT DEFAULT '',
    description_en TEXT DEFAULT '',
    coord_x DOUBLE PRECISION NOT NULL DEFAULT 0,
    coord_y DOUBLE PRECISION NOT NULL DEFAULT 0,
    segment_type TEXT NOT NULL DEFAULT 'land',
    location_id TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.path_steps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read path steps" ON public.path_steps
  FOR SELECT USING (true);
CREATE POLICY "Admins can manage path steps" ON public.path_steps
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- map_locations table
CREATE TABLE public.map_locations (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    name_en TEXT NOT NULL,
    name_arabic TEXT DEFAULT '',
    x DOUBLE PRECISION NOT NULL DEFAULT 0,
    y DOUBLE PRECISION NOT NULL DEFAULT 0,
    description TEXT DEFAULT '',
    description_en TEXT DEFAULT '',
    primary_category TEXT NOT NULL DEFAULT 'historic',
    is_active BOOLEAN NOT NULL DEFAULT true,
    travel_data JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.map_locations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active locations" ON public.map_locations
  FOR SELECT USING (true);
CREATE POLICY "Admins can manage locations" ON public.map_locations
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- location_events table
CREATE TABLE public.location_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    location_id TEXT NOT NULL REFERENCES public.map_locations(id) ON DELETE CASCADE,
    label TEXT NOT NULL,
    label_en TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'event',
    event_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.location_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read location events" ON public.location_events
  FOR SELECT USING (true);
CREATE POLICY "Admins can manage location events" ON public.location_events
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
