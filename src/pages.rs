use axum::response::IntoResponse;
use hypertext::{html_elements, maud, GlobalAttributes, Renderable};

const IPA: &str = "[ˈoː.kɛ]";
const IPA_URL: &str = "https://ipa-reader.com/?text=%5B%CB%88o%CB%90.k%C9%9B%5D&voice=Astrid";

fn hgroup() -> impl Renderable {
    maud! {
        hgroup {
            h1 { a href="/" { "Åke Amcoff" } }
            div.ipa {
                a href=(IPA_URL) { (IPA) }
            }
        }
    }
}

fn layout(main: impl Renderable) -> impl Renderable {
    maud! {
        !DOCTYPE
        html lang="en" {
            head {
                meta charset="utf-8";
                meta name="viewport" content="width=device-width, initial-scale=1";
                title { "Åke Amcoff" }

                link rel="preconnect" href="https://rsms.me/";
                link rel="stylesheet" href="https://rsms.me/inter/inter.css";

                link rel="stylesheet" href="/styles.css";
            }
            body { (main) }
        }
    }
}

pub async fn index() -> impl IntoResponse {
    layout(maud! {
        main.centered {
            (hgroup())
            ul.links {
                li { a href="https://github.com/akeamc/" { "Github" } }
                li { a href="/cv" { "CV" } }
            }
        }
    })
    .render()
}

pub async fn cv() -> impl IntoResponse {
    layout(maud! {
        main {
            (hgroup())
            section.cv {
              h3 { "Education" }
              ul {
                  li { "Södra Latins gymnasium (2021–2024)" }
                  li { "Lunds Tekniska Högskola (2024–)" }
              }
              h3 { "Career" }
              ul {
                  li {
                      a href="https://www.5monkeys.se/" { "5 Monkeys Agency" } " (2022–2024)"
                  }
                  li { a href="https://www.vaja.net/" { "Vaja" } " (2024–)" }
              }
              h3 { "Languages" }
              ul {
              li { "Swedish" }
              li { "English" }
              li { "German" }
              }
              h3 { "Diplomas etc." }
              ul {
                  li { "Driving license (class B, automatic only)" }
                  li { "Deutsches Sprachdiplom I & II" }
                  li {
                      "Bronze medal, "
                      a href="https://eoes.se/resultat/" { "European Olympiad of Experimental Science" }
                      " (2022)"
                  }
                  li {
                      "Bronze medal, "
                      a href="https://nbpho.ee/" { "Nordic–Baltic Physics Olympiad" }
                      " (2024)"
                  }
              }
              h3 { "Contact" }
              ul {
                  li { a href="mailto:ake@amcoff.net" { "ake@amcoff.net" } }
                  li { a href="https://github.com/akeamc/" { "Github" } }
                  li { a href="https://www.linkedin.com/in/%C3%A5ke/" { "Linkedin" } }
              }
            }
        }
    })
    .render()
}
