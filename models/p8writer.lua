local M = {}

function hex_digit(digit)
  if digit < 10 then
      return "" .. digit
  else
      digit = math.min(digit, 15)
      return string.char(87 + digit)
  end
end

function byteToHex(byte, reverse)
  -- Convert negative numbers
  if byte < 0 then
    byte = 256 + byte
  end

  local lowNibble = hex_digit(byte % 16)
  local highNibble = hex_digit(math.floor(byte / 16))

  if reverse then
    return lowNibble .. highNibble
  else
    return highNibble .. lowNibble
  end
end

function M.writeP8(filename, bytes)
  local p8 = io.open(filename, "wb")

  p8:write("pico-8 cartridge // http://www.pico-8.com\n")
  p8:write("version 18\n")
  p8:write("__lua__\n\n")
  p8:write("#include main.lua\n")
  p8:write("#include decompressor.lua\n")
  p8:write("#include triangle.lua\n")
  p8:write("#include 3d.lua\n")
  p8:write("#include misc.lua\n")
  p8:write("#include objects.lua\n")
  p8:write("----------------\n")
  p8:write("__gfx__\n")

  local lineCount = 0
  local writingGfx = true
  for i, byte in ipairs(bytes) do
    if i == 8192 then
      writingGfx = false
      write("__map__\n")
    end
    local hex = byteToHex(byte, writingGfx)
    p8:write(hex)

    lineCount = lineCount + 1
    if (lineCount == 64 and writingGfx) or (lineCount == 128 and not writingGfx) then
      p8:write("\n")
      lineCount = 0
    end

  end

  p8:close()
end

return M