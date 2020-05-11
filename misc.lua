function oprint(str, x, y, col)
  color(0)
  for c = 0, 2 do
    for d = 0, 2 do
      cursor(x + c, y + d)
      print(str)
    end
  end
  cursor(x + 1, y + 1)
  color(col)
  print(str)
end