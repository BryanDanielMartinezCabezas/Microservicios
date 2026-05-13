const express = require('express');

const app = express();
const PORT = process.env.PORT || 4000;

let requestsTotal = 0;
let errorCount = 0;
let totalResponseMs = 0;

const personas = [
  { id: 1, nombre: 'Juan Pérez', edad: 30, ciudad: 'Sucre' },
  { id: 2, nombre: 'María López', edad: 25, ciudad: 'La Paz' },
  { id: 3, nombre: 'Carlos García', edad: 35, ciudad: 'Cochabamba' },
  { id: 4, nombre: 'Ana Rodríguez', edad: 28, ciudad: 'Santa Cruz' },
  { id: 5, nombre: 'Luis Mamani', edad: 32, ciudad: 'Potosí' },
];

app.use((req, res, next) => {
  if (req.path === '/metrics') return next();
  const start = Date.now();
  res.on('finish', () => {
    requestsTotal++;
    const duration = Date.now() - start;
    totalResponseMs += duration;
    if (res.statusCode >= 400) {
      errorCount++;
    }
    console.log(`${req.method} ${req.path} ${res.statusCode} ${duration}ms`);
  });
  next();
});

app.get('/personas', (req, res) => {
  res.json({ success: true, data: personas });
});

app.get('/error', (req, res) => {
  res.status(500).json({ success: false, message: 'Error simulado del servidor' });
});

app.get('/metrics', (req, res) => {
  const avgMs = requestsTotal > 0 ? Math.round(totalResponseMs / requestsTotal) : 0;
  const lines = [
    `requests_total,service=microservicio value=${requestsTotal}`,
    `errorCount,service=microservicio value=${errorCount}`,
    `avg_response_ms,service=microservicio value=${avgMs}`,
  ];
  res.set('Content-Type', 'text/plain; charset=utf-8');
  res.send(lines.join('\n') + '\n');
});

app.listen(PORT, () => {
  console.log(`Microservicio TICKS escuchando en puerto ${PORT}`);
});
