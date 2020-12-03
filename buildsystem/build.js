let fs = require("fs");
let writer = require("./p8writer");

let models = {};
let camPathList = {};
let modelRenderList = [];

eval(fs.readFileSync("../editor/math3d.js").toString());
eval(fs.readFileSync("../editor/camera.js").toString());
eval(fs.readFileSync("../editor/objects.js").toString());

init_models();

// Convert models


// Compress models


// Convert camera path list



// Write P8

console.log(models);
console.log(camPathList);
console.log(modelRenderList);
