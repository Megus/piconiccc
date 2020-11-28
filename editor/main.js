'use strict';

let frameNumberStart = 1190;//1190
let frameNumber = 1190;
let isPlay = 0;
let prevFrame = 0;
let wireframe = 0;
let isHover = 1;
let isSplineCam = 1;

const canvas = document.getElementById("visuals")
const ctx = canvas.getContext("2d");
const width = canvas.width;
const height = canvas.height;

const canvas3d = document.getElementById("visuals3d")
const ctx3d = canvas3d.getContext("2d");
const width3d = canvas3d.width;
const height3d = canvas3d.width;

const canvasgl = document.getElementById("visualsgl")
const gl = canvasgl.getContext("webgl");
const widthgl = canvasgl.width;
const heightgl = canvasgl.width;
console.log(gl);


let camPathId = 1;
let camPathList = [];

function init() {
  
  //init_cam_path();

  //reset cam
  resetCam();	

	init_models();
	

  //plPlay(); //autoplay
  
  
  glInit(gl);
  
  showCamData();
  document.getElementById('frame').value = frameNumber;
  window.requestAnimationFrame(drawFrame);
}

function drawFrame(time) {
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, width, height);

  drawScene1Frame(ctx);

  ctx3d.fillStyle = "#000000";
  ctx3d.fillRect(0, 0, width3d, height3d);
  drawPicoFrame(ctx3d);
  
  glDrawFrame(gl);
  
  if (isHover == 1) {
    var dest = new Image;
    dest.src = canvas3d.toDataURL("image/png");
    ctx.globalAlpha = 0.6;
    ctx.drawImage(dest, 0, 0);
    ctx.globalAlpha = 1;
  }


  if (isPlay) {
    if (frameNumber < frames.length - 1) {
      let nowFrame = Math.floor((time / (1000 / 10))) % frames.length;
      if (nowFrame != prevFrame) {
        prevFrame = nowFrame;
        frameNumber++;
        
        //check next camPathId
        if (camPathList[camPathId + 1].frame == frameNumber) {
            camPathId++;
        }
        //spline cam
        if (isSplineCam) {
          spline_cam();
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
  changeCamPath();
  isPlay = 1;
}

function plStop() {
  isPlay = 0;
}

function plChange(num) {
  frameNumber = (frameNumber + num) % frames.length;
  changeCamPath();
  document.getElementById('frame').value = frameNumber;
}

function plSet(num) {
  frameNumberStart = parseInt(0 + num) % frames.length;
  frameNumber = frameNumberStart;
  document.getElementById('frame').value = frameNumber;
  changeCamPath();
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
