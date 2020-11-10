'use strict';

function normalize(v) {
  const x = v[0];
  const y = v[1];
  const z = v[2];
	const len = Math.sqrt(x * x + y * y + z * z);
	return [x / len, y / len, z / len];
}

function cross(v1, v2) {
	return [v1[1] * v2[2] - v1[2] * v2[1], v1[2] * v2[0] - v1[0] * v2[2], v1[0] * v2[1] - v1[1] * v2[0]];
}

function dot(v1, v2) {
	return v1[0]*v2[0] + v1[1]*v2[1] + v1[2]*v2[2];
}

function is_cw(p1, p2, p3) {
	return (p2[0]-p1[0])*(p3[1]-p1[1])-(p2[1]-p1[1])*(p3[0]-p1[0])>0;
}

/*
function normal(p1, p2, p3)
	local w1,w2,w3 = p1[4],p2[4],p3[4]
	local x1,y1,z1,x2,y2,z2,x3,y3,z3 = p1[1]*w1,p1[2]*w1,p1[3]*w1,p2[1]*w2,p2[2]*w2,p2[3]*w2,p3[1]*w3,p3[2]*w3,p3[3]*w3
	local ux, uy, uz, vx, vy, vz = x2-x1,y2-y1,z2-z1,x3-x1,y3-y1,z3-z1
	local x, y, z = uy * vz - uz * vy, uz * vx - ux * vz, ux * vy - uy * vx
	local len = sqrt(x*x+y*y+z*z)
	return (len < 0.001) and {0, 0, 0} or {x/len,y/len,z/len}
end
*/

function inrange(p) {
  const x = p[0];
  const y = p[1];
  const z = p[2];
  const w = p[3];
	return w < 0 && x > -1 && x < 1 && y > -1 && y < 1 && z > -1 && z < 1;
}

function mmult(m1, m2) {
	const r = [];
	for(let c = 0; c < 4; c++) {
		for(let d = 0; d < 4; d++) {
			let t = 0;
			for(let e = 0; e < 4; e++) {
				t += m1[c*4+e]*m2[e*4+d];
      }
      r.push(t);
    }
  }
	return r;
}