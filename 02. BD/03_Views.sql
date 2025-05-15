-- CREACION DE LAS VIEWS PARA EL DESARROLLO WEB DE BIONIKA

-- Date: 2025-04-28
-- Author: Uriel Hernandez & Jonathan Gomez
-- Emails: 84321@alumnos.utleon.edu.mx

USE bionika;

DROP VIEW IF EXISTS v_productos;
CREATE VIEW v_productos AS
SELECT
p.idProducto,
p.foto,
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

DROP VIEW IF EXISTS v_usuario;
CREATE VIEW v_usuario AS
SELECT
u.idUsuario,
u.usuario,
u.contrasena,
u.activo,
e.idEmpleado,
e.nombre,
e.apellidoP,
e.apellidoM,
e.correo,
e.telefono,
r.idRol,
r.tipoRol
FROM
usuario u
INNER JOIN empleado e ON u.idEmpleado = e.idEmpleado
INNER JOIN rol r ON u.rol = r.idRol;

select * from v_usuario;