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

function m3d_shaded(objects, eye, dir, angle) {
  const pnear = 1;
  const pfar = 200;
  const rangeInv = 1 / (pnear - pfar);
  const sc = 100;
  const projection_matrix = [
    6, 0, 0, 0,
    0, 6, 0, 0,
    0, 0, (pnear+pfar)*rangeInv, -1,
    0, 0, pnear*pfar*rangeInv*2, 0
  ];

  // Calculate camera matrix
	const up = [Math.sin(angle), Math.cos(angle), 0];
	const zaxis = normalize(dir);
	const xaxis = normalize(cross(zaxis, up));
	const yaxis = cross(xaxis, zaxis);
	const m = mmult(projection_matrix, [
		xaxis[0], xaxis[1], xaxis[2], -dot(xaxis, eye),
		yaxis[0], yaxis[1], yaxis[2], -dot(yaxis, eye),
		zaxis[0], zaxis[1], zaxis[2], -dot(zaxis, eye),
		0, 0, 0, 1
  ]);

  const sorted = []

  // Tranform all objects
  objects.forEach((obj) => {
    const v2d = []

    obj.v.forEach((v) => {
      const v1 = v[0];
      const v2 = v[1];
      const v3 = v[2];
      const w = m[12]*v1+m[13]*v2+m[14]*v3+m[15];
      const x = (m[0]*v1+m[1]*v2+m[2]*v3+m[3]) / w;
      const y = (m[4]*v1+m[5]*v2+m[6]*v3+m[7]) / w;
      const z = (m[8]*v1+m[9]*v2+m[10]*v3+m[11]) / w;
			v2d.push([x, y, z, w, 64 + sc * x, 64 + sc * y]);
    });

    obj.f.forEach((tri) => {
      const p1 = v2d[tri[1] - 1];
      const p2 = v2d[tri[2] - 1];
      const p3 = v2d[tri[3] - 1];
			if ((inrange(p1) && inrange(p2) && inrange(p3)) && is_cw(p1, p2, p3)) {
				//const pv3 = normal(p1, p2, p3)[2]
				//local light = min(256, flr(1 + 255 * abs(pv3)))
				sorted.push([(Math.min(Math.min(p1[2], p2[2]), p3[2])), p1, p2, p3, tri[0]]);
      }
    });
  });

  // Sort faces and draw them
  sorted.sort((a, b) => a[0] - b[0]);

  return sorted;
}

let picoEye = [4, -13, -14];
let picoDir = [0, 0.8, 0.7];
let picoAngle = 0;


function drawPicoFrame(ctx) {
  const tris = m3d_shaded(
    [models["O"], models["X"], models["Y"], models["G"], models["E"], models["N"], models["E1"]],
    picoEye, picoDir, picoAngle
  );

	tris.forEach((tri) => {
    const p1 = tri[1];
    const p2 = tri[2];
    const p3 = tri[3];

    ctx.fillStyle = tri[4];
    ctx.strokeStyle = tri[4];
    ctx.beginPath();
    ctx.moveTo(p1[4] * 4, p1[5] * 4);
    ctx.lineTo(p2[4] * 4, p2[5] * 4);
    ctx.lineTo(p3[4] * 4, p3[5] * 4);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
 });
}