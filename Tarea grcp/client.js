const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

// Cargar el archivo proto
const PROTO_PATH = path.join(__dirname, 'proto', 'empleados.proto');
const packageDef = protoLoader.loadSync(PROTO_PATH);
const grpcObject = grpc.loadPackageDefinition(packageDef);

// Conectar al servidor
const client = new grpcObject.empleados.EmpleadoService(
  'localhost:50051',
  grpc.credentials.createInsecure()
);

// ─── Pruebas ──────────────────────────────────────────────────────────────────

// 1. Crear empleados
function crearEmpleado(nombres, apellidos, cargo) {
  return new Promise((resolve) => {
    client.Crear({ nombres, apellidos, cargo }, (err, response) => {
      if (err) return resolve({ exito: false, mensaje: err.message });
      resolve(response);
    });
  });
}

// 2. Listar empleados
function listarEmpleados() {
  return new Promise((resolve) => {
    client.Listar({}, (err, response) => {
      if (err) return resolve([]);
      resolve(response.empleados);
    });
  });
}

// 3. Eliminar empleado
function eliminarEmpleado(id) {
  return new Promise((resolve) => {
    client.Eliminar({ id }, (err, response) => {
      if (err) return resolve({ exito: false, mensaje: err.message });
      resolve(response);
    });
  });
}

// ─── Ejecutar pruebas secuencialmente ────────────────────────────────────────
async function main() {
  console.log('\n=== CREAR EMPLEADOS ===');
  let res = await crearEmpleado('Carlos', 'Montellano', 'Desarrollador');
  console.log(res.mensaje);

  res = await crearEmpleado('Maria', 'Lopez', 'Diseñadora');
  console.log(res.mensaje);

  console.log('\n=== LISTAR EMPLEADOS ===');
  const empleados = await listarEmpleados();
  console.table(empleados);

  console.log('\n=== ELIMINAR EMPLEADO (ID: 1) ===');
  res = await eliminarEmpleado(1);
  console.log(res.mensaje);

  console.log('\n=== LISTAR DESPUES DE ELIMINAR ===');
  const empleadosActualizados = await listarEmpleados();
  console.table(empleadosActualizados);
}

main().catch(console.error);
