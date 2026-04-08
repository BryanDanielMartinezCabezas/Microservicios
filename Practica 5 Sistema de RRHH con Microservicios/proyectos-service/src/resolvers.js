const Proyecto = require('./models/Proyecto');

const resolvers = {
  Query: {
    proyectos: async () => await Proyecto.find(),
    proyecto: async (_, { id }) => await Proyecto.findById(id),
    proyectosPorEmpleado: async (_, { empleadoId }) => 
      await Proyecto.find({ empleadosIds: empleadoId }),
    proyectosPorEstado: async (_, { estado }) => 
      await Proyecto.find({ estado })
  },
  Mutation: {
    crearProyecto: async (_, { input }) => {
      const nuevoProyecto = new Proyecto(input);
      return await nuevoProyecto.save();
    },
    actualizarProyecto: async (_, { id, input }) => {
      return await Proyecto.findByIdAndUpdate(id, input, { new: true });
    },
    asignarEmpleado: async (_, { proyectoId, empleadoId }) => {
      return await Proyecto.findByIdAndUpdate(
        proyectoId,
        { $addToSet: { empleadosIds: empleadoId } },
        { new: true }
      );
    },
    desasignarEmpleado: async (_, { proyectoId, empleadoId }) => {
      return await Proyecto.findByIdAndUpdate(
        proyectoId,
        { $pull: { empleadosIds: empleadoId } },
        { new: true }
      );
    },
    eliminarProyecto: async (_, { id }) => {
      const result = await Proyecto.findByIdAndDelete(id);
      return !!result;
    }
  }
};

module.exports = resolvers;