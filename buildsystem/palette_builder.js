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

const modelPalettes = [
  ["oxygenein", "Y", "G", "E", "N", "E1", "X", "O"],
  ["tonnel1", "tonnel0"],
  ["tonnel2"],
  ["tonnel3"],
  ["rotor", "rotorin"],
  ["tonnel4"],
  ["arch1"],
  ["arch2"],
  ["tonnel5"],
  ["room"],
  ["cubes", "cubes2"]
];

const manualMapping = [
  // Oxygene
  {
    palette: [0x80, 0x84, 0x04, 0x89, 0x09, 0x87, 0x06],
    usedColors: {
      "#4F1F0F": 0x22,
      "#3F0F0F": 0x12,
      "#5F2F0F": 0x23,
      "#6F3F0F": 0x33,
      "#7F4F0F": 0x34,
      "#7F5F0F": 0x45,
      "#7F7F0F": 0x66,
      "#7F7F7F": 0x77
    }
  },
  // Tonnel 1
  {
    palette: [0x80, 0x84, 0x04, 0x86, 0x06],
    usedColors: {
      "#2F0F0F": 0x11,
      "#3F1F0F": 0x02,
      "#4F2F0F": 0x12,
      "#5F3F1F": 0x13,
      "#6F4F2F": 0x23,
      "#7F5F3F": 0x33,
      "#7F6F4F": 0x44,
    }},
  // Tonnel 2
  {
    palette: [0x81, 0x01, 0x8c, 0x0c, 0x05, 0x06, 0x0a],
    usedColors: {
      "#0F0F2F": 0x12,
      "#0F1F3F": 0x22,
      "#0F2F4F": 0x13,
      "#0F3F5F": 0x23,
      "#1F1F1F": 0x15,
      "#1F4F6F": 0x33,
      "#2F2F2F": 0x15,
      "#2F5F7F": 0x34,
      "#3F3F3F": 0x25,
      "#4F4F4F": 0x55,
      "#5F5F5F": 0x56,
      "#6F6F6F": 0x66,
      "#7F7F0F": 0x77,
    }
  },
  // tonnel3
  {
    palette: [0x85, 0x82, 0x05, 0x0d, 0x86, 0x06, 0x0a],
    usedColors: {
      "#1F1F0F": 0x03,
      "#2F1F1F": 0x11,
      "#2F2F1F": 0x13,
      "#3F2F2F": 0x14,
      "#3F3F2F": 0x33,
      "#4F3F3F": 0x34,
      "#4F4F3F": 0x35,
      "#5F4F4F": 0x45,
      "#5F5F4F": 0x36,
      "#6F5F5F": 0x46,
      "#6F6F5F": 0x66,
      "#7F6F6F": 0x56,
      "#7F7F0F": 0x77,
    }
  },
  // rotor
  {
    palette: [0x80, 0x85, 0x05, 0x0d, 0x86, 0x06, 0x0a],
    usedColors: {
      "#000000": 0x00,
      "#1F1F0F": 0x03,
      "#2F2F1F": 0x23,
      "#3F3F2F": 0x33,
      "#4F4F3F": 0x35,
      "#5F5F4F": 0x36,
      "#6F6F5F": 0x66,
      "#7F7F0F": 0x77,
    }},
  // tonnel4
  {
    palette: [0x80, 0x83, 0x03, 0x05, 0x86, 0x06, 0x0a],
    usedColors: {
      "#0F1F0F": 0x12,
      "#1F2F1F": 0x22,
      "#2F3F2F": 0x23,
      "#4F5F4F": 0x35,
      "#5F6F5F": 0x56,
      "#7F7F0F": 0x77,
    }
  },
  // arch1
  {
    palette: [0x80, 0x84, 0x04, 0x83, 0x03, 0x05, 0x86],
    usedColors: {
      "#000000": 0x00,
      "#0F1F0F": 0x14,
      "#1F2F1F": 0x15,
      "#2F3F2F": 0x25,
      "#3F1F0F": 0x12,
      "#3F4F3F": 0x47,
      "#4F2F0F": 0x22,
      "#4F2F1F": 0x22,
      "#4F5F4F": 0x35,
      "#5F3F1F": 0x34,
      "#5F3F2F": 0x34,
      "#5F6F5F": 0x57,
      "#6F4F2F": 0x36,
      "#6F4F3F": 0x36,
      "#7F5F3F": 0x37,
      "#7F5F4F": 0x37,
      "#7F6F5F": 0x67,
    }
  },
  // arch2
  {
    palette: [0x80, 0x83, 0x03, 0x8b, 0x85, 0x05, 0x06],
    usedColors: {
      "#0F2F1F": 0x02,
      "#1F3F1F": 0x12,
      "#1F3F2F": 0x03,
      "#2F4F2F": 0x13,
      "#2F4F3F": 0x53,
      "#3F5F3F": 0x23,
      "#3F5F4F": 0x23,
      "#4F6F4F": 0x63,
      "#4F6F5F": 0x64,
      "#5F7F5F": 0x74,
      "#5F7F6F": 0x74,
      "#6F7F6F": 0x77,
    }
  },
  // tonnel5
  {
    palette: [0x81, 0x01, 0x82, 0x8c, 0x05, 0x06, 0x0a],
    usedColors: {
      "#0F0F1F": 0x01,
      "#0F1F2F": 0x11,
      "#000000": 0x00,
      "#1F2F3F": 0x12,
      "#2F3F4F": 0x34,
      "#3F4F5F": 0x54,
      "#4F5F6F": 0x56,
      "#7F7F0F": 0x57,
    }
  },
  // room
  {
    palette: [0x80, 0x82, 0x84, 0x04, 0x09, 0x89, 0x0a],
    usedColors: {
      "#2F0F0F": 0x01,
      "#3F0F0F": 0x03,
      "#4F0F0F": 0x13,
      "#5F1F0F": 0x33,
      "#6F2F0F": 0x34,
      "#7F3F0F": 0x44,
      "#7F4F0F": 0x45,
      "#7F7F0F": 0x47,
    }
  },
  // cubes
  {
    palette: [0x82, 0x02, 0x85, 0x04, 0x86, 0x8f],
    usedColors: {
      "#3F0F3F": 0x11,
      "#4F1F3F": 0x12,
      "#5F2F3F": 0x32,
      "#6F3F3F": 0x34,
      "#7F4F3F": 0x44,
      "#7F5F3F": 0x55,
    }
  },
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
  const br = 1.2;
  const res = col.map((c) => (Math.pow(Math.sin(c / 255 * Math.PI / 2), 1)) * 255);
  if (res[0] > 255) res[0] = 255;
  if (res[1] > 255) res[1] = 255;
  if (res[2] > 255) res[2] = 255;

  return res;
}

