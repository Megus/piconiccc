let picoEye = [0, 0, -2];
let picoDir = [0, 0, 1];
let picoUp = [0, 1, 0];

/*
1. camMove(x,y,z) �� ����� camEye[0] = camEye[0] + x, ... - �������� � ������������
2. camRotateX(angle) / camRotateY(angle) / camRotateZ(angle) - �������� ����� ������ camEye � ��� �������� ������� camDir.
3. camRotateDir(angle) - �������� camUp ������������ camDir � � ������ �������, ������ camUp ���� ����������� �� ���, ��� � ������ ����� ??
4. camMoveDir(dist) - �������� �� ������� camDir � �� ������, ��� ������ �������� �����, �� ������� �������, �������
5. setCamEye(x,y,z) - ��������� � ������ �������
6. setCamLookAt(x,y,z) - ��������� ����������� ������� (��� ���� ���� �������� ��������� camUp = [0, 1, 0] ��� ����� �������� camDir = [0, 0, 1]) � ������ ��������� camDir = LookAt - camEye

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

function spline_cam(camId) {
  if (camPathList[camId] != undefined
    && camPathList[camId][camPathId - 1] != undefined
    && camPathList[camId][camPathId + 0] != undefined
    && camPathList[camId][camPathId + 1] != undefined
    && camPathList[camId][camPathId + 2] != undefined
    && camPathList[camId][camPathId + 1].frame != -1
  ) {
    var splineTime = (frameNumber - camPathList[camId][camPathId + 0].frame) / (camPathList[camId][camPathId + 1].frame - camPathList[camId][camPathId + 0].frame);
    if (frameNumber == camPathList[camId][camPathId + 0].frame) {
      splineTime = 0;
    }
    picoEye = spline(
      camPathList[camId][camPathId - 1].picoEye,
      camPathList[camId][camPathId + 0].picoEye,
      camPathList[camId][camPathId + 1].picoEye,
      camPathList[camId][camPathId + 2].picoEye,
      splineTime
    );
    picoDir = spline(
      camPathList[camId][camPathId - 1].picoDir,
      camPathList[camId][camPathId + 0].picoDir,
      camPathList[camId][camPathId + 1].picoDir,
      camPathList[camId][camPathId + 2].picoDir,
      splineTime
    );
    picoDir = normalize(picoDir);
    picoUp = spline(
      camPathList[camId][camPathId - 1].picoUp,
      camPathList[camId][camPathId + 0].picoUp,
      camPathList[camId][camPathId + 1].picoUp,
      camPathList[camId][camPathId + 2].picoUp,
      splineTime
    );
    picoUp = normalize(picoUp);
  }

}

function changeCamPath(camId) {
  if (camId == undefined) {
    console.log('bad');
  }
  for (let cp in camPathList[camId]) {
    if (camPathList[camId][cp]['frame'] != -1 &&
    frameNumber >= camPathList[camId][cp]['frame']) {
      camPathId = parseInt(cp);
    }
  }

}

function showCamData() {
	let html =
		'&nbsp;&nbsp;picoEye = [' + picoEye[0] + ', ' + picoEye[1] + ', ' + picoEye[2] + '];<br>'
		+ '&nbsp;&nbsp;picoDir = [' + picoDir[0] + ', ' + picoDir[1] + ', ' + picoDir[2] + '];<br>'
		+ '&nbsp;&nbsp;picoUp = [' + picoUp[0] + ', ' + picoUp[1] + ', ' + picoUp[2] + '];'
		;
  if (document.getElementById('camdata').innerHTML != html) {
    document.getElementById('camdata').innerHTML = html;
  }
  // render list
  html = 'Render-list: ';
  for (let mrlId in modelRenderList) {
    let mrl = modelRenderList[mrlId];
    let m = mrl.model;
    if (models[m].fstart <= frameNumber && models[m].fend > frameNumber) {
      html += '<b style="color:red;">' + m + '</b> <span style="color:#8090ff;">[' + modelRenderList[mrlId].campath + ']</span>' + '; ';
    }
  }
  if (document.getElementById('render-list').innerHTML != html) {
    document.getElementById('render-list').innerHTML = html;
  }
}

// reset cam
function resetCam() {
  picoEye = [0, 0, -2];
  picoDir = [0, 0, 1];
  picoUp = [0, 1, 0];
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

function camMovVec(vec, dist) {
  let vecN = normalize(vec);
	picoEye[0] += vecN[0] * dist;
	picoEye[1] += vecN[1] * dist;
	picoEye[2] += vecN[2] * dist;
}

// cam rotate
function camRotDir(alpha) {
  picoUp = normalize(rotVec(picoUp, picoDir, alpha));
}

function camRotUp(alpha) {
  picoDir = normalize(rotVec(picoDir, picoUp, alpha));
}

function camRotH(alpha) {
  let picoH = normalize(cross(picoUp, picoDir));
  picoDir = normalize(rotVec(picoDir, picoH, alpha));
  picoUp = normalize(rotVec(picoUp, picoH, alpha));
}

function camRotVec(vec, alpha) {
  let vecN = normalize(vec);
  picoEye = rotVec(picoEye, vecN, alpha);
  picoDir = rotVec(picoDir, vecN, alpha);
  picoUp = rotVec(picoUp, vecN, alpha);
}

function camRotX(alpha) {
  picoEye = rotX(picoEye, alpha);
  picoUp = normalize(rotX(picoUp, alpha));
  picoDir = normalize(rotX(picoDir, alpha));
}

function camRotY(alpha) {
  picoEye = rotY(picoEye, alpha);
  picoUp = normalize(rotY(picoUp, alpha));
  picoDir = normalize(rotY(picoDir, alpha));
}

function camRotZ(alpha) {
  picoEye = rotZ(picoEye, alpha);
  picoUp = normalize(rotZ(picoUp, alpha));
  picoDir = normalize(rotZ(picoDir, alpha));
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


/* bad functions */
function camLookAt(v3) {
  let dirNew = normalize(vSub(v3, picoEye));
  let rotDir = normalize(cross(picoDir, dirNew));
  let rad = vec3.angle(dirNew, picoDir);
  let deg = rad * 180 / Math.PI

  picoUp = normalize(rotVec(picoUp, rotDir, -deg));
  picoDir = dirNew;
}

