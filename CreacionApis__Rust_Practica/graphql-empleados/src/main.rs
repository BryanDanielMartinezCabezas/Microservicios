// ============================================================
// main.rs — Punto de entrada del servidor GraphQL
// Equivalente al servidor.js del parcial (Apollo Server)
// ============================================================

mod modelos;
mod resolvers;

use async_graphql::http::GraphiQLSource;
use async_graphql_axum::GraphQL;
use axum::{
    response::{Html, IntoResponse},
    routing::get,
    Router,
};

// Playground visual — equivalente a graphiql: true del parcial
async fn graphiql() -> impl IntoResponse {
    Html(GraphiQLSource::build().endpoint("/graphql").finish())
}

#[tokio::main]
async fn main() {
    let schema = resolvers::crear_schema();

    let app = Router::new()
        .route("/", get(graphiql))
        .route_service("/graphql", GraphQL::new(schema));

    let listener = tokio::net::TcpListener::bind("0.0.0.0:8081").await.unwrap();
    println!("╔═══════════════════════════════════════════════════╗");
    println!("║       GraphQL API de Empleados — Rust             ║");
    println!("╠═══════════════════════════════════════════════════╣");
    println!("║  Playground: http://localhost:8081/               ║");
    println!("║  Endpoint:   http://localhost:8081/graphql        ║");
    println!("║  (Requiere REST API corriendo en :8080)           ║");
    println!("╚═══════════════════════════════════════════════════╝");
    axum::serve(listener, app).await.unwrap();
}
