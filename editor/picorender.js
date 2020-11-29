'use strict';

function m3d_shaded(objects, eye, dir, up) {
  const pnear = 1;
  const pfar = 2;
  const rangeInv = 1 / (pnear - pfar);
  const sc = 81.3;
  const fov = 180 * Math.PI / 180;
  var projection_matrix = [
    fov, 0, 0, 0,
    0, fov, 0, 0,
    0, 0, (pnear+pfar)*rangeInv, -1,
    0, 0, pnear*pfar*rangeInv*2, 0
  ];

  // Calculate camera matrix
	const zaxis = normalize(dir);
	const xaxis = normalize(cross(zaxis, up));
	const yaxis = cross(xaxis, zaxis);
  const camMatrix = [
		xaxis[0], xaxis[1], xaxis[2], -dot(xaxis, eye),
		yaxis[0], yaxis[1], yaxis[2], -dot(yaxis, eye),
		zaxis[0], zaxis[1], zaxis[2], -dot(zaxis, eye),
		0, 0, 0, 1
  ];
	const m = mmult(projection_matrix, camMatrix);

  const sorted = [];

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

    obj.f.forEach((poly) => {
      const p1 = v2d[poly[1] - 1];
      const p2 = v2d[poly[2] - 1];
      const p3 = v2d[poly[3] - 1];
      let p4;
      if (poly.length == 5) {
        p4 = v2d[poly[4] - 1];
      }
      // (inrange(p1) && inrange(p2) && inrange(p3)) && 
      if (is_cw(p1, p2, p3)) {
        //const pv3 = normal(p1, p2, p3)[2]
        //local light = min(256, flr(1 + 255 * abs(pv3)))
        sorted.push([(Math.min(Math.min(p1[2], p2[2]), p3[2])), poly[0], p1, p2, p3, p4]);
      }
    });
  });

  // Sort faces and draw them
  sorted.sort((a, b) => a[0] - b[0]);

  return sorted;
}

function drawPicoFrame(ctx) {
 
  let models_render = [];
  for (let m in models) {
    //if (models[m].fstart <= frameNumber && models[m].fend > frameNumber) {
      models_render.push(models[m]);
    //}
  }
  const polys = m3d_shaded(
    models_render,
    picoEye, picoDir, picoUp
  );

  polys.forEach((poly) => {
    const p1 = poly[2];
    const p2 = poly[3];
    const p3 = poly[4];
    const p4 = poly[5];

    ctx.fillStyle = poly[1];
    ctx.strokeStyle = poly[1];
    ctx.beginPath();
    ctx.moveTo(p1[4] * 4, p1[5] * 4);
    ctx.lineTo(p2[4] * 4, p2[5] * 4);
    ctx.lineTo(p3[4] * 4, p3[5] * 4);
    if (p4 != null) ctx.lineTo(p4[4] * 4, p4[5] * 4);
    ctx.closePath();
	if (wireframe == 0) {
		ctx.fill();
	}
    ctx.stroke();
 });
}