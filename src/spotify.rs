use std::io::Cursor;

use axum::{
    body::Bytes,
    extract::State,
    http::StatusCode,
    response::{IntoResponse, Response},
};
use axum_extra::{headers::ContentType, TypedHeader};
use image::{ImageFormat, RgbaImage};
use mime_guess::{mime, Mime};
use rspotify::{
    model::{AdditionalType, Country, CurrentlyPlayingContext, Market, PlayableItem},
    prelude::OAuthClient,
};
use snafu::{ResultExt, Snafu};

use crate::AppState;

#[derive(Debug, Snafu)]
pub enum MusicError {
    #[snafu(display("Spotify error: {}", source))]
    Spotify { source: rspotify::ClientError },
    #[snafu(display("No Spotify client available"))]
    NoClient,
    #[snafu(display("Upstream http error: {}", source))]
    Reqwest { source: reqwest::Error },
}

impl IntoResponse for MusicError {
    fn into_response(self) -> Response {
        match self {
            MusicError::Spotify { .. } => (StatusCode::INTERNAL_SERVER_ERROR, "Spotify error"),
            MusicError::NoClient => (
                StatusCode::INTERNAL_SERVER_ERROR,
                "No Spotify client available",
            ),
            MusicError::Reqwest { .. } => {
                (StatusCode::INTERNAL_SERVER_ERROR, "Upstream http error")
            }
        }
        .into_response()
    }
}

fn album_cover_url(ctx: Option<&CurrentlyPlayingContext>) -> Option<&str> {
    let PlayableItem::Track(track) = ctx?.item.as_ref()? else {
        return None;
    };

    if ctx.is_some_and(|ctx| ctx.is_playing) {
        track
            .album
            .images
            .first()
            .as_ref()
            .map(|image| image.url.as_ref())
    } else {
        None
    }
}

fn res_mime(res: &reqwest::Response) -> Option<Mime> {
    res.headers()
        .get(reqwest::header::CONTENT_TYPE)
        .and_then(|header| header.to_str().ok())
        .and_then(|content_type| content_type.parse().ok())
}

async fn get_album_cover(url: &str) -> Result<(Mime, Bytes), MusicError> {
    let res = reqwest::get(url).await.context(ReqwestSnafu {})?;
    let mime = res_mime(&res).unwrap_or(mime::IMAGE_JPEG);

    Ok((mime, res.bytes().await.context(ReqwestSnafu {})?))
}

async fn currently_playing_img(
    ctx: Option<CurrentlyPlayingContext>,
) -> Result<(Mime, Bytes), MusicError> {
    if let Some(url) = album_cover_url(ctx.as_ref()) {
        get_album_cover(url).await
    } else {
        let mut out = Vec::new();
        RgbaImage::new(640, 640)
            .write_to(&mut Cursor::new(&mut out), ImageFormat::Png)
            .unwrap();

        Ok((mime::IMAGE_PNG, Bytes::from(out)))
    }
}

pub async fn music(state: State<AppState>) -> Result<impl IntoResponse, MusicError> {
    let Some(spotify) = state.spotify.as_ref() else {
        return Err(MusicError::NoClient);
    };

    let res = spotify
        .current_playing(
            Some(Market::Country(Country::Sweden)),
            Option::<[&AdditionalType; 0]>::None,
        )
        .await
        .context(SpotifySnafu {})?;

    let (mime, bytes) = currently_playing_img(res).await?;

    Ok((TypedHeader(ContentType::from(mime)), bytes))
}
