const mysql = require('mysql2');

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'api_rest',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

const connection = mysql.createConnection(dbConfig);

const connectWithRetry = () => {
    connection.connect((err) => {
        if (err) {
            console.error('❌ Error de conexión (reintentando en 5s):', err.message);
            setTimeout(connectWithRetry, 5000);
        } else {
            console.log('✅ CONEXIÓN EXITOSA A MYSQL');
        }
    });
};

connectWithRetry();

module.exports = connection;