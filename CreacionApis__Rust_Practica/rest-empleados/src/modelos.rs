// ============================================================
// modelos.rs — Estructuras de datos
// Equivalente a los models/ del parcial (mongoose Schema)
// ============================================================

use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::sync::{Arc, Mutex};
use utoipa::ToSchema;

// Base de datos en memoria compartida entre handlers
// Arc   → permite que múltiples threads lean el mismo HashMap
// Mutex → garantiza que solo un thread escribe a la vez
pub type DB = Arc<Mutex<HashMap<String, Empleado>>>;

// ---------------------------------------------------------------------------
// Modelo principal — equivalente al Schema de Mongoose
// ---------------------------------------------------------------------------
#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct Empleado {
    /// Identificador único (UUID generado automáticamente)
    pub id: String,
    pub nombre: String,
    pub apellido: String,
    /// Número de cédula — debe ser único
    pub cedula: String,
    pub cargo: String,
    pub departamento: String,
    /// Formato recomendado: YYYY-MM-DD
    pub fecha_ingreso: String,
}

// Input para crear — sin el campo id (se genera automáticamente)
#[derive(Debug, Deserialize, ToSchema)]
pub struct CrearEmpleadoInput {
    pub nombre: String,
    pub apellido: String,
    pub cedula: String,
    pub cargo: String,
    pub departamento: String,
    pub fecha_ingreso: String,
}

// Input para actualizar — todos opcionales (actualización parcial)
// Equivalente al ActualizarInput del parcial
#[derive(Debug, Deserialize, ToSchema)]
pub struct ActualizarEmpleadoInput {
    pub nombre: Option<String>,
    pub apellido: Option<String>,
    pub cedula: Option<String>,
    pub cargo: Option<String>,
    pub departamento: Option<String>,
    pub fecha_ingreso: Option<String>,
}

// ---------------------------------------------------------------------------
// Tipos de respuesta — equivalente al patrón { success, data/message } del parcial
// ---------------------------------------------------------------------------
#[derive(Serialize, ToSchema)]
pub struct RespuestaLista {
    pub success: bool,
    pub data: Vec<Empleado>,
}

#[derive(Serialize, ToSchema)]
pub struct RespuestaUno {
    pub success: bool,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub data: Option<Empleado>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub mensaje: Option<String>,
}

#[derive(Serialize, ToSchema)]
pub struct RespuestaMensaje {
    pub success: bool,
    pub mensaje: String,
}
