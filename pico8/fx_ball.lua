function fx_logo()

return function()
  wait_sync()
end,

function()

end,

function()
  line(0,0,100,100,7)
  spr(0, sin(frame / 30) * 10, cos(frame / 40) * 10, 16, 16)
end

end