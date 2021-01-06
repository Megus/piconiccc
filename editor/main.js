'use strict';
// 957 997 1035 1075 1135 1187
let frameNumberStart = 0;//115;
let frameNumber = frameNumberStart;
let timeStart = 0;
let isPlay = 0;
let prevFrame = 0;
let wireframe = 0;
let isHover = 0;
let isNeedChangeCam = true;
let isForceCamPath = 1;
let isRandomize = 0;

let isGlClearZBuff = 1;
let isGlCullFace = 1;

let isFrameNumberFloat = 0;

let picoRenderPointList = [];

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
canvasgl.setAttribute('style', 'transform:rotateY(180deg)');


let camPathId = 1;

let camPathList = {};
let modelRenderList = [];
let models = {};

function init() {

  //init_cam_path();

  //reset cam
  resetCam();

	init_models();
  show_models_stat();

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
  //drawPicoFrame(ctx3d);

  glDrawFrame(gl);

  if (isHover == 1) {
    var dest = new Image;
    ctx.globalAlpha = 0.5;
    canvasgl.globalAlpha = 0.5;
    dest.src = canvasgl.toDataURL("image/png");
    mirrorImage(ctx, dest, 0, 0, true);
    ctx.globalAlpha = 1;
    canvasgl.globalAlpha = 1;
  }

  // debug cam set
  if (isNeedChangeCam) {
    //resetCam();
  }

  isNeedChangeCam = false;
  if (isPlay && (time > timeStart)) {
    if (frameNumber < frames.length - 1) {
      if (isFrameNumberFloat) {
        frameNumber = ((time - timeStart) / (1000 / 15));
      }
      let nowFrame = Math.floor(((time - timeStart) / (1000 / 15))) % frames.length;
      if (nowFrame != prevFrame) {
        prevFrame = nowFrame;
        if (!isFrameNumberFloat) {
          frameNumber++;
        }
        document.getElementById('frame').value = frameNumber;
        isNeedChangeCam = true;
      }
    }
  }

  //animate rotor in
  if (models['rotorin'] != undefined) {
    for (v in models['rotorin'].v) {
      models['rotorin'].v[v] = rotVec(models['rotorin'].v[v], rotorin,  3);
    }
    
  }
  if (isRandomize || models['rotorin'] != undefined) {
    buffers = initBuffers(gl);
  }

  showCamData();
  window.requestAnimationFrame(drawFrame);
}

function plPlay() {
  timeStart = performance.now();
  frameNumber = frameNumberStart;
  isPlay = 1;
}

function plStop() {
  isPlay = 0;
}

function plChange(num) {
  frameNumber = (frameNumber + num) % frames.length;
  document.getElementById('frame').value = frameNumber;
  isNeedChangeCam = true;
}

function plSet(num) {
  frameNumberStart = parseInt(0 + num) % frames.length;
  frameNumber = frameNumberStart;
  document.getElementById('frame').value = frameNumber;
  isNeedChangeCam = true;
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
    86: 'isKeyV', //v - rot rotorin
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

function controlMouseMove(e, mltX) {
  if (window['isKeyV'] == 1) {
    if (e.ctrlKey) {
      camRotVec(rotorin, mltX * (offsetX - e.offsetX) * 0.25);
    } else {
      camMovVec(rotorin, mltX * (offsetX - e.offsetX) * 0.01);
    }
  }
  if (window['isKeyY'] == 1) {
    if (e.ctrlKey) {
      camRotUp(mltX * (offsetX - e.offsetX) * 0.1);
    }
    if (e.shiftKey) {
      camRotY(mltX * (offsetX - e.offsetX) * 0.1);
    }
    if (!e.ctrlKey && !e.shiftKey) {
      camMovUp((e.offsetY - offsetY) * 0.01);
    }
  }
  if (window['isKeyZ'] == 1) {
    if (e.ctrlKey) {
      camRotDir((e.offsetY - offsetY) * 0.1);
    }
    if (e.shiftKey) {
      camRotZ((offsetY - e.offsetY) * 0.1);
    }
    if (!e.ctrlKey && !e.shiftKey) {
      camMovDir((e.offsetY - offsetY) * 0.01);
    }
  }
  if (window['isKeyX'] == 1) {
    if (e.ctrlKey) {
      camRotH((e.offsetY - offsetY) * 0.1);
    }
    if (e.shiftKey) {
      camRotX(mltX * (offsetX - e.offsetX) * 0.1);
    }
    if (!e.ctrlKey && !e.shiftKey) {
      camMovH(mltX * (offsetX - e.offsetX) * 0.01);
    }
  }
  if (window['isKeyM'] == 1) {
    camMovUp((e.offsetY - offsetY) * 0.01);
    camMovH(mltX * (offsetX - e.offsetX) * 0.01);
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

// arguments
// ctx : the context on which to draw the mirrored image
// image : the image to mirror
// x,y : the top left of the rendered image
// horizontal : boolean if true mirror along X
// vertical : boolean if true mirror along y
function mirrorImage(ctx, image, x = 0, y = 0, horizontal = false, vertical = false){
    ctx.save();  // save the current canvas state
    ctx.setTransform(
        horizontal ? -1 : 1, 0, // set the direction of x axis
        0, vertical ? -1 : 1,   // set the direction of y axis
        x + horizontal ? image.width : 0, // set the x origin
        y + vertical ? image.height : 0   // set the y origin
    );
    ctx.drawImage(image,0,0);
    ctx.restore(); // restore the state as it was when this function was called
}