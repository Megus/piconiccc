const fs = require("fs");
const PNG = require("pngjs").PNG;

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

// Convert PICO-8 music to binary (for compression and storing additional music)
module.exports.music2binary = function(music) {
  const bin = [];
  music.forEach((line) => {
    const flags = parseInt(line.substring(0, 2), 16);
    let chA = parseInt(line.substring(3, 5), 16);
    let chB = parseInt(line.substring(5, 7), 16);
    let chC = parseInt(line.substring(7, 9), 16);
    let chD = parseInt(line.substring(9, 11), 16);
    if ((flags & 1) != 0) chA += 128;
    if ((flags & 2) != 0) chB += 128;

    bin.push(chA, chB, chC, chD);
  });
  return bin;
}

module.exports.sfx2binary = function(sfxs) {
  const bin = [];
  sfxs.forEach((sfx) => {
    const mode = parseInt(sfx.substring(0, 2), 16);
    const speed = parseInt(sfx.substring(2, 4), 16);
    const loopStart = parseInt(sfx.substring(4, 6), 16);
    const loopEnd = parseInt(sfx.substring(6, 8), 16);
    const rows = [];
    for (let c = 0; c < 32; c++) {
      rows.push({
        // byte2hex(pitch) .. nibble2hex(instrument) .. nibble2hex(volume) .. nibble2hex(fx)
        pitch: parseInt(sfx.substring(c * 5 + 8, c * 5 + 10), 16),
        instrument: parseInt(sfx.substring(c * 5 + 10, c * 5 + 11), 16),
        volume: parseInt(sfx.substring(c * 5 + 11, c * 5 + 12), 16),
        fx: parseInt(sfx.substring(c * 5 + 12, c * 5 + 13), 16),
      });
    }

    rows.forEach((row) => {
      let value = row.pitch + ((row.instrument & 7) << 6) + (row.volume << 9) + (row.fx << 12) + ((row.instrument & 8) << 12);
      let low = value & 255;
      let high = (value & 0xff00) >> 8;
      bin.push(low, high);
    });
    bin.push(mode, speed, loopStart, loopEnd);
  });
  return bin;
}

// Write P8 file
module.exports.writeP8 = function (p8path, p8) {
  // p8data: luaCode, graphicsData, label
  let cart = "pico-8 cartridge // http://www.pico-8.com\nversion 23\n";

  cart += "__lua__\n";
  if (p8.title != null) cart += `-- ${p8.title}\n`;
  if (p8.credits != null) cart += `-- ${p8.credits}\n`;

  // Write Lua code
  if (p8.luaCode != null && p8.luaCode.length > 0) {
    cart += p8.luaCode;
  }

  // Write graphics data (sprites and map)
  if (p8.graphics != null && p8.graphics.length > 0) {
    cart += "\n__gfx__\n";
    let addr = 0;
    while (addr < p8.graphics.length) {
      if (addr < 8192) {
        cart += bytes2hex(p8.graphics, addr, 64, true) + "\n";
        addr += 64;
        if (addr == 8192) {
          cart += "\n__map__\n";
        }
      } else {
        cart += bytes2hex(p8.graphics, addr, 128, false) + "\n";
        addr += 128;
      }
    }
  }

  // Write music
  if (p8.sfx != null && p8.sfx.length > 0) {
    cart += `\n__sfx__\n${p8.sfx.join("\n")}`;
  }
  if (p8.music != null && p8.music.length > 0) {
    cart += `\n__music__\n${p8.music.join("\n")}`;
  }

  // Write label
  if (p8.label != null && p8.label.length == 8192) {
    cart += "\n__label__\n";
    for (let c = 0; c < 8192; c += 64) {
      cart += bytes2hex(p8.label, c, 64, true) + "\n";
    }
  }

  fs.writeFileSync(p8path, cart);
};

module.exports.readP8 = function(p8path) {
  const text = fs.readFileSync(p8path).toString();
  const lines = text.split("\n");
  // TODO: Extract everything else, need only SFX and Music for now
  const p8 = {};

  let idx = 0;
  let block = "";
  while (idx < lines.length) {
    const line = lines[idx];

    if (line.startsWith("__")) block = "";

    // Reading blocks
    if (block == "sfx" && line.length > 0) {
      p8.sfx.push(line);
    } else if (block == "music" && line.length > 0) {
      p8.music.push(line);
    }
    // Block headers
    else if (line == "__sfx__") {
      p8.sfx = [];
      block = "sfx";
    } else if (line == "__music__") {
      p8.music = [];
      block = "music";
    }

    idx++;
  }

  //console.log(p8);
  return p8;
};



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

