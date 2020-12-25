function load_models()
  local avertices, acolors, atris, aquads, afp, nobjects = huffman(arcs[1]), huffman(arcs[2]), huffman(arcs[3]), huffman(arcs[4]), huffman(arcs[5]), {}

  for i = 1, #objects do
    local obj = objects[i]
    nobjects[obj.name] = obj

    if obj.name == "E" then
      obj.v, obj.f = nobjects["E1"].v, nobjects["E1"].f
    else
      obj.v, obj.f = {}, {}
      local col_add = (obj.pal % 2 == 0) and 0x1088.5a5a or 0x1000.5a5a

      -- Read vertices
      for c = 1, obj.vn do
        local v = {}
        for d = 1, 3 do
          add(v, avertices() / obj.s[d] + obj.o[d])
        end
        add(obj.v, v)
      end

      -- Read tri faces
      for c = 1, obj.f3n do
        add(obj.f, {acolors() + col_add, atris(), atris(), atris()})
      end

      -- Read quad faces
      local v = 0
      for c = 1, obj.f4n do
        local color, p = acolors() + col_add, fp[afp()]
        v = (v + aquads()) & 0xff
        add(obj.f, {color, v, v + p[1], v + p[2]})
        add(obj.f, {color, v + p[2], v + p[3], v})
      end
    end
  end
  objects = nobjects
end