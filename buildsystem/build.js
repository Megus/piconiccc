const fs = require("fs");
const converter = require("./model_converter");
const compressor = require("./model_compressor");
const writer = require("./p8writer");
const luaTools = require("./lua_tools");

// Get models and camera paths
let models = {};
let camPathList = {};
let modelRenderList = [];

eval(fs.readFileSync("../editor/camera.js").toString());
eval(fs.readFileSync("../editor/math3d.js").toString());
eval(fs.readFileSync("../editor/objects.js").toString());

init_models();

console.log(models.rotorin);
//console.log(camPathList);
//console.log(modelRenderList);

// Process models

const convertedModels = converter.convertModels(models);
//console.log(convertedModels.rotorin);
const compressedData = compressor.compressModels(convertedModels);

const modelInfo = luaTools.json2lua(compressedData.models);
fs.writeFileSync("../pico8/objects.lua", `objects = ${modelInfo}`);

// Write P8
const luaCode = "\
#include main.lua\n\
#include decompressor.lua\n\
#include triangle.lua\n\
#include 3d.lua\n\
#include misc.lua\n\
#include objects.lua\n";

writer.writeP8("../pico8/piconiccc.p8", luaCode, compressedData.binary);

