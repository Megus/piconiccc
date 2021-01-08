function fx_logo()
  local nl,gl,gli,gll,fi,fpal=0,0,1,{1,48,96,108,114},1,{7,6,134,5,133,1,128,0}
return function()
  while loop_frames(30) do
    nl+=2
  end
  wait_sync()
  while loop_sync() do
    if frame==gll[gli] then
      gl=10
      gli+=1
    end
  end
end,
function ()
  fi,gl=min(fi+0.5,#fpal),max(gl-1,0)
end,
function ()
  pal(0,fpal[flr(fi)],1)
  cls(0)
  for y = 64-nl,62+nl do
    memcpy(0x6000+y*64+flr(rnd(gl)-gl/2),y*64,64)
  end
end,
-1
end