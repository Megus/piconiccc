'use strict';

let frameNumberStart = 0;
let frameNumber = 0;
let isPlay = 0;
let prevFrame = 0;
let wireframe = 0;
let isHover = 0;

function init() {
	
	// transform base model OXYGEN
  let a = 0.5;
  let nMult = [a, a, a, a, a, a, a, 0]
  let n = 0;
	for (var m in models) {
		for (var v in models[m]['v']) {
			models[m]['v'][v][0] = (models[m]['v'][v][0] - 4.5) + n * nMult[n] - 1.45;
			models[m]['v'][v][1] -= 0;
			models[m]['v'][v][2] += 1.565;
      models[m]['v'][v][1] *= 1.5;
      models[m]['v'][v][2] *= 1.05;
      
      
			models[m]['v'][v] = rotX(models[m]['v'][v], -90);
		}
    n++;
	}
	
	camSetLookAtDistRot([0,0,0], 8.70, 26, 14, -4.5);
	

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
  
  if (isHover == 1) {
    var dest = new Image;
    dest.src = canvas3d.toDataURL("image/png");
    ctx.globalAlpha = 0.6;
    ctx.drawImage(dest, 0, 0);
    ctx.globalAlpha = 1;
  }


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

  showCamData();
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

function plHover() {
  isHover ^= 1;
}