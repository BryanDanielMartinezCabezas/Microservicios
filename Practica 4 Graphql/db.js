const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', 
    database: 'api_inventario'
});

connection.connect((err) => {
    if (err) {
        console.error('Error de conexión a MySQL:', err);
        process.exit(1);
    }
    console.log('Conectado a MySQL correctamente');
});

module.exports = connection;