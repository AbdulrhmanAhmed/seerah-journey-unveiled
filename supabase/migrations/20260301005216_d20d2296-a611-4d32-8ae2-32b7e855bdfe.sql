
-- Fix timeline_events policies - recreate as PERMISSIVE
DROP POLICY IF EXISTS "Public can read active timeline events" ON public.timeline_events;
DROP POLICY IF EXISTS "Admins can manage timeline events" ON public.timeline_events;

CREATE POLICY "Public can read active timeline events"
ON public.timeline_events FOR SELECT USING (true);

CREATE POLICY "Admins can manage timeline events"
ON public.timeline_events FOR ALL TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
