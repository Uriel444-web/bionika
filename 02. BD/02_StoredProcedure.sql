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
    IN u_idSucursal INT,
    OUT v_id_empleado INT,
    OUT v_id_usuario INT
)
BEGIN	
    -- Insertar al empleado
    INSERT INTO empleado (nombre, apellidoP, apellidoM, correo, telefono)
    VALUES (e_nombre, e_apellidoP, e_apellidoM, e_correo, e_telefono);
    
    SET v_id_empleado = LAST_INSERT_ID();
    
    -- Insertar al usuario vinculado al empleado y a la sucursal
    INSERT INTO usuario (usuario, contrasena, idEmpleado, rol, sucursal)
    VALUES (u_nombre, u_contrasena, v_id_empleado, u_idRol, u_idSucursal);
    
    SET v_id_usuario = LAST_INSERT_ID();
END 
$$ DELIMITER ;

-- ----------------------------------------------------------------
-- Actualizar usuario
-- -----------------------------------------------------------------
DELIMITER $$

CREATE PROCEDURE actualizarUsuario (
    IN e_nombre VARCHAR(100),
    IN e_apellidoP VARCHAR(100), 
    IN e_apellidoM VARCHAR(100), 
    IN e_correo VARCHAR(100), 
    IN e_telefono VARCHAR(20),
    IN u_nombre VARCHAR(100),
    IN u_contrasena VARCHAR(20),
    IN u_idRol INT,
    IN u_idSucursal INT,
    IN e_idEmpleado INT,
    IN u_idUsuario INT
)
BEGIN
    -- Actualizar datos del empleado
    UPDATE empleado
    SET nombre = e_nombre,
        apellidoP = e_apellidoP,
        apellidoM = e_apellidoM,
        correo = e_correo,
        telefono = e_telefono
    WHERE idEmpleado = e_idEmpleado;

    -- Actualizar datos del usuario
    UPDATE usuario
    SET usuario = u_nombre,
        contrasena = u_contrasena,
        rol = u_idRol,
        sucursal = u_idSucursal
    WHERE idUsuario = u_idUsuario;
END
$$ DELIMITER ;
-- -------------------------------------------------------
DROP PROCEDURE IF EXISTS insertarSucursal;
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
                                    OUT v_id_sucursal INT
                                    )
	BEGIN  
    
	INSERT INTO sucursal (nombreSuc, colonia, calle, codPos, latitud, longitud, numExt, telefono)
    VALUES (s_nombreSuc, s_colonia, s_calle, s_codPos, s_latitud, s_longitud, s_numExt, s_telefono);
	SET v_id_sucursal = LAST_INSERT_ID();
                  
    END
    $$ DELIMITER ;
    
    -- STORED PROCEDURE QUE SE USARA PARA REGISTRAR UNA VENTA
    DROP PROCEDURE IF EXISTS registrarVenta;
	DELIMITER $$
	CREATE PROCEDURE registrarVenta(
		IN v_cliente VARCHAR(100),
		IN v_total DECIMAL(10,2),
		IN v_idUsuario INT,
		IN v_idSucursal INT,
		IN v_detalles_json JSON,
		OUT v_idVenta INT
	)
		BEGIN
		DECLARE i INT DEFAULT 0;
		DECLARE totalDetalles INT;
    
		-- Insertar venta principal
		INSERT INTO venta (cliente, total, idUsuario, idSucursal)
		VALUES (v_cliente, v_total, v_idUsuario, v_idSucursal);

		-- Obtener ID generado
		SET v_idVenta = LAST_INSERT_ID();

		-- Variables para iteración
		SET totalDetalles = JSON_LENGTH(v_detalles_json);

		WHILE i < totalDetalles DO
        INSERT INTO detalle_venta (
            idVenta,
            idProducto,
            cantidad,
            idTalla,
            idUnidad,
            precioUnitario,
            total
        )
        VALUES (
            v_idVenta,
            CAST(JSON_EXTRACT(v_detalles_json, CONCAT('$[', i, '].idProducto')) AS UNSIGNED),
            CAST(JSON_EXTRACT(v_detalles_json, CONCAT('$[', i, '].cantidad')) AS UNSIGNED),
            CAST(JSON_EXTRACT(v_detalles_json, CONCAT('$[', i, '].idTalla')) AS UNSIGNED),
            CAST(JSON_EXTRACT(v_detalles_json, CONCAT('$[', i, '].idUnidad')) AS UNSIGNED),
            CAST(JSON_EXTRACT(v_detalles_json, CONCAT('$[', i, '].precioUnitario')) AS DECIMAL(10,2)),
            CAST(JSON_EXTRACT(v_detalles_json, CONCAT('$[', i, '].total')) AS DECIMAL(10,2))
        );

        SET i = i + 1;
    END WHILE;
	END
    $$ DELIMITER ;