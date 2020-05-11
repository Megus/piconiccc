local inspect = require("inspect")
local analysis = require("objanalysis")
local compressor = require("compressor")
local reader = require("objreader")

local function saveObjects(objs, var, filename)
  local output = io.open(filename, "wb")
  output:write(var .. " = " .. inspect(objs))
  output:close()
end

local objs = {}
reader.loadObj("oxygen_text.obj", false, objs)
reader.loadObj("tunnel01.obj", true, objs)

analysis.stats(objs)
analysis.countStorage(objs)
analysis.facePatterns(objs)

compressor.compress(objs)

saveObjects(objs, "objects", "objects.lua")
