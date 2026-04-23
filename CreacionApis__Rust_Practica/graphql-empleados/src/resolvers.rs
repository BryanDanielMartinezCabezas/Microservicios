// ============================================================
// resolvers.rs — Queries y Mutations GraphQL
// Equivalente a los resolvers/ del parcial
// ============================================================

use async_graphql::{Context, EmptySubscription, Object, Schema, ID};
use reqwest::Client;

use crate::modelos::{
    ActualizarEmpleadoInput, CrearEmpleadoInput, Empleado, RespuestaLista, RespuestaMensaje,
    RespuestaUno,
};

// URL base del REST API — el GraphQL lo llama internamente (server-to-server)
// Equivalente al GRAPHQL_URL de la Práctica 5
pub const REST_URL: &str = "http://localhost:8080";

// Convierte errores de reqwest a errores de async-graphql
pub fn http_err<E: std::fmt::Display>(e: E) -> async_graphql::Error {
    async_graphql::Error::new(format!("Error comunicando con REST API: {}", e))
}

// ---------------------------------------------------------------------------
// Query Root — equivalente a "type Query" del schema del parcial
// ---------------------------------------------------------------------------
pub struct QueryRoot;

#[Object]
impl QueryRoot {
    /// Obtener todos los empleados (llama GET /empleados del REST API)
    pub async fn empleados(&self, ctx: &Context<'_>) -> async_graphql::Result<Vec<Empleado>> {
        let client = ctx.data::<Client>()?;
        let resp: RespuestaLista = client
            .get(format!("{REST_URL}/empleados"))
            .send().await.map_err(http_err)?
            .json().await.map_err(http_err)?;
        Ok(resp.data)
    }

    /// Obtener un empleado por ID (llama GET /empleados/:id del REST API)
    pub async fn empleado(&self, ctx: &Context<'_>, id: ID) -> async_graphql::Result<Option<Empleado>> {
        let client = ctx.data::<Client>()?;
        let http_resp = client
            .get(format!("{REST_URL}/empleados/{}", id.as_str()))
            .send().await.map_err(http_err)?;

        if http_resp.status() == 404 {
            return Ok(None);
        }

        let body: RespuestaUno = http_resp.json().await.map_err(http_err)?;
        Ok(body.data)
    }
}

// ---------------------------------------------------------------------------
// Mutation Root — equivalente a "type Mutation" del schema del parcial
// ---------------------------------------------------------------------------
pub struct MutationRoot;

#[Object]
impl MutationRoot {
    /// Crear un nuevo empleado (llama POST /empleados del REST API)
    pub async fn crear_empleado(
        &self,
        ctx: &Context<'_>,
        input: CrearEmpleadoInput,
    ) -> async_graphql::Result<Empleado> {
        let client = ctx.data::<Client>()?;
        let body: RespuestaUno = client
            .post(format!("{REST_URL}/empleados"))
            .json(&input)
            .send().await.map_err(http_err)?
            .json().await.map_err(http_err)?;

        body.data.ok_or_else(|| async_graphql::Error::new("El REST API no retornó el empleado creado"))
    }

    /// Actualizar un empleado existente (llama PUT /empleados/:id del REST API)
    pub async fn actualizar_empleado(
        &self,
        ctx: &Context<'_>,
        id: ID,
        input: ActualizarEmpleadoInput,
    ) -> async_graphql::Result<Option<Empleado>> {
        let client = ctx.data::<Client>()?;
        let http_resp = client
            .put(format!("{REST_URL}/empleados/{}", id.as_str()))
            .json(&input)
            .send().await.map_err(http_err)?;

        if http_resp.status() == 404 {
            return Ok(None);
        }

        let body: RespuestaUno = http_resp.json().await.map_err(http_err)?;
        Ok(body.data)
    }

    /// Eliminar un empleado (llama DELETE /empleados/:id del REST API)
    pub async fn eliminar_empleado(
        &self,
        ctx: &Context<'_>,
        id: ID,
    ) -> async_graphql::Result<String> {
        let client = ctx.data::<Client>()?;
        let http_resp = client
            .delete(format!("{REST_URL}/empleados/{}", id.as_str()))
            .send().await.map_err(http_err)?;

        let body: RespuestaMensaje = http_resp.json().await.map_err(http_err)?;
        Ok(body.mensaje)
    }
}

// ---------------------------------------------------------------------------
// Tipo del schema y función de construcción
// Equivalente al ApolloServer({ typeDefs, resolvers }) del parcial
// ---------------------------------------------------------------------------
pub type EmpleadosSchema = Schema<QueryRoot, MutationRoot, EmptySubscription>;

pub fn crear_schema() -> EmpleadosSchema {
    let client = Client::new();
    Schema::build(QueryRoot, MutationRoot, EmptySubscription)
        .data(client)
        .finish()
}
