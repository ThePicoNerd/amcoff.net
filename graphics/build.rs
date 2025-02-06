use std::path::PathBuf;

use image::{imageops::FilterType, DynamicImage, GenericImageView, ImageBuffer};

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let out_dir: PathBuf = std::env::var("OUT_DIR")?.into();

    // make favicon
    let favicon = image::open("favicon.jpg")?.crop_circle();

    // resize to 32x32
    favicon
        .resize(32, 32, FilterType::Nearest)
        .save(out_dir.join("favicon.ico"))?;

    favicon
        .resize(200, 200, FilterType::Lanczos3)
        .save(out_dir.join("200.png"))?;

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

            let mut pixel = self.get_pixel(x, y);

            if dx * dx + dy * dy > r * r {
                pixel.0[3] = 0;
            }

            pixel
        })
        .into()
    }
}
