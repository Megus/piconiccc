local inspect = require("inspect")
local analysis = require("objanalysis")
local compressor = require("compressor")
local reader = require("objreader")
local writer = require("p8writer")

local nameMap = {
  ["0_Plane"] = "O",
  ["X_Plane.005"] = "X",
  ["Y_Plane.006"] = "Y",
  ["G_Plane.007"] = "G",
  ["E.001_Plane.001"] = "E1",
  ["N_Plane.010"] = "N",
  ["E_Plane.008"] = "E",
}

local function reverseFaces(obj)
  for _, face in ipairs(obj.f) do
    face[1], face[3] = face[3], face[1]
  end
end

local function saveObjects(objs, var, filename)
  local output = io.open(filename, "wb")
  output:write(var .. " = " .. inspect(objs))
  output:close()
end

local function saveJSObjects(objs, filename)
  local output = io.open(filename, "wb")
  output:write("const models = {\n")

  local palette = {"#000000", "#1d2b53", "#7e2553", "#008751", "#ab5236", "#5f574f", "#c2c3c7", "#fff1e8",
    "#ff004d", "#ffa300", "#ffec27", "#00e436", "#29adff", "#83769c", "#ff77a8", "#ffccaa"}

  for name, obj in pairs(objs) do
    output:write("  \"" .. name .. "\": {\n")

    output:write("    v: [")
    for _, v in ipairs(obj.v) do
      output:write("["..v[1] .. "," .. v[2] .. "," .. v[3] .. "], ")
    end
    output:write("],\n")

    output:write("    f: [")
    for _, f in ipairs(obj.f) do
      output:write("[\"" .. palette[f[4] + 1] .. "\"," .. f[1] .. "," .. f[2] .. "," .. f[3] .. "], ")
    end
    output:write("],\n")

    output:write("  },\n")
  end

  output:write("};\n")
  output:close()
end

local function remapNames(objs, nameMap)
  for oldName, newName in pairs(nameMap) do
    objs[newName] = objs[oldName]
    objs[oldName] = nil
  end
end

-- Load objects
local objs = {}
reader.loadObj("oxygene_by_letters.obj", objs)
reader.loadObj("tunnel01.obj", objs)

reverseFaces(objs["Cube"])

remapNames(objs, nameMap)

saveJSObjects(objs, "../editor/objects.js")

-- Some analysis
analysis.stats(objs)
analysis.countStorage(objs)
analysis.facePatterns(objs)

-- Compress and write
local meta, bytes = compressor.compress(objs)
writer.writeP8("../piconiccc.p8", bytes)
local metaFile = io.open("../objects.lua", "wb")
metaFile:write("objects = " .. inspect(meta))
metaFile:close()

saveObjects(objs, "objects", "full_objects.lua")
