use std::sync::LazyLock;

use axum::{
    http::{
        header::{CACHE_CONTROL, CONTENT_TYPE},
        HeaderValue, StatusCode,
    },
    response::IntoResponse,
    routing::get,
    Router,
};
use prometheus::{register_int_counter, IntCounter};
use tower_http::{compression::CompressionLayer, set_header::SetResponseHeaderLayer};

static ROBOT_COUNTER: LazyLock<IntCounter> =
    LazyLock::new(|| register_int_counter!("robots", "/robots.txt counter").unwrap());

async fn robots() -> impl IntoResponse {
    ROBOT_COUNTER.inc();
    "# gnorts, mr. alien"
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
    prometheus::TextEncoder::new()
        .encode_to_string(&metric_families)
        .unwrap()
}

async fn method_not_allowed() -> impl IntoResponse {
    (StatusCode::METHOD_NOT_ALLOWED, "Method not allowed")
}

async fn not_found() -> impl IntoResponse {
    (StatusCode::NOT_FOUND, "Not found")
}

#[tokio::main]
async fn main() {
    let _ = ROBOT_COUNTER.get();

    let app = Router::new()
        .route("/", get(index))
        .route("/robots.txt", get(robots))
        .route("/metrics", get(metrics))
        .method_not_allowed_fallback(method_not_allowed)
        .fallback(not_found)
        .layer(CompressionLayer::new())
        .layer(SetResponseHeaderLayer::if_not_present(
            CACHE_CONTROL,
            HeaderValue::from_static("no-cache"),
        ));

    let listener = tokio::net::TcpListener::bind("0.0.0.0:8000").await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
