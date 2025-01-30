use std::path::PathBuf;

use image::{DynamicImage, GenericImageView, ImageBuffer};

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let out_dir: PathBuf = std::env::var("OUT_DIR")?.into();

    // make favicon
    let favicon = image::open("favicon.jpg")?.crop_circle();

    // resize to 32x32
    favicon
        .resize(32, 32, image::imageops::FilterType::Nearest)
        .save(out_dir.join("favicon.ico"))?;

    println!("cargo:rerun-if-changed=favicon.jpg");

    Ok(())
}

trait ImageExt {
    fn crop_circle(&self) -> Self;
}

impl ImageExt for DynamicImage {
    fn crop_circle(&self) -> Self {
        let (width, height) = self.dimensions();
        let size = width.min(height);
        let r = size / 2;

        ImageBuffer::from_fn(size, size, |x, y| {
            let dx = x.abs_diff(r);
            let dy = y.abs_diff(r);

            if dx * dx + dy * dy <= r * r {
                self.get_pixel(x, y)
            } else {
                image::Rgba([0, 0, 0, 0])
            }
        })
        .into()
    }
}
