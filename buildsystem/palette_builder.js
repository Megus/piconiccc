const picoPalette = [
  [0x00, 0x00, 0x00], [0x1d, 0x2b, 0x53], [0x7e, 0x25, 0x53], [0x00, 0x87, 0x51],
  [0xab, 0x52, 0x36], [0x5f, 0x57, 0x4f], [0xc2, 0xc3, 0xc7], [0xff, 0xf1, 0xe8],
  [0xff, 0x00, 0x4d], [0xff, 0xa3, 0x00], [0xff, 0xec, 0x27], [0x00, 0xe4, 0x36],
  [0x29, 0xad, 0xff], [0x83, 0x76, 0x9c], [0xff, 0x77, 0xa8], [0xff, 0xcc, 0xaa],

  [0x29, 0x18, 0x14], [0x11, 0x1d, 0x35], [0x42, 0x21, 0x36], [0x12, 0x53, 0x59],
  [0x74, 0x2f, 0x29], [0x49, 0x33, 0x3b], [0xa2, 0x88, 0x79], [0xf3, 0xef, 0x7d],
  [0xbe, 0x12, 0x50], [0xff, 0x6c, 0x24], [0xa8, 0xe7, 0x2e], [0x00, 0xb5, 0x43],
  [0x06, 0x5a, 0xb5], [0x75, 0x46, 0x65], [0xff, 0x6e, 0x59], [0xff, 0x9d, 0x81]
];

function decodeHex(hexColor) {
  const rgb = parseInt(hexColor.substring(1), 16);
  const r = (rgb & 0xff0000) / 0x10000;
  const g = (rgb & 0xff00) / 0x100;
  const b = rgb & 0xff;
  return [r, g, b];
}

function colorDistance(col1, col2) {
  // TODO: Try using advanced formulas
  const d = [col2[0] - col1[0], col2[1] - col1[1], col2[2] - col1[2]];
  const w = [2, 2, 2];
  w[col1.indexOf(Math.max(...col1))] = 4;
  w[col1.indexOf(Math.min(...col1))] = 1;

  return Math.sqrt(w[0] * d[0] * d[0] + w[1] * d[1] * d[1] + w[2] * d[2] * d[2]);
}

function modifyColor(col) {
  // Make them brighter for now
  const br = 1.3;
  const res = [col[0] * br, col[1] * br, col[2] * br];
  if (res[0] > 255) res[0] = 255;
  if (res[1] > 255) res[1] = 255;
  if (res[2] > 255) res[2] = 255;

  return res;
}

function mixColors(col1, col2) {
  return [
    Math.sqrt(col1[0] * col1[0] * 0.5 + col2[0] * col2[0] * 0.5),
    Math.sqrt(col1[1] * col1[1] * 0.5 + col2[0] * col2[1] * 0.5),
    Math.sqrt(col1[2] * col1[2] * 0.5 + col2[0] * col2[2] * 0.5),
  ]
}

function notBlack(col) {
  return col[0] > 0 && col[1] > 0 && col[2] > 0;
}


module.exports.buildPalette = function(models) {
  const usedColors = {};
  const picoPaletteCounts = {};
  const palette = [];
  const res = {
    palette: [],
    colors: [],
  };

  let originalColorsCount = 0;

  // Find all colors used in all models
  for (const name in models) {
    const model = models[name];
    for (let c = 0; c < model.f.length; c++) {
      if (usedColors[model.f[c][0]] === undefined) originalColorsCount++;
      usedColors[model.f[c][0]] = true;
    }
  }

  console.log(`Total colors: ${originalColorsCount}`);

  // Pick the closest colors from the overall PICO-8 palette
  let paletteLength = 0;
  for (const hexColor in usedColors) {
    const color = modifyColor(decodeHex(hexColor));
    let minDiff = 1000;
    let picoColor = 0;
    for (let c = 0; c < picoPalette.length; c++) {
      const diff = colorDistance(color, picoPalette[c]);
      if (diff < minDiff) {
        minDiff = diff;
        picoColor = c;
      }
    }
    if (picoPaletteCounts[picoColor] === undefined) {
      picoPaletteCounts[picoColor] = 0;
      paletteLength++;
    }
    picoPaletteCounts[picoColor]++;
  }

  console.log(`Unique PICO-8 colors: ${paletteLength}`);

  // Truncate palette if needed, removing the least used colors
  if (paletteLength > 15) { // 15, not 16, because we always need the black color

  }

  // Add black color to palette
  palette.push(picoPalette[0]);

  for (const colIdx in picoPaletteCounts) {
    if (colIdx == 0) continue;
    palette.push(picoPalette[colIdx]);
    let picoColor = parseInt(colIdx);
    if (picoColor >= 16) picoColor += (128 - 16); // Change for undocumented palette
    res.palette.push(picoColor);
  }

  console.log(palette);
  console.log(res);

  // Assign best matching colors
  // TODO: Build 16 color palette from all 32 colors
  for (const hexColor in usedColors) {
    const color = modifyColor(decodeHex(hexColor));
    let minDiff = 1000000;
    let pico1 = 0;
    let pico2 = 0;
    for (let c = 0; c < palette.length; c++) {
      for (let d = c; d < palette.length; d++) {
        const mixedColor = mixColors(palette[c], palette[d]);
        const mixedDiff = colorDistance(palette[c], palette[d]);
        const diff = colorDistance(color, mixedColor);

        const wdiff = diff + 0.05 * mixedDiff;
        if (wdiff < minDiff && !(notBlack(color) && c == 0 && d == 0)) {
          minDiff = wdiff;
          pico1 = c;
          pico2 = d;
        }
      }
    }
    usedColors[hexColor] = pico1 * 16 + pico2;
  }

  for (const name in models) {
    const model = models[name];
    for (let c = 0; c < model.f.length; c++) {
      model.f[c][0] = usedColors[model.f[c][0]];
    }
  }

  return res;
}