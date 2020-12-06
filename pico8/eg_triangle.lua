function triangle( x1,y1,x2,y2,x3,y3,color1)
  if (min(x1, min(x2, x3)) > 127 or max(x1, max(x2, x3)) < 0 or min(y1, min(y2, y3)) > 127 or max(y1, max(y2, y3)) < 0) return
  local x1=band(x1,0xffff)
  local x2=band(x2,0xffff)
  local y1=band(y1,0xffff)
  local y2=band(y2,0xffff)
  local x3=band(x3,0xffff)
  local y3=band(y3,0xffff)

  local nsx,nex

	if (y1 > y2) y1, y2, x1, x2 = y2, y1, x2, x1
	if (y1 > y3) y1, y3, x1, x3 = y3, y1, x3, x1
	if (y2 > y3) y2, y3, x2, x3 = y3, y2, x3, x2

 if(y1!=y2)then
  local delta_sx=(x3-x1)/(y3-y1)
  local delta_ex=(x2-x1)/(y2-y1)

  if(y1>0)then
    nsx=x1
    nex=x1
    min_y=y1
  else --top edge clip
    nsx=x1-delta_sx*y1
    nex=x1-delta_ex*y1
    min_y=0
  end

  max_y=min(y2,128)

  for y=min_y,max_y-1 do

  rectfill(nsx,y,nex,y,color1)
  nsx+=delta_sx
  nex+=delta_ex
  end

else --where top edge is horizontal
  nsx=x1
  nex=x2
end

if(y3!=y2)then
  local delta_sx=(x3-x1)/(y3-y1)
  local delta_ex=(x3-x2)/(y3-y2)

  min_y=y2
  max_y=min(y3,128)
  if(y2<0)then
    nex=x2-delta_ex*y2
    nsx=x1-delta_sx*y1
    min_y=0
  end

   for y=min_y,max_y do

    rectfill(nsx,y,nex,y,color1)
    nex+=delta_ex
    nsx+=delta_sx
   end
else --where bottom edge is horizontal
  rectfill(nsx,y3,nex,y3,color1)
end

end
