function writeFlattenedArrays(src, dst) {
  for (let c = 0; c < src.length; c++) {
    for (let d = 0; d < src[c].length; d++) {
      let v = src[c][d];
      if (v < 0) v = 256 + v;
      dst.push(v);
    }
  }

}

module.exports.compressModels = function (convertedData) {
  const models = convertedData.models;
  const compressed = {};
  compressed.binary = [];
  compressed.models = {};

  for (const name in models) {
    const model = models[name];
    compressed.models[name] = {
      o: model.o,
      s: model.s,
      addr: compressed.binary.length,
      vn: model.v.length,
      f3n: model.f3.length,
      f4n: model.f4.length,
      fstart: model.fstart,
      fend: model.fend,
      pal: model.pal,
    };

    // Write vertices
    writeFlattenedArrays(model.v, compressed.binary);

    // Write faces
    //writeFlattenedArrays(model.f3, compressed.binary);
    writeFlattenedArrays(model.f4, compressed.binary);
    console.log(name);
    console.log(model.f4);
  }

  console.log(compressed.models);

  console.log(`Compressed length: ${compressed.binary.length}`);

  return compressed;
}
