function fx_fade(c1,c2,dots)
if (c1~=-1) cls(c1)
return function()
  wait_sync()
end,
function()
end,
function()
  for c=1,dots do
    pset(rnd(128),rnd(128),c2)
  end
end,
-1

end