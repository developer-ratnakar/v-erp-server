-- Function to ensure only one session is marked as current
CREATE OR REPLACE FUNCTION ensure_single_current_session()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.is_current = TRUE THEN
        -- Unset any other session that is currently marked as current
        UPDATE academic_sessions 
        SET is_current = FALSE 
        WHERE id <> NEW.id AND is_current = TRUE;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to run before insert or update on is_current
DROP TRIGGER IF EXISTS trg_ensure_single_current_session ON academic_sessions;
CREATE TRIGGER trg_ensure_single_current_session
BEFORE INSERT OR UPDATE OF is_current ON academic_sessions
FOR EACH ROW
WHEN (NEW.is_current = TRUE)
EXECUTE FUNCTION ensure_single_current_session();
