const huffman = require("./huffman");

function prepareArray(src, signed) {
  const dst = [];
  for (let c = 0; c < src.length; c++) {
    if (typeof src[c] == "number") {
      let v = src[c];
      if (signed == true) {
        if (v > 127) throw `Number too big ${v}`;
        if (v < -128) throw `Number too small ${v}`;
        if (v < 0) v = 256 + v;
      }
      if (v > 255) throw `Number too big ${v}`;
      dst.push(v);
    } else {
      dst.push(...prepareArray(src[c], signed));
    }
  }
  return dst;
}

module.exports.compressModels = function (convertedData) {
  const models = convertedData.models;
  const compressed = {
    models: [],
    arcs: [],
  };

  const binary = [];
  const bVertices = [];
  const bV3 = [];
  const bV4 = [];
  const bColors = [];
  const bFP = [];

  for (const name in models) {
    //console.log(name);
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

    if (name == "E") continue;

    // Write vertices
    bVertices.push(...prepareArray(model.v, false));

    // Write faces:
    // Triangles
    for (let c = 0; c < model.f3.length; c++) {
      bColors.push(model.f3[c][0]);
      bV3.push(model.f3[c][1], model.f3[c][2], model.f3[c][3]);
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
  compressed.arcs.push([binary.length, bVertices.length, cbVertices.tree]);
  binary.push(...cbVertices.binary);

  console.log("Colors:");
  const cbColors = huffman.compress(bColors);
  compressed.arcs.push([binary.length, bColors.length, cbColors.tree]);
  binary.push(...cbColors.binary);

  console.log("Triangles:");
  const cbV3 = huffman.compress(prepareArray(bV3, false));
  compressed.arcs.push([binary.length, bV3.length, cbV3.tree]);
  binary.push(...cbV3.binary);

  console.log("Quads:");
  const cbV4 = huffman.compress(prepareArray(bV4, true));
  compressed.arcs.push([binary.length, bV4.length, cbV4.tree]);
  binary.push(...cbV4.binary);

  const cbFP = huffman.compress(bFP);
  compressed.arcs.push([binary.length, bFP.length, cbFP.tree]);
  binary.push(...cbFP.binary);

  const uncompressedLength = bVertices.length + bV3.length + bV4.length + bColors.length + bFP.length;
  console.log(`Uncompressed length: ${uncompressedLength}, compressed length: ${binary.length}, ratio: ${binary.length / uncompressedLength}`);

  compressed.binary = binary;

  return compressed;
}
