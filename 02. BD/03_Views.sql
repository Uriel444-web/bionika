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
IFNULL(s.idSucursal, 0) AS idSucursal,
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
INNER JOIN rol r ON u.rol = r.idRol
LEFT JOIN sucursal s ON u.sucursal = s.idSucursal;
select * from v_usuario;
-- --------------------------------------------------------------------------------------------

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
                'idUnidad', u.idUnidad,
                'nombreUnidad', u.unidad,
                'stock', d.stock
            )
        )
        FROM detalle_producto d
        JOIN talla t ON d.talla = t.idTalla
        JOIN color c ON d.color = c.idColor
        JOIN unidad u ON d.unidad = u.idUnidad
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
        s.activo
    FROM
        sucursal s;
-- -----------------------------------------------------------------------------------------
DROP VIEW IF EXISTS vista_venta_con_detalles;
CREATE VIEW vista_venta_con_detalles AS
SELECT
    v.idVenta,
    v.fecha,
    v.cliente,
    v.total AS totalVenta,
    v.idSucursal,
    s.nombreSuc AS nombreSucursal,
    u.idUsuario,
    u.usuario AS nombreEmpleado,

    IFNULL((
        SELECT JSON_ARRAYAGG(
            JSON_OBJECT(
                'idDetalleVenta', dv.idDetalleVenta,
                'idProducto', p.idProducto,
                'nombreProducto', p.nombre,
                'codigoInterno', p.codigoInterno,
                'cantidad', dv.cantidad,
                'precioUnitario', dv.precioUnitario,
                'totalDetalle', dv.total,
                'nombreTalla', t.nombre,
                'nombreUnidad', un.unidad
            )
        )
        FROM detalle_venta dv
        JOIN producto p ON dv.idProducto = p.idProducto
        JOIN talla t ON dv.idTalla = t.idTalla
        JOIN unidad un ON dv.idUnidad = un.idUnidad
        WHERE dv.idVenta = v.idVenta
    ), JSON_ARRAY()) AS detalles

FROM venta v
JOIN usuario u ON v.idUsuario = u.idUsuario
JOIN sucursal s ON v.idSucursal = s.idSucursal;