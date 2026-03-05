
-- Drop all RESTRICTIVE policies and recreate as PERMISSIVE

-- timeline_events
DROP POLICY IF EXISTS "Public can read timeline events" ON public.timeline_events;
DROP POLICY IF EXISTS "Admins can manage timeline events" ON public.timeline_events;
CREATE POLICY "Public read timeline_events" ON public.timeline_events FOR SELECT USING (true);
CREATE POLICY "Admins manage timeline_events" ON public.timeline_events FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- map_locations
DROP POLICY IF EXISTS "Public can read locations" ON public.map_locations;
DROP POLICY IF EXISTS "Admins can manage locations" ON public.map_locations;
CREATE POLICY "Public read map_locations" ON public.map_locations FOR SELECT USING (true);
CREATE POLICY "Admins manage map_locations" ON public.map_locations FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- paths
DROP POLICY IF EXISTS "Public can read paths" ON public.paths;
DROP POLICY IF EXISTS "Admins can manage paths" ON public.paths;
CREATE POLICY "Public read paths" ON public.paths FOR SELECT USING (true);
CREATE POLICY "Admins manage paths" ON public.paths FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- path_steps
DROP POLICY IF EXISTS "Public can read path steps" ON public.path_steps;
DROP POLICY IF EXISTS "Admins can manage path steps" ON public.path_steps;
CREATE POLICY "Public read path_steps" ON public.path_steps FOR SELECT USING (true);
CREATE POLICY "Admins manage path_steps" ON public.path_steps FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- location_events
DROP POLICY IF EXISTS "Public can read location events" ON public.location_events;
DROP POLICY IF EXISTS "Admins can manage location events" ON public.location_events;
CREATE POLICY "Public read location_events" ON public.location_events FOR SELECT USING (true);
CREATE POLICY "Admins manage location_events" ON public.location_events FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- shamail_traits
DROP POLICY IF EXISTS "Public can read shamail traits" ON public.shamail_traits;
DROP POLICY IF EXISTS "Admins can manage shamail traits" ON public.shamail_traits;
CREATE POLICY "Public read shamail_traits" ON public.shamail_traits FOR SELECT USING (true);
CREATE POLICY "Admins manage shamail_traits" ON public.shamail_traits FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- user_roles
DROP POLICY IF EXISTS "Users can view own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;
CREATE POLICY "Users view own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Admins manage roles" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
