function fx_landscape()
	pal({129,1,133,5,134,6,7},1)
	local a1,a2,a3,t1,t2,t3,land,my=20,37,43,300,353,221,{},{}

	for c=1,32 do
		add(land,{})
		for d=1,32 do
			add(land[c],0)
		end
	end
	for c=1,128 do
		add(my,0)
	end

return function()
	while true do
		wait_frames(60)
		a1,a2,a3,t1,t2,t3=rnd(40)+10,rnd(30)+10,rnd(20)+5,rnd(200)+100,rnd(200)+100,rnd(200)+100
	end
end,

function()
	for c=1,32 do
		for d=1,32 do
			land[c][d]=sin(c/a1+sin(frame/t1))+cos(d/a2+sin(frame/t2))+sin(d/a3+cos(frame/t3))*0.7
		end
	end
end,

function()
	if (frame==0) cls(4)
	if (frame==1) cls(3)
	for c=1,128 do
		my[c]=128
	end
	for c=32,1,-1 do
		for d=1,32 do
			local x,y=c*4-d*3+32,d*2+c/2+32-land[c][d]*20
			if x>=0 and x<128 then
				if my[x+1]>y then
					pset(x,y,min(7,flr((c+d)/6)))
					my[x+1]=y
				end
			end
		end
	end
end

end