const Trabajador = require('../modelos/trabajador');

const resolvers = {
  Query: {
    obtenerTrabajadores: async () => {
      return await Trabajador.find();
    },
    obtenerTrabajador: async (_, { id }) => {
      const trabajador = await Trabajador.findById(id);
      if (!trabajador) throw new Error('Trabajador no encontrado');
      return trabajador;
    },
  },
  Mutation: {
    crearTrabajador: async (_, { input }) => {
      return await Trabajador.create(input);
    },
    actualizarTrabajador: async (_, { id, input }) => {
      const trabajador = await Trabajador.findByIdAndUpdate(id, input, {
        new: true,
        runValidators: true,
      });
      if (!trabajador) throw new Error('Trabajador no encontrado');
      return trabajador;
    },
    eliminarTrabajador: async (_, { id }) => {
      const trabajador = await Trabajador.findByIdAndDelete(id);
      if (!trabajador) throw new Error('Trabajador no encontrado');
      return `Trabajador ${trabajador.nombre} ${trabajador.apellido} eliminado correctamente`;
    },
  },
};

module.exports = resolvers;
