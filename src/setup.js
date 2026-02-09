"use strict";

const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const START_MARKER = "# >>> ascii-shell-greets >>>";
const END_MARKER = "# <<< ascii-shell-greets <<<";

function detectShell(explicitShell) {
  if (explicitShell) {
    return explicitShell;
  }

  const shellFromEnv = process.env.SHELL || "";

  if (shellFromEnv.includes("zsh")) {
    return "zsh";
  }

  if (shellFromEnv.includes("bash")) {
    return "bash";
  }

  return "zsh";
}

function resolveRcPath(shellName) {
  const home = os.homedir();

  if (shellName === "bash") {
    return path.join(home, ".bashrc");
  }

  if (shellName === "fish") {
    return path.join(home, ".config", "fish", "config.fish");
  }

  return path.join(home, ".zshrc");
}

function buildSnippet(shellName) {
  if (shellName === "fish") {
    return [
      START_MARKER,
      "type -q ascii-shell-greets; and ascii-shell-greets",
      END_MARKER
    ].join("\n");
  }

  return [
    START_MARKER,
    "command -v ascii-shell-greets >/dev/null 2>&1 && ascii-shell-greets",
    END_MARKER
  ].join("\n");
}

function ensureParentDir(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function installSnippet(options = {}) {
  const shellName = detectShell(options.shell);
  const rcPath = resolveRcPath(shellName);
  const snippet = buildSnippet(shellName);
  const quiet = Boolean(options.quiet);

  ensureParentDir(rcPath);

  let current = "";
  if (fs.existsSync(rcPath)) {
    current = fs.readFileSync(rcPath, "utf8");
  }

  if (current.includes(START_MARKER) && !options.force) {
    if (!quiet) {
      console.log(`ascii-shell-greets already configured in ${rcPath}`);
    }

    return {
      rcPath,
      changed: false,
      shell: shellName,
      reason: "already-configured"
    };
  }

  const next = current.trimEnd().length > 0 ? `${current.trimEnd()}\n\n${snippet}\n` : `${snippet}\n`;

  if (!options.dryRun) {
    fs.writeFileSync(rcPath, next, "utf8");
  }

  if (!quiet) {
    if (options.dryRun) {
      console.log(`Dry run: would add startup hook to ${rcPath}`);
    } else {
      console.log(`Added startup hook to ${rcPath}`);
    }
  }

  return {
    rcPath,
    changed: true,
    shell: shellName
  };
}

function doctor() {
  const candidates = ["zsh", "bash", "fish"];

  return candidates.map((shellName) => {
    const rcPath = resolveRcPath(shellName);
    const exists = fs.existsSync(rcPath);
    const content = exists ? fs.readFileSync(rcPath, "utf8") : "";

    return {
      shell: shellName,
      rcPath,
      exists,
      configured: content.includes(START_MARKER)
    };
  });
}

module.exports = {
  installSnippet,
  doctor,
  START_MARKER,
  END_MARKER
};
