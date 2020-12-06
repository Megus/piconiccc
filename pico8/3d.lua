v2d = {}

-- Projection matrix
znear, zfar = 0.5, 20
sc = 64
--sc = 10

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

function z_clip_line(p1x,p1y,p1z,p2x,p2y,p2z,clip)
	local alpha = (p1z-clip)/(p1z-p2z)
	return lerp(p1x,p2x,alpha),lerp(p1y,p2y,alpha),lerp(p1z,p2z,alpha)
end

function lerp(a,b,alpha)
	return a + (b - a) * alpha
	--return a*(1.0-alpha)+b*alpha
end


function m3d(obj, eye, dir, up)
	-- Camera matrix
	local xaxis = normalize(cross(dir, up))
	local yaxis = cross(xaxis, dir)
	local m = {
		xaxis[1], xaxis[2], xaxis[3], -dot(xaxis, eye),
		yaxis[1], yaxis[2], yaxis[3], -dot(yaxis, eye),
		dir[1], dir[2], dir[3], -dot(dir, eye),
		0, 0, 0, 1
	}

	local sorted = {}

	-- Tranform all objects
	for c = 1, #obj.v do
		local v = obj.v[c]
		local v1, v2, v3 = v[1], v[2], v[3]
		local x, y, z = m[1]*v1+m[2]*v2+m[3]*v3+m[4], m[5]*v1+m[6]*v2+m[7]*v3+m[8], m[9]*v1+m[10]*v2+m[11]*v3+m[12]
		v2d[c] = {x, y, z, 64 - sc * x / z, 64 - sc * y /z }
	end

	for tri in all(obj.f) do
		local p1, p2, p3 = v2d[tri[2]], v2d[tri[3]], v2d[tri[4]]
		local p1x,p1y,p1z=p1[1],p1[2],p1[3]
		local p2x,p2y,p2z=p2[1],p2[2],p2[3]
		local p3x,p3y,p3z=p3[1],p3[2],p3[3]

		local cx = .1*(p1x+p2x+p3x)/3
		local cy = .1*(p1y+p2y+p3y)/3
		local cz = .1*(p1z+p2z+p3z)/3
		local z_paint = -cx*cx-cy*cy-cz*cz

		if p1z < zfar or p2z < zfar or p3z < zfar then
			if p1z > znear and p2z > znear and p3z > znear then
				-- Back-culling only
				local s1x,s1y = p1[4],p1[5]
				local s2x,s2y = p2[4],p2[5]
				local s3x,s3y = p3[4],p3[5]

				if (s2x-s1x)*(s3y-s1y)-(s2y-s1y)*(s3x-s1x) > 0 then
					add(sorted, {z_paint, s1x, s1y, s2x, s2y, s3x, s3y, tri[1] + 0x1000.a5a5})
				end
			elseif p1z > znear or p2z > znear or p3z > znear then
				-- Clipping
				if (p1z<p2z) p1z,p2z = p2z,p1z p1x,p2x = p2x,p1x p1y,p2y = p2y,p1y
				if (p1z<p3z) p1z,p3z = p3z,p1z p1x,p3x = p3x,p1x p1y,p3y = p3y,p1y
				if (p2z<p3z) p2z,p3z = p3z,p2z p2x,p3x = p3x,p2x p2y,p3y = p3y,p2y

				if p1z > znear and p2z > znear then
					-- 4 points
					local n2x,n2y,n2z = z_clip_line(p2x,p2y,p2z,p3x,p3y,p3z,znear)
					local n3x,n3y,n3z = z_clip_line(p1x,p1y,p1z,p3x,p3y,p3z,znear)

					local s1x,s1y = 64 - sc * p1x / p1z, 64 - sc * p1y / p1z
					local s2x,s2y = 64 - sc * p2x / p2z, 64 - sc * p2y / p2z
					local s3x,s3y = 64 - sc * n2x / n2z, 64 - sc * n2y / n2z
					local s4x,s4y = 64 - sc * n3x / n3z, 64 - sc * n3y / n3z

					add(sorted, {z_paint, s1x, s1y, s2x, s2y, s4x, s4y, tri[1] + 0x1000.a5a5})
					add(sorted, {z_paint, s2x, s2y, s4x, s4y, s3x, s3y, tri[1] + 0x1000.a5a5})
				else
					-- 3 points
					local n1x,n1y,n1z = z_clip_line(p1x,p1y,p1z,p2x,p2y,p2z,znear)
					local n2x,n2y,n2z = z_clip_line(p1x,p1y,p1z,p3x,p3y,p3z,znear)

					local s1x,s1y = 64 - sc * p1x / p1z, 64 - sc * p1y / p1z
					local s2x,s2y = 64 - sc * n1x / n1z, 64 - sc * n1y / n1z
					local s3x,s3y = 64 - sc * n2x / n2z, 64 - sc * n2y / n2z

					add(sorted, {z_paint, s1x, s1y, s2x, s2y, s3x, s3y, tri[1] + 0x1000.a5a5})
				end
			end
		end
	end

	-- Sort faces and draw them
	radix_sort(sorted, 8, 1, #sorted)
	for tri in all(sorted) do
		triangle(tri[2], tri[3], tri[4], tri[5], tri[6], tri[7], tri[8])
	end
end
