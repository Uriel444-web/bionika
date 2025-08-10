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
    'Suc - Hidalgo',
    'Col. Obregon',
    'Calle Hidalgo',
    '37320',
    '21.126128327785',
    '-101.6812957050',
    '320',
    '477-713-3433'
);
SELECT * FROM detalle_venta;
SELECT * FROM vista_producto_con_detalles;
SELECT * FROM vista_venta_con_detalles;
select * from venta;
delete from venta where idVenta = 4;
select * from sucursal;
select * from usuario;
-- Declaramos las variables de salida
SET @id_empleado := 0;
SET @id_usuario := 0;

-- Llamamos al procedimiento con datos de prueba
CALL insertarUsuario(
    'Carolina',             -- e_nombre
    'Hernandez',            -- e_apellidoP
    'Mercado',            -- e_apellidoM
    'contactobionika@gmail.com', -- e_correo
    '477-130-4929',       -- e_telefono
    'carolina',          -- u_nombre (usuario)
    'bionika',             -- u_contrasena
    1,                  -- u_idRol (ej. 2 = empleado)
    1,                  -- u_idSucursal (1 si existe esa sucursal)
    @id_empleado,
    @id_usuario
);

SELECT @id_empleado AS 'ID Empleado Insertado', @id_usuario AS 'ID Usuario Insertado';

-- Verificamos si se insertaron correctamente
SELECT * FROM empleado WHERE idEmpleado = @id_empleado;
SELECT * FROM usuario WHERE idUsuario = @id_usuario;
select * from vista_producto_con_detalles;
select * from detalle_producto;
select * from v_usuario;
