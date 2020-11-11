'use strict';

let picoEye = [2, 0, -25];
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

function showCamData() {
	document.getElementById('camdata').innerHTML = 
		'eye:[' + picoEye[0] + ', ' + picoEye[1] + ', ' + picoEye[2] + ']'
		+ 'dir:[' + picoDir[0] + ', ' + picoDir[1] + ', ' + picoDir[2] + ']'
		+ 'up:[' + picoUp[0] + ', ' + picoUp[1] + ', ' + picoUp[2] + ']'
		;
}

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

function camMovDir(dist) {
	picoEye[0] += picoDir[0] * dist;
	picoEye[1] += picoDir[1] * dist;
	picoEye[2] += picoDir[2] * dist;
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

