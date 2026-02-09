"use strict";

const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const readline = require("node:readline/promises");

const START_MARKER = "# >>> ascii-shell-greets >>>";
const END_MARKER = "# <<< ascii-shell-greets <<<";
const ALIAS_START_MARKER = "# >>> ascii-shell-greets-alias >>>";
const ALIAS_END_MARKER = "# <<< ascii-shell-greets-alias <<<";

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

function buildStartupSnippet(shellName) {
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

function buildAliasSnippet(shellName, aliasName) {
  if (shellName === "fish") {
    return [
      ALIAS_START_MARKER,
      `alias ${aliasName} "ascii-shell-greets"`,
      ALIAS_END_MARKER
    ].join("\n");
  }

  return [
    ALIAS_START_MARKER,
    `alias ${aliasName}='ascii-shell-greets'`,
    ALIAS_END_MARKER
  ].join("\n");
}

function ensureParentDir(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function upsertManagedBlock(content, block, startMarker, endMarker, force) {
  const pattern = new RegExp(
    `${escapeRegex(startMarker)}[\\s\\S]*?${escapeRegex(endMarker)}\\n?`,
    "m"
  );
  const hasExisting = pattern.test(content);

  if (hasExisting && !force) {
    return {
      next: content,
      changed: false
    };
  }

  const base = hasExisting ? content.replace(pattern, "").trimEnd() : content.trimEnd();
  const next = base.length > 0 ? `${base}\n\n${block}\n` : `${block}\n`;

  return {
    next,
    changed: true
  };
}

function isValidAliasName(aliasName) {
  return /^[A-Za-z_][A-Za-z0-9_-]*$/.test(aliasName);
}

function installSnippet(options = {}) {
  const shellName = detectShell(options.shell);
  const rcPath = resolveRcPath(shellName);
  const startupSnippet = buildStartupSnippet(shellName);
  const startupEnabled = options.startup !== false;
  const aliasName = typeof options.alias === "string" ? options.alias.trim() : "";
  const aliasEnabled = aliasName.length > 0;
  const quiet = Boolean(options.quiet);

  if (aliasEnabled && !isValidAliasName(aliasName)) {
    throw new Error(
      `Invalid alias name "${aliasName}". Use letters/numbers/_/- and start with a letter or _.`
    );
  }

  ensureParentDir(rcPath);

  let current = "";
  if (fs.existsSync(rcPath)) {
    current = fs.readFileSync(rcPath, "utf8");
  }

  if (!startupEnabled && !aliasEnabled) {
    if (!quiet) {
      console.log("No setup options selected. Nothing changed.");
    }
    return {
      rcPath,
      changed: false,
      shell: shellName,
      reason: "no-op"
    };
  }

  let next = current;
  let startupChanged = false;
  let aliasChanged = false;

  if (startupEnabled) {
    const startupResult = upsertManagedBlock(
      next,
      startupSnippet,
      START_MARKER,
      END_MARKER,
      Boolean(options.force)
    );
    next = startupResult.next;
    startupChanged = startupResult.changed;
  }

  if (aliasEnabled) {
    const aliasSnippet = buildAliasSnippet(shellName, aliasName);
    const aliasResult = upsertManagedBlock(
      next,
      aliasSnippet,
      ALIAS_START_MARKER,
      ALIAS_END_MARKER,
      Boolean(options.force)
    );
    next = aliasResult.next;
    aliasChanged = aliasResult.changed;
  }

  const changed = startupChanged || aliasChanged;

  if (!options.dryRun && changed) {
    fs.writeFileSync(rcPath, next, "utf8");
  }

  if (!quiet) {
    if (!changed) {
      console.log(`ascii-shell-greets already configured in ${rcPath}`);
    } else if (options.dryRun) {
      console.log(`Dry run: would update ${rcPath}`);
    } else {
      console.log(`Updated ${rcPath}`);
    }

    if (startupEnabled) {
      const status = startupChanged ? "enabled" : "already enabled";
      console.log(`Startup greeting: ${status}`);
    }

    if (aliasEnabled) {
      const status = aliasChanged ? "added" : "already present";
      console.log(`Alias (${aliasName}): ${status}`);
    }
  }

  return {
    rcPath,
    changed,
    shell: shellName,
    startupEnabled,
    alias: aliasEnabled ? aliasName : undefined
  };
}

function parseYesNo(answer, fallback) {
  const normalized = String(answer || "").trim().toLowerCase();
  if (normalized.length === 0) {
    return fallback;
  }

  if (normalized === "y" || normalized === "yes") {
    return true;
  }

  if (normalized === "n" || normalized === "no") {
    return false;
  }

  return fallback;
}

async function runInteractiveSetup(options = {}) {
  const shellName = detectShell(options.shell);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  try {
    const startupAnswer = await rl.question(
      `Run ascii-shell-greets each time a new ${shellName} terminal opens? (Y/n) `
    );
    const startup = parseYesNo(startupAnswer, true);

    const aliasAnswer = await rl.question("Add a short alias command too? (y/N) ");
    const wantsAlias = parseYesNo(aliasAnswer, false);

    let alias;
    if (wantsAlias) {
      // Loop until we receive a shell-safe alias name.
      while (!alias) {
        const rawAlias = await rl.question("Alias name [asg]: ");
        const candidate = rawAlias.trim().length > 0 ? rawAlias.trim() : "asg";

        if (isValidAliasName(candidate)) {
          alias = candidate;
        } else {
          console.log("Alias must match [A-Za-z_][A-Za-z0-9_-]*");
        }
      }
    }

    return installSnippet({
      ...options,
      shell: shellName,
      startup,
      alias
    });
  } finally {
    rl.close();
  }
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
      configured: content.includes(START_MARKER),
      aliasConfigured: content.includes(ALIAS_START_MARKER)
    };
  });
}

module.exports = {
  installSnippet,
  runInteractiveSetup,
  isValidAliasName,
  doctor,
  START_MARKER,
  END_MARKER,
  ALIAS_START_MARKER,
  ALIAS_END_MARKER
};
