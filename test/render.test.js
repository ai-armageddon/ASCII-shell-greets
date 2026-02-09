"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const { createBox, renderGreeting } = require("../src/render");

test("createBox wraps content", () => {
  const box = createBox(["abc", "de"]);

  assert.equal(box[0], "+-----+");
  assert.equal(box[1], "| abc |");
  assert.equal(box[2], "| de  |");
  assert.equal(box[3], "+-----+");
});

test("renderGreeting includes custom message without color", () => {
  const output = renderGreeting({
    name: "Ari",
    theme: "mono",
    art: "terminal",
    message: "Ship it.",
    showTime: false,
    showJoke: false,
    showMission: false,
    showFortune: false,
    color: false
  });

  assert.match(output, /Ari/);
  assert.match(output, /Ship it\./);
  assert.match(output, /\+----------------\+/);
});
