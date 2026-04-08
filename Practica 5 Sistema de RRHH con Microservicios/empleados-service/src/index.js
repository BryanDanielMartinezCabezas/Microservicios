const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas (las crearemos en el siguiente paso)
app.use('/empleados', require('./routes/empleados'));

app.listen(PORT, () => {
  console.log(`Servicio de Empleados corriendo en http://localhost:${PORT}`);
});