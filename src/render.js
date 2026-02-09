"use strict";

const { ARTS, JOKES, MISSIONS, FORTUNES, pickRandom } = require("./content");
const { colorizeLines } = require("./styles");

function buildSalutation(name) {
  const hour = new Date().getHours();
  let greeting = "Hello";

  if (hour < 12) {
    greeting = "Good morning";
  } else if (hour < 18) {
    greeting = "Good afternoon";
  } else {
    greeting = "Good evening";
  }

  return name ? `${greeting}, ${name}!` : `${greeting}!`;
}

function normalizeArt(artName) {
  if (!artName || artName === "random") {
    return pickRandom(Object.keys(ARTS));
  }

  if (ARTS[artName]) {
    return artName;
  }

  return "terminal";
}

function createBox(lines) {
  const width = lines.reduce((max, line) => Math.max(max, line.length), 0);
  const top = `+${"-".repeat(width + 2)}+`;
  const body = lines.map((line) => `| ${line.padEnd(width)} |`);
  return [top, ...body, top];
}

function renderGreeting(options) {
  const artKey = normalizeArt(options.art);
  const artLines = (ARTS[artKey] || ARTS.terminal).trimEnd().split("\n");

  const messageLines = [buildSalutation(options.name)];

  if (options.message) {
    messageLines.push(options.message);
  }

  if (options.showTime) {
    messageLines.push(`Time: ${new Date().toLocaleString()}`);
  }

  if (options.showJoke) {
    messageLines.push(`Joke: ${pickRandom(JOKES)}`);
  }

  if (options.showMission) {
    messageLines.push(`Mission: ${pickRandom(MISSIONS)}`);
  }

  if (options.showFortune) {
    messageLines.push(`Fortune: ${pickRandom(FORTUNES)}`);
  }

  const boxed = createBox(messageLines);
  const combined = [...artLines, "", ...boxed];

  return colorizeLines(combined, options.theme, options.color).join("\n");
}

module.exports = {
  renderGreeting,
  buildSalutation,
  createBox
};
