const db = require('../db');

// 1. Obtener todos los usuarios (Con Paginación y Filtro por edad)
exports.getAll = (req, res) => {
    // Leemos los parámetros de la URL: ?edad=25&page=1&limit=5
    const { edad, page = 1, limit = 5 } = req.query;
    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM usuarios';
    let params = [];

    // Si el usuario manda una edad, filtramos
    if (edad) {
        query += ' WHERE edad = ?';
        params.push(edad);
    }

    // Agregamos paginación
    query += ' LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    db.query(query, params, (err, results) => {
        if (err) {
            return res.status(500).json({ transaccion: false, mensaje: "Error en la DB", data: null });
        }
        // Formato de respuesta pedido en el Ejercicio 5
        res.json({
            transaccion: true,
            mensaje: "Usuarios obtenidos con éxito",
            data: results
        });
    });
};

// 2. Crear un nuevo usuario (Con Validaciones)
exports.create = (req, res) => {
    const { nombre, email, edad, telefono } = req.body;

    // Ejercicio 3: Validar que el email exista y la edad sea positiva
    if (!email) {
        return res.status(400).json({ transaccion: false, mensaje: "El email es obligatorio", data: null });
    }
    if (edad <= 0) {
        return res.status(400).json({ transaccion: false, mensaje: "La edad debe ser mayor a 0", data: null });
    }

    const sql = 'INSERT INTO usuarios (nombre, email, edad, telefono) VALUES (?, ?, ?, ?)';
    db.query(sql, [nombre, email, edad, telefono], (err, result) => {
        if (err) {
            return res.status(500).json({ transaccion: false, mensaje: err.message, data: null });
        }
        res.status(201).json({
            transaccion: true,
            mensaje: "Usuario creado correctamente",
            data: { id: result.insertId }
        });
    });
};