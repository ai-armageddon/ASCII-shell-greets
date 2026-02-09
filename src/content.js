"use strict";

const ARTS = {
  cat: String.raw`
 /\_/\\
( o.o )
 > ^ <
`,
  robot: String.raw`
  [::::]
  |o  o|
  | -- |
 /|____|\\
/ /|  |\\ \\
`,
  coffee: String.raw`
   ( (
    ) )
  ........
  |      |]
  \\      /
   \\____/
`,
  octopus: String.raw`
   .---.
  (o o o)
  /  V  \\
 /(  _  )\\
   ^^ ^^
`,
  dragon: String.raw`
      / \\
  /\\ / _ \\
 (  ) (_) )
  \\/\___/
   /  _  \\
  /__/ \__\\
`,
  terminal: String.raw`
+----------------+
|  $ _           |
|  hello world   |
+----------------+
`
};

const JOKES = [
  "I wanted to tell a UDP joke, but you might not get it.",
  "There are 10 kinds of people: those who read binary and those who do not.",
  "My shell script and I are in a stable relationship: we both hate surprises.",
  "I told my code to be elegant. It responded with more comments.",
  "I tried to catch fog yesterday. Mist."
];

const MISSIONS = [
  "Ship one tiny improvement before coffee #2.",
  "Delete one line of code that nobody will miss.",
  "Close one stale tab. Your RAM will thank you.",
  "Name that variable like future-you is watching.",
  "Automate one repetitive task before lunch."
];

const FORTUNES = [
  "Great software grows from boring, reliable habits.",
  "Readable code is a gift to your future self.",
  "Small commits, fewer regrets.",
  "The best optimization is deleting unnecessary work.",
  "Test the scary parts first."
];

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function listArts() {
  return Object.keys(ARTS);
}

module.exports = {
  ARTS,
  JOKES,
  MISSIONS,
  FORTUNES,
  pickRandom,
  listArts
};
