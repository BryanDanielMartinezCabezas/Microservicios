const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const mongoose = require('mongoose');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
require('dotenv').config();

const startServer = async () => {
  try {
    // Conexión a MongoDB usando variable de entorno para Docker [cite: 277]
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/rrhh_proyectos';
    await mongoose.connect(mongoUri);
    console.log('✅ Conectado a MongoDB');

    const server = new ApolloServer({ typeDefs, resolvers });
    
    // El puerto 3002 es el requerido por la práctica 
    const { url } = await startStandaloneServer(server, {
      listen: { port: 3002 },
    });

    console.log(`🚀 Servicio de Proyectos listo en: ${url}`);
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
  }
};

startServer();