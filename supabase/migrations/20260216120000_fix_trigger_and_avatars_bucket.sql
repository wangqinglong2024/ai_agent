-- Purpose: Fix handle_new_user trigger to support 'username' metadata key,
--          create avatars storage bucket, and add storage policies.
-- Date: 2026-02-16

-- 1. Fix handle_new_user trigger to also check 'username' key in metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.user_profiles (id, nickname, avatar_url)
    VALUES (
        NEW.id,
        COALESCE(
            NEW.raw_user_meta_data->>'nickname',
            NEW.raw_user_meta_data->>'username',
            split_part(NEW.email, '@', 1)
        ),
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
    );
    RETURN NEW;
EXCEPTION WHEN unique_violation THEN
    RETURN NEW;
END;
$$;

-- 2. Create avatars storage bucket (public, 2MB limit, images only)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'avatars',
    'avatars',
    true,
    2097152,
    ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- 3. Storage policies for avatars bucket

-- Authenticated users can upload to their own folder
CREATE POLICY "Users can upload own avatar"
ON storage.objects FOR INSERT
TO public
WITH CHECK (
    bucket_id = 'avatars'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Authenticated users can update (overwrite) their own avatar
CREATE POLICY "Users can update own avatar"
ON storage.objects FOR UPDATE
TO public
USING (
    bucket_id = 'avatars'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Public read access for avatars
CREATE POLICY "Anyone can view avatars"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'avatars');

-- Service role full access
CREATE POLICY "Service role full access to avatars"
ON storage.objects FOR ALL
TO public
USING (
    bucket_id = 'avatars'
    AND auth.role() = 'service_role'
);
