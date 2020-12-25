function _init()
  poke(0x5f34, 1)
  poke(0x5f2d, 1)
  load_models()
  next_fx()
end
