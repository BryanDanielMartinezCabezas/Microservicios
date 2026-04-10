const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const db = require('./db');

// Cargar el archivo proto
const PROTO_PATH = path.join(__dirname, 'proto', 'empleados.proto');
const packageDef = protoLoader.loadSync(PROTO_PATH);
const grpcObject = grpc.loadPackageDefinition(packageDef);
const EmpleadoService = grpcObject.empleados.EmpleadoService;

// ─── Implementacion de los metodos ───────────────────────────────────────────

// Crear empleado
async function Crear(call, callback) {
  const { nombres, apellidos, cargo } = call.request;
  try {
    await db.query(
      'INSERT INTO empleados (nombres, apellidos, cargo) VALUES (?, ?, ?)',
      [nombres, apellidos, cargo]
    );
    callback(null, { exito: true, mensaje: `Empleado ${nombres} creado correctamente` });
  } catch (err) {
    callback(null, { exito: false, mensaje: 'Error al crear: ' + err.message });
  }
}

// Listar empleados
async function Listar(call, callback) {
  try {
    const [rows] = await db.query('SELECT * FROM empleados');
    callback(null, { empleados: rows });
  } catch (err) {
    callback(null, { empleados: [] });
  }
}

// Eliminar empleado por ID
async function Eliminar(call, callback) {
  const { id } = call.request;
  try {
    const [result] = await db.query('DELETE FROM empleados WHERE id = ?', [id]);
    if (result.affectedRows > 0) {
      callback(null, { exito: true, mensaje: `Empleado con ID ${id} eliminado` });
    } else {
      callback(null, { exito: false, mensaje: `No existe empleado con ID ${id}` });
    }
  } catch (err) {
    callback(null, { exito: false, mensaje: 'Error al eliminar: ' + err.message });
  }
}

// ─── Iniciar servidor ─────────────────────────────────────────────────────────

const server = new grpc.Server();

server.addService(EmpleadoService.service, { Crear, Listar, Eliminar });

const PORT = '0.0.0.0:50051';
server.bindAsync(PORT, grpc.ServerCredentials.createInsecure(), (err, port) => {
  if (err) {
    console.error('Error al iniciar servidor:', err);
    return;
  }
  console.log(`Servidor gRPC corriendo en puerto ${port}`);
});
