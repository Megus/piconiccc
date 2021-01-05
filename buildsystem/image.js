const fs = require("fs");
const PNG = require("pngjs").PNG;
const huffman = require("./huffman");
const p8tools = require("./p8tools");

module.exports.compressLogo = function() {
  const image = fs.readFileSync("./piconiccc.png");
  const png = PNG.sync.read(image);

  const p8image = [];
  for (let y = 0; y < png.height; y++) {
    for (let x = 0; x < png.width; x += 2) {
      const idx = (png.width * y + x) * 4;
      const c1 = [png.data[idx], png.data[idx + 1], png.data[idx + 2]];
      const c2 = [png.data[idx + 4], png.data[idx + 5], png.data[idx + 6]];
      const p1 = p8tools.rgb2pico(c1, false);
      const p2 = p8tools.rgb2pico(c2, false);
      p8image.push(p2 * 16 + p1);
    }
  }

  const compImage = huffman.compress(p8image);

  return compImage;
};