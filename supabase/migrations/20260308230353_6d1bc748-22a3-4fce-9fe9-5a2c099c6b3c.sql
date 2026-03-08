
-- Fix shamail_traits: drop restrictive policies, recreate as permissive
DROP POLICY IF EXISTS "Public read shamail_traits" ON public.shamail_traits;
DROP POLICY IF EXISTS "Admins manage shamail_traits" ON public.shamail_traits;

CREATE POLICY "Public read shamail_traits" ON public.shamail_traits FOR SELECT USING (true);
CREATE POLICY "Admins manage shamail_traits" ON public.shamail_traits FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Fix timeline_events
DROP POLICY IF EXISTS "Public read timeline_events" ON public.timeline_events;
DROP POLICY IF EXISTS "Admins manage timeline_events" ON public.timeline_events;

CREATE POLICY "Public read timeline_events" ON public.timeline_events FOR SELECT USING (true);
CREATE POLICY "Admins manage timeline_events" ON public.timeline_events FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Fix map_locations
DROP POLICY IF EXISTS "Public read map_locations" ON public.map_locations;
DROP POLICY IF EXISTS "Admins manage map_locations" ON public.map_locations;

CREATE POLICY "Public read map_locations" ON public.map_locations FOR SELECT USING (true);
CREATE POLICY "Admins manage map_locations" ON public.map_locations FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Fix paths
DROP POLICY IF EXISTS "Public read paths" ON public.paths;
DROP POLICY IF EXISTS "Admins manage paths" ON public.paths;

CREATE POLICY "Public read paths" ON public.paths FOR SELECT USING (true);
CREATE POLICY "Admins manage paths" ON public.paths FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Fix path_steps
DROP POLICY IF EXISTS "Public read path_steps" ON public.path_steps;
DROP POLICY IF EXISTS "Admins manage path_steps" ON public.path_steps;

CREATE POLICY "Public read path_steps" ON public.path_steps FOR SELECT USING (true);
CREATE POLICY "Admins manage path_steps" ON public.path_steps FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Fix location_events
DROP POLICY IF EXISTS "Public read location_events" ON public.location_events;
DROP POLICY IF EXISTS "Admins manage location_events" ON public.location_events;

CREATE POLICY "Public read location_events" ON public.location_events FOR SELECT USING (true);
CREATE POLICY "Admins manage location_events" ON public.location_events FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
