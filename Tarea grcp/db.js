const mysql = require('mysql2/promise');

// Configuracion de la base de datos MySQL
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',       // <-- cambia por tu password
  database: 'empresa',
  waitForConnections: true,
  connectionLimit: 10,
});

module.exports = pool;
