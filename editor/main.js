'use strict';

let frameNumberStart = 0;
let frameNumber = 0;
let isPlay = 0;
let prevFrame = 0;
let wireframe = 0;
let isHover = 0;

const canvas = document.getElementById("visuals")
const ctx = canvas.getContext("2d");
const width = canvas.width;
const height = canvas.height;
const canvas3d = document.getElementById("visuals3d")
const ctx3d = canvas3d.getContext("2d");
const width3d = canvas3d.width;
const height3d = canvas3d.width;

let camPathId = 1;
let camPathList = [];

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
	
  //0
  camSetLookAtDistRot([0,0,0], 8.70, 26, 14, -4.5);
  // first for spline
  camMovDir(0.1);
  camPathList.push({"frame":-1, "picoEye":picoEye, "picoDir":picoDir, "picoUp":picoUp});
  camMovDir(-0.1);
  // 0
  camPathList.push({"frame":0, "picoEye":picoEye, "picoDir":picoDir, "picoUp":picoUp});
  
  //25
  camSetLookAtDistRot([0,0,0], 8.70, 44.5, 6, -3.0);
  camMovDir(4.5);
  camMov(-0.625, 0.2, 0);
  camPathList.push({"frame":25, "picoEye":picoEye, "picoDir":picoDir, "picoUp":picoUp});
  
  //50
  camSetLookAtDistRot([0,0,0], 1.7, 61, -2, 2);
  camMov(-0.55, 0, 0);
  camMovUp(-0.45);
  camPathList.push({"frame":50, "picoEye":picoEye, "picoDir":picoDir, "picoUp":picoUp});
  
  //60
  camSetLookAtDistRot([0,0,0], 1.372, 75, -3.2, 2);
  camMov(-0.425, 0, 0);
  camMovUp(-0.55);
  camPathList.push({"frame":60, "picoEye":picoEye, "picoDir":picoDir, "picoUp":picoUp});
  
  // last for spline
  camMovDir(0.1);
  camPathList.push({"frame":-1, "picoEye":picoEye, "picoDir":picoDir, "picoUp":picoUp});
  // last for spline
  camMovDir(0.1);
  camPathList.push({"frame":-1, "picoEye":picoEye, "picoDir":picoDir, "picoUp":picoUp});

  plPlay(); //autoplay
  window.requestAnimationFrame(drawFrame);
}

function drawFrame(time) {
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, width, height);

  drawScene1Frame(ctx);

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
        
        //check next camPathId
        if (camPathList[camPathId + 1].frame == frameNumber) {
            camPathId++;
        }
        //spline cam
        if (camPathList[camPathId + 1].frame != -1) {
            // warning! uneven movement detected (+0.5 is small fixing. need find the problem)
            var splineTime = (frameNumber - camPathList[camPathId + 0].frame) / (camPathList[camPathId + 1].frame - camPathList[camPathId + 0].frame + 0.5);
            if (frameNumber == camPathList[camPathId + 0].frame) {
                splineTime = 0;
            }
            
            picoEye = spline(
                camPathList[camPathId - 1].picoEye,
                camPathList[camPathId + 0].picoEye,
                camPathList[camPathId + 1].picoEye,
                camPathList[camPathId + 2].picoEye,
                splineTime
            );
            picoDir = spline(
                camPathList[camPathId - 1].picoDir,
                camPathList[camPathId + 0].picoDir,
                camPathList[camPathId + 1].picoDir,
                camPathList[camPathId + 2].picoDir,
                splineTime
            );
            picoDir = normalize(picoDir);
            picoUp = spline(
                camPathList[camPathId - 1].picoUp,
                camPathList[camPathId + 0].picoUp,
                camPathList[camPathId + 1].picoUp,
                camPathList[camPathId + 2].picoUp,
                splineTime
            );
            picoUp = normalize(picoUp);
        }

      }
    }
    document.getElementById('frame').value = frameNumber;
  }

  showCamData();
  window.requestAnimationFrame(drawFrame);
}

function plPlay() {
  frameNumber = frameNumberStart;
  camPathId = 1;
  picoEye = camPathList[1].picoEye;
  picoDir = camPathList[1].picoDir;
  picoUp = camPathList[1].picoUp;
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

let isKeyZ = 0;
let isKeyX = 0;
let isKeyY = 0;
let isKeyM = 0;
let isKeyCtrl = 0;

let offsetX = 0;
let offsetY = 0;

//--- scene control
let keyCodeList = {
    90: 'isKeyZ', //z
    88: 'isKeyX', //x
    67: 'isKeyY', //c
    89: 'isKeyY', //y
    77: 'isKeyM', //m - move
}
function controlKey(e, state) {
    //console.log(e.keyCode);
    for (let keyCode in keyCodeList) {
        if (keyCode == e.keyCode) {
            window[keyCodeList[keyCode]] = state;
            //console.log(keyCodeList[keyCode], state);
        }
    }
}

function controlMouseMove(e) {
    if (window['isKeyY'] == 1) {
        if (e.ctrlKey) {
            camRotUp((offsetX - e.offsetX) * 0.1);
        } else {
            camMovUp((e.offsetY - offsetY) * 0.01);
        }
    }
    if (window['isKeyZ'] == 1) {
        if (e.ctrlKey) {
            camRotDir((e.offsetY - offsetY) * 0.1);
        } else {
            camMovDir((e.offsetY - offsetY) * 0.01);
        }
    }
    if (window['isKeyX'] == 1) {
        if (e.ctrlKey) {
            camRotH((e.offsetY - offsetY) * 0.1);
        } else {
            camMovH((offsetX - e.offsetX) * 0.01);
        }
    }
    if (window['isKeyM'] == 1) {
        camMovUp((e.offsetY - offsetY) * 0.01);
        camMovH((offsetX - e.offsetX) * 0.01);
    }
    offsetX = e.offsetX;
    offsetY = e.offsetY;
}
function controlMouseWheel (e) {
    if (window['isKeyM'] == 1) {
        e.preventDefault();
        let dist = e.deltaY < 0 ? 0.25 : -0.25;
        camMovDir(dist);
    }
}