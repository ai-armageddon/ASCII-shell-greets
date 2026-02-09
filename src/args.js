"use strict";

function parseArgs(argv) {
  const options = {
    command: "greet",
    name: undefined,
    theme: undefined,
    art: undefined,
    message: undefined,
    showTime: undefined,
    showJoke: undefined,
    showMission: undefined,
    showFortune: undefined,
    color: undefined,
    configPath: undefined,
    shell: undefined,
    dryRun: false,
    quiet: false,
    force: false,
    list: false
  };

  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];

    if (token === "setup" || token === "doctor") {
      options.command = token;
      continue;
    }

    if (token === "list" || token === "--list") {
      options.list = true;
      continue;
    }

    if (token === "--help" || token === "-h") {
      options.command = "help";
      continue;
    }

    if (token === "--version" || token === "-v") {
      options.command = "version";
      continue;
    }

    if (token === "--name" || token === "-n") {
      options.name = argv[i + 1];
      i += 1;
      continue;
    }

    if (token.startsWith("--name=")) {
      options.name = token.slice("--name=".length);
      continue;
    }

    if (token === "--theme" || token === "-t") {
      options.theme = argv[i + 1];
      i += 1;
      continue;
    }

    if (token.startsWith("--theme=")) {
      options.theme = token.slice("--theme=".length);
      continue;
    }

    if (token === "--art" || token === "-a") {
      options.art = argv[i + 1];
      i += 1;
      continue;
    }

    if (token.startsWith("--art=")) {
      options.art = token.slice("--art=".length);
      continue;
    }

    if (token === "--message" || token === "-m") {
      options.message = argv[i + 1];
      i += 1;
      continue;
    }

    if (token.startsWith("--message=")) {
      options.message = token.slice("--message=".length);
      continue;
    }

    if (token === "--joke") {
      options.showJoke = true;
      continue;
    }

    if (token === "--no-joke") {
      options.showJoke = false;
      continue;
    }

    if (token === "--mission") {
      options.showMission = true;
      continue;
    }

    if (token === "--no-mission") {
      options.showMission = false;
      continue;
    }

    if (token === "--fortune") {
      options.showFortune = true;
      continue;
    }

    if (token === "--no-fortune") {
      options.showFortune = false;
      continue;
    }

    if (token === "--time") {
      options.showTime = true;
      continue;
    }

    if (token === "--no-time") {
      options.showTime = false;
      continue;
    }

    if (token === "--no-color") {
      options.color = false;
      continue;
    }

    if (token === "--color") {
      options.color = true;
      continue;
    }

    if (token === "--config") {
      options.configPath = argv[i + 1];
      i += 1;
      continue;
    }

    if (token.startsWith("--config=")) {
      options.configPath = token.slice("--config=".length);
      continue;
    }

    if (token === "--shell") {
      options.shell = argv[i + 1];
      i += 1;
      continue;
    }

    if (token.startsWith("--shell=")) {
      options.shell = token.slice("--shell=".length);
      continue;
    }

    if (token === "--dry-run") {
      options.dryRun = true;
      continue;
    }

    if (token === "--quiet") {
      options.quiet = true;
      continue;
    }

    if (token === "--force") {
      options.force = true;
      continue;
    }
  }

  return options;
}

module.exports = {
  parseArgs
};
