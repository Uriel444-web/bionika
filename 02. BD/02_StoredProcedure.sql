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
	IN p_foto LONGTEXT,
    IN p_nombre VARCHAR(100),
    IN p_descripcion VARCHAR(250),
    IN p_precio DOUBLE,
    IN p_stock INT,
    IN p_codigoInterno VARCHAR(100),
    IN p_categoria INT,
    OUT p_idProducto INT
)
BEGIN
    INSERT INTO producto (foto,nombre, descripcion, precio, stock, codigoInterno, categoria)
    VALUES (p_foto,p_nombre, p_descripcion, p_precio, p_stock, p_codigoInterno, p_categoria);
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
    IN p_foto LONGTEXT,
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
		foto = p_foto,
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
