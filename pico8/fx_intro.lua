function fx_intro()

  local dots = {}
  local fr = 0
  pal({129, 130, 1, 131, 141, 134, 7}, 1)

  local function add_text(text, ox, oy)
    cls()
    print(text, 0, 0, 7)
    local f, a = fr + 60, 0x4300
    memset(a, 0, 512)
    memcpy(a, 0x6000, 512)
    for y = oy, oy + 23, 3 do
      for x = ox, ox + 383, 6 do
        local v = peek(a)
        if v & 15 ~= 0 then
          add(dots, {x, y, f + rnd(#text * 20)})
          f += 1
        end
        if v & 0xf0 ~= 0 then
          add(dots, {x + 3, y, f + rnd(#text * 20)})
          f += 1
        end
        a += 1
      end
    end
  end


return function()
  add_text("this is", 22, 11)
  wait_frames(60)
  add_text("not your", 16, 32)
  wait_frames(60)
  add_text("regular", 22, 53)
  wait_frames(60)
  add_text("stniccc", 22, 74)
  wait_frames(60)
  add_text("clone", 34, 95)
  wait_sync()
end,

function ()
  fr += 1
end,

function ()
  cls()
  color(7)
  for c = 1, #dots do
    local x, y, t = dots[c][1], dots[c][2], (dots[c][3] - fr) / 3
    if (t < 0) t = 0
    local x, y, col = dots[c][1] + t * sin(t / 17) + rnd(t / 3), dots[c][2] + t * cos(t / 20) + rnd(t / 2), 7 - (t / 10)
    rectfill(x, y, x + 1, y + 1, (col < 1) and 1 or flr(col))
  end
end

end