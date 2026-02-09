"use strict";

const THEMES = {
  sunrise: [
    [255, 145, 77],
    [255, 94, 98],
    [255, 195, 113]
  ],
  ocean: [
    [77, 182, 255],
    [38, 139, 210],
    [0, 120, 212]
  ],
  forest: [
    [52, 199, 89],
    [30, 130, 76],
    [126, 211, 33]
  ],
  retro: [
    [0, 255, 65],
    [30, 30, 30],
    [0, 200, 50]
  ],
  fire: [
    [255, 87, 34],
    [255, 193, 7],
    [244, 67, 54]
  ],
  mono: [
    [210, 210, 210],
    [170, 170, 170],
    [235, 235, 235]
  ]
};

function listThemes() {
  return Object.keys(THEMES);
}

function rgbText(text, rgb, enabled) {
  if (!enabled || !rgb) {
    return text;
  }

  return `\u001b[38;2;${rgb[0]};${rgb[1]};${rgb[2]}m${text}\u001b[0m`;
}

function colorizeLines(lines, themeName, enabled) {
  const theme = THEMES[themeName] || THEMES.sunrise;

  if (!enabled) {
    return lines;
  }

  return lines.map((line, index) => rgbText(line, theme[index % theme.length], true));
}

module.exports = {
  THEMES,
  listThemes,
  colorizeLines,
  rgbText
};
