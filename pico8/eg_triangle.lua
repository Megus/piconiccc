function triangle(x1,y1,x2,y2,x3,y3,color)
  local x1,x2,y1,y2,x3,y3=x1 & 0xffff,x2 & 0xffff,y1 & 0xffff,y2 & 0xffff,x3 & 0xffff,y3 & 0xffff
  local nsx,nex,min_y

	if (y1 > y2) y1, y2, x1, x2 = y2, y1, x2, x1
	if (y1 > y3) y1, y3, x1, x3 = y3, y1, x3, x1
	if (y2 > y3) y2, y3, x2, x3 = y3, y2, x3, x2

  if y1 ~= y2 then
    local delta_sx,delta_ex=(x3-x1)/(y3-y1),(x2-x1)/(y2-y1)

    if y1 > 0 then
      nsx,nex,min_y = x1,x1,y1
    else --top edge clip
      nsx,nex,min_y = x1-delta_sx*y1,x1-delta_ex*y1, 0
    end

    local max_y=min(y2,128)-1
    for y=min_y,max_y do
      rectfill(nsx,y,nex,y,color)
      nsx+=delta_sx
      nex+=delta_ex
    end
  else --where top edge is horizontal
    nsx,nex=x1,x2
  end

  if y3 ~= y2 then
    local delta_sx,delta_ex=(x3-x1)/(y3-y1),(x3-x2)/(y3-y2)

    min_y=y2
    local max_y=min(y3,127)
    if y2 < 0 then
      nex,nsx,min_y=x2-delta_ex*y2,x1-delta_sx*y1,0
    end

    for y=min_y,max_y do
      rectfill(nsx,y,nex,y,color)
      nex+=delta_ex
      nsx+=delta_sx
    end
  else --where bottom edge is horizontal
    rectfill(nsx,y3,nex,y3,color)
  end
end
