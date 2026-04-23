// ============================================================
// handlers.rs — Lógica CRUD
// Equivalente a los controllers/ del parcial
// ============================================================

use axum::{
    extract::{Path, State},
    http::StatusCode,
    response::{IntoResponse, Response},
    Json,
};
use uuid::Uuid;

use crate::modelos::{
    ActualizarEmpleadoInput, CrearEmpleadoInput, Empleado, RespuestaLista, RespuestaMensaje,
    RespuestaUno, DB,
};

// ---------------------------------------------------------------------------
// GET /empleados — Listar todos
// ---------------------------------------------------------------------------
#[utoipa::path(
    get,
    path = "/empleados",
    tag = "Empleados",
    responses(
        (status = 200, description = "Lista de empleados obtenida exitosamente", body = RespuestaLista)
    )
)]
pub async fn get_empleados(State(db): State<DB>) -> Json<RespuestaLista> {
    let db = db.lock().unwrap();
    let data: Vec<Empleado> = db.values().cloned().collect();
    Json(RespuestaLista { success: true, data })
}

// ---------------------------------------------------------------------------
// GET /empleados/:id — Obtener uno por ID
// ---------------------------------------------------------------------------
#[utoipa::path(
    get,
    path = "/empleados/{id}",
    tag = "Empleados",
    params(("id" = String, Path, description = "ID UUID del empleado")),
    responses(
        (status = 200, description = "Empleado encontrado", body = RespuestaUno),
        (status = 404, description = "Empleado no encontrado", body = RespuestaUno)
    )
)]
pub async fn get_empleado(State(db): State<DB>, Path(id): Path<String>) -> Response {
    let db = db.lock().unwrap();
    match db.get(&id) {
        Some(emp) => (
            StatusCode::OK,
            Json(RespuestaUno { success: true, data: Some(emp.clone()), mensaje: None }),
        ).into_response(),
        None => (
            StatusCode::NOT_FOUND,
            Json(RespuestaUno { success: false, data: None, mensaje: Some("Empleado no encontrado".into()) }),
        ).into_response(),
    }
}

// ---------------------------------------------------------------------------
// POST /empleados — Crear nuevo empleado
// ---------------------------------------------------------------------------
#[utoipa::path(
    post,
    path = "/empleados",
    tag = "Empleados",
    request_body = CrearEmpleadoInput,
    responses(
        (status = 201, description = "Empleado creado exitosamente", body = RespuestaUno)
    )
)]
pub async fn crear_empleado(
    State(db): State<DB>,
    Json(input): Json<CrearEmpleadoInput>,
) -> (StatusCode, Json<RespuestaUno>) {
    let empleado = Empleado {
        id: Uuid::new_v4().to_string(),
        nombre: input.nombre,
        apellido: input.apellido,
        cedula: input.cedula,
        cargo: input.cargo,
        departamento: input.departamento,
        fecha_ingreso: input.fecha_ingreso,
    };
    let mut db = db.lock().unwrap();
    db.insert(empleado.id.clone(), empleado.clone());
    (StatusCode::CREATED, Json(RespuestaUno { success: true, data: Some(empleado), mensaje: None }))
}

// ---------------------------------------------------------------------------
// PUT /empleados/:id — Actualizar campos (actualización parcial)
// ---------------------------------------------------------------------------
#[utoipa::path(
    put,
    path = "/empleados/{id}",
    tag = "Empleados",
    params(("id" = String, Path, description = "ID UUID del empleado")),
    request_body = ActualizarEmpleadoInput,
    responses(
        (status = 200, description = "Empleado actualizado correctamente", body = RespuestaUno),
        (status = 404, description = "Empleado no encontrado", body = RespuestaUno)
    )
)]
pub async fn actualizar_empleado(
    State(db): State<DB>,
    Path(id): Path<String>,
    Json(input): Json<ActualizarEmpleadoInput>,
) -> Response {
    let mut db = db.lock().unwrap();
    match db.get_mut(&id) {
        Some(emp) => {
            // Solo actualiza los campos que llegaron en el body (Option::Some)
            // Equivalente al patrón campos[]/valores[] del parcial
            if let Some(v) = input.nombre      { emp.nombre = v; }
            if let Some(v) = input.apellido    { emp.apellido = v; }
            if let Some(v) = input.cedula      { emp.cedula = v; }
            if let Some(v) = input.cargo       { emp.cargo = v; }
            if let Some(v) = input.departamento { emp.departamento = v; }
            if let Some(v) = input.fecha_ingreso { emp.fecha_ingreso = v; }
            (
                StatusCode::OK,
                Json(RespuestaUno { success: true, data: Some(emp.clone()), mensaje: None }),
            ).into_response()
        }
        None => (
            StatusCode::NOT_FOUND,
            Json(RespuestaUno { success: false, data: None, mensaje: Some("Empleado no encontrado".into()) }),
        ).into_response(),
    }
}

// ---------------------------------------------------------------------------
// DELETE /empleados/:id — Eliminar empleado
// ---------------------------------------------------------------------------
#[utoipa::path(
    delete,
    path = "/empleados/{id}",
    tag = "Empleados",
    params(("id" = String, Path, description = "ID UUID del empleado")),
    responses(
        (status = 200, description = "Empleado eliminado exitosamente", body = RespuestaMensaje),
        (status = 404, description = "Empleado no encontrado", body = RespuestaMensaje)
    )
)]
pub async fn eliminar_empleado(State(db): State<DB>, Path(id): Path<String>) -> Response {
    let mut db = db.lock().unwrap();
    match db.remove(&id) {
        Some(_) => (
            StatusCode::OK,
            Json(RespuestaMensaje { success: true, mensaje: "Empleado eliminado correctamente".into() }),
        ).into_response(),
        None => (
            StatusCode::NOT_FOUND,
            Json(RespuestaMensaje { success: false, mensaje: "Empleado no encontrado".into() }),
        ).into_response(),
    }
}
