const fs = require("fs");

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
}
