'use strict';

let picoEye = [0, 0, -2];
let picoDir = [0, 0, 1];
let picoUp = [0, 1, 0];

/*
1. camMove(x,y,z) по факту camEye[0] = camEye[0] + x, ... - движение в пространстве
2. camRotateX(angle) / camRotateY(angle) / camRotateZ(angle) - вращение сцены вокруг camEye — это вращение вектора camDir.
3. camRotateDir(angle) - вращение camUp относительно camDir — я сейчас осознал, почему camUp надо расчитывать не так, как я сейчас делаю ??
4. camMoveDir(dist) - движение по вектору camDir — не уверен, что такого движения много, но проблем никаких, конечно
5. setCamEye(x,y,z) - установка в нужную позицию
6. setCamLookAt(x,y,z) - установка направления взгляда (при этом надо вычилять изменение camUp = [0, 1, 0] как будто изменили camDir = [0, 0, 1]) — просто установка camDir = LookAt - camEye

*/

function spline_coord_katmulrom(v0, v1, v2, v3, p) {
    let k = [];
	let t2 =  p * p;
	let t3 = t2 * p;
	k[0] = -1 * v0 + 3 * v1 - 3 * v2 + v3;
	k[1] =  2 * v0 - 5 * v1 + 4 * v2 - v3;
	k[2] = -1 * v0 + v2;
	k[3] =  2 * v1;
	return ((t3*k[0] + t2*k[1] + p*k[2] + k[3] ) * 0.5);
}

function spline(v0, v1, v2, v3, p) {
    var x = spline_coord_katmulrom(v0[0], v1[0], v2[0], v3[0], p);
    var y = spline_coord_katmulrom(v0[1], v1[1], v2[1], v3[1], p);
    var z = spline_coord_katmulrom(v0[2], v1[2], v2[2], v3[2], p);
    return [x, y, z];
}

function spline_cam() {
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

function showCamData() {
	document.getElementById('camdata').innerHTML = 
		'eye:[' + picoEye[0] + ', ' + picoEye[1] + ', ' + picoEye[2] + ']'
		+ 'dir:[' + picoDir[0] + ', ' + picoDir[1] + ', ' + picoDir[2] + ']'
		+ 'up:[' + picoUp[0] + ', ' + picoUp[1] + ', ' + picoUp[2] + ']'
		;
}

// reset cam
function resetCam() {
  picoEye = [0, 0, -2];
  picoDir = [0, 0, 1];
  picoUp = [0, 1, 0];
}

// cam rotate
function camRotX(alpha) {
	let L = (alpha%360) * Math.PI / 180;
	let y = picoDir[1] * Math.cos(L) + picoDir[2] * Math.sin(L);
	let z = - picoDir[1] * Math.sin(L) + picoDir[2] * Math.cos(L);
	picoDir = normalize([picoDir[0], y, z]);
	y = picoUp[1] * Math.cos(L) + picoUp[2] * Math.sin(L);
	z = - picoUp[1] * Math.sin(L) + picoUp[2] * Math.cos(L);
	picoUp = normalize([picoUp[0], y, z]);
}

function camRotY(alpha) {
	let L = (alpha%360) * Math.PI / 180;
	let x = picoDir[0] * Math.cos(L) + picoDir[2] * Math.sin(L);
	let z = - picoDir[0] * Math.sin(L) + picoDir[2] * Math.cos(L);
	picoDir = normalize([x, picoDir[1], z]);
	x = picoUp[0] * Math.cos(L) + picoUp[2] * Math.sin(L);
	z = - picoUp[0] * Math.sin(L) + picoUp[2] * Math.cos(L);
	picoUp = normalize([x, picoUp[1], z]);
}

function camRotZ(alpha) {
	let L = (alpha%360) * Math.PI / 180;
	let x = picoDir[0] * Math.cos(L) - picoDir[1] * Math.sin(L);
	let y = picoDir[0] * Math.sin(L) + picoDir[1] * Math.cos(L);
	picoDir = normalize([x, y, picoDir[2]]);
	x = picoUp[0] * Math.cos(L) - picoUp[1] * Math.sin(L);
	y = picoUp[0] * Math.sin(L) + picoUp[1] * Math.cos(L);
	picoUp = normalize([x, y, picoUp[2]]);
}

// cam move
function camMovDir(dist) {
	picoEye[0] += picoDir[0] * dist;
	picoEye[1] += picoDir[1] * dist;
	picoEye[2] += picoDir[2] * dist;
}

function camMovUp(dist) {
	picoEye[0] += picoUp[0] * dist;
	picoEye[1] += picoUp[1] * dist;
	picoEye[2] += picoUp[2] * dist;
}

function camMovH(dist) {
    let v3 = normalize(cross(picoUp, picoDir));
	picoEye[0] += v3[0] * dist;
	picoEye[1] += v3[1] * dist;
	picoEye[2] += v3[2] * dist;
}

//cam self rotate
function camRotDir(alpha) {
	let L = (alpha%360) * Math.PI / 180;
	let x = picoUp[0] * Math.cos(L) - picoUp[1] * Math.sin(L);
	let y = picoUp[0] * Math.sin(L) + picoUp[1] * Math.cos(L);
	picoUp = normalize([x, y, picoUp[2]]);
}

function camRotUp(alpha) {
	let L = (alpha%360) * Math.PI / 180;
	let x = picoDir[0] * Math.cos(L) + picoDir[2] * Math.sin(L);
	let z = - picoDir[0] * Math.sin(L) + picoDir[2] * Math.cos(L);
	picoDir = normalize([x, picoDir[1], z]);
}

function camRotH(alpha) {
	let L = (alpha%360) * Math.PI / 180;
	let y = picoDir[1] * Math.cos(L) + picoDir[2] * Math.sin(L);
	let z = - picoDir[1] * Math.sin(L) + picoDir[2] * Math.cos(L);
	picoDir = normalize([picoDir[0], y, z]);
	y = picoUp[1] * Math.cos(L) + picoUp[2] * Math.sin(L);
	z = - picoUp[1] * Math.sin(L) + picoUp[2] * Math.cos(L);
	picoUp = normalize([picoUp[0], y, z]);
}


function camSetLookAtDistRot(lookAt, dist, rX, rY, rZ) {
	picoEye = [0, 0, 0];
	picoDir = [0, 0, 1];
	picoUp = [0, 1, 0];
	camRotX(rX);
	camRotY(rY);
	camRotZ(rZ);
	camMovDir(-dist);
}

// bad functions
function camMov(x, y, z) {
	picoEye[0] += x;
	picoEye[1] += y;
	picoEye[2] += z;
}

