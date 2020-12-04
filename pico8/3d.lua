v2d = {}

-- Projection matrix
pnear, pfar = 1, 200
rangeInv = 1 / (pnear - pfar)
sc = 100
projection_matrix = {
	1, 0, 0, 0,
	0, 1, 0, 0,
	0, 0, (pnear+pfar)*rangeInv, -1,
	0, 0, pnear*pfar*rangeInv*2, 0
}

function normalize(v)
	local x,y,z = v[1],v[2],v[3]
	local len = sqrt(x*x+y*y+z*z)
	return {x/len,y/len,z/len}
end

function cross(v1, v2)
	local x1,y1,z1,x2,y2,z2 = v1[1],v1[2],v1[3],v2[1],v2[2],v2[3]
	return {y1*z2-z1*y2, z1*x2-x1*z2, x1*y2-y1*x2}
end

function dot(v1, v2)
	return v1[1]*v2[1] + v1[2]*v2[2] + v1[3]*v2[3]
end

function is_cw(p1, p2, p3)
	return (p2[1]-p1[1])*(p3[2]-p1[2])-(p2[2]-p1[2])*(p3[1]-p1[1])>0
end

function normal(p1, p2, p3)
	local w1,w2,w3 = p1[4],p2[4],p3[4]
	local x1,y1,z1,x2,y2,z2,x3,y3,z3 = p1[1]*w1,p1[2]*w1,p1[3]*w1,p2[1]*w2,p2[2]*w2,p2[3]*w2,p3[1]*w3,p3[2]*w3,p3[3]*w3
	local ux, uy, uz, vx, vy, vz = x2-x1,y2-y1,z2-z1,x3-x1,y3-y1,z3-z1
	local x, y, z = uy * vz - uz * vy, uz * vx - ux * vz, ux * vy - uy * vx
	local len = sqrt(x*x+y*y+z*z)
	return (len < 0.001) and {0, 0, 0} or {x/len,y/len,z/len}
end

function inrange(p)
	local x,y,z,w = p[1], p[2], p[3], p[4]
	return w < 0 and x > -1 and x < 1 and y > -1 and y < 1 and z > -1 and z < 1
end

function mmult(m1, m2)
	local r = {}
	for c = 0, 3 do
		for d = 0, 3 do
			local t = 0
			for e = 0, 3 do
				t += m1[c*4+e+1]*m2[e*4+d+1]
			end
			add(r, t)
		end
	end
	return r
end

function radix_sort(arr, mask, idx1, idx2)
	local c, rb = idx1, idx2 + 1
	while c < rb do
		if band(arr[c][1], mask) ~= 0 then
			repeat
				rb -= 1
				if (rb == c) break
			until band(arr[rb][1], mask) == 0
			arr[c], arr[rb] = arr[rb], arr[c]
		end
		c += 1
	end
	if mask >= 0x0.08 then
		mask /= 2
		if (rb - 1 > idx1) radix_sort(arr, mask, idx1, rb - 1)
		if (rb < idx2) radix_sort(arr, mask, rb, idx2)
	end
end

function m3d_shaded(objects, eye, zaxis, up)
	-- Calculate camera matrix
	--local zaxis = normalize(dir)
	local xaxis = normalize(cross(zaxis, up))
	local yaxis = cross(xaxis, zaxis)
	local m = mmult(projection_matrix, {
		xaxis[1], xaxis[2], xaxis[3], -dot(xaxis, eye),
		yaxis[1], yaxis[2], yaxis[3], -dot(yaxis, eye),
		zaxis[1], zaxis[2], zaxis[3], -dot(zaxis, eye),
		0, 0, 0, 1
	})

	local sorted = {}

	-- Tranform all objects
	for obj in all(objects) do
		for c = 1, #obj.v do
			local v = obj.v[c]
			local v1, v2, v3 = v[1], v[2], v[3]
			local w = m[13]*v1+m[14]*v2+m[15]*v3+m[16]
			local x, y, z = (m[1]*v1+m[2]*v2+m[3]*v3+m[4]) / w, (m[5]*v1+m[6]*v2+m[7]*v3+m[8]) / w, (m[9]*v1+m[10]*v2+m[11]*v3+m[12]) / w
			v2d[c] = {x, y, z, w, 64 + sc * x, 64 + sc * y}
		end

		for tri in all(obj.f) do
			local p1, p2, p3 = v2d[tri[2]], v2d[tri[3]], v2d[tri[4]]
			if (inrange(p1) or inrange(p2) or inrange(p3)) and is_cw(p1, p2, p3) then
				add(sorted, {(min(min(p1[3], p2[3]), p3[3])), p1, p2, p3, tri[1] + 0x1000.a5a5})
			end
		end
	end

	-- Sort faces and draw them
	radix_sort(sorted, 2, 1, #sorted)
	for tri in all(sorted) do
		local p1, p2, p3 = tri[2], tri[3], tri[4]
		triangle(p1[5], p1[6], p2[5], p2[6], p3[5], p3[6], tri[5])
	end
end
