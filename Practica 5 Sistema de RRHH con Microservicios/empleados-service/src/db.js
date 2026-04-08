const mysql = require('mysql2/promise');
require('dotenv').config();

// Creamos un pool de conexiones para manejar múltiples peticiones 
const pool = mysql.createPool({
  host: process.env.DB_HOST,     // Será 'mysql-empleados' en Docker [cite: 258]
  user: process.env.DB_USER,     // 'root' [cite: 259]
  password: process.env.DB_PASS, // 'root1234' [cite: 262]
  database: process.env.DB_NAME, // 'rrhh_empleados' [cite: 263]
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;