
-- Fix timeline_events policies
DROP POLICY IF EXISTS "Public can read active timeline events" ON public.timeline_events;
CREATE POLICY "Public can read active timeline events" ON public.timeline_events FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage timeline events" ON public.timeline_events;
CREATE POLICY "Admins can manage timeline events" ON public.timeline_events FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Fix paths policies
DROP POLICY IF EXISTS "Public can read active paths" ON public.paths;
CREATE POLICY "Public can read active paths" ON public.paths FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage paths" ON public.paths;
CREATE POLICY "Admins can manage paths" ON public.paths FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Fix path_steps policies
DROP POLICY IF EXISTS "Public can read path steps" ON public.path_steps;
CREATE POLICY "Public can read path steps" ON public.path_steps FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage path steps" ON public.path_steps;
CREATE POLICY "Admins can manage path steps" ON public.path_steps FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Fix map_locations policies
DROP POLICY IF EXISTS "Public can read active locations" ON public.map_locations;
CREATE POLICY "Public can read active locations" ON public.map_locations FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage locations" ON public.map_locations;
CREATE POLICY "Admins can manage locations" ON public.map_locations FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Fix location_events policies
DROP POLICY IF EXISTS "Public can read location events" ON public.location_events;
CREATE POLICY "Public can read location events" ON public.location_events FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage location events" ON public.location_events;
CREATE POLICY "Admins can manage location events" ON public.location_events FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Fix shamail_traits policies
DROP POLICY IF EXISTS "Public can read active shamail traits" ON public.shamail_traits;
CREATE POLICY "Public can read active shamail traits" ON public.shamail_traits FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage shamail traits" ON public.shamail_traits;
CREATE POLICY "Admins can manage shamail traits" ON public.shamail_traits FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
