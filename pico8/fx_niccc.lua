function fx_niccc()

nframe = 173
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
    nframe += 0.5
  end
end,

function()
  total_tris = 0

  local models = "m: "
  local cameras = "c: "
  local oldcam
  for c = 1, #renderlist, 2 do
    local model = objects[renderlist[c]]
    if model.fstart <= nframe and model.fend > nframe then
      models = models .. renderlist[c] .. " "
      camera = campath[renderlist[c + 1]]
      cameras = cameras .. renderlist[c + 1] .. " "

      local pn = model.pal
      local padd = (pn & 1 == 1) and 0 or 8
      for i = 1, #colors[pn] do
        pal(i + padd, colors[pn][i], 1)
      end

      if oldcam ~= camera then
        set_cam_idx()
        spline_cam()
      end
      oldcam = camera

      local srt = modelsort[renderlist[c]]
      if renderlist[c] == "rotorin" then
        m3d(model, eye, dir, up, srt[1], srt[2], srt[3], -dframe / 150)
      else
        m3d(model, eye, dir, up, srt[1], srt[2], srt[3])
      end
    end
  end

  local pcol = 15
  oprint("cpu: " .. stat(1), 0, 0, pcol)
  oprint("f: " .. nframe, 52, 0, pcol)
  oprint(models, 0, 8, pcol)
  oprint(cameras, 0, 16, pcol)
  oprint("t: " .. total_tris, 104, 0, pcol)
end
end

function spline_coord_katmulrom(v0, v1, v2, v3, p)
  return (p * p * p * (3 * v1 - 3 * v2 + v3 - v0) +
    p * p * (2 * v0 - 5 * v1 + 4 * v2 - v3) +
    p * (v2 - v0) + 2 * v1) * 0.5
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

modelsort = {
  oxygenein = {max, 1, 0x.1},
  O = {min, 0x.8, 0x.02},
  X = {max, 0x.8, 0x.01},
  Y = {min, 1, 0x.01},
  G = {min, 1, 0x.08},
  E = {min, 1, 0x.1},
  N = {min, 1, 0x.08},
  E1 = {min, 1, 0x.1},
  cubes = {max, 2, 0x.1},
  cubes2 = {max, 2, 0x.1},
  room = {max, 2, 0x.08},
  tonnel5 = {max, 1, 0x.8},
  arch2 = {max, 2, 0x.2},
  arch1 = {max, 2, 0x.4},
  tonnel4 = {max, 1, 0x.8},
  rotor = {max, 0x.8, 0x.08},
  rotorin = {max, 0x.8, 0x.02},
  tonnel3 = {max, 2, 0x.4},
  tonnel2 = {max, 1, 0x.04},
  tonnel1 = {max, 4, 0x.01}
}