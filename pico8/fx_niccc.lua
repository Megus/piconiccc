function fx_niccc()

nframe,dframe,triangle=0,0,eg_triangle
pal(0,0,1)
pal(8,0,1)
local cg,lp=0,true

return function()
	local omt=ptn
	while loop_sync() do
		nframe+=0.4
		if (ptn~=omt and ptn%2==0) cg=8
		omt=ptn
	end
	lp,cg=false,8
	wait_sync()
end,

function()
	if (lp) cg=max(cg-0.3,0)
	dframe+=1
end,
function()
	if (lp) cls(0)
	camera(flr(rnd(cg)-cg/2),0)
	if (lp) draw3d()
	if (cg>0) then
		local n=rnd(30)+10
		for c=1,n do
			local y=flr(rnd(119))+1
			memcpy(0x6000+y*64+flr(rnd(cg)-cg/2),0x6000+y*64,128*flr(rnd(4)+1))
		end
	end
end,
-1
end

function draw3d(usepals)
	local oldcam
	for c=1,#renderlist,2 do
		local model=objects[renderlist[c]]
		if model.fstart<=nframe and model.fend>nframe then
			cam = campath[renderlist[c + 1]]

			if usepals~=false then
				local pn=model.pal
				local padd=(pn&1==1) and 0 or 8
				for i=1,#colors[pn] do
					pal(i+padd,colors[pn][i],1)
				end
			end

			if oldcam~=cam then
				for d=1,#cam do
					if cam[d][1]~=-1 and nframe>=cam[d][1] then
						cam_idx=d
					end
				end

				local cframe=cam[cam_idx][1]
				local t=(nframe-cframe)/(cam[cam_idx+1][1]-cframe)
				eye,dir,up=spline(2,t),normalize(spline(5,t)),normalize(spline(8,t))
			end
			oldcam=cam

			local srt=modelsort[renderlist[c]]
			if renderlist[c]=="rotorin" then
				m3d(model,eye,dir,up,srt[1],srt[2],srt[3],-dframe/150)
			else
				m3d(model,eye,dir,up,srt[1],srt[2],srt[3])
			end
		end
	end
end

function spline_kmr(v0,v1,v2,v3,p)
	return (p*p*p*(3*v1-3*v2+v3-v0)+p*p*(2*v0-5*v1+4*v2-v3)+p*(v2-v0)+2*v1)*0.5
end

function spline(i,p)
	local d0,d1,d2,d3,i1,i2=cam[cam_idx-1],cam[cam_idx],cam[cam_idx+1],cam[cam_idx+2],i+1,i+2
	return {spline_kmr(d0[i],d1[i],d2[i],d3[i],p),spline_kmr(d0[i1],d1[i1],d2[i1],d3[i1],p),spline_kmr(d0[i2],d1[i2],d2[i2],d3[i2],p)}
end

modelsort = {
	oxygenein={max,1,0x.1},
	O={min,1,0x.02},
	X={max,1,0x.02},
	Y={min,1,0x.01},
	G={min,1,0x.04},
	E={min,2,0x.04},
	N={min,2,0x.04},
	E1={min,1,0x.02},
	cubes={max,2,0x.1},
	cubes2={max,2,0x.1},
	room={max,2,0x.08},
	tonnel5={max,1,0x.8},
	arch2={max,2,0x.2},
	arch1={max,2,0x.4},
	tonnel4={max,1,0x.8},
	rotor={max,0x.8,0x.04},
	rotorin={max,0x.8,0x.01},
	tonnel3={max,2,0x.4},
	tonnel2={max,1,0x.04},
	tonnel1={max,4,0x.01},
	tonnel0={max,4,0x.01}
}