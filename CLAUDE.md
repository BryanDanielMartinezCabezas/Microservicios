# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Contexto

Materia: **Microservicios** — Universidad. Cada carpeta es una práctica o ejercicio independiente.

| Carpeta | Tecnología |
|---|---|
| `Practica 3 rest/` | REST + MongoDB |
| `Ejercicio Rest/` | REST + MongoDB (refactorizado, sin `version` en compose) |
| `Practica 4 Graphql/` | GraphQL (`express-graphql`) + MySQL |
| `Tarea grcp/` | gRPC + MySQL |
| `Practica 5 Sistema de RRHH con Microservicios/` | 2 microservicios (GraphQL+MySQL y REST+MongoDB) en un solo compose |
| `Primer Parcial/api-trabajadores/` | GraphQL (**Apollo Server**) + MongoDB |

---

## Stack tecnológico

- **Runtime:** Node.js + Express
- **Bases de datos:** MongoDB (mongoose) y MySQL (mysql2)
- **API styles:** REST, GraphQL (`express-graphql` o `@apollo/server`), gRPC (`@grpc/grpc-js`, `@grpc/proto-loader`)
- **Contenedores:** Docker + Docker Compose

**Imágenes Docker locales disponibles:** `mongo:latest`, `mysql:8.0`, `node:18-alpine`

---

## Comandos por proyecto

Cada subcarpeta es un proyecto independiente con su propio `package.json`.

```bash
# Levantar cualquier proyecto dockerizado
cd "Nombre del proyecto"
docker-compose up --build -d

# Ver logs
docker-compose logs -f

# Bajar contenedores
docker-compose down

# Desarrollo local (sin Docker)
npm install
npm run dev   # usa nodemon
npm start     # producción
```

---

## Arquitectura REST + MongoDB

```
proyecto/
├── src/
│   ├── config/database.js       ← connectDB() con mongoose
│   ├── models/recurso.model.js  ← Schema mongoose con timestamps: true
│   ├── controllers/             ← Lógica CRUD (getAll, create, update, delete)
│   └── routes/                  ← express.Router(), montar en app.js
├── app.js                       ← express() + express.json() + rutas
├── server.js                    ← dotenv.config() + connectDB() + listen
├── .env                         ← PORT y MONGO_URI
├── Dockerfile
└── docker-compose.yml
```

- Puerto por defecto: `3000`
- `MONGO_URI` apunta al servicio `mongo` dentro de la red Docker: `mongodb://mongo:27017/dbname`
- Respuestas siempre con `{ success: true/false, data/message }`

---

## Arquitectura GraphQL + MySQL (`express-graphql`)

Usada en `Practica 4 Graphql/`.

```
proyecto/
├── db.js                        ← mysql2 createConnection, connect()
├── app.js                       ← graphqlHTTP({ schema, rootValue, graphiql: true }) en /graphql
├── schema/typeDefs.js           ← buildSchema() con type, input, Query, Mutation
└── resolvers/recursoResolver.js ← Promises para cada operación
```

- Puerto por defecto: `4000` — interfaz visual: `http://localhost:4000/graphql`
- Todos los resolvers usan `new Promise((resolve, reject) => { db.query(...) })`
- Relaciones 1-N: 2 queries anidadas dentro del resolver
- Mutations de creación: calcular totales con `reduce`, INSERT cabecera → `insertId` → INSERT masivo hijos con `VALUES ?`
- Mutations de actualización dinámica: construir arrays `campos[]` y `valores[]` según campos presentes en el input

---

## Arquitectura GraphQL + MongoDB (`@apollo/server`) — Primer Parcial

Usada en `Primer Parcial/api-trabajadores/`. Entry point: `servidor.js` (no `server.js`).

```
proyecto/
├── src/
│   ├── config/baseDatos.js      ← mongoose.connect() async
│   ├── modelos/                 ← Schema mongoose con timestamps: true
│   ├── schema/schema.js         ← typeDefs como template literal `#graphql`
│   └── resolvers/               ← Query y Mutation como objeto { Query, Mutation }
├── servidor.js                  ← ApolloServer + startStandaloneServer
├── .env                         ← PUERTO y MONGO_URI
├── Dockerfile
└── docker-compose.yml
```

- Puerto por defecto: `4000` (env var `PUERTO`, no `PORT`)
- Apollo Standalone no usa Express; no hay `app.use`
- Schema usa SDL con template literal, resolvers como objeto con `Query` y `Mutation` anidados
- Variable de entorno del compose: `PUERTO`, no `PORT`

---

## Arquitectura gRPC + MySQL

```
proyecto/
├── proto/servicio.proto         ← Definición del servicio y mensajes
├── server.js                    ← grpc.Server() con implementaciones
├── client.js                    ← Cliente de prueba
└── db.js                        ← mysql2
```

---

## Arquitectura Microservicios (Práctica 5)

Múltiples servicios independientes en un mismo `docker-compose.yml`. Patrón de comunicación: HTTP entre servicios usando el nombre del servicio Docker como hostname (e.g. `GRAPHQL_URL: http://proyectos-service:3002/graphql`).

- Cada servicio tiene su propio `Dockerfile` y base de datos
- `depends_on` con `healthcheck` para MySQL antes de levantar el servicio que lo consume
- MySQL init scripts en `mysql-init/` montados en `/docker-entrypoint-initdb.d`

---

## Docker Compose — reglas generales

- **No usar el campo `version`** (obsoleto, genera warning) — omitirlo completamente
- Red siempre `bridge` compartida entre servicios
- Volúmenes nombrados para persistencia de datos
- Variables de entorno de DB apuntan al nombre del servicio Docker, no a `localhost`
- `.dockerignore` siempre excluye: `node_modules`, `.env`, `.git`
