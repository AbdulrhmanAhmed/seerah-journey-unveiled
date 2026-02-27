
-- Phase 2: Add media columns to map_locations
ALTER TABLE public.map_locations
  ADD COLUMN IF NOT EXISTS image_url text,
  ADD COLUMN IF NOT EXISTS gallery_urls jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS audio_url text;

-- Add media columns to path_steps
ALTER TABLE public.path_steps
  ADD COLUMN IF NOT EXISTS image_url text,
  ADD COLUMN IF NOT EXISTS audio_url text,
  ADD COLUMN IF NOT EXISTS custom_note text,
  ADD COLUMN IF NOT EXISTS custom_note_en text;

-- Create storage bucket for media uploads
INSERT INTO storage.buckets (id, name, public)
VALUES ('seerah-media', 'seerah-media', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies: public read
CREATE POLICY "Public can view seerah media"
ON storage.objects FOR SELECT
USING (bucket_id = 'seerah-media');

-- Admin can upload
CREATE POLICY "Admins can upload seerah media"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'seerah-media' AND public.has_role(auth.uid(), 'admin'));

-- Admin can update
CREATE POLICY "Admins can update seerah media"
ON storage.objects FOR UPDATE
USING (bucket_id = 'seerah-media' AND public.has_role(auth.uid(), 'admin'));

-- Admin can delete
CREATE POLICY "Admins can delete seerah media"
ON storage.objects FOR DELETE
USING (bucket_id = 'seerah-media' AND public.has_role(auth.uid(), 'admin'));
