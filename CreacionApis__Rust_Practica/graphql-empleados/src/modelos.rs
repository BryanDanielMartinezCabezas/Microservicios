// ============================================================
// modelos.rs — Tipos de datos GraphQL y estructuras HTTP
// ============================================================

use async_graphql::{InputObject, SimpleObject};
use serde::{Deserialize, Serialize};

// ---------------------------------------------------------------------------
// Tipo GraphQL principal
// SimpleObject → async-graphql lo expone como tipo en el schema automáticamente
// Los campos snake_case se convierten a camelCase en GraphQL (fecha_ingreso → fechaIngreso)
// ---------------------------------------------------------------------------
#[derive(SimpleObject, Deserialize, Clone)]
pub struct Empleado {
    pub id: String,
    pub nombre: String,
    pub apellido: String,
    pub cedula: String,
    pub cargo: String,
    pub departamento: String,
    pub fecha_ingreso: String,
}

// InputObject → equivalente a "input TrabajadorInput" del schema del parcial
#[derive(InputObject, Serialize)]
pub struct CrearEmpleadoInput {
    pub nombre: String,
    pub apellido: String,
    pub cedula: String,
    pub cargo: String,
    pub departamento: String,
    pub fecha_ingreso: String,
}

// Campos opcionales — equivalente a "input ActualizarInput" del parcial
#[derive(InputObject, Serialize)]
pub struct ActualizarEmpleadoInput {
    pub nombre: Option<String>,
    pub apellido: Option<String>,
    pub cedula: Option<String>,
    pub cargo: Option<String>,
    pub departamento: Option<String>,
    pub fecha_ingreso: Option<String>,
}

// ---------------------------------------------------------------------------
// Structs para deserializar las respuestas del REST API (uso interno)
// ---------------------------------------------------------------------------
#[derive(Deserialize)]
pub struct RespuestaLista {
    pub data: Vec<Empleado>,
}

#[derive(Deserialize)]
pub struct RespuestaUno {
    pub data: Option<Empleado>,
}

#[derive(Deserialize)]
pub struct RespuestaMensaje {
    pub mensaje: String,
}
