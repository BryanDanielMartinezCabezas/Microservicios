require('dotenv').config();
const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const conectar = require('./src/config/baseDatos');
const esquema = require('./src/schema/schema');
const resolvers = require('./src/resolvers/trabajadorResolver');

async function iniciar() {
  await conectar();

  const servidor = new ApolloServer({ typeDefs: esquema, resolvers });

  const PUERTO = parseInt(process.env.PUERTO) || 4000;
  const { url } = await startStandaloneServer(servidor, {
    listen: { port: PUERTO },
  });

  console.log(`Servidor GraphQL corriendo en ${url}`);
}

iniciar();
