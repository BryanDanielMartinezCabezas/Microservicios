const mongoose = require('mongoose');

const ProyectoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: String,
  estado: { 
    type: String, 
    enum: ['PLANIFICACION', 'EN_CURSO', 'FINALIZADO', 'CANCELADO'], // Requerido por la guía [cite: 130-135]
    default: 'PLANIFICACION' 
  },
  fechaInicio: { type: String, required: true },
  fechaFin: String,
  presupuesto: { type: Number, required: true },
  empleadosIds: { type: [String], default: [] } // Lista de IDs de empleados asignados [cite: 106, 128]
});

module.exports = mongoose.model('Proyecto', ProyectoSchema);