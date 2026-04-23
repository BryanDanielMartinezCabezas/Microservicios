// ============================================================
// main.rs — Punto de entrada del servidor REST
// Equivalente al server.js del parcial
// ============================================================

mod handlers;
mod modelos;
mod rutas;

use std::collections::HashMap;
use std::sync::{Arc, Mutex};

#[tokio::main]
async fn main() {
    // Base de datos en memoria (sin MongoDB/MySQL para esta práctica)
    let db = Arc::new(Mutex::new(HashMap::new()));

    let app = rutas::crear_router(db);

    let listener = tokio::net::TcpListener::bind("0.0.0.0:8080").await.unwrap();
    println!("╔══════════════════════════════════════════╗");
    println!("║      REST API de Empleados — Rust        ║");
    println!("╠══════════════════════════════════════════╣");
    println!("║  REST:    http://localhost:8080/empleados ║");
    println!("║  Swagger: http://localhost:8080/swagger-ui║");
    println!("╚══════════════════════════════════════════╝");
    axum::serve(listener, app).await.unwrap();
}
