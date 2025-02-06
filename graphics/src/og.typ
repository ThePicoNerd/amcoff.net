// #import "@preview/based:0.1.0": base64

#let headers = json.decode(sys.inputs.headers)
// #let headers = (
//   user-agent: "bruh moment",
//   your-mom: "true dat",
//   what: "yes indeed",
// )
// #let img-bytes = base64.decode(sys.inputs.img)

#set text(font: "Inter", fill: rgb("#5a5853"))
#set page(
  width: 1200pt,
  height: 600pt,
  margin: 32pt,
  fill: rgb("#e8e7e3"),
)

#let user-agent = headers.at("user-agent", default: none)

#grid(
  columns: (1fr, 1fr),
  box(
    inset: 0pt,
    {
      v(1fr)
      text(size: 72pt, fill: black, tracking: -0.022em, weight: "semibold")[Åke Amcoff]
      v(1fr)
      [
        #set text(size: 32pt)
        #text("https://")#text(fill: black)[amcoff.net]
      ]
    },
  ),
  [
    #set text(size: 16pt, font: "DejaVu Sans Mono")
    #terms(
      ..headers
        .pairs()
        .map(((name, value)) => terms.item(
          text(fill: black)[#name:],
          text(value),
        )),
    )],
)

// #show raw: set text(size: 12pt)

// #table(
//   columns: 2,
//   ..headers.pairs().map(((name, value)) => (
//     raw(name),
//     raw(value),
//   )).flatten()
// )

