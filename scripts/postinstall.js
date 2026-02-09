"use strict";

const { runInteractiveSetup } = require("../src/setup");

function isGlobalInstall() {
  if (process.env.npm_config_global === "true") {
    return true;
  }

  const argv = process.env.npm_config_argv || "";
  return argv.includes("-g") || argv.includes("--global");
}

function shouldSkipSetup() {
  return Boolean(process.env.ASG_SKIP_SETUP) || process.env.CI === "true";
}

function canPrompt() {
  return Boolean(process.stdin.isTTY && process.stdout.isTTY);
}

async function runPostinstallSetup() {
  if (shouldSkipSetup()) {
    return;
  }

  if (!isGlobalInstall()) {
    return;
  }

  try {
    if (!canPrompt()) {
      return;
    }

    console.log("ascii-shell-greets installed.");
    console.log("Quick setup:");
    await runInteractiveSetup({ quiet: false });
  } catch (error) {
    // Keep install resilient even if setup cannot run.
  }
}

void runPostinstallSetup();
