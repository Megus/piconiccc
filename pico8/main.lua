function _init()
  decompress()
  create_lighting()
  poke(0x5f34, 1)
  poke(0x5f2d, 1)

  eye = {4, -13, -14}
  dir = {0, 0.8, 0.7}
  angle = 0
  speed = 0.1
end

function _update()
  if btn(0) then
    eye[1] -= speed
  elseif btn(1) then
    eye[1] += speed
  elseif btn(2) then
    eye[2] += speed
  elseif btn(3) then
    eye[2] -= speed
  elseif btn(4) then
    eye[3] -= speed
  elseif btn(5) then
    eye[3] += speed
  end

  --dir[1] = (stat(32) - 64) / 256
  --dir[2] = (64 - stat(33)) / 128

end

function _draw()
  cls()
  m3d_shaded({
    objects["rotor"],
  }, eye, dir, angle)

  oprint(stat(1), 0, 0, 7)
  oprint(eye[1]..","..eye[2]..","..eye[3], 0, 8, 7)
end

