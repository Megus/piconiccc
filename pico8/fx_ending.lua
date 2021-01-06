greetz = "lexaloffle|ate bit|hprg|triad|mATTcURRENT|fairlight|nuance|proxima|serzhsoft|prosonix|5711|razor1911|the sands|offence|jumalauta|excess team|gemba|scoopex|outsiders|joker|sibcrew|q-bone|goblinish|gdc"

function fx_ending()

local fade,gr,dots,gframe,gp,gidx={0,0x81,1,0x84,4,0x8e,0x9f,0x9f,0x9f,0x8e,4,0x84,1,0x81},split(greetz,"|",false),{},300,1,1
nframe,dframe,triangle=200,0,striangle
pal({1,11,7,4,5,6,7},1)

return function()
	while true do
		nframe=200+flr(rnd(22))*50
		while loop_frames(180) do
			if gframe >= 300 then
				gframe = 0
				if gp == 1 then
					gp,dots=0,{}
					local y=12
					if gidx<#gr then
						for c=gidx,min(gidx+3,#gr) do
							add_text(dots,gr[c],(132-#gr[c]*12)/2,y,0)
							y+=24
						end
						gidx+=3
					end
				else
					gp=1
				end
			end
		end
	end
end,

function()
	gframe+=1
	dframe-=0.5
	nframe+=0.08
end,

function()
	pal(1,fade[flr(frame/180*#fade)+1],1)
	draw3d(false)

	local dx={}
	for c=1,#dots do
		local x,y=dots[c][1],dots[c][2]
		if dx[y]==nil then
			local t=max(0,gframe-y)
			dx[y]=(gp==0) and (128-sease_elastic(t/120,128)) or sease_cubic(t/120,-160)
		end
		x+=dx[y]
		if x<128 and x>-3 then
			rectfill(x-1,y-1,x+2,y+2,0)
			rectfill(x,y,x+1,y+1,3)
		end
	end

	camera(0,-16)
	oprint("CODE",6,96,2)
	oprint("mEGUS",4,104,3)
	oprint("3D",33,96,2)
	oprint("MODELS",43,96,2)
	oprint("tMk",44,104,3)
	oprint("MUSIC",76,96,2)
	oprint("N1K-O",76,104,3)
	oprint("GFX",108,96,2)
	oprint("dIVER",104,104,3)

	oprint("cpu: " ..stat(1), 0, -16, 3)
	camera()
end

end