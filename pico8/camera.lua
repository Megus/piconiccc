function spline_coord_katmulrom(v0, v1, v2, v3, p)
  local t2, t3 = p * p
  local t3 = t2 * p
  return (t3 * (-1 * v0 + 3 * v1 - 3 * v2 + v3) +
    t2 * (2 * v0 - 5 * v1 + 4 * v2 - v3) +
    p * (-1 * v0 + v2) + 2 * v1) * 0.5
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
  local time = (frame - cframe) / (camera[cam_idx + 1][1] - cframe)
  eye, dir, up = spline(2, time), normalize(spline(5, time)), normalize(spline(8, time))
end

function set_cam_idx()
  for c = 1, #camera do
    if camera[c][1] ~= -1 and frame >= camera[c][1] then
      cam_idx = c
    end
  end
end
