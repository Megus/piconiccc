function writeFlattenedArrays(src, dst) {
  for (let c = 0; c < src.length; c++) {
    for (let d = 0; d < src[c].length; d++) {
      let v = src[c][d];
      if (v < 0) v = 256 + v;
      dst.push(v);
    }
  }

}

module.exports.compressModels = function (models) {
  const compressed = {};
  compressed.binary = [];
  compressed.models = {};

  let totalFps = 0;

  for (const name in models) {
    const model = models[name];
    compressed.models[name] = {
      o: model.o,
      s: model.s,
      addr: compressed.binary.length,
      fpn: model.fp.length,
      vn: model.v.length,
      fn: model.f.length,
      fstart: model.fstart,
      fend: model.fend,
    };

    totalFps += model.fp.length;

    // Write vertices
    writeFlattenedArrays(model.v, compressed.binary);

    // Write face patterns
    writeFlattenedArrays(model.fp, compressed.binary);

    // Write faces
    writeFlattenedArrays(model.f, compressed.binary);
  }

  console.log(`Face patterns: ${totalFps}`);
  console.log(`Compressed length: ${compressed.binary.length}`);

  return compressed;
}
