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
SELECT * FROM categoria;
SELECT * FROM producto;
SELECT * FROM v_productos;
-- Inserciones de prueba para productos
INSERT INTO producto (foto, nombre, descripcion, precio, stock, codigoInterno, categoria)
VALUES 
(
    'no hay', 
    'Almohada Ortopédica', 
    'Almohada ergonómica para soporte cervical.', 
    249.99, 
    30, 
    'P001', 
    1 -- BLANDOS
),
(
    'no hay', 
    'Muleta de Aluminio', 
    'Muleta ligera y resistente para adultos.', 
    399.50, 
    50, 
    'P002', 
    2 -- FIERROS
),
(
    'no hay', 
    'Rodillera Neopreno', 
    'Rodillera importada con ajuste doble.', 
    325.00, 
    20, 
    'P003', 
    3 -- IMPORTADOS
),
(
    'no hay', 
    'Resina Ortopédica', 
    'Resina para moldeado de férulas ortopédicas.', 
    899.99, 
    15, 
    'P004', 
    4 -- MATERIA PRIMA
),
(
    'no hay', 
    'Collarín Cervical', 
    'Collarín ajustable para inmovilización del cuello.', 
    189.75, 
    40, 
    'P005', 
    1 -- BLANDOS
);

-- Inserciones de prueba para usuario
INSERT INTO usuario (usuario, contrasena, rol) VALUES ("carolina", "1234",1),("Uriel", "1234");