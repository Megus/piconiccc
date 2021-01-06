v2d,znear,zfar={},0.04,30

function normalize(v)
	local x,y,z=v[1],v[2],v[3]
	local len=sqrt(x*x+y*y+z*z)
	return {x/len,y/len,z/len}
end

function cross(v1,v2)
	local x1,y1,z1,x2,y2,z2=v1[1],v1[2],v1[3],v2[1],v2[2],v2[3]
	return {y1*z2-z1*y2,z1*x2-x1*z2,x1*y2-y1*x2}
end

function dot(v1,v2)
	return v1[1]*v2[1]+v1[2]*v2[2]+v1[3]*v2[3]
end

function mmult(m1,m2)
	local r={}
	for c=0,3 do
		for d=0,3 do
			local t=0
			for e=0,3 do
				t+=m1[c*4+e+1]*m2[e*4+d+1]
			end
			add(r,t)
		end
	end
	return r
end

function radix_sort(arr,mask,idx1,idx2,sortmin)
	local c,rb=idx1,idx2+1
	while c<rb do
		if arr[c][1]&mask~=0 then
			repeat
				rb-=1
				if (rb==c) break
			until arr[rb][1]&mask==0
			arr[c],arr[rb]=arr[rb],arr[c]
		end
		c+=1
	end
	if mask>=sortmin then
		mask/=2
		if (rb-1>idx1) radix_sort(arr,mask,idx1,rb-1,sortmin)
		if (rb<idx2) radix_sort(arr,mask,rb,idx2,sortmin)
	end
end

function z_clip_line(p1x,p1y,p1z,p2x,p2y,p2z,clip)
	local alpha=(p1z-clip)/(p1z-p2z)
	return lerp(p1x,p2x,alpha),lerp(p1y,p2y,alpha),lerp(p1z,p2z,alpha)
end

function lerp(a,b,alpha)
	return a+(b-a)*alpha
end

function m3d(obj,eye,dir,up,zp,sortmax,sortmin,angle)
	local xaxis=normalize(cross(dir,up))
	local yaxis=cross(xaxis,dir)
	local m={xaxis[1],xaxis[2],xaxis[3],-dot(xaxis,eye),yaxis[1],yaxis[2],yaxis[3],-dot(yaxis,eye),dir[1],dir[2],dir[3],-dot(dir,eye),0,0,0,1}
	if (angle~=nil) m=mmult(m,{cos(angle),0,sin(angle),0,0,1,0,0,-sin(angle),0,cos(angle),0,0,0,0,1})

	sorted={}

	for c=1,#obj.v do
		local v=obj.v[c]
		local v1,v2,v3=v[1],v[2],v[3]
		local x,y,z=m[1]*v1+m[2]*v2+m[3]*v3+m[4],m[5]*v1+m[6]*v2+m[7]*v3+m[8],m[9]*v1+m[10]*v2+m[11]*v3+m[12]
		v2d[c]={x,y,z,x/z,y/z}
	end

	for c=1,#obj.f do
		local tri=obj.f[c]
		local p1,p2,p3=v2d[tri[2]],v2d[tri[3]],v2d[tri[4]]
		local p1z,p2z,p3z=p1[3],p2[3],p3[3]
		local z_paint=-0.08*zp(p1z,zp(p2z,p3z))

		if p1z<zfar or p2z<zfar or p3z<zfar then
			if p1z>znear and p2z>znear and p3z>znear then
				local s1x,s1y,s2x,s2y,s3x,s3y=p1[4],p1[5],p2[4],p2[5],p3[4],p3[5]

				if (min(s1x,min(s2x,s3x))<1 and max(s1x,max(s2x,s3x))>=-1 and (s2x-s1x)*(s3y-s1y)-(s2y-s1y)*(s3x-s1x)>0) add(sorted,{z_paint,s1x,s1y,s2x,s2y,s3x,s3y,tri[1]})
			elseif p1z>znear or p2z>znear or p3z>znear then
				local p1x,p2x,p3x,p1y,p2y,p3y=p1[1],p2[1],p3[1],p1[2],p2[2],p3[2]
				if (p1z<p2z) p1z,p2z,p1x,p2x,p1y,p2y=p2z,p1z,p2x,p1x,p2y,p1y
				if (p1z<p3z) p1z,p3z,p1x,p3x,p1y,p3y=p3z,p1z,p3x,p1x,p3y,p1y
				if (p2z<p3z) p2z,p3z,p2x,p3x,p2y,p3y=p3z,p2z,p3x,p2x,p3y,p2y

				if p1z>znear and p2z>znear then
					local n2x,n2y,n2z=z_clip_line(p2x,p2y,p2z,p3x,p3y,p3z,znear)
					local n3x,n3y,n3z=z_clip_line(p1x,p1y,p1z,p3x,p3y,p3z,znear)

					local s1x,s2x,s3x,s4x,s2y,s4y=p1x/p1z,p2x/p2z,n2x/n2z,n3x/n3z,p2y/p2z,n3y/n3z

					if (min(s1x,min(s2x,s4x))<1 and max(s1x,max(s2x,s4x))>=-1) add(sorted,{z_paint,s1x,p1y/p1z,s2x,s2y,s4x,s4y,tri[1]})
					if (min(s4x,min(s2x,s3x))<1 and max(s4x,max(s2x,s3x))>=-1) add(sorted,{z_paint,s2x,s2y,s4x,s4y,s3x,n2y/n2z,tri[1]})
				else
					local n1x,n1y,n1z=z_clip_line(p1x,p1y,p1z,p2x,p2y,p2z,znear)
					local n2x,n2y,n2z=z_clip_line(p1x,p1y,p1z,p3x,p3y,p3z,znear)
					local s1x,s2x,s3x=p1x/p1z,n1x/n1z,n2x/n2z

					if (min(s1x,min(s2x,s3x))<1 and max(s1x,max(s2x,s3x))>=-1) add(sorted,{z_paint,s1x,p1y/p1z,s2x,n1y/n1z,s3x,n2y/n2z,tri[1]})
				end
			end
		end
	end

	radix_sort(sorted,sortmax,1,#sorted,sortmin)
	for c=1,#sorted do
		local tri=sorted[c]
		triangle(64-64*tri[2],64-64*tri[3],64-64*tri[4],64-64*tri[5],64-64*tri[6],64-64*tri[7],tri[8])
	end
end
