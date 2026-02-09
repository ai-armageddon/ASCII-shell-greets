"use strict";

const { installSnippet } = require("../src/setup");

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

function runPostinstallSetup() {
  if (shouldSkipSetup()) {
    return;
  }

  if (!isGlobalInstall()) {
    return;
  }

  try {
    installSnippet({ quiet: true });
  } catch (error) {
    // Keep install resilient even if startup hook cannot be written.
  }
}

runPostinstallSetup();
