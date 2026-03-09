-- Add slug column to support human-readable event URLs like /event/birth
ALTER TABLE public.timeline_events
ADD COLUMN IF NOT EXISTS slug text;

-- Ensure slug uniqueness when provided
CREATE UNIQUE INDEX IF NOT EXISTS timeline_events_slug_unique
ON public.timeline_events (slug)
WHERE slug IS NOT NULL;

-- Backfill slug for the Birth of the Prophet event
UPDATE public.timeline_events
SET slug = 'birth'
WHERE id = '62062ae3-01c6-4e8d-be6b-e672a330e91c'
  AND (slug IS NULL OR slug = '');