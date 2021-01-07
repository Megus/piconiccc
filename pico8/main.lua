function _init()
	poke(0x5f34, 1)
	poke(0x5f2d, 1)
	pal({129},1)
	load_data()
	music(0)
	next_fx()
end
