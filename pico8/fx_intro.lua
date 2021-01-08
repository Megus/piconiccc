function fx_intro()

	local dots,fr,fl={},0,false
	pal({129,130,1,131,141,140,12},1)

return function()
	wait_frames(4)
	add_text(dots,"this is",22,11,fr)
	wait_frames(100)
	add_text(dots,"not your",16,32,fr)
	wait_frames(100)
	add_text(dots,"regular",22,53,fr)
	wait_frames(100)
	add_text(dots,"stniccc",22,74,fr)
	wait_frames(100)
	add_text(dots,"clone",34,95,fr)
	wait_sync()
	fl=true
	wait_sync()
end,

function ()
	fr+=1
end,

function ()
	if fl then
		cls(15)
		fl=false
	end
	for c=1,#dots do
		local t=max(0,(dots[c][3]-fr)/3)
		local x,y,col=dots[c][1]+t*sin(t/17)+rnd(t/3),dots[c][2]+t*cos(t/20)+rnd(t/2),7-(t/10)
		rectfill(x,y,x+1,y+1,(col<1) and 1 or flr(col))
	end
end,
1
end