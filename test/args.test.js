"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const { parseArgs } = require("../src/args");

test("parseArgs parses long and short flags", () => {
  const parsed = parseArgs([
    "--name",
    "Ari",
    "-t",
    "ocean",
    "--art=robot",
    "--no-time",
    "--joke",
    "--config",
    "/tmp/a.json"
  ]);

  assert.equal(parsed.name, "Ari");
  assert.equal(parsed.theme, "ocean");
  assert.equal(parsed.art, "robot");
  assert.equal(parsed.showTime, false);
  assert.equal(parsed.showJoke, true);
  assert.equal(parsed.configPath, "/tmp/a.json");
});

test("parseArgs identifies setup command", () => {
  const parsed = parseArgs([
    "setup",
    "--shell",
    "bash",
    "--dry-run",
    "--alias",
    "asg",
    "--no-startup",
    "--no-interactive"
  ]);

  assert.equal(parsed.command, "setup");
  assert.equal(parsed.shell, "bash");
  assert.equal(parsed.dryRun, true);
  assert.equal(parsed.alias, "asg");
  assert.equal(parsed.startup, false);
  assert.equal(parsed.interactive, false);
});
