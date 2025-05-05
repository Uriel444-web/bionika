-- CREACION DE LAS VIEWS PARA EL DESARROLLO WEB DE BIONIKA

-- Date: 2025-04-28
-- Author: Uriel Hernandez & Jonathan Gomez
-- Emails: 84321@alumnos.utleon.edu.mx

USE bionika;
DROP VIEW IF EXISTS v_productos;
CREATE VIEW v_productos AS
SELECT
p.idProducto,
p.nombre,
p.descripcion,
p.precio,
p.stock,
p.codigoInterno,
c.idCategoria,
c.nombre AS nombreCategoria
FROM
producto p
INNER JOIN categoria c WHERE p.categoria = c.idCategoria;