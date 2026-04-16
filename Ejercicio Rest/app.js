const express = require('express');
const libroRoutes = require('./src/routes/libro.routes');

const app = express();

app.use(express.json());

app.use('/libro', libroRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'API de Libros funcionando correctamente' });
});

module.exports = app;
