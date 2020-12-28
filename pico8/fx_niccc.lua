function fx_niccc()

nframe = 580
dframe = 0

pal(0, 0, 1)
pal(8, 0, 1)

return function()
  wait_sync()
end,

function()
  dframe += 1
  if btn(1) then
    nframe += 1
  elseif btn(0) then
    nframe -= 1
  else
    --nframe += 0.2
  end
end,

function()
  total_tris = 0

  local models = "m: "
  local cameras = "c: "
  for c = 1, #renderlist, 2 do
    local model = objects[renderlist[c]]
    if model.fstart <= nframe and model.fend > nframe then
      models = models .. renderlist[c] .. " "
      camera = campath[renderlist[c + 1]]
      cameras = cameras .. renderlist[c + 1] .. " "

      local pn = model.pal
      if pn & 1 == 1 then
        for i = 1, #colors[pn] do
          pal(i, colors[pn][i], 1)
        end
      else
        for i = 1, #colors[pn] do
          pal(i + 8, colors[pn][i], 1)
        end
      end

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
  oprint("f: " .. nframe, 52, 0, pcol)
  oprint(models, 0, 8, pcol)
  oprint(cameras, 0, 16, pcol)
  oprint("t: " .. total_tris, 104, 0, pcol)

  oprint("eye: " .. eye[1] .. " " .. eye[2] .. " " .. eye[3], 0, 96, pcol)
  oprint("dir: " .. dir[1] .. " " .. dir[2] .. " " .. dir[3], 0, 104, pcol)
  oprint("up:  " .. up[1] .. " " .. up[2] .. " " .. up[3], 0, 112, pcol)
end
end

function spline_coord_katmulrom(v0, v1, v2, v3, p)
  --[[v0 *= 32
  v1 *= 32
  v2 *= 32
  v3 *= 32]]
  --local t2 = p * p
  --local t3 = t2 * p
  return ((p * p * p * (-1 * v0 + 3 * v1 - 3 * v2 + v3) +
    p * p * (2 * v0 - 5 * v1 + 4 * v2 - v3) +
    p * (-1 * v0 + v2) + 2 * v1) * 0.5) / 32
end

function spline(i, p)
  local d0, d1, d2, d3, i1, i2 = camera[cam_idx - 1], camera[cam_idx], camera[cam_idx + 1], camera[cam_idx + 2], i + 1, i + 2
  return {
    spline_coord_katmulrom(d0[i], d1[i], d2[i], d3[i], p),
    spline_coord_katmulrom(d0[i1], d1[i1], d2[i1], d3[i1], p),
    spline_coord_katmulrom(d0[i2], d1[i2], d2[i2], d3[i2], p)
  }
end

function spline_cam()
  if (camera[cam_idx - 1] == nil or camera[cam_idx] == nil or camera[cam_idx + 1] == nil or camera[cam_idx + 2] == nil or camera[cam_idx + 1][1] == -1) return
  local cframe = camera[cam_idx][1]
  local time = (nframe - cframe) / (camera[cam_idx + 1][1] - cframe)
  eye, dir, up = spline(2, time), normalize(spline(5, time)), normalize(spline(8, time))
end

function set_cam_idx()
  for c = 1, #camera do
    if camera[c][1] ~= -1 and nframe >= camera[c][1] then
      cam_idx = c
    end
  end
end