function toGrayscale(col) {
  return col[0] * 0.2989 + col[1] * 0.5870 + col[2] * 0.1140;
}

function mixColors(col1, col2) {
  return [
    Math.sqrt(col1[0] * col1[0] * 0.5 + col2[0] * col2[0] * 0.5),
    Math.sqrt(col1[1] * col1[1] * 0.5 + col2[1] * col2[1] * 0.5),
    Math.sqrt(col1[2] * col1[2] * 0.5 + col2[2] * col2[2] * 0.5),
  ]
}

function notBlack(col) {
  return col[0] > 0 && col[1] > 0 && col[2] > 0;
}

function equalColors(col1, col2) {
  return Math.floor(col1[0]) == Math.floor(col2[0]) && Math.floor(col1[1]) == Math.floor(col2[1]) && Math.floor(col1[2]) == Math.floor(col2[2]);
}

function findClosestPair(color, palette) {
  const mYellow = modifyColor([0x7f, 0x7f, 0x0f]);
  if (equalColors(color, mYellow)) {
    // Special case for the yellow color
    for (let c = 0; c < palette.length; c++) {
      //if (equalColors(palette[c], picoPalette[23])) {
      if (equalColors(palette[c], picoPalette[10])) {
        return [c, c];
      }
    }
  }

  let minDiff = 10000;
  let pico1 = 0;
  let pico2 = 0;
  for (let c = 0; c < palette.length; c++) {
    for (let d = c; d < palette.length; d++) {
      const mixedColor = mixColors(palette[c], palette[d]);
      const mixedDiff = colorDistance(palette[c], palette[d]);
      const diff = colorDistance(color, mixedColor);
      const wdiff = diff + 0.05 * mixedDiff;

      if (wdiff < minDiff/* && !(notBlack(color) && c == 0 && d == 0)*/) {
        minDiff = wdiff;
        pico1 = c;
        pico2 = d;
      }
    }
  }
  return [pico1, pico2];
}

