function fx_logo()
  memcpy(0x4300, arcs[6][1], 1753)
  arcs[6][1] = 0x4300
  local a = huffman(arcs[6])
  for i = 0, 8191 do
    poke(i, a())
  end

return function()
  wait_sync()
end,

function()

end,

function()
  line(0,0,100,100,7)
  spr(0, sin(frame / 30) * 10, cos(frame / 40) * 10, 16, 16)
end

end