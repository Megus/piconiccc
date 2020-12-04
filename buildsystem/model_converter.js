const picoPalette = [
    [0x00, 0x00, 0x00], [0x1d, 0x2b, 0x53], [0x7e, 0x25, 0x53], [0x00, 0x87, 0x51],
    [0xab, 0x52, 0x36], [0x5f, 0x57, 0x4f], [0xc2, 0xc3, 0xc7], [0xff, 0xf1, 0xe8],
    [0xff, 0x00, 0x4d], [0xff, 0xa3, 0x00], [0xff, 0xec, 0x27], [0x00, 0xe4, 0x36],
    [0x29, 0xad, 0xff], [0x83, 0x76, 0x9c], [0xff, 0x77, 0xa8], [0xff, 0xcc, 0xaa],
];

module.exports.convertModels = function (models) {
  // TODO: Idea with global list of face patterns (Dec 5: 21 patterns repeat across models, 117 vs 138)
  const usedColors = {};

  const converted = {};
  for (const name in models) {
    const model = models[name];
    const cmodel = {};
    cmodel.fstart = model.fstart;
    cmodel.fend = model.fend;

    // Scale vertices
    const mins = [1e6, 1e6, 1e6];
    const maxs = [-1e6, -1e6, -1e6];
    for (let c = 0; c < model.v.length; c++) {
      const v = model.v[c];
      for (let d = 0; d < 3; d++) {
        if (v[d] < mins[d]) mins[d] = v[d];
        if (v[d] > maxs[d]) maxs[d] = v[d];
      }
    }

    cmodel.o = mins;
    cmodel.s = [];
    for (let c = 0; c < 3; c++) {
      cmodel.s[c] = 255 / (maxs[c] - mins[c]);
    }

    cmodel.v = [];
    for (let c = 0; c < model.v.length; c++) {
      const v = model.v[c];
      const sv = [];
      for (let d = 0; d < 3; d++) {
        sv.push(Math.floor((v[d] - mins[d]) * cmodel.s[d]));
      }
      cmodel.v.push(sv);
    }

    // Find face patterns and convert faces
    cmodel.fp = [];
    cmodel.f = [];
    for (let c = 0; c < model.f.length; c++) {
      const f = model.f[c];
      const hexColor = f[0].toUpperCase();
      usedColors[hexColor] = true;
      const cf = [hexColor, f[1]];
      const fp = [f[2] - f[1], f[3] - f[1]];

      let fpIdx = -1;
      for (let d = 0; d < cmodel.fp.length; d++) {
        if (cmodel.fp[d][0] == fp[0] && cmodel.fp[d][1] == fp[1]) {
          fpIdx = d;
          break;
        }
      }
      if (fpIdx == -1) {
        cmodel.fp.push(fp);
        cf.push(cmodel.fp.length);
      } else {
        cf.push(fpIdx + 1);
      }

      cmodel.f.push(cf);
    }

    converted[name] = cmodel;
  }


  // Assign best matching colors
  // TODO: Build 16 color palette from all 32 colors
  for (const hexColor in usedColors) {
    const rgb = parseInt(hexColor.substring(1), 16);
    const r = (rgb & 0xff0000) / 0x10000;
    const g = (rgb & 0xff00) / 0x100;
    const b = rgb & 0xff;
    let minDiff = 1000;
    let pico1 = 0;
    let pico2 = 0;
    for (let c = 0; c < 16; c++) {
      for (let d = 0; d < 16; d++) {
        let avgR = (picoPalette[c][0] + picoPalette[d][0]) / 2;
        let avgG = (picoPalette[c][1] + picoPalette[d][1]) / 2;
        let avgB = (picoPalette[c][2] + picoPalette[d][2]) / 2;
        const diff = Math.abs(avgR - r) + Math.abs(avgG - g) + Math.abs(avgB - b);
        if (diff < minDiff) {
          minDiff = diff;
          pico1 = c;
          pico2 = d;
        }
      }
    }
    //usedColors[hexColor] = [pico1 * 16 + pico2, [r, g, b], picoPalette[pico1], picoPalette[pico2]];
    usedColors[hexColor] = pico1 * 16 + pico2;
  }

  for (const name in converted) {
    const model = converted[name];
    for (let c = 0; c < model.f.length; c++) {
      model.f[c][0] = usedColors[model.f[c][0]];
    }
  }
  return converted;
}