use std::sync::LazyLock;

use axum::{
    http::header::{CACHE_CONTROL, CONTENT_TYPE},
    response::IntoResponse,
    routing::get,
    Router,
};
use prometheus::{register_int_counter, IntCounter};
use tower_http::compression::CompressionLayer;

static ROBOT_COUNTER: LazyLock<IntCounter> =
    LazyLock::new(|| register_int_counter!("robots", "/robots.txt counter").unwrap());

async fn robots() -> impl IntoResponse {
    ROBOT_COUNTER.inc();
    ([(CACHE_CONTROL, "no-cache")], "lol")
}

async fn index() -> impl IntoResponse {
    (
        [
            (CONTENT_TYPE, "text/html"),
            (CACHE_CONTROL, "public; max-age=60"),
        ],
        include_bytes!("index.html"),
    )
}

async fn metrics() -> impl IntoResponse {
    let metric_families = prometheus::gather();
    let text = prometheus::TextEncoder::new()
        .encode_to_string(&metric_families)
        .unwrap();
    ([(CACHE_CONTROL, "no-cache")], text)
}

#[tokio::main]
async fn main() {
    let _ = ROBOT_COUNTER.get();

    let app = Router::new()
        .route("/", get(index))
        .route("/robots.txt", get(robots))
        .route("/metrics", get(metrics))
        .layer(CompressionLayer::new());

    let listener = tokio::net::TcpListener::bind("0.0.0.0:8000").await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
