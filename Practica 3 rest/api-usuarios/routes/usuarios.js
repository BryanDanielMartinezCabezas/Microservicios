const express = require('express');
const router = express.Router();
const controller = require('../controllers/usuariosController');

// Cuando alguien entre a "/" con GET, ejecutamos getAll
router.get('/', controller.getAll);

// Cuando alguien mande datos a "/" con POST, ejecutamos create
router.post('/', controller.create);

module.exports = router;