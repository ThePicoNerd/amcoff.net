use axum::{http::request::Parts, response::IntoResponse};
use axum_extra::{headers::ContentType, TypedHeader};
use mime_guess::mime;

pub async fn opengraph(parts: Parts) -> impl IntoResponse {
    let vec = tokio::task::spawn_blocking(|| ::graphics::opengraph_image(parts.headers))
        .await
        .unwrap();

    (TypedHeader(ContentType::from(mime::IMAGE_PNG)), vec)
}
