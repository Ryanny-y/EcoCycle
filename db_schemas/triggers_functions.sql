-- SEQUENCE CODE TRIGGER
CREATE SEQUENCE resident_code_seq
START 1
INCREMENT 1;

CREATE OR REPLACE FUNCTION generate_resident_code()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.code IS NULL THEN
        NEW.code := 'BT-' || LPAD(nextval('resident_code_seq')::TEXT, 4, '0');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER resident_code_trigger
BEFORE INSERT ON resident_records
FOR EACH ROW
EXECUTE FUNCTION generate_resident_code();

