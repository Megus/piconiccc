let camPathList = {};
let modelRenderList = [];
let models = {};

const canvas = document.getElementById("visuals")
const ctx = canvas.getContext("2d");
const width = canvas.width;
const height = canvas.height;


const usedByPal = [];

function init() {
  init_models();

  const converted = convertModels(models);

  let cModels = converted.models;

  for (let c = 0; c < modelPalettes.length; c++) {
    const pm = modelPalettes[c].map((name) => cModels[name]);
    const usedColors = findUsedColors(pm);
    usedByPal.push(usedColors);
    console.log(usedColors);
  }

  window.requestAnimationFrame(drawFrame);
}

function drawFrame() {
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, width, height);

  let y = 32;

  // Draw PICO8-palette
  for (let c = 0; c < 32; c++) {
    drawColor(64 + c * 16, 0, picoPalette[c]);
  }

  // Draw used colors
  for (let c = 0; c < usedByPal.length; c++) {
    for (let colHex in usedByPal[c]) {
      const col = decodeHex(colHex);
      const mCol = modifyColor(col);
      drawColor(0x8, y, col);
      drawColor(0x18, y, mCol);

      const picos = findClosestPair(col, picoPalette);
      const mPicos = findClosestPair(mCol, picoPalette);
      drawColor(0x40, y, picoPalette[picos[0]]);
      drawColor(0x50, y, picoPalette[picos[1]]);
      drawMix(0x60, y, picoPalette[picos[0]], picoPalette[picos[1]]);

      drawColor(0x80, y, picoPalette[mPicos[0]]);
      drawColor(0x90, y, picoPalette[mPicos[1]]);
      drawMix(0xa0, y, picoPalette[mPicos[0]], picoPalette[mPicos[1]]);

      y += 16;
    }
    y += 16;
  }


  //window.requestAnimationFrame(drawFrame);
}

function drawColor(x, y, col) {
  ctx.fillStyle = `rgb(${col[0]},${col[1]},${col[2]})`;
  ctx.fillRect(x, y, 16, 16);
}

function drawMix(x, y, c1, c2) {
  ctx.fillStyle = `rgb(${c1[0]},${c1[1]},${c1[2]})`;

  ctx.fillStyle = `rgb(${c2[0]},${c2[1]},${c2[2]})`;
}