
ALTER TABLE public.battles
  ADD COLUMN IF NOT EXISTS background text,
  ADD COLUMN IF NOT EXISTS background_en text,
  ADD COLUMN IF NOT EXISTS preparations text,
  ADD COLUMN IF NOT EXISTS preparations_en text,
  ADD COLUMN IF NOT EXISTS aftermath text,
  ADD COLUMN IF NOT EXISTS aftermath_en text,
  ADD COLUMN IF NOT EXISTS lessons text,
  ADD COLUMN IF NOT EXISTS lessons_en text,
  ADD COLUMN IF NOT EXISTS timeline_phases jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS key_figures jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS casualties_detail jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS tactical_map jsonb,
  ADD COLUMN IF NOT EXISTS troop_movements jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS force_composition jsonb;
