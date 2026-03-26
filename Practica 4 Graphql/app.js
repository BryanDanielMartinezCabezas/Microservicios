// app.js
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema/typeDefs');
const resolvers = require('./resolvers/inventarioResolver');

const app = express();

// Montar el endpoint GraphQL
app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: resolvers,
    graphiql: true // Esto activa la interfaz visual para hacer pruebas
}));

app.listen(4000, () => {
    console.log('Servidor GraphQL corriendo en http://localhost:4000/graphql');
});