function triangle(x1, y1, x2, y2, x3, y3, col)
	if (min(x1, min(x2, x3)) > 127 or max(x1, max(x2, x3)) < 0 or min(y1, min(y2, y3)) > 127 or max(y1, max(y2, y3)) < 0) return

	if (y1 > y2) y1, y2, x1, x2 = y2, y1, x2, x1
	if (y1 > y3) y1, y3, x1, x3 = y3, y1, x3, x1
	if (y2 > y3) y2, y3, x2, x3 = y3, y2, x3, x2

	local dx1, tx1, tx2, dx2 = (x3 - x1) / (y3 - y1), x1, x1

	local function fill(y1, y2)
		for y = y1, min(y2, 127) do
			rectfill(tx1, y, tx2, y, col)
			tx1 += dx1
			tx2 += dx2
		end
	end

	if y2 > y1 then
		dx2 = (x2 - x1) / (y2 - y1)
		fill(y1, y2)
	end
	tx1, tx2, dx2 = x1 + (y2 - y1) * dx1, x2, (x3 - x2) / (y3 - y2)
	fill(y2, y3)
end
