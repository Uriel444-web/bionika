-- CREACION DE EL DML PARA EL DESARROLLO WEB DE BIONIKA

-- Date: 2025-04-28
-- Author: Uriel Hernandez & Jonathan Gomez
-- Emails: 84321@alumnos.utleon.edu.mx


USE bionika;

-- Inserciones de prueba para rol

insert into rol (tipoRol) values ("Administrador");
select * from rol;
insert into rol (tipoRol) values ("Empleado"),("Usuario");

-- Inserciones de prueba para categoria
INSERT INTO categoria (nombre) VALUES ('BLANDOS'),('FIERROS'),('IMPORTADOS'),('MATERIA PRIMA');

-- Inserciones de prueba para usuario
-- INSERT INTO usuario (usuario, contrasena, rol) VALUES ("carolina", "1234",1),("Uriel", "1234", 3);
-- SELECT * FROM usuario;

INSERT INTO talla (nombre) VALUES("XP"),("S"),("M"),("G"),("XL"),("2XL"),("3XL");
INSERT INTO color (nombre) VALUES("AZUL"),("BEIGE"),("NEGRO"),("PIEL");
INSERT INTO unidad (unidad) VALUES ("pz"),("par");
select * from usuario;
select * from empleado;
select * from categoria;
SELECT * FROM producto;
SELECT * FROM vista_producto_con_detalles;
SELECT * FROM detalle_producto;
SELECT * FROM talla WHERE idTalla IN (2, 4);
SELECT * FROM unidad;

-- Pruebas para insertar sucursal
INSERT INTO sucursal (
    nombreSuc, colonia, calle, codPos, latitud, longitud, numExt, telefono
)
VALUES (
    'No pertenece',
    'Colonia Juárez',
    'Calle Hidalgo',
    '44700',
    '20.659699',
    '-103.349609',
    '123',
    '3312345678'
);
SELECT * FROM detalle_venta;
SELECT idUsuario, sucursal FROM usuario WHERE usuario= "UrielEmpleado" and contrasena="1234";
SELECT * FROM vista_producto_con_detalles WHERE codigoInterno = "MH-203";
