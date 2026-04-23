// ============================================================
// rutas.rs — Definición del Router y documentación Swagger
// Equivalente a las routes/ del parcial + configuración de Swagger
// ============================================================

use axum::{routing::get, Router};
use utoipa::OpenApi;
use utoipa_swagger_ui::SwaggerUi;

use crate::handlers::{
    actualizar_empleado, crear_empleado, eliminar_empleado, get_empleado, get_empleados,
};
use crate::modelos::{
    ActualizarEmpleadoInput, CrearEmpleadoInput, Empleado, RespuestaLista, RespuestaMensaje,
    RespuestaUno, DB,
};

// ---------------------------------------------------------------------------
// Documentación OpenAPI — utoipa genera el JSON de Swagger a partir de esto
// ---------------------------------------------------------------------------
#[derive(OpenApi)]
#[openapi(
    paths(
        crate::handlers::get_empleados,
        crate::handlers::get_empleado,
        crate::handlers::crear_empleado,
        crate::handlers::actualizar_empleado,
        crate::handlers::eliminar_empleado,
    ),
    components(schemas(
        Empleado,
        CrearEmpleadoInput,
        ActualizarEmpleadoInput,
        RespuestaLista,
        RespuestaUno,
        RespuestaMensaje,
    )),
    tags(
        (name = "Empleados", description = "CRUD completo de gestión de empleados")
    ),
    info(
        description = "API REST de Empleados — Práctica Microservicios con Rust"
    )
)]
pub struct ApiDoc;

// ---------------------------------------------------------------------------
// Construye y devuelve el Router completo con todas las rutas montadas
// Equivalente al app.use('/empleados', router) del parcial
// ---------------------------------------------------------------------------
pub fn crear_router(db: DB) -> Router {
    Router::new()
        .merge(SwaggerUi::new("/swagger-ui").url("/api-docs/openapi.json", ApiDoc::openapi()))
        .route("/empleados", get(get_empleados).post(crear_empleado))
        .route(
            "/empleados/:id",
            get(get_empleado).put(actualizar_empleado).delete(eliminar_empleado),
        )
        .with_state(db)
}
