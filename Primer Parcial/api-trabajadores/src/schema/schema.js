const esquema = `#graphql
  type Trabajador {
    id: ID!
    nombre: String!
    apellido: String!
    cedula: String!
    cargo: String!
    departamento: String!
    fechaIngreso: String!
  }

  input TrabajadorInput {
    nombre: String!
    apellido: String!
    cedula: String!
    cargo: String!
    departamento: String!
    fechaIngreso: String!
  }
  

  input ActualizarInput {
    nombre: String
    apellido: String
    cedula: String
    cargo: String
    departamento: String
    fechaIngreso: String
  }

  type Query {
    obtenerTrabajadores: [Trabajador]
    obtenerTrabajador(id: ID!): Trabajador
  }

  type Mutation {
    crearTrabajador(input: TrabajadorInput!): Trabajador
    actualizarTrabajador(id: ID!, input: ActualizarInput!): Trabajador
    eliminarTrabajador(id: ID!): String
  }
`;

module.exports = esquema;
