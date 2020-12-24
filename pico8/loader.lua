function decompress()
  for name, obj in pairs(objects) do
    obj.v = {}
    obj.f = {}

    -- Read vertices
    local addr = obj.addr
    for c = 1, obj.vn do
      local v = {}
      for d = 1, 3 do
        add(v, peek(addr) / obj.s[d] + obj.o[d])
        addr += 1
      end
      add(obj.v, v)
    end

    -- Read tri faces
    for c = 1, obj.f3n do
      local v, fp = peek(addr + 1), fp3[peek(addr + 2)]
      --add(obj.f, {peek(addr) + 0x1000.5a5a, v, v + fp[1], v + fp[2]})
      addr += 3
    end

    -- Read quad faces
    for c = 1, obj.f4n do
      local color, v, fp = peek(addr) + 0x1000.5a5a, peek(addr + 1), fp4[peek(addr + 2)]
      add(obj.f, {color, v, v + fp[1], v + fp[2]})
      add(obj.f, {color, v + fp[2], v + fp[3], v})
      addr += 3
    end
  end
end