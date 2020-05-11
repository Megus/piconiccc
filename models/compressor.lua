local M = {}

local function scaleVertices(vertices, range)
  local mins = {1000000, 1000000, 1000000}
  local maxs = {-1000000, -1000000, -1000000}
  local offsets = {0, 0, 0}
  local scales = {1, 1, 1}

  -- Find mins and maxs
  for _, v in ipairs(vertices) do
    for i = 1, 3 do
      if v[i] < mins[i] then
        mins[i] = v[i]
      elseif v[i] > maxs[i] then
        maxs[i] = v[i]
      end
    end
  end

  -- Mins go to offsets, calculate scales
  for i = 1, 3 do
    offsets[i] = mins[i]
    scales[i] = (maxs[i] - mins[i]) / (range - 1)
  end

  -- Move and scale vertices
  for _, v in ipairs(vertices) do
    for i = 1, 3 do
      v[i] = math.floor((v[i] - mins[i]) / scales[i])
    end
  end

  return offsets, scales
end


function M.compress(objs)
  for name, obj in pairs(objs) do
    -- Scale vertices
    local offsets, scales = scaleVertices(obj.v, 128)
    obj.o = offsets
    obj.s = scales
  end
end

return M