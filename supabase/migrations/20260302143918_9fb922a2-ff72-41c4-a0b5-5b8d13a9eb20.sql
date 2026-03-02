
-- Add real GPS coordinate columns to timeline_events
ALTER TABLE public.timeline_events 
ADD COLUMN IF NOT EXISTS lat double precision NOT NULL DEFAULT 21.4225,
ADD COLUMN IF NOT EXISTS lng double precision NOT NULL DEFAULT 39.8262;

-- Also add to path_steps for real polyline coordinates
ALTER TABLE public.path_steps
ADD COLUMN IF NOT EXISTS lat double precision NOT NULL DEFAULT 21.4225,
ADD COLUMN IF NOT EXISTS lng double precision NOT NULL DEFAULT 39.8262;

-- Populate timeline_events based on location_id
UPDATE public.timeline_events SET lat = 21.4225, lng = 39.8262 WHERE location_id = 'makkah' OR location_id ILIKE '%makkah%' OR location_id ILIKE '%mecca%';
UPDATE public.timeline_events SET lat = 24.4672, lng = 39.6111 WHERE location_id = 'madinah' OR location_id ILIKE '%madinah%' OR location_id ILIKE '%medina%';
UPDATE public.timeline_events SET lat = 23.7736, lng = 38.7889 WHERE location_id = 'badr' OR location_id ILIKE '%badr%';
UPDATE public.timeline_events SET lat = 24.5033, lng = 39.6158 WHERE location_id ILIKE '%uhud%';
UPDATE public.timeline_events SET lat = 21.45, lng = 39.75 WHERE location_id ILIKE '%hudaybiyyah%';
UPDATE public.timeline_events SET lat = 21.2703, lng = 40.4159 WHERE location_id ILIKE '%taif%';
UPDATE public.timeline_events SET lat = 21.4573, lng = 39.8594 WHERE location_id ILIKE '%hira%';
UPDATE public.timeline_events SET lat = 9.0, lng = 38.7 WHERE location_id ILIKE '%abyssinia%' OR location_id ILIKE '%habasha%';
UPDATE public.timeline_events SET lat = 24.4672, lng = 39.6111 WHERE location_id ILIKE '%khandaq%' OR location_id ILIKE '%trench%';
UPDATE public.timeline_events SET lat = 25.0, lng = 38.5 WHERE location_id ILIKE '%khaybar%';
UPDATE public.timeline_events SET lat = 21.4225, lng = 39.8262 WHERE location_id ILIKE '%arafat%' OR location_id ILIKE '%mina%';
UPDATE public.timeline_events SET lat = 32.0, lng = 36.0 WHERE location_id ILIKE '%tabuk%';
UPDATE public.timeline_events SET lat = 24.85, lng = 39.55 WHERE location_id ILIKE '%hamra%';
UPDATE public.timeline_events SET lat = 28.5, lng = 36.5 WHERE location_id ILIKE '%mutah%' OR location_id ILIKE '%mu''tah%';
