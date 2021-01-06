function fx_landscape()
  pal({129, 1, 133, 5, 134, 6, 7}, 1)

  local land = {}
  local my = {}
  for c = 1, 32 do
    add(land, {})
    for d = 1, 32 do
      add(land[c], 0)
    end
  end
  for c = 1, 128 do
    add(my, 0)
  end

return function()
  wait_sync()
end,

function()
  for c = 1, 32 do
    for d = 1, 32 do
      land[c][d] = sin(c / 20 + sin(frame / 300)) + cos(d / 37 + sin(frame / 353)) + sin(d / 43 + cos(frame / 221)) * 0.5
    end
  end
end,

function()
  for c = 1, 128 do
    my[c] = 128
  end
  for c = 32, 1, -1 do
    for d = 1, 32 do
      local x = c * 4 - d * 3 + 32
      local y = d * 2 + c / 2 + 32 - land[c][d] * 20
      if x >= 0 and x < 128 then
        if my[x + 1] > y then
          pset(x, y, min(7, flr((c + d) / 6)))
          my[x + 1] = y
        end
      end
    end
  end
  oprint("cpu: " .. stat(1), 0, 0, 7)
end

end