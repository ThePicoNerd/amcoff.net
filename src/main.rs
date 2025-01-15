use std::{sync::LazyLock, time::Duration};

use axum::{
    extract::Path,
    http::{
        header::{CACHE_CONTROL, CONTENT_TYPE},
        HeaderValue, StatusCode,
    },
    response::{Html, IntoResponse},
    routing::get,
    Router,
};
use axum_extra::{
    headers::{CacheControl, ContentType},
    TypedHeader,
};
use prometheus::{register_int_counter, IntCounter};
use rust_embed::Embed;
use tower_http::{compression::CompressionLayer, set_header::SetResponseHeaderLayer};

static ROBOT_COUNTER: LazyLock<IntCounter> =
    LazyLock::new(|| register_int_counter!("robots", "/robots.txt counter").unwrap());

async fn static_handler(Path(path): Path<String>) -> impl IntoResponse {
    #[derive(Embed)]
    #[folder = "assets/"]
    struct Assets;

    match Assets::get(&path) {
        Some(file) => (
            TypedHeader(ContentType::from(
                mime_guess::from_path(path).first_or_octet_stream(),
            )),
            file.data,
        )
            .into_response(),
        None => not_found().await.into_response(),
    }
}

async fn robots() -> impl IntoResponse {
    ROBOT_COUNTER.inc();

    (TypedHeader(ContentType::text()), "# gnorts, mr. alien")
}

async fn index() -> impl IntoResponse {
    (
        TypedHeader(
            CacheControl::new()
                .with_public()
                .with_max_age(Duration::from_secs(60)),
        ),
        Html(include_bytes!("index.html")),
    )
}

async fn metrics() -> impl IntoResponse {
    let metric_families = prometheus::gather();
    let text = prometheus::TextEncoder::new()
        .encode_to_string(&metric_families)
        .unwrap();

    ([(CONTENT_TYPE, prometheus::TEXT_FORMAT)], text)
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
        .route("/{*file}", get(static_handler))
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
