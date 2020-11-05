'use strict';

let frameNumber = 0

function init() {
  window.requestAnimationFrame(drawFrame);
}

function drawFrame(time) {
  const canvas = document.getElementById("visuals")
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;

  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, width, height);

  drawScene1Frame(ctx);
  //drawPicoFrame(ctx);

  frameNumber = Math.floor((time / (1000 / 15))) % frames.length;
  picoEye[0] += 0.005;

  window.requestAnimationFrame(drawFrame);
}