CREATE OR REPLACE VIEW resident_view AS
SELECT
    id,
    code,
    CONCAT(last_name, ', ', first_name, ' ', middle_name, 
           COALESCE(' ' || suffix, '')) AS full_name,
    birth_date,
    DATE_PART('year', AGE(birth_date)) AS age,
    gender,
    is_resident,
    address,
    points,
    contact_number,
    created_at,
    updated_at
FROM resident_records;

SELECT * FROM resident_view;
