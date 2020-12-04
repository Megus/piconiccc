module.exports.convertCamera = function(camPathList) {
  const converted = {};
  console.log(camPathList);

  for (let name in camPathList) {
    const camera = camPathList[name];
    const cCamera = [];
    for (let c = 0; c < camera.length; c++) {
      const data = [];
      data.push(camera[c].frame);
      data.push(camera[c].picoEye[0]);
      data.push(camera[c].picoEye[1]);
      data.push(camera[c].picoEye[2]);
      data.push(camera[c].picoDir[0]);
      data.push(camera[c].picoDir[1]);
      data.push(camera[c].picoDir[2]);
      data.push(camera[c].picoUp[0]);
      data.push(camera[c].picoUp[1]);
      data.push(camera[c].picoUp[2]);
      cCamera.push(data);
    }
    converted[name] = cCamera;
  }

  return converted;
};