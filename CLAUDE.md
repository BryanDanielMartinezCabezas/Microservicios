# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Contexto

Materia: **Microservicios** — Universidad. Cada carpeta es una práctica o ejercicio independiente. El trabajo del parcial vive en `Primer Parcial/`.

**Temas del Primer Parcial:** REST, GraphQL, Docker.

---

## Stack tecnológico

- **Runtime:** Node.js + Express
- **Bases de datos:** MongoDB (mongoose) y MySQL (mysql2)
- **API styles:** REST, GraphQL (`express-graphql`), gRPC (`@grpc/grpc-js`, `@grpc/proto-loader`)
- **Contenedores:** Docker + Docker Compose

**Imágenes Docker locales disponibles:**
- `mongo:latest`
- `mysql:8.0`
- `node:18-alpine`

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

## Arquitectura REST + MongoDB (patrón usado en parcial)

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

## Arquitectura GraphQL + MySQL (patrón usado en parcial)

```
proyecto/
├── db.js                        ← mysql2 createConnection, connect()
├── app.js                       ← graphqlHTTP({ schema, rootValue, graphiql: true }) en /graphql
├── schema/typeDefs.js           ← buildSchema() con type, input, Query, Mutation
└── resolvers/recursoResolver.js ← Promises para cada operación
```

- Puerto por defecto: `4000`
- Interfaz de prueba visual: `http://localhost:4000/graphql` (GraphiQL)
- Todos los resolvers usan `new Promise((resolve, reject) => { db.query(...) })`
- Para relaciones 1-N: 2 queries anidadas dentro del resolver
- Mutations de creación: calcular totales con `reduce`, INSERT cabecera → `insertId` → INSERT masivo hijos con `VALUES ?`
- Mutations de actualización dinámica: construir arrays `campos[]` y `valores[]` según campos presentes en el input

## Arquitectura gRPC + MySQL

```
proyecto/
├── proto/servicio.proto         ← Definición del servicio y mensajes
├── server.js                    ← grpc.Server() con implementaciones
├── client.js                    ← Cliente de prueba
└── db.js                        ← mysql2
```

## Arquitectura Microservicios (Práctica 5)

Múltiples servicios independientes en un mismo `docker-compose.yml`:
- Cada servicio tiene su propio `Dockerfile` y base de datos
- Se comunican por nombre de servicio Docker dentro de la red compartida
- `depends_on` con `healthcheck` para MySQL antes de levantar el servicio

---

## Docker Compose — reglas generales

- No usar el campo `version` (obsoleto, genera warning)
- Red siempre `bridge` compartida entre servicios
- Volúmenes nombrados para persistencia de datos
- Variables de entorno de DB apuntan al nombre del servicio Docker, no a `localhost`
- `.dockerignore` siempre excluye: `node_modules`, `.env`, `.git`
