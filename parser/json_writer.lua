local M = {}

-- Save frames
function M.saveJSON(frames, filename)
  local palette = {}

  local output = io.open(filename, "wb")
  output:write("const frames = [\n")

  for i, frame in ipairs(frames) do
    output:write("// Frame " .. i .. "\n{\n")
    if frame.palette ~= nil then
      for color, rgb in pairs(frame.palette) do
        palette[color] = rgb
      end
    end

    local indexed = frame.vertices ~= nil

    if indexed then
      output:write("  vertices: [")

      for i, v in ipairs(frame.vertices) do
        output:write("[" .. v.x .. "," .. v.y .. "], ")
      end

      output:write("],\n")
    end

    output:write("  polys: [\n")
    for i, poly in ipairs(frame.polys) do
      output:write("    [")
      -- Poly vertices
      for i, v in ipairs(poly) do
        if i == 1 then
          -- Color
          local color = palette[v]
          output:write("\"#" .. color.r .. "f" .. color.g .. "f" .. color.b .. "f\",  ")
        else
          if indexed then
            output:write(v .. ",")
          else
            output:write("[" .. v.x .. "," .. v.y .. "],")
          end
        end
      end

      output:write("],\n")
    end

    output:write("  ]\n")

    output:write("},\n")
  end
  output:write("]\n")
  output:close()
end

return M