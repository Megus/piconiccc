'use strict';

let frameNumberStart = 0;
let frameNumber = 0;
let isPlay = 0;
let prevFrame = 0;
let wireframe = 0;

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
  
  const canvas3d = document.getElementById("visuals3d")
  const ctx3d = canvas3d.getContext("2d");
  const width3d = canvas3d.width;
  const height3d = canvas3d.width;
  
  ctx3d.fillStyle = "#000000";
  ctx3d.fillRect(0, 0, width3d, height3d);

  drawPicoFrame(ctx3d);
  
  //test
  picoAngle += 1.5;
  
  if (isPlay) {
    if (frameNumber < frames.length - 1) {
      let nowFrame = Math.floor((time / (1000 / 15))) % frames.length;
      if (nowFrame != prevFrame) {
        prevFrame = nowFrame;
        frameNumber++;
      }
    }
    document.getElementById('frame').value = frameNumber;
  }

  window.requestAnimationFrame(drawFrame);
}

function plPlay() {
  frameNumber = frameNumberStart;
  isPlay = 1;
}

function plStop() {
  isPlay = 0;
}

function plChange(num) {
  frameNumber = (frameNumber + num) % frames.length;
  document.getElementById('frame').value = frameNumber;
}

function plSet(num) {
  frameNumberStart = parseInt(0 + num) % frames.length;
  frameNumber = frameNumberStart;
  document.getElementById('frame').value = frameNumber;
}

function plWireframe() {
  wireframe ^= 1;
}