-- CREACION DE LOS SP PARA EL DESARROLLO WEB DE BIONIKA

-- Date: 2025-04-28
-- Author: Uriel Hernandez & Jonathan Gomez
-- Emails: 84321@alumnos.utleon.edu.mx

USE bionika;
-- ----------------------------------------------------------------
-- SP PARA GUARDRAR UN PRODUCTO CON SU ID DE CATEGORIA
-- ----------------------------------------------------------------
DROP PROCEDURE IF EXISTS insertarProducto;
DELIMITER $$
CREATE PROCEDURE insertarProducto (
    IN p_nombre VARCHAR(100),
    IN p_descripcion VARCHAR(250),
    IN p_precio DOUBLE,
    IN p_stock INT,
    IN p_codigoInterno VARCHAR(100),
    IN p_categoria INT,
    OUT p_idProducto INT
)
BEGIN
    INSERT INTO producto (nombre, descripcion, precio, stock, codigoInterno, categoria)
    VALUES (p_nombre, p_descripcion, p_precio, p_stock, p_codigoInterno, p_categoria);
    SET p_idProducto = LAST_INSERT_ID();
END $$
DELIMITER ;

-- -----------------------------------------------------------------------------------
-- SP PARA ACTUALIZAR UN PRODUCTO
-- -----------------------------------------------------------------------------------
DROP PROCEDURE IF EXISTS actualizarProducto;

DELIMITER $$
CREATE PROCEDURE actualizarProducto (
    IN p_idProducto INT,
    IN p_nombre VARCHAR(100),
    IN p_descripcion VARCHAR(250),
    IN p_precio DOUBLE,
    IN p_stock INT,
    IN p_codigoInterno VARCHAR(100),
    IN p_categoria INT
)
BEGIN
    UPDATE producto
    SET 
        nombre = p_nombre,
        descripcion = p_descripcion,
        precio = p_precio,
        stock = p_stock,
        codigoInterno = p_codigoInterno,
        categoria = p_categoria
    WHERE idProducto = p_idProducto;
END $$
DELIMITER ;

-- ----------------------------------------------------------------------
-- SP PARA ELIMINAR UN PRODUCTO
-- ----------------------------------------------------------------------
