const fs = require("fs");
const converter = require("./model_converter");
const compressor = require("./model_compressor");
const camera = require("./camera_converter");
const palette = require("./palette_builder");
const renderList = require("./renderlist_converter");
const huffman = require("./huffman");

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

// Write JSON model data
fs.writeFileSync("../json_models/models.json", JSON.stringify(models, null, 2));
fs.writeFileSync("../json_models/camera.json", JSON.stringify(camPathList, null, 2));
fs.writeFileSync("../json_models/renderList.json", JSON.stringify(modelRenderList, null, 2));

// Convert models
const convertedData = converter.convertModels(models);
const convertedModels = convertedData.models;
// Build palette
const picoPalette = palette.buildPalette(convertedModels);
// Process camera
const convertedCamera = camera.convertCamera(camPathList);
// Process renderlist
const convertedRenderList = renderList.convertRenderList(modelRenderList);

// Compress models
const compressedData = compressor.compressModels(convertedData);

// PICONICCC image
const logo = p8tools.png2pico("./res/piconiccc.png", p8tools.defaultPalette);
const compressedLogo = huffman.compress(logo.data);
compressedData.arcs.push([compressedData.binary.length, compressedLogo.tree]);
compressedData.binary.push(...compressedLogo.binary);

// Music
const music1 = p8tools.readP8("./res/nic21.p8");
const music2 = p8tools.readP8("./res/nic-epilogue-3.p8");
music2.sfx.splice(0, 8);
const musicBinary = p8tools.music2binary(music2.music);
const sfxBinary = p8tools.sfx2binary(music2.sfx);
const musicStart = compressedData.binary.length;
const musicLength = musicBinary.length;
compressedData.binary.push(...musicBinary);
const sfxStart = compressedData.binary.length;
const sfxLength = sfxBinary.length;
compressedData.binary.push(...sfxBinary);

console.log(`Total binary size: ${compressedData.binary.length}`);

// Write demo data
const luaData = `colors,fp,renderlist,arcs,objects,campath,emus,emusl,esfx,esfxl=${luaTools.json2lua(picoPalette)},\
${luaTools.json2lua(convertedData.fp4)},\
${luaTools.json2lua(convertedRenderList)},\
${luaTools.json2lua(compressedData.arcs)},\
${luaTools.json2lua(compressedData.models)},\
${luaTools.json2lua(convertedCamera)},\
${musicStart},${musicLength},${sfxStart},${sfxLength}\
`;
fs.writeFileSync("../pico8/data.lua", luaData);

// Write P8
const luaCode = "\
#include main.lua\n\
#include misc.lua\n\
#include demoengine.lua\n\
#include triangle.lua\n\
#include 3d.lua\n\
#include data.lua\n\
#include huffman.lua\n\
#include loader.lua\n\
#include fx_fade.lua\n\
#include fx_intro.lua\n\
#include fx_landscape.lua\n\
#include fx_ball.lua\n\
#include fx_logo.lua\n\
#include fx_niccc.lua\n\
#include fx_ending.lua\n\
#include script.lua\n\
";

p8tools.writeP8("../pico8/piconiccc.p8", {
  luaCode: luaCode,
  graphics: compressedData.binary,
  label: logo.data,
  title: "piconiccc",
  credits: "by megus, demarche & stardust",
  sfx: music1.sfx,
  music: music1.music,
});
