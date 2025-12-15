-- Delete the failed migration record
DELETE FROM flyway_schema_history WHERE version = '5';
