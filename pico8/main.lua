function _init()
  decompress()
  poke(0x5f34, 1)
  poke(0x5f2d, 1)
  frame = 320
end

function _update60()
  frame += 0.2
  if btn(1) then
    frame += 0.2
  elseif btn(0) then
    frame -= 0.2
  end
end

function _draw()
  cls()
  local models = ""
  local cameras = ""
  for c = 1, #renderlist, 2 do
    local model = objects[renderlist[c]]
    if model.fstart <= frame and model.fend > frame then
      models = models .. renderlist[c] .. " "
      camera = campath[renderlist[c + 1]]
      cameras = cameras .. renderlist[c + 1] .. " "
      set_cam_idx()
      spline_cam()
      if renderlist[c] == "rotorin" then
        m3d(model, eye, dir, up, -frame / 30)
      else
        m3d(model, eye, dir, up)
      end
    end
  end

  oprint(models, 0, 8, 7)
  oprint(cameras, 0, 16, 7)
  oprint(frame, 64, 0, 7)
  oprint(stat(1), 0, 0, 7)
end

