const fs = require("fs");
const converter = require("./model_converter");
const compressor = require("./model_compressor");
const camera = require("./camera_converter");
const palette = require("./palette_builder");
const renderList = require("./renderlist_converter");
const image = require("./image");

const p8tools = require("./p8tools");
const luaTools = require("./lua_tools");

// Get models and camera paths
let models = {};
let camPathList = {};
let modelRenderList = [];

eval(fs.readFileSync("../editor/objects.js").toString());
eval(fs.readFileSync("../editor/camera.js").toString());
eval(fs.readFileSync("../editor/math3d.js").toString());

init_models();

//console.log(models.rotorin);
//console.log(camPathList);
//console.log(modelRenderList);

// Convert models
const convertedData = converter.convertModels(models);
const convertedModels = convertedData.models;
// Build palette
const picoPalette = palette.buildPalette(convertedModels);
// Compress models
const compressedData = compressor.compressModels(convertedData);
// Process camera
const convertedCamera = camera.convertCamera(camPathList);
// Process renderlist
const convertedRenderList = renderList.convertRenderList(modelRenderList);

// Process PICONICCC image
const compressedLogo = image.compressLogo();
compressedData.arcs.push([compressedData.binary.length, compressedLogo.tree]);
compressedData.binary.push(...compressedLogo.binary);


const luaData = `colors = ${luaTools.json2lua(picoPalette)}\n\n\
fp = ${luaTools.json2lua(convertedData.fp4)}\n\n\
renderlist = ${luaTools.json2lua(convertedRenderList)}\n\n\
arcs = ${luaTools.json2lua(compressedData.arcs)}\n\n\
objects = ${luaTools.json2lua(compressedData.models)}\n\n\
campath = ${luaTools.json2lua(convertedCamera)}\n\n\
`;
fs.writeFileSync("../pico8/data.lua", luaData);

// Write P8
const luaCode = "\
#include main.lua\n\
#include misc.lua\n\
#include demoengine.lua\n\
#include eg_triangle.lua\n\
#include 3d.lua\n\
#include data.lua\n\
#include huffman.lua\n\
#include loader.lua\n\
#include fx_intro.lua\n\
#include fx_landscape.lua\n\
#include fx_logo.lua\n\
#include fx_niccc.lua\n\
#include script.lua\n\
";

p8tools.writeP8("../pico8/piconiccc.p8", luaCode, compressedData.binary);