function findUsedColors(models) {
  const usedColors = {};
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    for (let c = 0; c < model.f3.length; c++) {
      usedColors[model.f3[c][0]] = true;
    }
    for (let c = 0; c < model.f4.length; c++) {
      usedColors[model.f4[c][0]] = true;
    }
  }
  return usedColors;
}


function buildModelPalette(models) {
  const picoPaletteCounts = {};
  const palette = [];
  const res = [];

  // Find all colors used in models
  const usedColors = findUsedColors(models);

  // Pick the closest colors from the overall PICO-8 palette
  let paletteLength = 0;
  for (const hexColor in usedColors) {
    const color = modifyColor(decodeHex(hexColor));
    const picoColors = findClosestPair(color, picoPalette);
    picoColors.forEach((picoColor) => {
      if (picoPaletteCounts[picoColor] === undefined) {
        picoPaletteCounts[picoColor] = 0;
        paletteLength++;
      }
      picoPaletteCounts[picoColor]++;
    });
  }
  // We'll always have black color in the palette for the background
  if (picoPaletteCounts[0] != null) {
    delete picoPaletteCounts[0];
    paletteLength--;
  }

  //console.log(`Unique PICO-8 colors: ${paletteLength}`);
  //console.log(picoPaletteCounts);

  // Add black color to the palette
  palette.push([0, 0, 0, 0]);

  // If the palette is too bit (more than 7 colors), remove some colors
  if (paletteLength > 7) {
    const weighedColors = [];
    for (const picoColor in picoPaletteCounts) {
      const count = picoPaletteCounts[picoColor];
      const wcol = [parseInt(picoColor), count, 0, 0];
      // Find the minimal distance to other colors in the palette
      let minDiff = 1000;
      for (const color2 in picoPaletteCounts) {
        if (color2 != picoColor) {
          const diff = colorDistance(picoPalette[picoColor], picoPalette[color2])
          if (diff < minDiff) minDiff = diff;
        }
      }
      wcol[2] = minDiff;
      wcol[3] = minDiff + count * 100;

      weighedColors.push(wcol);
    }

    // Sort colors
    weighedColors.sort((a, b) => b[3] - a[3]);
    //console.log(weighedColors);

    for (let c = 0; c < 7; c++) {
      const idx = weighedColors[c][0];
      let picoColor = idx;
      if (picoColor >= 16) picoColor += (128 - 16); // Change for undocumented palette
      const col = [picoPalette[idx][0], picoPalette[idx][1], picoPalette[idx][2], picoColor];
      palette.push(col);
    }
  } else {
    for (const colIdx in picoPaletteCounts) {
      let picoColor = parseInt(colIdx);
      if (picoColor >= 16) picoColor += (128 - 16); // Change for undocumented palette
      const col = [picoPalette[colIdx][0], picoPalette[colIdx][1], picoPalette[colIdx][2], picoColor];
      palette.push(col);
    }
  }

  // Sort colors by their brightness
  palette.sort((a, b) => toGrayscale(a) - toGrayscale(b));
  //console.log(palette);

  for (let c = 1; c < palette.length; c++) {
    res.push(palette[c][3]);
  }

  // Assign best matching colors
  for (const hexColor in usedColors) {
    const color = modifyColor(decodeHex(hexColor));
    const pico = findClosestPair(color, palette);
    usedColors[hexColor] = pico[0] * 16 + pico[1];
  }

  return {
    palette: res,
    usedColors: usedColors,
  };
}

function remapModelColors(models, palIdx, usedColors) {
  const colAdd = (palIdx % 2 == 1) ? 0x88 : 0x00;
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    model.pal = palIdx + 1;
    for (let c = 0; c < model.f3.length; c++) {
      model.f3[c][0] = usedColors[model.f3[c][0]] + colAdd;
    }
    for (let c = 0; c < model.f4.length; c++) {
      model.f4[c][0] = usedColors[model.f4[c][0]] + colAdd;
    }
  }
}

function buildPalette(models) {
  const palettes = [];
  for (let c = 0; c < modelPalettes.length; c++) {
    const pm = modelPalettes[c].map((name) => models[name]);
    let mapping;
    if (manualMapping[c].palette.length != 0) {
      mapping = manualMapping[c];
    } else {
      mapping = buildModelPalette(pm);
    }

    remapModelColors(pm, c, mapping.usedColors);
    palettes.push(mapping.palette);
  }
  return palettes;
}

if (typeof module !== "undefined") {
  module.exports.buildPalette = buildPalette;
}
