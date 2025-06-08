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
    codigoInterno 	VARCHAR(100) UNIQUE,
    categoria 		INT NOT NULL,
    CONSTRAINT fk_producto_categoria FOREIGN KEY(categoria) REFERENCES categoria(idCategoria)
);

-- TABLA DE TALLAS, AQUI SE ALMACENARAN TODAS LAS TALLAS QUE MANEJA BIONIKA
CREATE TABLE IF NOT EXISTS talla
(
	idTalla 	INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nombre 		VARCHAR(100) NOT NULL
);

-- TABLA DE COLORES, AQUI DE IGUAL MANERA SE ALMACENARAN TODOS LOS COLORES QUE
-- MANEJA BIONIKA
CREATE TABLE IF NOT EXISTS color 
(
	idColor		INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nombre		VARCHAR(100) NOT NULL
);

-- TABLA DE DETALLE PRODUCTO, AQUI IRAN LAS TALLAS, EL COLOR, Y EL STOCK DISPONIBLE
CREATE TABLE IF NOT EXISTS detalle_producto
(
	idDetalle		INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    producto		INT,
    talla			INT,
    color			INT,
    stock			INT NOT NULL,
    CONSTRAINT FK_DETALLE_PRODUCTO_PRODUCTO FOREIGN KEY (producto) REFERENCES producto (idProducto),
    CONSTRAINT FK_DETALLE_PRODUCTO_TALLA FOREIGN KEY (talla) REFERENCES talla (idTalla),
    CONSTRAINT FK_DETALLE_PRODUCTO_COLOR FOREIGN KEY (color) REFERENCES color (idColor)
);

CREATE TABLE sucursal(
idSucursal INT NOT NULL AUTO_INCREMENT,
nombreSuc VARCHAR(80) NOT NULL,
colonia VARCHAR(80) NOT NULL,
calle VARCHAR(80) NOT NULL,
codPos VARCHAR(9) NOT NULL,
latitud VARCHAR(15) NOT NULL,
longitud VARCHAR(15) NOT NULL,
numExt VARCHAR(9) NOT NULL,
telefono VARCHAR(20) NOT NULL,
activo  INT NOT NULL DEFAULT 1,
idUsuario INT NOT NULL,
CONSTRAINT PK_idSucursal PRIMARY KEY (idSucursal),
CONSTRAINT FK_idUsuario FOREIGN KEY (idUsuario) REFERENCES usuario (idUsuario)
);
