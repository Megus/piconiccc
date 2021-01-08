greetz = "|greetz|||lexaloffle|oxygene|ate bit|hprg|mATTcURRENT|mayhem|fairlight|nuance|caroline|proxima|gasman|5711|razor1911|the sands|nedopc|offence|jumalauta|excess team|agenda|inversion|AND|ALL|dIhALT|visitors"

function fx_ending()
camera()
poke4(0x5f40,0)
memcpy(0x3100,emus,emusl)
memcpy(0x3420,esfx,esfxl)
music(0)
local fade,gr,dots,gframe,gp,gidx,ff={0,128,129,130,133,141,141,141,133,130,129,128},split(greetz,"|",false),{},300,1,1,0
nframe,dframe,triangle=225,0,striangle
pal({1,11,7,0x81,5,6,7},1)

return function()
	while gidx<#gr do
		wait_frames(240)
	end
	wait_frames(300)
	music(-1,8000)
	wait_frames(400)
	while loop_sync() do
		if (ff%240==0) break
	end
	cls()
	stop()
end,

function()
	ff+=1
	if (ff%240==0) nframe=rnd({0,225,350,420,570,690,750,1000,1200})
	gframe+=1
	dframe-=0.5
	nframe+=0.08
	if gframe >= 200 then
		gframe = 0
		if gp == 1 then
			gp,dots=0,{}
			local y=12
			if gidx<#gr then
				for c=gidx,min(gidx+3,#gr) do
					add_text(dots,gr[c],(132-#gr[c]*12)/2,y,0)
					y+=24
				end
				gidx+=4
			end
		else
			gp=1
		end
	end
end,

function()
	pal(1,fade[flr(ff%240/240*#fade)+1],1)
	draw3d(false)

	local dx={}
	for c=1,#dots do
		local x,y=dots[c][1],dots[c][2]
		if dx[y]==nil then
			local t=max(0,gframe-y)
			dx[y]=(gp==0) and (128-sease_elastic(t/100,128)) or sease_cubic(t/100,-160)
		end
		x+=dx[y]
		if x<128 and x>-3 then
			rectfill(x,y,x+2,y+2,3)
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

	--oprint("cpu: " ..stat(1), 0, -16, 3)
	--oprint(nframe, 64,-16,3)
	camera()
end
end