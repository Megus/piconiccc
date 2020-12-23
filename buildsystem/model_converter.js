module.exports.convertModels = function (models) {
  // TODO: Idea with global list of face patterns (Dec 5: 21 patterns repeat across models, 117 vs 138)

  const converted = {};
  const facePatterns3 = [];
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

      const fp = [];
      for (let d = 2; d < f.length; d++) {
        fp.push(f[d] - f[1]);
      }

      let fpIdx = -1;
      const facePatterns = isQuad ? facePatterns4 : facePatterns3;

      for (let d = 0; d < facePatterns.length; d++) {
        let equal = true;
        for (let i = 0; i < fp.length; i++) {
          if (facePatterns[d][i] != fp[i]) {
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
        facePatterns.push(fp);
        cf.push(facePatterns.length);
      } else {
        cf.push(fpIdx + 1);
      }

      if (isQuad) {
        cmodel.f4.push(cf);
      } else {
        cmodel.f3.push(cf);
      }
    }

    converted[name] = cmodel;
  }

  //console.log(facePatterns3);
  //console.log(facePatterns4);
  console.log(`Tri patterns: ${facePatterns3.length}, Quad patterns: ${facePatterns4.length}`);

  return {
    fp3: facePatterns3,
    fp4: facePatterns4,
    models: converted,
  };
}