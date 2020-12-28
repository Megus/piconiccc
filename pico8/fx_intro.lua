function fx_intro()
  print("hello people", 0, 0, 7)
  memcpy(0x4300, 0x6000, 512)

return function()
  wait_sync()
end,

function ()

end,

function ()
  print(peek(0x4300), 0, 0, 7)
  --line(0, 0, 100, 100, 7)
end

end