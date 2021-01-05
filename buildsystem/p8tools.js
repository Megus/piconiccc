const fs = require("fs");

// PICO-8 palette (including 16 undocumented colors)
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

module.exports.picoPalette = picoPalette;

module.exports.rgb2pico = function(col, use32colors) {
  let minDiff = 10000;
  let picoColor = 0;
  for (let c = 0; c < (use32colors ? 32 : 16); c++) {
    const diff = col.reduce((res, comp, i) => res + Math.abs(comp - picoPalette[c][i]), 0);
    if (diff < minDiff) {
      minDiff = diff;
      picoColor = c;
    }
  }
  return picoColor;
}

// Write P8 file
module.exports.writeP8 = function (p8path, luaCode, graphicsData) {
  let p8 = "pico-8 cartridge // http://www.pico-8.com\nversion 23\n";

  if (luaCode != null && luaCode.length > 0) {
    p8 += `__lua__\n\n${luaCode}`;
  }

  if (graphicsData != null && graphicsData.length > 0) {
    p8 += "\n__gfx__\n";
    let lineCount = 0;
    let writingGfx = true;

    for (let c = 0; c < graphicsData.length; c++) {
      if (c == 8192) {
        writingGfx = false;
        p8 += "__map__\n";
      }
      let byte = graphicsData[c].toString(16);
      if (byte.length == 1) byte = `0${byte}`;
      if (writingGfx) {
        byte = byte.split("").reverse().join("");
      }
      p8 += byte;
      lineCount++;
      if ((lineCount == 64 && writingGfx) || (lineCount == 128 && !writingGfx)) {
        p8 += "\n";
        lineCount = 0;
      }
    }
  }

  fs.writeFileSync(p8path, p8);
};
