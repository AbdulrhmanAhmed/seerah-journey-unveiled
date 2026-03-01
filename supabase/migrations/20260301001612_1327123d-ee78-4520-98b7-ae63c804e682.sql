
-- Drop restrictive policies and recreate as permissive
DROP POLICY IF EXISTS "Users can view own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;

CREATE POLICY "Users can view own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Admins can manage roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Fix other tables too
DROP POLICY IF EXISTS "Public can read active locations" ON public.map_locations;
DROP POLICY IF EXISTS "Admins can manage locations" ON public.map_locations;
CREATE POLICY "Public can read active locations" ON public.map_locations FOR SELECT USING (true);
CREATE POLICY "Admins can manage locations" ON public.map_locations FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Public can read location events" ON public.location_events;
DROP POLICY IF EXISTS "Admins can manage location events" ON public.location_events;
CREATE POLICY "Public can read location events" ON public.location_events FOR SELECT USING (true);
CREATE POLICY "Admins can manage location events" ON public.location_events FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Public can read active paths" ON public.paths;
DROP POLICY IF EXISTS "Admins can manage paths" ON public.paths;
CREATE POLICY "Public can read active paths" ON public.paths FOR SELECT USING (true);
CREATE POLICY "Admins can manage paths" ON public.paths FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Public can read path steps" ON public.path_steps;
DROP POLICY IF EXISTS "Admins can manage path steps" ON public.path_steps;
CREATE POLICY "Public can read path steps" ON public.path_steps FOR SELECT USING (true);
CREATE POLICY "Admins can manage path steps" ON public.path_steps FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Public can read active shamail traits" ON public.shamail_traits;
DROP POLICY IF EXISTS "Admins can manage shamail traits" ON public.shamail_traits;
CREATE POLICY "Public can read active shamail traits" ON public.shamail_traits FOR SELECT USING (true);
CREATE POLICY "Admins can manage shamail traits" ON public.shamail_traits FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
