use textkit::{search_key, slugify, MAX_SLUG_LEN};

#[test]
fn slug_is_never_longer_than_the_limit() {
    let long = "word ".repeat(40);
    let slug = slugify(&long);
    assert!(
        slug.len() <= MAX_SLUG_LEN,
        "{} is {} long",
        slug,
        slug.len()
    );
    assert!(!slug.ends_with('-'));
}

#[test]
fn slug_of_nothing_usable_is_empty() {
    assert_eq!(slugify("!!! ??? 日本"), "");
}

#[test]
fn slug_expands_ligatures() {
    assert_eq!(slugify("ﬁnal ﬂow"), "final-flow");
}

#[test]
fn search_keys_match_across_accents_and_case() {
    assert_eq!(search_key("Résumé REVIEW"), search_key("resume review"));
}

#[test]
fn search_key_is_idempotent() {
    let once = search_key("  Ünïcödé — Title, (draft) ");
    assert_eq!(search_key(&once), once);
    assert_eq!(once, "unicode title draft");
}
