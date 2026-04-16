const mongoose = require('mongoose');

const libroSchema = new mongoose.Schema(
  {
    titulo: {
      type: String,
      required: [true, 'El título es obligatorio'],
      trim: true,
    },
    autor: {
      type: String,
      required: [true, 'El autor es obligatorio'],
      trim: true,
    },
    editorial: {
      type: String,
      required: [true, 'La editorial es obligatoria'],
      trim: true,
    },
    anio: {
      type: Number,
      required: [true, 'El año es obligatorio'],
    },
    descripcion: {
      type: String,
      required: [true, 'La descripción es obligatoria'],
      trim: true,
    },
    numero_paginas: {
      type: Number,
      required: [true, 'El número de páginas es obligatorio'],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Libro', libroSchema);
