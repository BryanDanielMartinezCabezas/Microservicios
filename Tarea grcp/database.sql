-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS empresa;
USE empresa;

-- Crear tabla empleados
CREATE TABLE IF NOT EXISTS empleados (
  id        INT AUTO_INCREMENT PRIMARY KEY,
  nombres   VARCHAR(100) NOT NULL,
  apellidos VARCHAR(100) NOT NULL,
  cargo     VARCHAR(100) NOT NULL
);
