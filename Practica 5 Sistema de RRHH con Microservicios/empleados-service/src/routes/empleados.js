const express = require('express');
const router = express.Router();
const db = require('../db');
const axios = require('axios');

// 1. LISTAR EMPLEADOS (Con filtro opcional por departamento)
router.get('/', async (req, res) => {
  try {
    const { departamento } = req.query;
    let query = 'SELECT * FROM empleados WHERE activo = true';
    const params = [];

    if (departamento) {
      query += ' AND departamento = ?';
      params.push(departamento);
    }

    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. OBTENER UN EMPLEADO POR ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM empleados WHERE id = ? AND activo = true', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Empleado no encontrado' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. REGISTRAR EMPLEADO (Con validaciones obligatorias)
router.post('/', async (req, res) => {
  const { nombre, apellido, ci, cargo, departamento, fecha_ingreso, salario } = req.body;

  // Validación de campos obligatorios y salario mayor a cero
  if (!nombre || !apellido || !ci || !cargo || !departamento || !fecha_ingreso || salario === undefined) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }
  if (salario <= 0) {
    return res.status(400).json({ error: 'El salario debe ser mayor a cero' });
  }

  // Validación de fecha de ingreso (no futura)
  if (new Date(fecha_ingreso) > new Date()) {
    return res.status(400).json({ error: 'La fecha de ingreso no puede ser futura' });
  }

  try {
    // Validación de CI único
    const [exist] = await db.query('SELECT id FROM empleados WHERE ci = ?', [ci]);
    if (exist.length > 0) {
      return res.status(400).json({ error: 'El CI ya está registrado' });
    }

    const sql = 'INSERT INTO empleados (nombre, apellido, ci, cargo, departamento, fecha_ingreso, salario) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const [result] = await db.query(sql, [nombre, apellido, ci, cargo, departamento, fecha_ingreso, salario]);
    
    res.status(201).json({ 
      id: result.insertId, 
      nombre, apellido, ci, cargo, departamento, fecha_ingreso, salario, 
      activo: true 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. ACTUALIZAR EMPLEADO
router.put('/:id', async (req, res) => {
  const { nombre, apellido, cargo, departamento, salario } = req.body;
  try {
    const [result] = await db.query(
      'UPDATE empleados SET nombre=?, apellido=?, cargo=?, departamento=?, salario=? WHERE id=? AND activo=true',
      [nombre, apellido, cargo, departamento, salario, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Empleado no encontrado' });
    res.json({ message: 'Empleado actualizado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 5. BAJA LÓGICA (activo = false)
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await db.query('UPDATE empleados SET activo = false WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Empleado no encontrado' });
    res.json({ message: 'Empleado dado de baja correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 6. OBTENER PROYECTOS DEL EMPLEADO (Comunicación con Servicio GraphQL)
router.get('/:id/proyectos', async (req, res) => {
  const { id } = req.params;
  try {
    // 1. Verificar existencia del empleado
    const [rows] = await db.query('SELECT * FROM empleados WHERE id = ? AND activo = true', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Empleado no encontrado' });

    // 2. Consultar al servicio GraphQL vía HTTP POST
    const query = `
      query {
        proyectosPorEmpleado(empleadoId: "${id}") {
          id nombre estado fechaInicio presupuesto
        }
      }
    `;
    
    const response = await axios.post('http://proyectos-service:3002/graphql', { query });
    const proyectos = response.data.data.proyectosPorEmpleado;
    
    res.json({ 
      empleado: rows[0], 
      proyectos 
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Error al conectar con el servicio de proyectos', 
      details: error.message 
    });
  }
});

module.exports = router;