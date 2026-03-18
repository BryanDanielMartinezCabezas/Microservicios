CREATE DATABASE IF NOT EXISTS api_rest;
USE api_rest;

CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    email VARCHAR(100),
    edad INT,
    telefono VARCHAR(20)
);