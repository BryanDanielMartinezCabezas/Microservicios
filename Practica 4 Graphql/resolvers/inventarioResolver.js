const db = require('../db');

const inventarioResolver = {
  // --- QUERIES ---
  productos: () => {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM productos', (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  },

  producto: ({ id }) => {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM productos WHERE id = ?', [id], (err, results) => {
        if (err) return reject(err);
        if (results.length === 0) return reject(new Error('Producto no encontrado'));
        resolve(results[0]);
      });
    });
  },

  proveedores: () => {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM proveedores', (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  },

  movimientos: ({ producto_id }) => {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM movimientos WHERE producto_id = ?', [producto_id], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  },

  // --- MUTATIONS ---
  registrarMovimiento: ({ input }) => {
    const { producto_id, tipo, cantidad, fecha, observacion } = input;

    return new Promise((resolve, reject) => {
      // 1. Obtener stock actual
      db.query('SELECT stock_actual FROM productos WHERE id = ?', [producto_id], (err, results) => {
        if (err) return reject(err);
        if (results.length === 0) return reject(new Error('Producto no encontrado'));

        let stockActual = results[0].stock_actual;
        let nuevoStock = (tipo === 'ENTRADA') ? stockActual + cantidad : stockActual - cantidad;

        // 2. Validar stock negativo en SALIDAS
        if (tipo === 'SALIDA' && nuevoStock < 0) {
          return reject(new Error('Error: Stock insuficiente para realizar la salida'));
        }

        // 3. Insertar movimiento
        db.query(
          'INSERT INTO movimientos (producto_id, tipo, cantidad, fecha, observacion) VALUES (?, ?, ?, ?, ?)',
          [producto_id, tipo, cantidad, fecha, observacion],
          (errIns, resIns) => {
            if (errIns) return reject(errIns);
            
            // 4. Actualizar tabla productos
            db.query('UPDATE productos SET stock_actual = ? WHERE id = ?', [nuevoStock, producto_id], (errUpd) => {
              if (errUpd) return reject(errUpd);
              
              resolve({
                id: resIns.insertId,
                producto_id,
                tipo,
                cantidad,
                fecha,
                observacion
              });
            });
          }
        );
      });
    });
  },

  crearProducto: ({ input }) => {
    const { nombre, categoria, precio } = input;
    return new Promise((resolve, reject) => {
      db.query(
        'INSERT INTO productos (nombre, categoria, precio) VALUES (?, ?, ?)',
        [nombre, categoria, precio],
        (err, result) => {
          if (err) return reject(err);
          resolve({ id: result.insertId, nombre, categoria, precio, stock_actual: 0 });
        }
      );
    });
  },

  eliminarProducto: ({ id }) => {
    return new Promise((resolve, reject) => {
      db.query('DELETE FROM productos WHERE id = ?', [id], (err, result) => {
        if (err) return reject(err);
        if (result.affectedRows === 0) return reject(new Error('Producto no encontrado'));
        resolve(`Producto con id ${id} eliminado correctamente`);
      });
    });
  }
};

module.exports = inventarioResolver;