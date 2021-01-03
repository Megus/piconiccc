let camPathList = {};
let modelRenderList = [];
let models = {};

const canvas = document.getElementById("visuals")
const ctx = canvas.getContext("2d");
const width = canvas.width;
const height = canvas.height;


const autoMapping = [];

function init() {
  init_models();

  const converted = convertModels(models);

  let cModels = converted.models;

  for (let c = 0; c < modelPalettes.length; c++) {
    const pm = modelPalettes[c].map((name) => cModels[name]);
    const mapping = buildModelPalette(pm);
    console.log(mapping);
    autoMapping.push(mapping);
  }

  window.requestAnimationFrame(drawFrame);
}

function drawFrame() {
  ctx.fillStyle = "#000000";
  ctx.strokeStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);


  // Draw PICO8-palette
  for (let c = 0; c < 32; c++) {
    drawColor(64 + c * 16, 0, picoPalette[c]);
    ctx.strokeText(`${c.toString(16)}`, 64 + c * 16, 24);
  }

  drawMapping(autoMapping, 8);
  drawMapping(manualMapping, 80);



  //window.requestAnimationFrame(drawFrame);
}

function drawMapping(mapping, x) {
  let y = 32;
  for (let c = 0; c < mapping.length; c++) {
    for (let colHex in mapping[c].usedColors) {
      const col = decodeHex(colHex);
      drawColor(x, y, col);
      drawColor(x + 0x10, y, modifyColor(col));

      const p1 = mapping[c].usedColors[colHex] & 0xf;
      const p2 = (mapping[c].usedColors[colHex] & 0xf0) >> 4;
      const c1 = (p1 == 0) ? picoPalette[0] : picoColor(mapping[c].palette[p1 - 1]);
      const c2 = (p2 == 0) ? picoPalette[0] : picoColor(mapping[c].palette[p2 - 1]);
      drawMix(x + 0x20, y, c1, c2);

      y += 16;
    }
    y += 16;
  }

}

function picoColor(c) {
  return (c < 128) ? picoPalette[c] : picoPalette[c - 128 + 16];
}

function drawColor(x, y, col) {
  ctx.fillStyle = `rgb(${col[0]},${col[1]},${col[2]})`;
  ctx.fillRect(x, y, 16, 16);
}

function drawMix(x, y, c1, c2) {
  ctx.fillStyle = `rgb(${c1[0]},${c1[1]},${c1[2]})`;
  for (let c = 0; c < 8; c++) {
    for (let d = 0; d < 8; d++) {
      if (((c ^ d) & 1) == 0) ctx.fillRect(x + c * 2, y + d * 2, 2, 2);
    }
  }
  ctx.fillStyle = `rgb(${c2[0]},${c2[1]},${c2[2]})`;
  for (let c = 0; c < 8; c++) {
    for (let d = 0; d < 8; d++) {
      if (((c ^ d) & 1) == 1) ctx.fillRect(x + c * 2, y + d * 2, 2, 2);
    }
  }
}