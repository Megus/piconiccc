function fx_fade(c1,c2)
if (c1~=-1) cls(c1)
return function()
  wait_sync()
end,
function()
end,
function()
  for c=1,600 do
    pset(rnd(128),rnd(128),c2)
  end
end,
-1

end