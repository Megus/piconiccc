local M = {}

local palette = {
  {0x00, 0x00, 0x00}, {0x1d, 0x2b, 0x53}, {0x7e, 0x25, 0x53}, {0x00, 0x87, 0x51},
  {0xab, 0x52, 0x36}, {0x5f, 0x57, 0x4f}, {0xc2, 0xc3, 0xc7}, {0xff, 0xf1, 0xe8},
  {0xff, 0x00, 0x4d}, {0xff, 0xa3, 0x00}, {0xff, 0xec, 0x27}, {0x00, 0xe4, 0x36},
  {0x29, 0xad, 0xff}, {0x83, 0x76, 0x9c}, {0xff, 0x77, 0xa8}, {0xff, 0xcc, 0xaa},
}

function rgb_to_pico16(r, g, b)
  local col = 0
  local mindiff = 10000
  for i = 1, 16 do
      local diff = math.abs(r - palette[i][1]) + math.abs(g - palette[i][2]) + math.abs(b - palette[i][3])
      if diff < mindiff then
          col = i - 1
          mindiff = diff
      end
  end

  --return hex_digit(col)
  return col
end

local function loadFile(filename)
  local lines = {}
  for line in io.lines(filename) do
    table.insert(lines, line)
  end
  return lines
end

local function splitLine(line)
  local tokens = {}
  for w in line:gmatch("%S+") do table.insert(tokens, w) end
  return tokens
end

local function vnumber(token)
  local numbers = {}
  for w in token:gmatch("%d+") do table.insert(numbers, w) end
  return tonumber(numbers[1])
end

local function loadMaterials(filename)
  local lines = loadFile(filename)
  local materials = {}
  local mtlName = "default"

  for i, line in ipairs(lines) do
    if line:len() > 2 then
      local tokens = splitLine(line)
      local cmd = tokens[1]

      if cmd == "newmtl" then
        mtlName = tokens[2]
      elseif cmd == "Kd" then
        local r = tonumber(tokens[2]) * 255
        local g = tonumber(tokens[3]) * 255
        local b = tonumber(tokens[4]) * 255
        materials[mtlName] = rgb_to_pico16(r, g, b)
      end
    end
  end

  return materials
end


function M.loadObj(filename, reverseFaces, objects)
  local lines = loadFile(filename)
  local materials = {}
  local obj = nil
  local color = 7

  for i, line in ipairs(lines) do
    if line:len() > 2 then
      local tokens = splitLine(line)
      local cmd = tokens[1]

      if cmd == "o" then
        curObject = {v = {}, f = {}}
        objects[tokens[2]] = curObject
      elseif cmd == "mtllib" then
        materials = loadMaterials(tokens[2])
      elseif cmd == "v" then
        local x = tonumber(tokens[2])
        local y = tonumber(tokens[3])
        local z = tonumber(tokens[4])
        table.insert(curObject.v, {x, y, z})
      elseif cmd == "usemtl" then
        color = materials[tokens[2]]
      elseif cmd == "f" then
        local v1 = vnumber(tokens[2])
        local v2 = vnumber(tokens[3])
        local v3 = vnumber(tokens[4])
        if reverseFaces then
          v1, v3 = v3, v1
        end
        table.insert(curObject.f, {v1, v2, v3, color})
      end
    end
  end
end

return M