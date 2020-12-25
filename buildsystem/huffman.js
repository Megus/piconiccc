function calculateFrequencies(data) {
  const freq = [];
  for (let c = 0; c < 256; c++) {
    freq.push(0);
  }
  for (let c = 0; c < data.length; c++) {
    freq[data[c]]++;
  }
  return freq;
}

function buildLeafs(freq) {
  let leafs = freq.map((f, byte) => ({f: f, v: byte}));
  leafs = leafs.filter((l) => l.f != 0);
  leafs.sort((a, b) => a.f - b.f);
  return leafs;
}

function dequeue(q1, q2) {
  if (q1.length == 0) {
    return q2.shift();
  }
  if (q2.length == 0) {
    return q1.shift();
  }
  if (q1[0].f < q2[0].f) {
    return q1.shift();
  } else {
    return q2.shift();
  }
}

function buildTree(leafs) {
  const q1 = leafs;
  const q2 = [];

  while (q1.length + q2.length > 1) {
    const n1 = dequeue(q1, q2);
    const n2 = dequeue(q1, q2);
    const node = {f: n1.f + n2.f, left: n1, right: n2};
    q2.push(node);
  }
  const root = dequeue(q1, q2);

  return root;
}

function buildCodes(tree) {
  const codes = [];
  for (let c = 0; c < 256; c++) {
    codes.push("");
  }

  const traverse = function(node, code) {
    if (node.v != null) {
      codes[node.v] = code;
    }
    if (node.left != null) {
      traverse(node.left, code + "0");
    }
    if (node.right != null) {
      traverse(node.right, code + "1");
    }
  }

  traverse(tree, "");
  return codes;
}

function encode(data, codes) {
  let bString = "";
  for (let c = 0; c < data.length; c++) {
    bString += codes[data[c]];
  }
  return bString;
}

function binaryStringToArray(bString) {
  const data = [];
  let byte = 0;
  let bit = 128;
  for (let c = 0; c < bString.length; c++) {
    if (bString.charAt(c) == "1") {
      byte += bit;
    }
    if (bit != 1) {
      bit /= 2;
    } else {
      bit = 128;
      data.push(byte);
      byte = 0;
    }
  }
  if (bit != 128) {
    data.push(byte);
  }
  return data;
}

function encodeTree(tree) {
  let treeString = "";
  const stack = [tree];
  while (stack.length > 0) {
    const node = stack.pop();
    if (node.v == null) {
      treeString += ".";
    } else {
      if (node.v < 16) {
        treeString += `0${node.v.toString(16)}`;
      } else {
        treeString += node.v.toString(16);
      }
    }
    if (node.right != null) stack.push(node.right);
    if (node.left != null) stack.push(node.left);
  }

  return treeString;
}

module.exports.compress = function(data) {
  const freq = calculateFrequencies(data);
  const leafs = buildLeafs(freq);
  const tree = buildTree(leafs);
  const codes = buildCodes(tree);
  const binaryString = encode(data, codes);
  const binary = binaryStringToArray(binaryString);
  console.log(`Uncompressed length: ${data.length}, Compressed length: ${binary.length}, ratio: ${binary.length / data.length}`);

  return {
    binary: binary,
    freq: freq,
    tree: encodeTree(tree),
  };
}