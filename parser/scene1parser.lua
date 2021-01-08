local reader = require("reader")
local writer = require("json_writer")
local inspect = require("inspect")

local frames = reader.readFrames(1800)

writer.saveJSON(frames, "scene1frames.js")
