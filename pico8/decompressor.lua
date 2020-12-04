function decompress()
  for _, obj in pairs(objects) do
    obj.v = {}
    obj.f = {}
    obj.fp = {}

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

    -- Read face patterns
    for c = 1, obj.fpn do
      local fp = {peek(addr), peek(addr + 1)}
      if (fp[1] > 127) fp[1] -= 256
      if (fp[2] > 127) fp[2] -= 256
      add(obj.fp, fp)
      addr += 2
    end

    -- Read faces
    for c = 1, obj.fn do
      local v, fp = peek(addr + 1), obj.fp[peek(addr + 2)]
      add(obj.f, {peek(addr), v, v + fp[1], v + fp[2]})
      addr += 3
    end
  end
end