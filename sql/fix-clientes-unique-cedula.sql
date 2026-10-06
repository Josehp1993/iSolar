-- Remove duplicate clients keeping the most recent one per cedula
DELETE FROM clientes a USING clientes b
WHERE a.id < b.id AND a.cedula = b.cedula AND a.cedula IS NOT NULL AND a.cedula != '';

-- Add unique constraint on cedula
ALTER TABLE clientes ADD CONSTRAINT clientes_cedula_unique UNIQUE (cedula);
