function convertModels(models) {
  // TODO: Idea with global list of face patterns (Dec 5: 21 patterns repeat across models, 117 vs 138)

  const converted = {};
  const facePatterns4 = [];

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
    cmodel.f3 = [];
    cmodel.f4 = [];
    for (let c = 0; c < model.f.length; c++) {
      const f = model.f[c];
      const hexColor = f[0].toUpperCase();
      const cf = [hexColor, f[1]];
      const isQuad = (f.length == 5);

      if (!isQuad) {
        // Don't apply face patterns to tris
        cf.push(f[2], f[3]);
        cmodel.f3.push(cf);
        continue;
      }

      // Apply face pattern compression
      const fp = [];
      for (let d = 2; d < f.length; d++) {
        fp.push(f[d] - f[1]);
      }

      let fpIdx = -1;

      for (let d = 0; d < facePatterns4.length; d++) {
        let equal = true;
        for (let i = 0; i < fp.length; i++) {
          if (facePatterns4[d][i] != fp[i]) {
            equal = false;
            break;
          }
        }
        if (equal) {
          fpIdx = d;
          break;
        }
      }
      if (fpIdx == -1) {
        facePatterns4.push(fp);
        cf.push(facePatterns4.length);
      } else {
        cf.push(fpIdx + 1);
      }

      cmodel.f4.push(cf);
    }

    converted[name] = cmodel;
  }

  return {
    fp4: facePatterns4,
    models: converted,
  };
}

if (typeof module !== "undefined") {
  module.exports.convertModels = convertModels;
}
