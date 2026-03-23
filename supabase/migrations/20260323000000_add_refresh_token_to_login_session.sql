-- Migration: Add refresh_token column to login_session table
-- Access tokens expire in 15 minutes; refresh tokens expire in 24 hours.
-- The refresh_token column stores the current valid refresh token for each session.
-- On each token refresh, this value is rotated (old value replaced with new one).

ALTER TABLE login_session
ADD COLUMN IF NOT EXISTS refresh_token TEXT;
