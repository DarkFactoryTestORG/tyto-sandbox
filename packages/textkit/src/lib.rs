//! N-API exports of the textkit crate. Names are camelCased for JavaScript by napi-derive.

use napi_derive::napi;

/// A URL slug for a workspace or project name.
#[napi]
pub fn slugify(input: String) -> String {
    textkit::slugify(&input)
}

/// A normalised search key for a task title.
#[napi]
pub fn search_key(input: String) -> String {
    textkit::search_key(&input)
}
