const express = require('express');
const router = express.Router();
const {
  getLibros,
  createLibro,
  updateLibro,
  deleteLibro,
} = require('../controllers/libro.controller');

router.get('/', getLibros);
router.post('/', createLibro);
router.put('/:id', updateLibro);
router.delete('/:id', deleteLibro);

module.exports = router;
