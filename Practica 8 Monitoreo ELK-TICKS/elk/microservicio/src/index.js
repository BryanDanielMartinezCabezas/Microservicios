const express = require('express');
const net = require('net');

const app = express();
const PORT = process.env.PORT || 3000;
const LOGSTASH_HOST = process.env.LOGSTASH_HOST || 'logstash';
const LOGSTASH_PORT = parseInt(process.env.LOGSTASH_PORT || '5044');

const personas = [
  { id: 1, nombre: 'Juan Pérez', edad: 30, ciudad: 'Sucre' },
  { id: 2, nombre: 'María López', edad: 25, ciudad: 'La Paz' },
  { id: 3, nombre: 'Carlos García', edad: 35, ciudad: 'Cochabamba' },
  { id: 4, nombre: 'Ana Rodríguez', edad: 28, ciudad: 'Santa Cruz' },
  { id: 5, nombre: 'Luis Mamani', edad: 32, ciudad: 'Potosí' },
];

function sendLog(entry) {
  const client = new net.Socket();
  client.setTimeout(2000);
  client.on('error', () => client.destroy());
  client.on('timeout', () => client.destroy());
  client.connect(LOGSTASH_PORT, LOGSTASH_HOST, () => {
    client.write(JSON.stringify(entry) + '\n', () => client.destroy());
  });
}

function log(level, message, extra = {}) {
  const entry = {
    '@timestamp': new Date().toISOString(),
    level,
    message,
    service: 'personas-svc',
    ...extra,
  };
  console.log(JSON.stringify(entry));
  sendLog(entry);
}

app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    const level = res.statusCode >= 400 ? 'ERROR' : 'INFO';
    log(level, `${req.method} ${req.path} ${res.statusCode}`, {
      route: req.path,
      method: req.method,
      statusCode: res.statusCode,
      duration_ms: duration,
    });
  });
  next();
});

app.get('/personas', (req, res) => {
  res.json({ success: true, data: personas });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/error', (req, res) => {
  res.status(500).json({ success: false, message: 'Error simulado del servidor' });
});

app.listen(PORT, () => {
  console.log(`Microservicio ELK escuchando en puerto ${PORT}`);
});
