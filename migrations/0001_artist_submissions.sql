CREATE TABLE IF NOT EXISTS artist_submissions (
  id TEXT PRIMARY KEY,
  artwork_name TEXT NOT NULL,
  material_media TEXT NOT NULL,
  artist_bio TEXT NOT NULL,
  price TEXT NOT NULL,
  image_key TEXT,
  image_filename TEXT,
  image_content_type TEXT,
  image_size INTEGER,
  created_at TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'mcliv.studio/submit'
);

CREATE INDEX IF NOT EXISTS artist_submissions_created_at_idx
  ON artist_submissions (created_at DESC);
