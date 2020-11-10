local M = {}

local scale = 1.5625
local xOffset = (256 / scale - 128) / 2

M.data = {} -- We'll have frames here

-- Scale down resolution
function M.scale()
  for _, frame in ipairs(M.data.frames) do
    if frame.vertices ~= nil then
      -- Frame with indexed vertices
      for c = 1, #frame.vertices do
        local x = math.floor(frame.vertices[c].x / scale - xOffset)
        local y = math.floor(frame.vertices[c].y / scale)
        frame.vertices[c] = { x, y }
      end
    else
      -- Frame with coordinates
      for c = 1, #frame.polys do
        for d = 2, #frame.polys[c] do
          local x = math.floor(frame.polys[c][d].x / scale - xOffset)
          local y = math.floor(frame.polys[c][d].y / scale)
          frame.polys[c][d] = { x, y }
        end
      end
    end
  end
end

function M.removeInvisible()
  local maxLines = 0

  local removedPolys = 0
  local removedVertices = 0
  for _, frame in ipairs(M.data.frames) do

    -- Count max lines (for Vectrex)
    local frameLines = 0
    for c = 1, #frame.polys do
      frameLines = frameLines + #frame.polys[c] - 1
    end

    if frameLines > maxLines then
      maxLines = frameLines
    end

    local toDelete = {}
    -- Find invisible polys
    for c = 1, #frame.polys do
      local isOffscreen = true
      for d = 2, #frame.polys[c] do
        local x
        if frame.vertices ~= nil then
          x = frame.vertices[frame.polys[c][d]][1]
        else
          x = frame.polys[c][d][1]
        end
        if x >= 0 and x <= 127 then
          isOffscreen = false
          break
        end
      end
      if isOffscreen == true then
        table.insert(toDelete, c)
        removedPolys = removedPolys + 1
      end
    end

    -- Remove invisible polys
    for d = #toDelete, 1, -1 do
      table.remove(frame.polys, toDelete[d])
    end

    -- Check if there are now unused vertices in indexed polys and remove them too
    if frame.vertices ~= nil then
      local newVertices = {}
      local indices = {}
      local idx = 1
      for c = 1, #frame.vertices do
        table.insert(indices, idx)
        -- Check if this vertex is used
        local isUsed = false
        for d = 1, #frame.polys do
          for e = 2, #frame.polys[d] do
            if frame.polys[d][e] == c then
              isUsed = true
              break
            end
          end
          if isUsed == true then
            break
          end
        end
        if isUsed == true then
          idx = idx + 1
          table.insert(newVertices, frame.vertices[c])
        else
          removedVertices = removedVertices + 1
        end
      end

      frame.vertices = newVertices

      -- Remap vertices in polys
      for c = 1, #frame.polys do
        for d = 2, #frame.polys[c] do
          frame.polys[c][d] = indices[frame.polys[c][d]]
        end
      end
    end
  end
  print("Removed polys: " .. removedPolys)
  print("Removed vertices: " .. removedVertices)
  print("Max lines: " .. maxLines)
end

function M.deltaIndexedPolys()
  M.data.patterns = {}

  for i, frame in ipairs(M.data.frames) do
    if i % 100 == 0 then print("Delta for frame " .. i) end
    if frame.vertices ~= nil then
      for c = 1, #frame.polys do
        local delta = { 1 }
        for d = 3, #frame.polys[c] do
          table.insert(delta, frame.polys[c][d] - frame.polys[c][d - 1])
        end
        -- Search this pattern in the pattern list
        local idx = 0
        for d = 1, #M.data.patterns do
          local found = true
          for i = 2, #M.data.patterns[d] do
            if M.data.patterns[d][i] ~= delta[i] then
              found = false
              break
            end
          end
          if found == true then
            idx = d
            break
          end
        end

        if idx == 0 then
          table.insert(M.data.patterns, delta)
          idx = #M.data.patterns
        else
          M.data.patterns[idx][1] = M.data.patterns[idx][1] + 1
        end

        frame.polys[c] = { frame.polys[c][1], frame.polys[c][2], idx }
      end
    end
  end
  print("Number of poly patterns: " .. #M.data.patterns)
end


function M.cleanup()
  for i, frame in ipairs(M.data.frames) do
    frame.palette = nil
  end
end


return M