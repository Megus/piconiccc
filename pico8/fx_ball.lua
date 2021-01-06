function fx_ball()
	pal()
	local gpal,sn,gmode,balls={1,5,6,15,10},15,2,{{o={0,0,0},a={1.6,0.91,0.4},g={}},{o={0,0,0},a={0.94,0.33,0.43},g={}}}

	local function pj(u,v,r,o)
		local y,r,s=cos(v/sn/2)+o[2],u/sn+r,sin(v/sn/2)
		local x,z=cos(r)*s+o[1],sin(r)*s+o[3]
		return 250*x/z+64,250*y/z-32,z
	end

	local function ag(g)
		local gg,u,v,u1,v1={},flr(rnd(sn)),flr(rnd(sn))
		for c=1,8 do
			u1,v1=u+flr(rnd(2)-1),v+flr(rnd(2)-1)
			add(gg,{u,v,u1,v1,6.9-c/1.5})
			u,v=u1,v1
		end
		add(g,gg)
	end

	for c=1,#balls do
		for d=1,12 do
			ag(balls[c].g)
		end
	end

return function()
	while(1) do
		gmode=2
		wait_frames(100)
		gmode=1
		wait_frames(32)
	end
	wait_sync()
end,

function()
	for c=1,#balls do
		local t=time()/4+c/3
		local b=balls[c]
		b.o={sin(t*b.a[1]),cos(t*b.a[2])+3,10+3*sin(t*b.a[3])}
		for g in all(b.g) do
			if rnd()<0.2 then
				for d=#g,2,-1 do
					g[d][4],g[d][3],g[d][2],g[d][1]=g[d-1][4],g[d-1][3],g[d-1][2],g[d-1][1]
				end
				g[1][1],g[1][2],g[1][3],g[1][4]=g[1][1]+flr(rnd(2)-1),g[1][2]+flr(rnd(2)-1),g[1][1],g[1][2]
			end
		end
	end
end,

function()
	local r=time()/5
	for c = 1, #balls do
		local b=balls[c]

		for d=1,#b.g do
			for e=1,#b.g[d] do
				local g=b.g[d][e]
				local x1,y1,z=pj(g[1],g[2],r,b.o)
				local x2,y2=pj(g[3],g[4],r,b.o)
				line(x1+rnd(2),y1-rnd(),x2-rnd(2),y2+rnd(),gpal[(z<b.o[3]) and (flr(g[5])+gmode-3) or 1])
			end
		end

		for v=1,sn-1 do
			for u=1,sn do
				local x,y,z = pj(u,v,r,b.o)
				if (z<b.o[3]) circfill(x, y, 1, c)
				pset(x,y,c+((gmode==1 or z>b.o[3]) and 0 or 11))
			end
		end
	end

	if gmode==1 then
		for c=1,frame do
			local y=flr(rnd(128))
			memcpy(0x6000+y*64,y*64,64)
		end
	end
end

end