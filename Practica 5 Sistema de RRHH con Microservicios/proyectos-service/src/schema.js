const { gql } = require('graphql-tag');

const typeDefs = gql`
  enum EstadoProyecto {
    PLANIFICACION
    EN_CURSO
    FINALIZADO
    CANCELADO
  }

  type Proyecto {
    id: ID!
    nombre: String!
    descripcion: String
    estado: EstadoProyecto!
    fechaInicio: String!
    fechaFin: String
    presupuesto: Float!
    empleadosIds: [String!]!
  }

  input ProyectoInput {
    nombre: String!
    descripcion: String
    estado: EstadoProyecto
    fechaInicio: String!
    fechaFin: String
    presupuesto: Float!
  }

  type Query {
    proyectos: [Proyecto!]!
    proyecto(id: ID!): Proyecto
    proyectosPorEmpleado(empleadoId: String!): [Proyecto!]!
    proyectosPorEstado(estado: EstadoProyecto!): [Proyecto!]!
  }

  type Mutation {
    crearProyecto(input: ProyectoInput!): Proyecto!
    actualizarProyecto(id: ID!, input: ProyectoInput!): Proyecto!
    asignarEmpleado(proyectoId: ID!, empleadoId: String!): Proyecto!
    desasignarEmpleado(proyectoId: ID!, empleadoId: String!): Proyecto!
    eliminarProyecto(id: ID!): Boolean!
  }
`;

module.exports = typeDefs;