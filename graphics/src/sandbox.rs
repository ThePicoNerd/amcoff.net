use typst::diag::{FileError, FileResult};
use typst::foundations::{Bytes, Datetime, Dict};
use typst::syntax::{FileId, Source};
use typst::text::{Font, FontBook};
use typst::utils::LazyHash;
use typst::Library;

struct FileEntry {
    bytes: Bytes,
    /// This field is filled on demand.
    source: Option<Source>,
}

impl FileEntry {
    fn source(&mut self, id: FileId) -> FileResult<Source> {
        // Fallible `get_or_insert`.
        let source = if let Some(source) = &self.source {
            source
        } else {
            let contents = std::str::from_utf8(&self.bytes).map_err(|_| FileError::InvalidUtf8)?;
            // Defuse the BOM!
            let contents = contents.trim_start_matches('\u{feff}');
            let source = Source::new(id, contents.into());
            self.source.insert(source)
        };
        Ok(source.clone())
    }
}

pub struct Sandbox {
    library: LazyHash<Library>,
    book: LazyHash<FontBook>,
    fonts: Vec<Font>,
}

fn fonts() -> Vec<Font> {
    typst_assets::fonts()
        .chain(std::iter::once(
            include_bytes!("../fonts/Inter.ttc").as_ref(),
        ))
        .flat_map(|bytes| {
            let buffer = Bytes::from_static(bytes);
            let face_count = ttf_parser::fonts_in_collection(&buffer).unwrap_or(1);
            (0..face_count)
                .map(move |face| Font::new(buffer.clone(), face).expect("failed to load font"))
        })
        .chain(std::iter::once(
            Font::new(
                Bytes::from_static(include_bytes!("../fonts/NotoColorEmoji-Regular.ttf")),
                0,
            )
            .unwrap(),
        ))
        .collect()
}

fn make_source(source: String) -> Source {
    Source::detached(source)
}

fn get_time() -> time::OffsetDateTime {
    time::OffsetDateTime::now_utc()
}

pub struct WithSource<'a> {
    sandbox: &'a Sandbox,
    source: Source,
    time: time::OffsetDateTime,
}

impl Sandbox {
    pub fn new(inputs: Dict) -> Self {
        let fonts = fonts();

        Self {
            library: LazyHash::new(Library::builder().with_inputs(inputs).build()),
            book: LazyHash::new(FontBook::from_fonts(&fonts)),
            fonts,
        }
    }

    pub fn with_source(&self, source: String) -> WithSource<'_> {
        WithSource {
            sandbox: self,
            source: make_source(source),
            time: get_time(),
        }
    }

    fn file<T>(&self, id: FileId, map: impl FnOnce(&mut FileEntry) -> T) -> FileResult<T> {
        let mut file = match id.vpath().as_rooted_path().to_str() {
            Some("/favicon.png") => FileEntry {
                bytes: Bytes::from_static(crate::favicon::PNG_200),
                source: None,
            },
            _ => return Err(FileError::NotFound(id.vpath().as_rootless_path().into())),
        };

        Ok(map(&mut file))
    }
}

impl typst::World for WithSource<'_> {
    fn library(&self) -> &LazyHash<Library> {
        &self.sandbox.library
    }

    fn main(&self) -> FileId {
        self.source.id()
    }

    fn source(&self, id: FileId) -> FileResult<Source> {
        if id == self.source.id() {
            Ok(self.source.clone())
        } else {
            self.sandbox.file(id, |file| file.source(id))?
        }
    }

    fn book(&self) -> &LazyHash<FontBook> {
        &self.sandbox.book
    }

    fn font(&self, id: usize) -> Option<Font> {
        self.sandbox.fonts.get(id).cloned()
    }

    fn file(&self, id: FileId) -> FileResult<Bytes> {
        self.sandbox.file(id, |file| file.bytes.clone())
    }

    fn today(&self, offset: Option<i64>) -> Option<Datetime> {
        // We are in UTC.
        let offset = offset.unwrap_or(0);
        let offset = time::UtcOffset::from_hms(offset.try_into().ok()?, 0, 0).ok()?;
        let time = self.time.checked_to_offset(offset)?;
        Some(Datetime::Date(time.date()))
    }
}
