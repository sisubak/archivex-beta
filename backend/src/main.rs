use axum::{
    routing::get,
    Json, Router,
};
use serde::Serialize;
use std::net::SocketAddr;
use tower_http::cors::{Any, CorsLayer};

#[derive(Serialize)]
struct HealthResponse {
    status: &'static str,
    service: &'static str,
}

#[derive(Serialize)]
struct Section {
    id: &'static str,
    title: &'static str,
    direction: &'static str,
}

async fn health() -> Json<HealthResponse> {
    Json(HealthResponse {
        status: "ok",
        service: "archivex-backend",
    })
}

async fn sections() -> Json<Vec<Section>> {
    Json(vec![
        Section { id: "clients", title: "Clients", direction: "up" },
        Section { id: "about",   title: "About",   direction: "left" },
        Section { id: "status",  title: "Status",  direction: "right" },
        Section { id: "answers", title: "Answers", direction: "up" },
        Section { id: "faq",     title: "FAQ",     direction: "down" },
    ])
}

#[tokio::main]
async fn main() {
    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods(Any)
        .allow_headers(Any);

    let app = Router::new()
        .route("/health", get(health))
        .route("/api/sections", get(sections))
        .layer(cors);

    let addr = SocketAddr::from(([127, 0, 0, 1], 8080));
    println!("archivex backend — http://{}", addr);

    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}