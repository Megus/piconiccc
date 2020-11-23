function init_cam_path_tunnel4() {
}










function init_cam_path_begin() {
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
}