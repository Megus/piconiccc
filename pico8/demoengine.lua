sc_idx,mfx_idx,ptn,otick=1,1,0,0

function loop_int(r)
	yield()
	frame+=1
	if (not r) frame=0
	return r
end

function loop_frames(frames)
	return loop_int(frame<=frames)
end

function wait_frames(frames)
	while loop_frames(frames) do end
end

function loop_sync()
	local r=mfx_time<scenario[sc_idx]
	if (not r) sc_idx+=1
	return loop_int(r)
end

function wait_sync()
	while loop_sync() do end
end

function next_fx()
	pal()
	fx_coupdate,fx_update,fx_draw,fx_bg=scenario[sc_idx]()
	fx_coupdate,frame=cocreate(fx_coupdate),-1
	sc_idx+=1
end

function toggle_loop(a)
	poke(a,bxor(peek(a),0x80))
end

function _update60()
	local tick = stat(26)
	if (tick<otick) ptn+=1
	otick=tick
	mfx_time=ptn+tick/4096

	if mfx_time>=mfx_scenario[mfx_idx] then
		local cmd=mfx_scenario[mfx_idx+1]
		mfx_idx+=2
		if band(cmd,0x0.8)==0 then
			poke4(0x5f40,cmd)
		else
			toggle_loop(mfx_l1)
			toggle_loop(mfx_l2)
			mfx_l1,mfx_l2=0x3100+band(cmd,0x3f00)/64,0x3101+band(cmd,0x3f)*4
			toggle_loop(mfx_l1)
			toggle_loop(mfx_l2)
		end
	end

	if (not coresume(fx_coupdate)) next_fx()
	fx_update()
end

function _draw()
	if (fx_bg~=-1) cls(fx_bg or 0)
	fx_draw()
	oprint(ptn,0,0,15)
end
