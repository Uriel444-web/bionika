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
    activo			INT NOT NULL DEFAULT 1,
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

-- AGREGAR UNIDAD DE MEDIDA A LA TABLA DE PRODUCTOS.
CREATE TABLE IF NOT EXISTS unidad
(
	idUnidad 	INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    unidad 		VARCHAR(50) NOT NULL
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
CONSTRAINT PK_idSucursal PRIMARY KEY (idSucursal)
);

-- TABLA DE DETALLE PRODUCTO, AQUI IRAN LAS TALLAS, EL COLOR, Y EL STOCK DISPONIBLE
CREATE TABLE IF NOT EXISTS detalle_producto
(
	idDetalle		INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    producto		INT,
    talla			INT,
    color			INT,
    unidad 			INT,
    stock			INT NOT NULL,
	idSucursal 		INT NOT NULL,
	CONSTRAINT fk_detalle_producto_sucursal FOREIGN KEY (idSucursal) REFERENCES sucursal(idSucursal),
    CONSTRAINT FK_DETALLE_PRODUCTO_PRODUCTO FOREIGN KEY (producto) REFERENCES producto (idProducto),
    CONSTRAINT FK_DETALLE_PRODUCTO_TALLA FOREIGN KEY (talla) REFERENCES talla (idTalla),
    CONSTRAINT FK_DETALLE_PRODUCTO_COLOR FOREIGN KEY (color) REFERENCES color (idColor),
    CONSTRAINT FK_DETALLE_PRODUCTO_UNIDAD FOREIGN KEY (unidad) REFERENCES unidad (idUnidad)

);

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
    idEmpleado 	INT NOT NULL UNIQUE,
    rol         INT NOT NULL DEFAULT 2,
    sucursal	INT NULL,
    CONSTRAINT pk_usuario PRIMARY KEY (idUsuario),
	CONSTRAINT fk_empleado FOREIGN KEY (idEmpleado) REFERENCES empleado(idEmpleado),
	CONSTRAINT fk_empleado_rol FOREIGN KEY (rol) REFERENCES rol(idRol),
    CONSTRAINT fk_usuario_sucursal FOREIGN KEY (sucursal) REFERENCES sucursal (idSucursal)
);

-- TABLA PARA VENTAS DONDE SE GUARDARA EL ID DE VENTA, LA FECHA EN QUE SE REALIZO LA VENTA, NOMBRE DEL CLIENTE ID DEL EMPLEADO QUE REALIZO LA VENTA
-- ID DE LA SUCURSAL A LA QUE PERTENECE EL EMPLEADO Y EL TOTAL DE VENTA.
CREATE TABLE IF NOT EXISTS venta (
    idVenta INT NOT NULL AUTO_INCREMENT,
    fecha DATETIME NOT NULL DEFAULT NOW(),
    cliente VARCHAR(100) NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    idUsuario INT NOT NULL,
    idSucursal INT NOT NULL,
    CONSTRAINT pk_venta PRIMARY KEY (idVenta),
    CONSTRAINT fk_venta_usuario FOREIGN KEY (idUsuario) REFERENCES usuario(idUsuario),
    CONSTRAINT fk_venta_sucursal FOREIGN KEY (idSucursal) REFERENCES sucursal(idSucursal)
);

-- TABLA DE DETALLE DE VENTA QUE GUARDARA LOS DETALLES DE UNA VENTA, TENDRA ID DETALLE, EL ID DE LA VENTA, ID DEL PRODUCTO VENDIDO, 
-- CANTIDAD DE PRODUCTO, PRECIO UNITARIO, EL ID DE LA TALLA  Y EL ID UNIDAD.
CREATE TABLE detalle_venta (
    idDetalleVenta INT NOT NULL AUTO_INCREMENT,
    idVenta INT NOT NULL,
    idProducto INT NOT NULL,
    idTalla INT NOT NULL,
    idUnidad INT NOT NULL,
    cantidad INT NOT NULL,
    precioUnitario DECIMAL(10, 2) NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    descuento INT NULL,
    PRIMARY KEY (idDetalleVenta),
    CONSTRAINT fk_detalleventa_venta FOREIGN KEY (idVenta) REFERENCES venta(idVenta),
    CONSTRAINT fk_detalleventa_producto FOREIGN KEY (idProducto) REFERENCES producto(idProducto),
    CONSTRAINT fk_detalleventa_talla FOREIGN KEY (idTalla) REFERENCES talla(idTalla),
    CONSTRAINT fk_detalleventa_unidad FOREIGN KEY (idUnidad) REFERENCES unidad(idUnidad)
);
