function oprint(str,x,y,col)
	for c=0,2 do
		for d=0,2 do
			print(str,x+c,y+d,0)
		end
	end
	print(str,x+1,y+1,col)
end

function sease_elastic(t,scale)
	return scale*(2^(-10*t))*-sin(t-0.25)+scale
end

function sease_cubic(t,scale)
	return (t<0.5) and (scale*(t*2)^3/2) or (scale-scale*((1-t)*2)^3/2)
end

function add_text(dots,text,ox,oy,fr)
	cls()
	print(text,0,0,7)
	local f,a=fr+60,0x4300
	memset(a,0,512)
	memcpy(a,0x6000,512)
	for y=oy,oy+23,3 do
		for x=ox,ox+383,6 do
			local v=peek(a)
			if v&15~=0 then
				add(dots,{x,y,f+rnd(#text*20)})
				f+=1
			end
			if v&0xf0~=0 then
				add(dots,{x+3,y,f+rnd(#text*20)})
				f+=1
			end
			a+=1
		end
	end
end
