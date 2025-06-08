-- CREACION DE LAS VIEWS PARA EL DESARROLLO WEB DE BIONIKA

-- Date: 2025-04-28
-- Author: Uriel Hernandez & Jonathan Gomez
-- Emails: 84321@alumnos.utleon.edu.mx

USE bionika;

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

DROP VIEW IF EXISTS vista_producto_con_detalles;
CREATE VIEW vista_producto_con_detalles AS
SELECT
    p.idProducto,
    p.foto,
    p.nombre AS nombreProducto,
    p.descripcion,
    p.precio,
    p.codigoInterno,
    c.idCategoria,
    c.nombre,

    -- Subconsulta para obtener los detalles en formato JSON
    (
        SELECT JSON_ARRAYAGG(
            JSON_OBJECT(
                'idDetalle', d.idDetalle,
                'idTalla', t.idTalla,
                'nombreTalla', t.nombre,
                'idColor', c.idColor,
                'nombreColor', c.nombre,
                'stock', d.stock
            )
        )
        FROM detalle_producto d
        JOIN talla t ON d.talla = t.idTalla
        JOIN color c ON d.color = c.idColor
        WHERE d.producto = p.idProducto
    ) AS detalles

FROM producto p
INNER JOIN categoria c ON p.categoria = c.idCategoria;

DROP VIEW IF EXISTS v_sucursal;
CREATE VIEW v_sucursal AS
    SELECT 
        s.idSucursal,
        s.nombreSuc,
        s.colonia,
        s.calle,
        s.codPos,
        s.latitud,
        s.longitud,
        s.numExt,
        s.telefono,
        s.activo,
        u.idUsuario,
        u.usuario
    FROM
        sucursal s
	INNER JOIN usuario u ON s.idUsuario = u.idUsuario;