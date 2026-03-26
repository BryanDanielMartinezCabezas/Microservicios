const { buildSchema } = require('graphql');

const schema = buildSchema(`
  type Producto {
    id: Int
    nombre: String
    categoria: String
    stock_actual: Int
    precio: Float
  }

  type Proveedor {
    id: Int
    nombre: String
    telefono: String
    ciudad: String
  }

  type Movimiento {
    id: Int
    producto_id: Int
    tipo: String
    cantidad: Int
    fecha: String
    observacion: String
    producto: Producto
  }

  input ProductoInput {
    nombre: String!
    categoria: String!
    precio: Float!
  }

  input MovimientoInput {
    producto_id: Int!
    tipo: String!
    cantidad: Int!
    fecha: String!
    observacion: String
  }

  type Query {
    productos: [Producto]
    producto(id: Int!): Producto
    movimientos(producto_id: Int!): [Movimiento]
    proveedores: [Proveedor]
  }

  type Mutation {
    crearProducto(input: ProductoInput!): Producto
    registrarMovimiento(input: MovimientoInput!): Movimiento
    eliminarProducto(id: Int!): String
  }
`);

module.exports = schema;