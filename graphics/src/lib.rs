use http::HeaderMap;
use indexmap::IndexMap;
use sandbox::Sandbox;
use typst::foundations::{Dict, Value};

pub mod favicon;
mod sandbox;

#[derive(serde::Serialize)]
struct HeadersJson<'a>(IndexMap<&'a str, &'a str>);

impl<'a> From<&'a HeaderMap> for HeadersJson<'a> {
    fn from(headers: &'a HeaderMap) -> Self {
        let map = headers
            .into_iter()
            .filter_map(|(name, value)| {
                let name = name.as_str();
                let value = core::str::from_utf8(value.as_bytes()).ok()?;
                Some((name, value))
            })
            .collect();
        Self(map)
    }
}

pub fn opengraph_image(headers: HeaderMap) -> Vec<u8> {
    let mut inputs = Dict::new();
    inputs.insert(
        "headers".into(),
        Value::Str(
            serde_json::to_string(&HeadersJson::from(&headers))
                .unwrap()
                .into(),
        ),
    );

    let sandbox = Sandbox::new(inputs);
    let source = include_str!("og.typ").into();
    // let source = std::fs::read_to_string("graphics/src/og.typ").unwrap();
    let world = sandbox.with_source(source);
    let document = typst::compile(&world);
    for warning in document.warnings {
        eprintln!("warning: {}", warning.message);
    }
    let document = document.output.unwrap();

    let out = typst_render::render(&document.pages[0], 1.0);

    out.encode_png().unwrap()
}
