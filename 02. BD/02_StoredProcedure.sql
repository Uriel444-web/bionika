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
    DECLARE last_id_producto INT;
    DECLARE i INT DEFAULT 0;
    DECLARE total INT;
    DECLARE existe INT DEFAULT 0;

    bloque: BEGIN
        -- Verificar si ya existe un producto con ese código interno
        SELECT COUNT(*) INTO existe FROM producto WHERE codigoInterno = p_codigoInterno;

        IF existe > 0 THEN
            -- Producto duplicado
            SET p_idProducto = -1;
            LEAVE bloque;
        END IF;

        -- Insertar producto
        INSERT INTO producto(foto, nombre, descripcion, precio, codigoInterno, categoria)
        VALUES(p_foto, p_nombre, p_descripcion, p_precio, p_codigoInterno, p_idCategoria);
        SET p_idProducto = LAST_INSERT_ID();
        SET last_id_producto = p_idProducto;

        -- Insertar detalles
        SET total = JSON_LENGTH(p_detalles);

        WHILE i < total DO
            INSERT INTO detalle_producto(producto, talla, color, unidad, stock)
            VALUES (
                last_id_producto,
                JSON_UNQUOTE(JSON_EXTRACT(p_detalles, CONCAT('$[', i, '].idTalla'))),
                JSON_UNQUOTE(JSON_EXTRACT(p_detalles, CONCAT('$[', i, '].idColor'))),
                JSON_UNQUOTE(JSON_EXTRACT(p_detalles, CONCAT('$[', i, '].idUnidad'))),
                JSON_EXTRACT(p_detalles, CONCAT('$[', i, '].stock'))
            );
            SET i = i + 1;
        END WHILE;
    END bloque;
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
        INSERT INTO detalle_producto(producto, talla, color, unidad, stock)
        VALUES (
            p_idProducto,
            JSON_UNQUOTE(JSON_EXTRACT(p_detalles, CONCAT('$[', i, '].idTalla'))),
            JSON_UNQUOTE(JSON_EXTRACT(p_detalles, CONCAT('$[', i, '].idColor'))),
            JSON_UNQUOTE(JSON_EXTRACT(p_detalles, CONCAT('$[', i, '].idUnidad'))),
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
    
END$$
DELIMITER ;