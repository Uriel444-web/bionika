-- CREACION DE EL DDL PARA EL DESARROLLO WEB DE BIONIKA 1.0

-- Date: 2025-04-28
-- Author: Uriel Hernandez & Jonathan Gomez
-- Emails: 84321@alumnos.utleon.edu.mx, 82949@utleon.edu.mx

-- TABLA DE ROLES ------------------------------------------------
-- CONTENDRA EL ID Y EL NOMBRE DEL ROL SERA DE TIPO USUARIO, ADMINISTRADOR Y EMPLEADO.
-- ---------------------------------------------------------------------------------------

-- Actualizacion DE EL DDL PARA EL DESARROLLO WEB DE BIONIKA 1.1

-- Date: 2025-10-05
-- Author: Uriel Hernandez & Jonathan Gomez
-- Emails: 84321@alumnos.utleon.edu.mx, 82949@utleon.edu.mx

-- actualizacion a la tabla usuario, cambios: A-T-Empleado, T-usuario: A-idUsuario, A-Token, A-Activo

DROP DATABASE IF EXISTS bionika;
CREATE DATABASE bionika;
USE bionika;


CREATE TABLE IF NOT EXISTS rol 
(
	idRol 	INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    tipoRol VARCHAR(50) NOT NULL
);

-- TABLA DE CATEGORIA -----------------------------------------------
-- ESTA SON LAS CATEGORIAS A LAS QUE PODRA PERTENECER UN PRODUCTO
CREATE TABLE IF NOT EXISTS categoria
(
	idCategoria 	INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nombre			VARCHAR(60) NOT NULL
);

-- TABLA DE EMPLEADO -------------------------------------------------
-- CADA EMPLEADO TENDRA UN ROL ASIGNADO. DE CADA EMPLEADO SE REGISTRARA SUS NOMBRES, APELLIDO P, APELLIDO M, CORREO, TELEFONO PERSONAL

CREATE TABLE IF NOT EXISTS empleado
(
	idEmpleado INT NOT NULL AUTO_INCREMENT,
	nombre		VARCHAR(100) NOT NULL,
    apellidoP	VARCHAR(100) NOT NULL,
    apellidoM	VARCHAR(100) NOT NULL,
    correo		VARCHAR(250) NOT NULL,
    telefono	VARCHAR(20) NOT NULL,
    CONSTRAINT pk_empleado PRIMARY KEY (idEmpleado)
);

select * from empleado;

-- TABLA DE USUARIOS -------------------------------------------------
-- CADA USUARIO TENDRA UN ROL ASIGNADO. DE CADA USUARIO SE REGISTRARA SUS NOMBRES, APELLIDO P, APELLIDO M, CORREO, TELEFONO PERSONAL,
-- NOMBRE DE USUARIO Y PASSWORD Y A SU VEZ TENDRA UN ROL ASIGNADO QUE POR DEFECTO SERA TIPO USUARIO

CREATE TABLE IF NOT EXISTS usuario
(
	idUsuario   INT NOT NULL AUTO_INCREMENT,
    usuario		VARCHAR(100) NOT NULL,
    contrasena	VARCHAR(20) NOT NULL,
    token       lONGTEXT,
    activo      INT NOT NULL DEFAULT 1,
    idEmpleado INT NOT NULL UNIQUE,
    rol         INT NOT NULL DEFAULT 2,
    CONSTRAINT pk_usuario PRIMARY KEY (idUsuario),
	CONSTRAINT fk_empleado FOREIGN KEY (idEmpleado) REFERENCES empleado(idEmpleado),
	CONSTRAINT fk_empleado_rol FOREIGN KEY (rol) REFERENCES rol(idRol)
);

-- TABLA DE PRODUCTO --------------------------------------------------
-- DE CADA PRODUCTO SE GUARDARA EL NOMBRE, DESCRIPCION, PRECIO, STOCK, CODIGO INTERNO Y A SU VEZ 
-- EL PRODUCTO PERTENECE A UNA CATEGORIA

CREATE TABLE IF NOT EXISTS producto
(
	idProducto 		INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    foto			LONGTEXT,
	nombre			VARCHAR(100) NOT NULL,
    descripcion		VARCHAR(250) NOT NULL,
    precio 			DOUBLE NOT NULL,
    stock			INT NOT NULL,
    codigoInterno 	VARCHAR(100),
    categoria 		INT NOT NULL,
    CONSTRAINT fk_producto_categoria FOREIGN KEY(categoria) REFERENCES categoria(idCategoria)
);