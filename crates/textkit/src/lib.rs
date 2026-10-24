//! Text helpers for Plotline: URL slugs for workspaces and projects, and normalised search keys
//! for task titles. Both fold Unicode to its base letters (é → e, ﬁ → fi), so "Café plan" and
//! "cafe plan" find each other.

use unicode_normalization::char::is_combining_mark;
use unicode_normalization::UnicodeNormalization;

/// The longest slug [`slugify`] returns, in bytes. Slugs are ASCII, so bytes equal characters.
pub const MAX_SLUG_LEN: usize = 64;

/// Compatibility-decomposes `input` and drops combining marks, then lowercases it.
fn fold(input: &str) -> impl Iterator<Item = char> + '_ {
    input
        .nfkd()
        .filter(|c| !is_combining_mark(*c))
        .flat_map(char::to_lowercase)
}

/// A URL slug: ASCII letters and digits separated by single hyphens, at most
/// [`MAX_SLUG_LEN`] long, never starting or ending with a hyphen. Characters with no ASCII
/// base letter are dropped. An input with nothing usable gives an empty string; callers pick a
/// fallback.
pub fn slugify(input: &str) -> String {
    let mut slug = String::with_capacity(input.len().min(MAX_SLUG_LEN));
    let mut pending_hyphen = false;
    for c in fold(input) {
        if c.is_ascii_alphanumeric() {
            if pending_hyphen && !slug.is_empty() {
                if slug.len() + 2 > MAX_SLUG_LEN {
                    break;
                }
                slug.push('-');
            }
            if slug.len() + 1 > MAX_SLUG_LEN {
                break;
            }
            slug.push(c);
            pending_hyphen = false;
        } else if c.is_whitespace() || c.is_ascii_punctuation() {
            pending_hyphen = true;
        }
    }
    slug
}

/// A search key: folded, lowercased, punctuation removed, whitespace collapsed to single
/// spaces and trimmed. Letters outside ASCII (Greek, CJK, …) are kept, lowercased.
pub fn search_key(input: &str) -> String {
    let mut key = String::with_capacity(input.len());
    let mut pending_space = false;
    for c in fold(input) {
        if c.is_alphanumeric() {
            if pending_space && !key.is_empty() {
                key.push(' ');
            }
            key.push(c);
            pending_space = false;
        } else if c.is_whitespace() {
            pending_space = true;
        }
        // Punctuation and symbols are dropped without splitting words: "don't" → "dont".
    }
    key
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn slugify_lowercases_and_hyphenates() {
        assert_eq!(slugify("Project Alpha"), "project-alpha");
    }

    #[test]
    fn slugify_folds_accents() {
        assert_eq!(slugify("Café Déjà Vu"), "cafe-deja-vu");
    }

    #[test]
    fn slugify_collapses_separators() {
        assert_eq!(slugify("  Q4 -- launch!! plan  "), "q4-launch-plan");
    }

    #[test]
    fn search_key_strips_punctuation() {
        assert_eq!(
            search_key("Don't forget: the  Q3 report!"),
            "dont forget the q3 report"
        );
    }

    #[test]
    fn search_key_keeps_non_latin_letters() {
        assert_eq!(search_key("Ελληνικά Τεστ"), "ελληνικα τεστ");
    }
}
