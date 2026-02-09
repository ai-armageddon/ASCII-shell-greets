"use strict";

const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const DEFAULT_CONFIG = {
  enabled: true,
  name: "",
  theme: "sunrise",
  art: "random",
  showTime: true,
  showJoke: true,
  showMission: true,
  showFortune: false,
  color: true,
  message: ""
};

function resolveHomeFile(fileName) {
  return path.join(os.homedir(), fileName);
}

function loadConfig(configPath) {
  const resolvedPath = configPath || resolveHomeFile(".ascii-shell-greets.json");

  if (!fs.existsSync(resolvedPath)) {
    return {
      path: resolvedPath,
      config: { ...DEFAULT_CONFIG }
    };
  }

  try {
    const raw = fs.readFileSync(resolvedPath, "utf8");
    const parsed = JSON.parse(raw);

    return {
      path: resolvedPath,
      config: { ...DEFAULT_CONFIG, ...parsed }
    };
  } catch (error) {
    return {
      path: resolvedPath,
      config: { ...DEFAULT_CONFIG },
      error
    };
  }
}

function writeDefaultConfigIfMissing(configPath) {
  if (fs.existsSync(configPath)) {
    return;
  }

  const content = `${JSON.stringify(DEFAULT_CONFIG, null, 2)}\n`;
  fs.writeFileSync(configPath, content, "utf8");
}

module.exports = {
  DEFAULT_CONFIG,
  loadConfig,
  writeDefaultConfigIfMissing,
  resolveHomeFile
};
