#!/usr/bin/env node
"use strict";

const { run } = require("../src/cli");

Promise.resolve(run()).catch((error) => {
  console.error(error.message || error);
  process.exitCode = 1;
});
