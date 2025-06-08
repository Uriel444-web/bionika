-- CREACION DE LOS SP PARA EL DESARROLLO WEB DE BIONIKA

-- Date: 2025-04-28
-- Author: Uriel Hernandez & Jonathan Gomez
-- Emails: 84321@alumnos.utleon.edu.mx

USE bionika;
-- ----------------------------------------------------------------
-- SP PARA GUARDRAR UN PRODUCTO CON SU ID DE CATEGORIA
-- ----------------------------------------------------------------
DROP PROCEDURE IF EXISTS insertar_producto_con_detalles;
DELIMITER $$

CREATE PROCEDURE insertar_producto_con_detalles(
    IN p_foto LONGTEXT,
    IN p_nombre VARCHAR(100),
    IN p_descripcion TEXT,
    IN p_precio DOUBLE,
    IN p_codigoInterno VARCHAR(50),
    IN p_idCategoria INT,
    IN p_detalles JSON,
    OUT p_idProducto INT
)
BEGIN
    -- Primero todas las variables
    DECLARE last_id_producto INT;
    DECLARE i INT DEFAULT 0;
    DECLARE total INT;

    -- Ahora sí puedes hacer inserts y sets
    INSERT INTO producto(foto, nombre, descripcion, precio, codigoInterno, categoria)
    VALUES(p_foto, p_nombre, p_descripcion, p_precio, p_codigoInterno, p_idCategoria);
	SET p_idProducto = LAST_INSERT_ID();
    SET last_id_producto = LAST_INSERT_ID();

    SET total = JSON_LENGTH(p_detalles);

    WHILE i < total DO
        INSERT INTO detalle_producto(producto, talla, color, stock)
        VALUES (
            last_id_producto,
            JSON_UNQUOTE(JSON_EXTRACT(p_detalles, CONCAT('$[', i, '].idTalla'))),
            JSON_UNQUOTE(JSON_EXTRACT(p_detalles, CONCAT('$[', i, '].idColor'))),
            JSON_EXTRACT(p_detalles, CONCAT('$[', i, '].stock'))
        );
        SET i = i + 1;
    END WHILE;
END $$

DELIMITER ;
-- -----------------------------------------------------------------------------------
-- NUEVO SP PARA ACTUALIZAR UN PRODUCTO (19/05/2025)
-- -----------------------------------------------------------------------------------
DROP PROCEDURE IF EXISTS actualizar_producto_con_detalles;
DELIMITER $$

CREATE PROCEDURE actualizar_producto_con_detalles(
    IN p_idProducto INT,
    IN p_foto LONGTEXT,
    IN p_nombre VARCHAR(100),
    IN p_descripcion TEXT,
    IN p_precio DOUBLE,
    IN p_codigoInterno VARCHAR(50),
    IN p_idCategoria INT,
    IN p_detalles JSON
)
BEGIN
    DECLARE i INT DEFAULT 0;
    DECLARE total INT;

    -- Actualizar el producto principal
    UPDATE producto
    SET foto = p_foto,
        nombre = p_nombre,
        descripcion = p_descripcion,
        precio = p_precio,
        codigoInterno = p_codigoInterno,
        categoria = p_idCategoria
    WHERE idProducto = p_idProducto;

    -- Eliminar detalles anteriores
    DELETE FROM detalle_producto WHERE producto = p_idProducto;

    -- Insertar nuevos detalles
    SET total = JSON_LENGTH(p_detalles);

    WHILE i < total DO
        INSERT INTO detalle_producto(producto, talla, color, stock)
        VALUES (
            p_idProducto,
            JSON_UNQUOTE(JSON_EXTRACT(p_detalles, CONCAT('$[', i, '].idTalla'))),
            JSON_UNQUOTE(JSON_EXTRACT(p_detalles, CONCAT('$[', i, '].idColor'))),
            JSON_EXTRACT(p_detalles, CONCAT('$[', i, '].stock'))
        );
        SET i = i + 1;
    END WHILE;
END $$

DELIMITER ;

-- ----------------------------------------------------------------------
-- SP PARA ELIMINAR UN PRODUCTO
-- ----------------------------------------------------------------------
DROP PROCEDURE IF EXISTS eliminarProducto;

DELIMITER $$
CREATE PROCEDURE eliminarProducto (
    IN p_idProducto INT
)
BEGIN
   DELETE FROM producto WHERE idProducto = p_idProducto;
END $$
DELIMITER ;

-- ----------------------------------------------------------------------
-- SP PARA INSERTAR UN USUARIO
-- ----------------------------------------------------------------------

select * from usuario;
select * from empleado;

DELIMITER $$
CREATE PROCEDURE insertarUsuario (
    IN e_nombre VARCHAR(100),
    IN e_apellidoP VARCHAR(100), 
    IN e_apellidoM VARCHAR(100), 
    IN e_correo VARCHAR(100), 
    IN e_telefono VARCHAR(20),
    IN u_nombre VARCHAR(100),
    IN u_contrasena VARCHAR(20),
    IN u_idRol INT,
    OUT v_id_empleado INT,
    OUT v_id_usuario INT
)
BEGIN	
    
    -- Insertar al empleado con el rol
    INSERT INTO empleado (nombre, apellidoP, apellidoM, correo, telefono)
    VALUES (e_nombre, e_apellidoP, e_apellidoM, e_correo, e_telefono);
	SET v_id_empleado = LAST_INSERT_ID();
    
    -- Insertar al usuario vinculado al empleado
    INSERT INTO usuario (usuario, contrasena, idEmpleado, rol)
    VALUES (u_nombre, u_contrasena, v_id_empleado, u_idRol);
    SET v_id_usuario = LAST_INSERT_ID();
    
END
$$ DELIMITER ;

DELIMITER $$
CREATE PROCEDURE insertarSucursal (
									IN s_nombreSuc VARCHAR(100),
									IN s_colonia VARCHAR(100), 
									IN s_calle VARCHAR(100), 
									IN s_codPos VARCHAR(100), 
									IN s_latitud VARCHAR(20),
									IN s_longitud VARCHAR(100),
									IN s_numExt VARCHAR(20),
                                    IN s_telefono VARCHAR(20),
                                    IN s_idUsuario INT,
                                    OUT v_id_sucursal INT)
BEGIN  
    
	INSERT INTO sucursal (nombreSuc, colonia, calle, codPos, latitud, longitud, numExt, telefono, idUsuario)
    VALUES (s_nombreSuc, s_colonia, s_calle, s_codPos, s_latitud, s_longitud, s_numExt, s_telefono, s_idUsuario);
	SET v_id_sucursal = LAST_INSERT_ID();
                  
    END
    
    $$ DELIMITER ;