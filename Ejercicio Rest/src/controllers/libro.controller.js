const Libro = require('../models/libro.model');

// GET /libro - Obtener todos los libros
const getLibros = async (req, res) => {
  try {
    const libros = await Libro.find();
    res.status(200).json({
      success: true,
      total: libros.length,
      data: libros,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /libro - Crear un nuevo libro
const createLibro = async (req, res) => {
  try {
    const libro = await Libro.create(req.body);
    res.status(201).json({
      success: true,
      data: libro,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// PUT /libro/:id - Actualizar un libro
const updateLibro = async (req, res) => {
  try {
    const libro = await Libro.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!libro) {
      return res.status(404).json({ success: false, message: 'Libro no encontrado' });
    }

    res.status(200).json({
      success: true,
      data: libro,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE /libro/:id - Eliminar un libro
const deleteLibro = async (req, res) => {
  try {
    const libro = await Libro.findByIdAndDelete(req.params.id);

    if (!libro) {
      return res.status(404).json({ success: false, message: 'Libro no encontrado' });
    }

    res.status(200).json({
      success: true,
      message: 'Libro eliminado correctamente',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getLibros, createLibro, updateLibro, deleteLibro };
