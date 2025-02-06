use std::sync::LazyLock;

use axum::{
    extract::Path,
    http::{
        header::{CACHE_CONTROL, CONTENT_TYPE},
        HeaderValue, StatusCode,
    },
    response::IntoResponse,
    routing::get,
    Router,
};
use axum_extra::{headers::ContentType, TypedHeader};
use prometheus::{register_int_counter, IntCounter};
use rspotify::{scopes, AuthCodeSpotify, Credentials, OAuth, Token};
use rust_embed::Embed;
use snafu::{OptionExt, ResultExt, Whatever};
use spotify::music;
use tower_http::{compression::CompressionLayer, set_header::SetResponseHeaderLayer};

mod graphics;
mod pages;
mod spotify;

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

async fn styles() -> impl IntoResponse {
    ([(CONTENT_TYPE, "text/css")], include_bytes!("styles.css"))
}

async fn favicon_ico() -> impl IntoResponse {
    ([(CONTENT_TYPE, "image/x-icon")], ::graphics::favicon::ICO)
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

#[derive(Clone)]
struct AppState {
    spotify: Option<AuthCodeSpotify>,
}

async fn setup_spotify() -> Result<AuthCodeSpotify, Whatever> {
    let client_credentials = Credentials::from_env()
        .whatever_context("RSPOTIFY_CLIENT_ID or RSPOTIFY_CLIENT_SECRET not set")?;
    let spotify = AuthCodeSpotify::with_config(
        client_credentials,
        OAuth {
            scopes: scopes!("user-read-currently-playing"),
            ..Default::default()
        },
        Default::default(),
    );
    let refresh_token = std::env::var("RSPOTIFY_REFRESH_TOKEN")
        .whatever_context("RSPOTIFY_REFRESH_TOKEN not set")?;
    *spotify.token.lock().await.unwrap() = Some(Token {
        refresh_token: Some(refresh_token),
        ..Default::default()
    });
    Ok(spotify)
}

#[tokio::main]
async fn main() {
    let _ = dotenvy::dotenv();

    let _ = ROBOT_COUNTER.get();

    let app = Router::new()
        .route("/", get(pages::index))
        .route("/cv", get(pages::cv))
        .route("/music", get(music))
        .route("/styles.css", get(styles))
        .route("/robots.txt", get(robots))
        .route("/favicon.ico", get(favicon_ico))
        .route("/metrics", get(metrics))
        .route("/og", get(graphics::opengraph))
        .route("/{*file}", get(static_handler))
        .method_not_allowed_fallback(method_not_allowed)
        .fallback(not_found)
        .layer(CompressionLayer::new())
        .layer(SetResponseHeaderLayer::if_not_present(
            CACHE_CONTROL,
            HeaderValue::from_static("no-cache"),
        ))
        .with_state(AppState {
            spotify: match setup_spotify().await {
                Ok(spotify) => Some(spotify),
                Err(e) => {
                    eprintln!("Failed to set up Spotify: {}", e);
                    None
                }
            },
        });

    let listener = tokio::net::TcpListener::bind("0.0.0.0:8000").await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
