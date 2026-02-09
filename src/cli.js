"use strict";

const { parseArgs } = require("./args");
const { loadConfig } = require("./config");
const { listArts } = require("./content");
const { listThemes } = require("./styles");
const { renderGreeting } = require("./render");
const { installSnippet, runInteractiveSetup, doctor } = require("./setup");

function readVersion() {
  try {
    return require("../package.json").version;
  } catch (error) {
    return "0.0.0";
  }
}

function printHelp() {
  console.log(`ascii-shell-greets v${readVersion()}

Usage:
  ascii-shell-greets [options]
  ascii-shell-greets setup [--shell zsh|bash|fish] [--dry-run] [--force]
  ascii-shell-greets doctor
  ascii-shell-greets --list

Options:
  -n, --name <name>         Name used in greeting
  -t, --theme <theme>       Theme (${listThemes().join(", ")})
  -a, --art <art>           ASCII art (${listArts().join(", ")}, random)
  -m, --message <text>      Custom message line
      --joke / --no-joke    Toggle joke line
      --mission / --no-mission
                            Toggle daily mission line
      --fortune / --no-fortune
                            Toggle fortune line
      --time / --no-time    Toggle current date/time line
      --color / --no-color  Toggle ANSI colors
      --config <path>       Use custom config file path
      --list                Show available themes and art names
      --alias <name>        Add a short alias in setup (example: asg)
      --no-alias            Skip alias in setup
      --startup / --no-startup
                            Enable/disable startup hook in setup
      --interactive / --no-interactive
                            Prompt in setup for startup + alias choices
  -h, --help                Show help
  -v, --version             Show version

Env vars:
  ASG_SKIP_SETUP=1          Skip postinstall setup prompts
  NO_COLOR=1                Disable ANSI colors
`);
}

function printList() {
  console.log(`Themes: ${listThemes().join(", ")}`);
  console.log(`Art: ${listArts().join(", ")}, random`);
}

function resolveBoolean(argValue, configValue) {
  if (typeof argValue === "boolean") {
    return argValue;
  }

  return Boolean(configValue);
}

function resolveColor(argValue, configValue) {
  if (process.env.NO_COLOR) {
    return false;
  }

  if (typeof argValue === "boolean") {
    return argValue;
  }

  return Boolean(configValue);
}

function printDoctor() {
  const checks = doctor();

  for (const check of checks) {
    const presence = check.exists ? "exists" : "missing";
    const startup = check.configured ? "startup: configured" : "startup: not configured";
    const alias = check.aliasConfigured ? "alias: configured" : "alias: not configured";
    console.log(`${check.shell}: ${check.rcPath} (${presence}, ${startup}, ${alias})`);
  }
}

async function run(argv = process.argv.slice(2)) {
  const args = parseArgs(argv);

  if (args.command === "help") {
    printHelp();
    return;
  }

  if (args.command === "version") {
    console.log(readVersion());
    return;
  }

  if (args.command === "setup") {
    const interactiveByDefault = Boolean(process.stdin.isTTY && process.stdout.isTTY);
    const interactive = args.interactive ?? interactiveByDefault;
    const alias = args.alias === false ? undefined : args.alias;
    const setupOptions = {
      shell: args.shell,
      dryRun: args.dryRun,
      force: args.force,
      quiet: args.quiet,
      startup: args.startup,
      alias
    };

    if (interactive && args.alias === undefined && args.startup === undefined) {
      await runInteractiveSetup(setupOptions);
    } else {
      installSnippet(setupOptions);
    }
    return;
  }

  if (args.command === "doctor") {
    printDoctor();
    return;
  }

  if (args.list) {
    printList();
    return;
  }

  const loaded = loadConfig(args.configPath);
  if (loaded.error && !args.quiet) {
    console.error(`Warning: could not parse config at ${loaded.path}; using defaults.`);
  }

  const config = loaded.config;
  if (!config.enabled) {
    return;
  }

  const options = {
    name: args.name ?? config.name ?? process.env.USER ?? "",
    theme: args.theme ?? config.theme,
    art: args.art ?? config.art,
    message: args.message ?? config.message,
    showTime: resolveBoolean(args.showTime, config.showTime),
    showJoke: resolveBoolean(args.showJoke, config.showJoke),
    showMission: resolveBoolean(args.showMission, config.showMission),
    showFortune: resolveBoolean(args.showFortune, config.showFortune),
    color: resolveColor(args.color, config.color)
  };

  const output = renderGreeting(options);
  console.log(output);
}

module.exports = {
  run,
  printHelp,
  printList,
  resolveBoolean,
  resolveColor
};
