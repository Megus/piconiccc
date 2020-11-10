function decompress()
  for _, obj in pairs(objects) do
    obj.vertices = {}
    obj.faces = {}

    -- Read vertices
    local addr = obj.addr
    for c = 1, obj.v do
      local x, y, z = peek(addr), peek(addr + 1), peek(addr + 2)
      x = x * obj.s[1] + obj.o[1]
      y = y * obj.s[2] + obj.o[2]
      z = z * obj.s[3] + obj.o[3]
      add(obj.vertices, {x, y, z})
      addr += 3
    end

    -- Read faces
    for c = 1, obj.f do
      add(obj.faces, {peek(addr), peek(addr + 1), peek(addr + 2), peek(addr + 3)})
      addr += 4
    end
  end
end