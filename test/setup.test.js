"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const { isValidAliasName } = require("../src/setup");

test("isValidAliasName accepts safe alias names", () => {
  assert.equal(isValidAliasName("asg"), true);
  assert.equal(isValidAliasName("wow_2"), true);
  assert.equal(isValidAliasName("dev-tools"), true);
});

test("isValidAliasName rejects unsafe alias names", () => {
  assert.equal(isValidAliasName(""), false);
  assert.equal(isValidAliasName("2bad"), false);
  assert.equal(isValidAliasName("bad space"), false);
  assert.equal(isValidAliasName("bad;rm"), false);
});
