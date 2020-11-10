'use strict';

function drawScene1Frame(ctx) {
  const frame = frames[frameNumber];
  const scale = (128 / 200) * 4;
  const offset = (512 - 256 * scale) / 2;


  if (frame.vertices != null) {
    for (let c = 0; c < frame.polys.length; c++) {
      const poly = frame.polys[c];

      ctx.fillStyle = poly[0];  // Color
      ctx.strokeStyle = poly[0];  // Color
      ctx.beginPath();
      const vertex = frame.vertices[poly[1] - 1];
      ctx.moveTo(vertex[0] * scale + offset, vertex[1] * scale);

      for (let d = 2; d < poly.length; d++) {
        const vertex = frame.vertices[poly[d] - 1];
        ctx.lineTo(vertex[0] * scale + offset, vertex[1] * scale);
      }
      ctx.closePath();
      if (wireframe == 0) {
        ctx.fill();
      }
      ctx.stroke();
    }
  } else {
    for (let c = 0; c < frame.polys.length; c++) {
      const poly = frame.polys[c];

      ctx.fillStyle = poly[0];  // Color
      ctx.strokeStyle = poly[0];  // Color
      ctx.beginPath();
      ctx.moveTo(poly[1][0] * scale + offset, poly[1][1] * scale);

      for (let d = 2; d < poly.length; d++) {
        ctx.lineTo(poly[d][0] * scale + offset, poly[d][1] * scale);
      }
      ctx.closePath();
      if (wireframe == 0) {
        ctx.fill();
      }
      ctx.stroke();
    }
  }
}