const huffman = require("./huffman");

function writeFlattenedArrays(src, dst) {
  for (let c = 0; c < src.length; c++) {
    if (typeof src[c] == "number") {
      dst.push(src[c]);
    } else {
      for (let d = 0; d < src[c].length; d++) {
        let v = src[c][d];
        if (v < 0) v = 256 + v;
        dst.push(v);
      }
    }
  }
}

module.exports.compressModels = function (convertedData) {
  const models = convertedData.models;
  const compressed = {};
  compressed.models = [];

  const binary = [];
  const bVertices = [];
  const bV3 = [];
  const bV4 = [];
  const bColors = [];
  const bFP = [];

  for (const name in models) {
    const model = models[name];
    compressed.models.push({
      name: name,
      o: model.o,
      s: model.s,
      vn: model.v.length,
      f3n: model.f3.length,
      f4n: model.f4.length,
      fstart: model.fstart,
      fend: model.fend,
      pal: model.pal,
    });

    if (name == "E1") continue;

    // Write vertices
    writeFlattenedArrays(model.v, bVertices);

    // Write faces:
    // Triangles
    let oldV = 0;
    for (let c = 0; c < model.f3.length; c++) {
      bColors.push(model.f3[c][0]);
      bV3.push(model.f3[c][1] - oldV, model.f3[c][2] - model.f3[c][1], model.f3[c][3] - model.f3[c][1]);
      oldV = model.f3[c][1];
    }

    // Quads
    oldV = 0;
    for (let c = 0; c < model.f4.length; c++) {
      bColors.push(model.f4[c][0]);
      bV4.push(model.f4[c][1] - oldV);
      oldV = model.f4[c][1];
      bFP.push(model.f4[c][2]);
    }
  }

  console.log("Vertices:");
  const cbVertices = huffman.compress(bVertices);
  writeFlattenedArrays(cbVertices.binary, binary);

  console.log("Colors:");
  const cbColors = huffman.compress(bColors);
  writeFlattenedArrays(cbColors.binary, binary);

  console.log("Triangles:");
  const cbV3 = huffman.compress(bV3);
  writeFlattenedArrays(cbV3.binary, binary);

  console.log("Quads:");
  const cbV4 = huffman.compress(bV4);
  writeFlattenedArrays(cbV4.binary, binary);
  const cbFP = huffman.compress(bFP);
  writeFlattenedArrays(cbFP.binary, binary);

  const uncompressedLength = bVertices.length + bV3.length + bV4.length + bColors.length + bFP.length;
  console.log(`Uncompressed length: ${uncompressedLength}, compressed length: ${binary.length}, ratio: ${binary.length / uncompressedLength}`);

  compressed.binary = binary;
  //compressed.htree = compressedBinary.tree;

  return compressed;
}
