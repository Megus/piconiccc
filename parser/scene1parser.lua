local reader = require("reader")
local writer = require("json_writer")
local compressor = require("compressor")
local inspect = require("inspect")

local frames = reader.readFrames(1800)

compressor.data.frames = frames

compressor.scale()
compressor.removeInvisible()
compressor.deltaIndexedPolys()
compressor.cleanup()

local output = io.open("_processed.lua", "wb")
output:write(inspect(compressor.data))
output:close()

--writer.saveJSON(frames, "scene1frames.js")
