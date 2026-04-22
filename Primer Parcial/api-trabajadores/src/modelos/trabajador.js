const mongoose = require('mongoose');

const trabajadorEsquema = new mongoose.Schema(
  {
    nombre: { type: String, required: [true, 'El nombre es obligatorio'], trim: true },

    apellido: { type: String, required: [true, 'El apellido es obligatorio'], trim: true },
    
    cedula: { type: String, required: [true, 'La cédula es obligatoria'], unique: true, trim: true },
    cargo: { type: String, required: [true, 'El cargo es obligatorio'], trim: true },
    departamento: { type: String, required: [true, 'El departamento es obligatorio'], trim: true },
    fechaIngreso: { type: String, required: [true, 'La fecha de ingreso es obligatoria'] }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Trabajador', trabajadorEsquema);
