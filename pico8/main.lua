function _init()
  poke(0x5f34, 1)
  poke(0x5f2d, 1)
  pal(0, 0, 1)
  pal(8, 0, 1)

  load_models()

  frame = 173
  dframe = 0

end

function _update60()
  dframe += 1
  if btn(1) then
    frame += 1
  elseif btn(0) then
    frame -= 1
  else
    frame += 0.2
  end
end

function set_palette(pn)
  if pn & 1 == 1 then
    for i = 1, #colors[pn] do
      pal(i, colors[pn][i], 1)
    end
  else
    for i = 1, #colors[pn] do
      pal(i + 8, colors[pn][i], 1)
    end
  end
end

function _draw()
  cls()

  total_tris = 0

  local models = "m: "
  local cameras = "c: "
  for c = 1, #renderlist, 2 do
    local model = objects[renderlist[c]]
    if model.fstart <= frame and model.fend > frame then
      models = models .. renderlist[c] .. " "
      camera = campath[renderlist[c + 1]]
      cameras = cameras .. renderlist[c + 1] .. " "
      set_palette(model.pal)
      set_cam_idx()
      spline_cam()
      if renderlist[c] == "rotorin" then
        m3d(model, eye, dir, up, -dframe / 150)
      else
        m3d(model, eye, dir, up)
      end
    end
  end

  local pcol = 15
  oprint("cpu: " .. stat(1), 0, 0, pcol)
  oprint("f: " .. frame, 52, 0, pcol)
  oprint(models, 0, 8, pcol)
  oprint(cameras, 0, 16, pcol)
  oprint("t: " .. total_tris, 104, 0, pcol)
end

