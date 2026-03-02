
-- Add rich content fields to timeline_events
ALTER TABLE public.timeline_events
ADD COLUMN quran_references jsonb NOT NULL DEFAULT '[]'::jsonb,
ADD COLUMN hadith_references jsonb NOT NULL DEFAULT '[]'::jsonb,
ADD COLUMN related_event_ids jsonb NOT NULL DEFAULT '[]'::jsonb,
ADD COLUMN full_story text NULL DEFAULT '',
ADD COLUMN full_story_en text NULL DEFAULT '';

COMMENT ON COLUMN public.timeline_events.quran_references IS 'Array of {surah, ayah, text, text_en}';
COMMENT ON COLUMN public.timeline_events.hadith_references IS 'Array of {source, text, text_en}';
COMMENT ON COLUMN public.timeline_events.related_event_ids IS 'Array of timeline_event UUIDs';
