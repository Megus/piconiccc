
module.exports.convertModels = function (models) {
  // TODO: Idea with global list of face patterns (Dec 5: 21 patterns repeat across models, 117 vs 138)

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

 return converted;
}