const fs = require("fs");
const PNG = require("pngjs").PNG;

// Convert part of array of bytes to a hex string
function bytes2hex(data, start, length, swapNibbles) {
  let result = "";
  for (let c = start; c < Math.min(data.length, start + length); c++) {
    let byte = data[c].toString(16);
    if (byte.length == 1) byte = `0${byte}`;
    if (swapNibbles) {
      byte = byte.split("").reverse().join("");
    }
    result += byte;
  }
  return result;
}

// PICO-8 palette (including 16 undocumented colors)
const picoPalette = [
  [0x00, 0x00, 0x00], [0x1d, 0x2b, 0x53], [0x7e, 0x25, 0x53], [0x00, 0x87, 0x51],
  [0xab, 0x52, 0x36], [0x5f, 0x57, 0x4f], [0xc2, 0xc3, 0xc7], [0xff, 0xf1, 0xe8],
  [0xff, 0x00, 0x4d], [0xff, 0xa3, 0x00], [0xff, 0xec, 0x27], [0x00, 0xe4, 0x36],
  [0x29, 0xad, 0xff], [0x83, 0x76, 0x9c], [0xff, 0x77, 0xa8], [0xff, 0xcc, 0xaa],

  [0x29, 0x18, 0x14], [0x11, 0x1d, 0x35], [0x42, 0x21, 0x36], [0x12, 0x53, 0x59],
  [0x74, 0x2f, 0x29], [0x49, 0x33, 0x3b], [0xa2, 0x88, 0x79], [0xf3, 0xef, 0x7d],
  [0xbe, 0x12, 0x50], [0xff, 0x6c, 0x24], [0xa8, 0xe7, 0x2e], [0x00, 0xb5, 0x43],
  [0x06, 0x5a, 0xb5], [0x75, 0x46, 0x65], [0xff, 0x6e, 0x59], [0xff, 0x9d, 0x81],
];

module.exports.picoPalette = picoPalette;
module.exports.defaultPalette = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

// Gets the index of the closest color from provided palette
module.exports.rgb2pico = function(col, palette) {
  let minDiff = 10000;
  let idx = 0;
  for (let c = 0; c < palette.length; c++) {
    const diff = col.reduce((res, comp, i) => res + Math.abs(comp - picoPalette[palette[c]][i]), 0);
    if (diff < minDiff) {
      minDiff = diff;
      idx = c;
    }
  }
  return idx;
};

// Read PNG image and convert it to a provided palette
module.exports.png2pico = function(pngPath, palette) {
  const image = fs.readFileSync(pngPath);
  const png = PNG.sync.read(image);

  const p8image = [];
  for (let y = 0; y < png.height; y++) {
    for (let x = 0; x < png.width; x += 2) {
      const idx = (png.width * y + x) * 4;
      const c1 = [png.data[idx], png.data[idx + 1], png.data[idx + 2]];
      const c2 = [png.data[idx + 4], png.data[idx + 5], png.data[idx + 6]];
      const p1 = this.rgb2pico(c1, palette);
      const p2 = this.rgb2pico(c2, palette);
      p8image.push(p2 * 16 + p1);
    }
  }

  return {
    width: png.width,
    height: png.height,
    data: p8image
  };
};

// Write P8 file
module.exports.writeP8 = function (p8path, p8data) {
  // p8data: luaCode, graphicsData, label
  let p8 = "pico-8 cartridge // http://www.pico-8.com\nversion 23\n";

  const luaCode = p8data.luaCode;
  const graphics = p8data.graphics;
  const label = p8data.label;

  p8 += "__lua__\n";
  if (p8data.title != null) p8 += `-- ${p8data.title}\n`;
  if (p8data.credits != null) p8 += `-- ${p8data.credits}\n`;

  // Write Lua code
  if (luaCode != null && luaCode.length > 0) {
    p8 += luaCode;
  }

  // Write graphics data (sprites and map)
  if (graphics != null && graphics.length > 0) {
    p8 += "\n__gfx__\n";
    let addr = 0;
    while (addr < graphics.length) {
      if (addr < 8192) {
        p8 += bytes2hex(graphics, addr, 64, true) + "\n";
        addr += 64;
        if (addr == 8192) {
          p8 += "\n__map__\n";
        }
      } else {
        p8 += bytes2hex(graphics, addr, 128, false) + "\n";
        addr += 128;
      }
    }
  }

  // Write music

  // Write label
  if (label != null && label.length == 8192) {
    p8 += "\n__label__\n";
    for (let c = 0; c < 8192; c += 64) {
      p8 += bytes2hex(label, c, 64, true) + "\n";
    }
  }

  fs.writeFileSync(p8path, p8);
};
