let rotorin = [0,1,0];

const useFrameLimit = true;

const models_oxygene_fstart = 0;
const models_oxygene_fend = 67;

const models_oxygenein_fstart = 0;
const models_oxygenein_fend = 90;

const models_tonnel1_fstart = 0;
const models_tonnel1_fend = 0;

const models_tonnel2_fstart = 173;
const models_tonnel2_fend = 276;//265

const models_tonnel3_fstart = 215; //230
const models_tonnel3_fend = 345+5;

const models_rotor_fstart = 315;
const models_rotor_fend = 600;

const models_tonnel4_fstart = 500;
const models_tonnel4_fend = 723;

const models_tonnel5_fstart = 1190;
const models_tonnel5_fend = 1347;

const models_arch2_fstart = 801;//925;
const models_arch2_fend = 1193;

const models_arch1_fstart = 723;//925;
const models_arch1_fend = 941;//941;

const models_room_fstart = 1330;//1538;
const models_room_fend = 9999;

const models_cubes_fstart = 1538;
const models_cubes_fend = 9999;

const models_cubes2_fstart = 1538;
const models_cubes2_fend = 9999;

//1784 must invert



function init_models() {
  //init_testcube();
  
  init_cubes();
  init_room();
  init_tonnel5();
  init_arch2();
  init_arch1();
  init_tonnel4();
  init_rotor();
  init_tonnel3();
  init_tonnel2(); //tonnel-2 + squad
  init_tonnel1();
  init_oxygene();
  //console.log(models);
  //console.log(camPathList);
  //console.log(modelRenderList);
  

  // cam to cam
  if (camPathList['tonnel4'] != undefined && camPathList['tonnel3'] != undefined) {
    for (var c in camPathList['tonnel4']) {
      camPathList['tonnel3'].push(camPathList['tonnel4'][c]);
    }
  }
  
  
}

function show_models_stat() {
  total_v = 0;
  total_f = 0;
  for (m in models) {
    console.log(m + ', v:' + models[m].v.length + ' f:' + models[m].f.length);
    total_v += models[m].v.length;
    total_f += models[m].f.length;
  }
  console.log('total v:' + total_v + ', f:' + total_f);
}

function vSub(v1,v2) {
  return [
    v1[0] - v2[0],
    v1[1] - v2[1],
    v1[2] - v2[2],
  ];
}
function vMov(v1,v2,dist) {
  v2 = normalize(v2);
  return [
    v1[0] + v2[0] * dist,
    v1[1] + v2[1] * dist,
    v1[2] + v2[2] * dist,
  ];  
}


function vecHalf(v1,v2) {
  return [
    (v1[0]+v2[0])/2,
    (v1[1]+v2[1])/2,
    (v1[2]+v2[2])/2,
  ];
}

function init_rotor() {
  modelRenderList.push({
    model: 'rotor',
    campath: 'rotor',
  });
  modelRenderList.push({
    model: 'rotorin',
    campath: 'rotor',
  });

  let model = {
		fstart: useFrameLimit ? models_rotor_fstart : 0,
		fend: useFrameLimit ? models_rotor_fend : 9999,
    v: [],
    f: [],
  }
  let model2 = {
		fstart: useFrameLimit ? models_rotor_fstart : 0,
		fend: useFrameLimit ? models_rotor_fend : 9999,
    v: [],
    f: [],
  }

  let colors = [
    ['#7F7F0F','#2F2F1F','#7F7F0F', '#ff0000'], //r
    ['#4F4F3F','#4F4F3F','#3F3F2F', '#ff0000'], //forv
    ['#7F7F0F','#2F2F1F','#7F7F0F', '#ff0000'], //r
    ['#2F2F1F','#1F1F0F','#2F2F1F', '#ff0000'], //back
  ];

  let nqty = 6;
  let sz = 1.15;
  let r1 = 2;
  let r2 = r1 - 0.25;
  let rlist = [r1, r2];

  for (n = 0; n < nqty; n++) {
    let clr = n%2 == 0 ? 2 : 1;
    if (n >= nqty-2) {
      // clr = 0;
    }
    let aa = 0;
    let alist = [0, 2, -2, 0];
    for (a = 0; a < 360; a += 360/8) {
      let rr1 = rlist[aa%2];
      let rr2 = rlist[(aa%2)^1];
      let al = 2*(aa%2);
      let L1 = (a+alist[al]) * Math.PI / 180;
      let L2 = (a+alist[al+1]) * Math.PI / 180;
      model.v.push([ rr1 * Math.cos(L1), rr1 * Math.sin(L1), n*sz - sz*3 ]);
      model.v.push([ rr2 * Math.cos(L2), rr2 * Math.sin(L2), n*sz - sz*3 ]);
      aa++;
    }
    let nn = n * 16;
    if (n < nqty-1) {
      for (let i = 0; i < 16; i++) {
        let ci = i % 4;
        let clr1 = clr;
        //let clr1 = i == 1 ? 3 : clr;
        let v1 = 2+i <= 16 ? 2+i : 1;
        let v2 = 18+i <= 32 ? 18+i : 17;
        if (!(i==3 && n ==0)) {
          model.f.push([colors[ci][clr1], nn+1+i, nn+17+i, nn+v2, nn+v1]);
          //model.f.push([colors[ci][clr1], nn+v2, nn+v1, nn+1+i]);
        }
      }
    }
  }

  //4,5,20,21
  let colors3 = ['#4F4F3F','#2f2f1f','#1F1F0F','#2f2f1f'];
  let dd1 = 0.75;
  let dd2 = 0.35;
  let nn = model.v.length;
  let center = vecHalf(model.v[4-1], model.v[21-1]);
  let llist = [4-1,20-1,21-1,5-1];
  for (l in llist) {
    let point = model.v[llist[l]];
    let dir = normalize([point[0], point[1], 0]);
    let dir2 = vSub(center, point);
    let point2 = [
      point[0] + dd1*dir[0] + dd2*dir2[0],
      point[1] + dd1*dir[1] + dd2*dir2[1],
      point[2] + dd1*dir[2] + dd2*dir2[2],
    ];
    model.v.push(point2);
  }

  model.f.push([colors3[0], 4, 20, nn+2, nn+1]);
  //model.f.push([colors3[0], nn+2, nn+1, 4]);
  model.f.push([colors3[1], 20, 21, nn+3, nn+2]);
  //model.f.push([colors3[1], nn+3, nn+2, 20]);
  model.f.push([colors3[2], 21, 5, nn+4, nn+3]);
  //model.f.push([colors3[2], nn+4, nn+3, 21]);
  model.f.push([colors3[3], 5, 4, nn+1, nn+4]);
  //model.f.push([colors3[3], nn+1, nn+4, 5]);

  model.f.push([colors[3][1], 3, 4, 5, 6]);
  //model.f.push([colors[3][1], 5, 6, 3]);
  model.f.push([colors[3][1], 7, 8, 9, 10]);
  //model.f.push([colors[3][1], 9, 10, 7]);
  model.f.push([colors[3][1], 11, 12, 13, 14]);
  //model.f.push([colors[3][1], 13, 14, 11]);
  model.f.push([colors[3][1], 15, 16, 1, 2]);
  //model.f.push([colors[3][1], 1, 2, 15]);

  //inner
  let colors2 = [
    ['#5F5F4F','#3F3F2F','#6F6F5F','#7F7F0F'],
    ['#4F4F3F','#2F2F1F','#5F5F4F','#3F3F2F'],
  ];

  let nqty2 = 10;
  let xr1 = 0.35;
  let xr2 = 0.6;
  let xlist = [
    {z:0,r:xr1},
    {z:1,r:xr1},
    {z:1,r:xr2},
    {z:2,r:xr2},
    {z:2,r:xr1},
    {z:3,r:xr1},
    {z:3,r:xr2},
    {z:4,r:xr2},
    {z:4,r:xr1},
    {z:5,r:xr1}
  ];
  for (n = 0; n < nqty2; n++) {
    for (a = 0; a < 360; a += 360/8) {
      let L = a * Math.PI / 180;
      let r = xlist[n].r;
      model2.v.push([ r * Math.cos(L), r * Math.sin(L), xlist[n].z*sz - sz*3 ]);
    }
    let nn = n * 8;
    if (n < nqty2-1) {
      for (let i = 0; i < 8; i++) {
        let v1 = 2+i <= 8 ? 2+i : 1;
        let v2 = 10+i <= 16 ? 10+i : 9;
        model2.f.push([colors2[i%2][n%4], nn+1+i, nn+v1, nn+v2, nn+9+i]);
        //model2.f.push([colors2[i%2][n%4], nn+v2, nn+9+i, nn+1+i]);
      }
    }
  }

  // modify
  for (v in model.v) {
    model.v[v] = rotX(model.v[v], 90);
    model.v[v] = rotY(model.v[v], -360/16);
    model.v[v] = rotY(model.v[v], -360/4);
  }
  for (v in model2.v) {
    model2.v[v] = rotX(model2.v[v], 90);
    model2.v[v] = rotY(model2.v[v], -360/16);
    model2.v[v] = rotY(model2.v[v], -360/4);
  }

  models['rotor'] = model;
  models['rotorin'] = model2;

  //rotor cam
  camPathList['rotor'] = [];

  //315
  picoEye = [0.12493943061155013, 2.811982324716844, -3.260394806604835];
  picoDir = [0.48544951487361176, 0.1469226637329067, 0.8618308995334306];
  picoUp = [-0.23769876631118914, 0.9709851993862086, -0.026211430084283553];
  camMovDir(-0.1);
  camPathList['rotor'].push({"frame":-1, "picoEye":picoEye, "picoDir":picoDir, "picoUp":picoUp});
  camMovDir(0.1);
  camPathList['rotor'].push({"frame":315, "picoEye":picoEye, "picoDir":picoDir, "picoUp":picoUp});

  //330
  picoEye = [0.305429895399044, 1.6746254004712695, -2.8266204394537895];
  picoDir = [0.3483413317121603, 0.24865517806046772, 0.9037858811935036];
  picoUp = [-0.2813559973992302, 0.9473379752418875, -0.15293646848311082];
  camPathList['rotor'].push({"frame":330, "picoEye":picoEye, "picoDir":picoDir, "picoUp":picoUp});

  //350
  resetCam();
  camMovVec(rotorin, 2);
  camRotDir(15);
  camPathList['rotor'].push({"frame":350, "picoEye":picoEye, "picoDir":picoDir, "picoUp":picoUp});

  //360
  picoEye = [0.18956817506316442, 2.0029054671343456, -1.6754890954477335];
  picoDir = [-0.19684375951084995, -0.07666503985926991, 0.9774328652163335];
  picoUp = [-0.30675713916057445, 0.9515927910151917, 0.019267009678143848];
  camPathList['rotor'].push({"frame":360, "picoEye":picoEye, "picoDir":picoDir, "picoUp":picoUp});

  //380
  picoEye = [0.9562437886072557, 1.8016091873536535, -1.0856061984780663];
  picoDir = [-0.41487688453301025, -0.30959937023477446, 0.8555848295934275];
  picoUp = [-0.5065084571259862, 0.8597620240271271, 0.06525676134034457];

  picoEye = [0.9562437886072557, 1.8016091873536535, -1.0856061984780663];
  picoDir = [-0.4348732541541764, -0.274848778144034, 0.8575216626850245];
  picoUp = [-0.48944638047159683, 0.8714869126878078, 0.03086748543574832];
  camPathList['rotor'].push({"frame":380, "picoEye":picoEye, "picoDir":picoDir, "picoUp":picoUp});

  //390
  picoEye = [1.233203970761894, 1.5079468438455277, -0.5209284866351637];
  picoDir = [-0.5002794325986561, -0.42274534879886366, 0.7556499582397221];
  picoUp = [-0.5968280728081955, 0.7986696279818724, 0.07696152835899871];
  camPathList['rotor'].push({"frame":390, "picoEye":picoEye, "picoDir":picoDir, "picoUp":picoUp});

  //410
  picoEye = [1.2065398154189535, 0.679858966946426, 0.21841141189872626];
  picoDir = [-0.6122680634339003, -0.6597292715324093, 0.4357580828650439];
  picoUp = [-0.7370239193412177, 0.6755340801859873, 0.02120020816364129];
  camPathList['rotor'].push({"frame":410, "picoEye":picoEye, "picoDir":picoDir, "picoUp":picoUp});

  //420
  picoEye = [1.0169727510860445, 0.14323966903352575, 0.5490028577338081];
  picoDir = [-0.6805081772887165, -0.7237190724496315, 0.11462689394655122];
  picoUp = [-0.7621660756848956, 0.6442152550203605, -0.06394981058719398];
  camPathList['rotor'].push({"frame":420, "picoEye":picoEye, "picoDir":picoDir, "picoUp":picoUp});

  //430
  //picoEye = [0.6356926642937349, -0.2938980186351984, 0.5644974471545317];
  //picoDir = [-0.6385717972073157, -0.7328896620577133, -0.23473134230509696];
  //picoUp = [-0.7245329342042289, 0.6753637435081563, -0.13760756232147928];
  picoEye = [0.4863491134299662, -0.2938980186351984, 0.6972998430709243];
  picoDir = [-0.5661310640058796, -0.7328896620577123, -0.37731732217922787];
  picoUp = [-0.6723901841021994, 0.6753637435081563, -0.3029443088715483];
  camPathList['rotor'].push({"frame":430, "picoEye":picoEye, "picoDir":picoDir, "picoUp":picoUp});

  //450
  picoEye = [-0.2619685334717981, -0.5899537194456943, 0.7369350299785382];
  picoDir = [0.02200347513450028, -0.6470795739103173, -0.7621048957394564];
  picoUp = [-0.1898350265275319, 0.8407531309567344, -0.5070471728446374];
  camPathList['rotor'].push({"frame":450, "picoEye":picoEye, "picoDir":picoDir, "picoUp":picoUp});

  //470
  picoEye = [-0.8780284817988329, -1.045421494859839, 0.7110086029607725];
  picoDir = [0.1921362545227356, -0.2860336137924592, -0.938758984765952];
  picoUp = [-0.13211822110794902, 0.988894153409815, 0.06806709192522019];
  camPathList['rotor'].push({"frame":470, "picoEye":picoEye, "picoDir":picoDir, "picoUp":picoUp});

  //490
  picoEye = [-0.9689632610029416, -1.660665737918407, -0.07703958139989273];
  picoDir = [0.4258589651331985, -0.0030966168304646796, -0.9047842575884524];
  picoUp = [0.050073305687805374, 0.8640200169113372, 0.5009611506235079];
  camPathList['rotor'].push({"frame":490, "picoEye":picoEye, "picoDir":picoDir, "picoUp":picoUp});

  //520
  picoEye = [-0.3731060916340098, -2.685050606424624, -1.1774316217475562];
  picoDir = [0.6958355527248758, 0.2233865035364816, 0.6825769946327023];
  picoUp = [-0.19241684110712187, 0.9616206339340687, 0.19560551027666997];
  camPathList['rotor'].push({"frame":520, "picoEye":picoEye, "picoDir":picoDir, "picoUp":picoUp});

  //540
  picoEye = [0.16298921581086195, -2.9204977902665203, -1.150442706541002];
  picoDir = [0.14932502958634442, 0.12285672668445768, 0.9811260164970746];
  picoUp = [-0.31280795301605085, 0.9471593967026618, -0.07099480099104304];
  camPathList['rotor'].push({"frame":540, "picoEye":picoEye, "picoDir":picoDir, "picoUp":picoUp});

  //550
  picoEye = [0.329657084320371, -3.0373286068254575, -0.9196913921830118];
  picoDir = [-0.040292989007964373, 0.11975129302723113, 0.9919859388394124];
  picoUp = [-0.3092411612356124, 0.9425533950231078, -0.12634477325185817];
  camPathList['rotor'].push({"frame":550, "picoEye":picoEye, "picoDir":picoDir, "picoUp":picoUp});

  //575
  picoEye = [0.6944578490625232, -2.928953834120747, 0.3144789464349414];
  picoDir = [0.5204629687228612, 0.13819060584100684, 0.8426278268876963];
  picoUp = [-0.3094357696643162, 0.9502654762525795, 0.03528496981308845];
  camPathList['rotor'].push({"frame":575, "picoEye":picoEye, "picoDir":picoDir, "picoUp":picoUp});

  picoEye = [0.9772453416286452, -2.8548832522156995, 0.7844749098076782];
  picoDir = [0.6268700242271048, 0.1700915520900256, 0.7603307416073054];
  picoUp = [-0.3092874938033647, 0.9500734923322728, 0.04125051932270093];
  camPathList['rotor'].push({"frame":585, "picoEye":picoEye, "picoDir":picoDir, "picoUp":picoUp});

  picoEye = [1.7545641716702525, -2.643969727624065, 1.7272850294007378];
  picoDir = [0.6268700242271049, 0.17009155209002563, 0.7603307416073055];
  picoUp = [-0.3092874938033647, 0.9500734923322728, 0.04125051932270093];
  camPathList['rotor'].push({"frame":600, "picoEye":picoEye, "picoDir":picoDir, "picoUp":picoUp});
  camMovDir(0.1);
  camPathList['rotor'].push({"frame":-1, "picoEye":picoEye, "picoDir":picoDir, "picoUp":picoUp});

}

function init_tonnel5() {
  modelRenderList.push({
    model: 'tonnel5',
    campath: 'tonnel5',
  });
  let model = {
		fstart: useFrameLimit ? models_tonnel5_fstart : 0,
		fend: useFrameLimit ? models_tonnel5_fend : 9999,
    v: [],
    f: [],
  }

  let colors = [
    [
      '#3F4F5F','#7F7F0F','#4F5F6F','#3F4F5F','#2F3F4F',
      '#1F2F3F','#0F1F2F','#0F0F1F','#1F2F3F','#7F7F0F'
    ],[
      '#2F3F4F','#0F0F1F','#3F4F5F','#2F3F4F','#1F2F3F',
      '#0F1F2F','#0F0F1F','#000000','#0F1F2F','#0F0F1F'
    ]
  ];
  //colors[0] = changeColors(colors[0]);
  //colors[1] = changeColors(colors[1]);

  let nqty = 16;
  let sx = 1.5;
  let sy = 0.7;

  let d1 = 0.685;
  let dx2 = 0.8;
  let dy2 = 0.275;
  let d3 = 0;
  let d4 = 0.7;
  let d5 = 0.685;

  let mDz = 1.5;
  let mRot = -15;
  let mRotF = 25;

  for (let n = 0; n < nqty; n++) {
    let points = [
      [-sx*d1, -sy, 0],
      [-sx*dx2, -sy*dy2, 0],
      [-sx, -sy*d3, 0],
      [-sx, sy*d4, 0],
      [-sx*d5, sy, 0],

      [sx*d5, sy, 0],
      [sx, sy*d4, 0],
      [sx, -sy*d3, 0],
      [sx*dx2, -sy*dy2, 0],
      [sx*d1, -sy, 0],
    ];
    for (p in points) {
      model.v.push(points[p]);
    }

    // modify points
    for (v in model.v) {
      model.v[v][2] += mDz;
      if (n < 6) {
        model.v[v][2] += 0.5*mDz;
      }

      if (n == 6 || n == 7) {
        model.v[v] = rotX(model.v[v], mRot/2);
      }
      if (n > 7) {
        model.v[v] = rotX(model.v[v], mRot);
      }
    }

    // push polygons
    if (n < nqty - 1) {
      let nn = n*10;
      clr = n%2 == 0 ? 0 : 1;
      model.f.push([colors[clr][0], nn+1, nn+10, nn+20, nn+11]);
      //model.f.push([colors[clr][0], nn+20, nn+11, nn+1]);
      for (let i = 0; i < 9; i++) {
        model.f.push([colors[clr][1+i], nn+2+i, nn+1+i, nn+11+i, nn+12+i]);
        //model.f.push([colors[clr][1+i], nn+11+i, nn+12+i, nn+2+i]);
      }
    }
  }

  for (v in model.v) {
    //model.v[v][2] -= 1;
    //model.v[v] = rotX(model.v[v], mRotF);
    //model.v[v][2] -= 1.65;
    //model.v[v][1] -= 0.2;
  }

  models['tonnel5'] = model;

  // cam path tonnel5
  camPathList['tonnel5'] = [];
  let len = 1340-1190; //(150)
  let frm = 0;
  const frmStep = 11;
  for (let n = 0; n < nqty-1; n++) {
    let nn = (nqty-n-2)*10;

    let upp = normalize(vSub(model.v[nn+4-1], model.v[nn+3-1]));
    let hrz = normalize(vSub(model.v[nn+6-1], model.v[nn+5-1]));
    picoDir = normalize(cross(hrz, upp));
    picoUp = normalize(upp);
    picoEye = [
      (model.v[nn+3-1][0] + model.v[nn+8-1][0]) / 2,
      (model.v[nn+3-1][1] + model.v[nn+8-1][1]) / 2,
      (model.v[nn+3-1][2] + model.v[nn+8-1][2]) / 2,
    ];
    if (n==0) {
      camMovDir(-1.9);
      camRotDir(17);
      camRotUp(4);
      camRotH(8);
      camMovUp(0.2);
    }
    if (n==1) {
      camMovDir(-1.9);
      camRotDir(17);
      camRotUp(4);
      camRotH(6);
      camMovUp(0.4);
      camMovDir(0.5);
    }
    if (n==2) {
      camMovDir(-1.9);
      camRotDir(17);
      camRotUp(4);
      camRotH(0);
      camMovUp(0.4);
      camMovDir(0.5);
    }
    if (n==3) {
      camMovDir(-1.9);
      camRotDir(17);
      camRotUp(4);
      camRotH(0);
      camMovUp(0.4);
      camMovDir(0.5);
    }
    if (n==4) {
      camMovDir(-1.9);
      camRotDir(17);
      camRotUp(4);
      camRotH(0);
      camMovUp(0.2);
      camMovDir(0.5);
    }

    if (n > 4) {
      camMovDir(-1.9);
      camRotDir(17);
      camRotUp(4);
      camRotH(0);
      camMovUp(0.0);
      camMovDir(0.5);
    }

    if (n >= 6) {
      picoUp = camPathList['tonnel5'][camPathList['tonnel5'].length-1].picoUp;
      picoDir = camPathList['tonnel5'][camPathList['tonnel5'].length-1].picoDir;
    }
    if (n >= 6) {
      //camMovUp(-0.05 * (n-6));
      camMovDir(-0.05 * (n-6));
      camRotUp(2.5);
    }
    if (n >= 8) {
      camRotDir(-2.0);
    }
    if (n >= 10) {
      camRotH(-5);
      camRotUp(0.5);
    }
    if (n == 0) {
      camMovDir(-0.1);
      camPathList['tonnel5'].push({"frame":-1, "picoEye":picoEye, "picoDir":picoDir, "picoUp":picoUp});
      camMovDir(0.1);
    }
    camPathList['tonnel5'].push({"frame":1190+frm, "picoEye":picoEye, "picoDir":picoDir, "picoUp":picoUp});
    frm += frmStep;
  }

  let vdir = normalize(vSub(camPathList['tonnel5'][camPathList['tonnel5'].length-1].picoEye, camPathList['tonnel5'][camPathList['tonnel5'].length-2].picoEye));
  picoEye[0] += vdir[0];
  picoEye[1] += vdir[1];
  picoEye[2] += vdir[2];
  camRotH(-5);
  camPathList['tonnel5'].push({"frame":1190+frm+frmStep, "picoEye":picoEye, "picoDir":picoDir, "picoUp":picoUp});
  camPathList['tonnel5'].push({"frame":-1, "picoEye":picoEye, "picoDir":picoDir, "picoUp":picoUp});
}

function init_tonnel3() {
  modelRenderList.push({
    model: 'tonnel3',
    campath: 'tonnel2',// 'tonnel3',
  });

  let model = {
		fstart: useFrameLimit ? models_tonnel3_fstart : 0,
		fend: useFrameLimit ? models_tonnel3_fend : 9999,
    v: [],
    f: [],
  }

  let nqty = 4;
  let sx = 2.0;
  let sy = 0.75;
  let sz = 4;
  let bsz = 0.5;

  let dd = 0.275;
  let uu = 0.125;
  let ddd = 0.5;
  let uuu = 0.1;
  let uuu1 = 0.075;

  let mDx = sx*5.0;
  let mDy = sx*1.0;
  let mA1 = 22;
  let mA2 = 2;
  let mA3 = 5;
  let mRz = 8;

  colors = [
    [
      '#5F4F4F', '#4F3F3F', '#3F2F2F',
      '#2F1F1F', '#7F7F0F',
      '#6F5F5F', '#5F4F4F',
      '#2F1F1F', '#3F2F2F', '#4F3F3F', '#5F4F4F', '#6F5F5F',
      '#3F2F2F', '#4F3F3F', '#5F4F4F', '#6F5F5F', '#7F6F6F',

    ],[
      '#4F4F3F', '#3F3F2F', '#2F2F1F',
      '#2F1F1F', '#7F7F0F',
      '#5F5F4F', '#4F4F3F',
      '#1F1F0F', '#2F2F1F', '#3F3F2F', '#4F4F3F', '#5F5F4F',
      '#2F2F1F', '#3F3F2F', '#4F4F3F', '#5F5F4F', '#6F6F5F',
    ]
  ];

  camPathList['tonnel3'] = [];

  picoEye = [-0.8182420986748542, -0.29062341243165724, -4.4119376628131795];
  picoDir = [-0.7439393866881508, -0.31923433506859183, 0.5870635640604618];
  picoUp = [-0.11900897610965751, 0.9273891844788019, 0.3546634519048639];
  picoEye = [-1.7801733510084925, -0.34392629268699343, -5.652868375328305];
  picoDir = [-0.6634050935765127, -0.33924857250040585, 0.6669363446935362];
  picoUp = [-0.11747780304519831, 0.9271534892668756, 0.35578838251400363];
  camMovDir(-0.1);
  camPathList['tonnel3'].push({"frame":-1, "picoEye":picoEye, "picoDir":picoDir, "picoUp":picoUp});
  camPathList['tonnel3'].push({"frame":230, "picoEye":picoEye, "picoDir":picoDir, "picoUp":picoUp});

  picoEye = [-0.11081032230069038, 0.1621182017924546, -5.5739725987201965];
  picoDir = [-0.72993551188593, -0.31745993623084895, 0.6053208548993921];
  picoUp = [-0.09462810825391108, 0.9236277028409792, 0.3714261537277387];
  camPathList['tonnel3'].push({"frame":240, "picoEye":picoEye, "picoDir":picoDir, "picoUp":picoUp});

  picoEye = [0.15108805282764132, 0.3158241187087269, -4.025539460421117];
  picoDir = [-0.48988339898348965, -0.35645459160962334, 0.7955843007003092];
  picoUp = [-0.08882958925187798, 0.9279606442037327, 0.3619369377147572];
  camPathList['tonnel3'].push({"frame":255, "picoEye":picoEye, "picoDir":picoDir, "picoUp":picoUp});


  picoEye = [0.7554011580242874, 0.43243759594506775, -3.5538523759236464];
  picoDir = [-0.47643155796691744, -0.32984807624993634, 0.8149927712363049];
  picoUp = [-0.07487928293271544, 0.9385380463469623, 0.3369561225838016];
  camPathList['tonnel3'].push({"frame":260, "picoEye":picoEye, "picoDir":picoDir, "picoUp":picoUp});

  picoEye = [0.1834417157125638, 1.0302207382329638, -3.0842940410740294];
  picoDir = [-0.1793347031899026, -0.2435789874129799, 0.9531570390668356];
  picoUp = [-0.04061091009926922, 0.9697061296997466, 0.24087502154363702];
  camPathList['tonnel3'].push({"frame":265, "picoEye":picoEye, "picoDir":picoDir, "picoUp":picoUp});


  picoEye = [-0.06718303398527865, 0.03999999999999998, -1.4435166996832427];
  picoDir = [-0.21132479645538899, 0, 0.9774158942860958];
  picoUp = [0, 1, 0];
  picoEye = [-0.07528025162854733, 0.0023770992554984875, -1.406065584826991];
  picoDir = [-0.20970434478983216, 0.12360147674049266, 0.9699210084969995];
  picoUp = [0.026120056913770073, 0.9923319378854888, -0.12081004792339083];
  camPathList['tonnel3'].push({"frame":272, "picoEye":picoEye, "picoDir":picoDir, "picoUp":picoUp});

  picoEye = [-0.30598005397986805, 0.03999999999999998, -0.3390367391399551];
  picoDir = [-0.21132479645538899, 0, 0.9774158942860958];
  picoUp = [0, 1, 0];
  //camPathList['tonnel3'].push({"frame":277, "picoEye":picoEye, "picoDir":picoDir, "picoUp":picoUp});

  picoEye = [-0.6193606275118955, -0.12684675901290243, 1.3174718397112632];
  picoDir = [-0.3534270836006363, 0.1530375805469429, 0.9228590333945303];
  picoUp = [0, 0.9865721616069695, -0.1633259622416223];
  //camPathList['tonnel3'].push({"frame":285, "picoEye":picoEye, "picoDir":picoDir, "picoUp":picoUp});

  picoEye = [-1.804354578929214, 0.28226430843378136, 4.547565758933419];
  picoDir = [-0.615510802711745, 0.19924050494728418, 0.7625284735231169];
  picoUp = [0, 0.9739759672790517, -0.2266513074368552];
  camPathList['tonnel3'].push({"frame":300, "picoEye":picoEye, "picoDir":picoDir, "picoUp":picoUp});

  picoEye = [-3.811842109674175, 1.1825834544576832, 6.976862602438046];
  picoDir = [-0.7828435715133802, 0.26176466536299364, 0.5644778140082879];
  picoUp = [0, 0.9414705448120377, -0.3370952584230825];
  //camPathList['tonnel3'].push({"frame":315, "picoEye":picoEye, "picoDir":picoDir, "picoUp":picoUp});

  picoEye = [-5.728650436362118, 1.5415470277654413, 7.969150459874183];
  picoDir = [-0.868298849657964, 0.24594325287849586, 0.43077723250678046];
  picoUp = [0, 0.953190667792947, -0.30236989075044496];
  //camPathList['tonnel3'].push({"frame":330, "picoEye":picoEye, "picoDir":picoDir, "picoUp":picoUp});

  picoEye = [-7.917669572509831, 1.8741860903599386, 8.619666991434878];
  picoDir = [-0.9659035291590949, 0.2517437892575516, 0.06046020946254634];
  picoUp = [0, 0.925209718385782, -0.37945615952900547];
  camPathList['tonnel3'].push({"frame":345+5, "picoEye":picoEye, "picoDir":picoDir, "picoUp":picoUp});
  camPathList['tonnel3'].push({"frame":-1, "picoEye":picoEye, "picoDir":picoDir, "picoUp":picoUp});

  for (let n = 0; n < nqty; n++) {
    // create points
    let points = [
      [-sx+dd, -sy, 0], //1-8
      [-sx, -sy+dd, 0],
      [-sx, sy-uu, 0],
      [-sx+uu, sy, 0],
      [sx-uu, sy, 0],
      [sx, sy-uu, 0],
      [sx, -sy+dd, 0],
      [sx-dd, -sy, 0],

      [-sx+dd, -sy, 0],
      [-sx, -sy+dd, 0],
      [-sx, sy-uu, 0],
      [-sx+uu, sy, 0],
      [sx-uu, sy, 0],
      [sx, sy-uu, 0],
      [sx, -sy+dd, 0],
      [sx-dd, -sy, 0],

      [0,0,0,0], [0,0,0,0], [0,0,0,0], [0,0,0,0],

      [-sx+dd+ddd, -sy+uuu, 0],
      [-sx+ddd, -sy+dd+uuu, 0],
      [-sx+ddd, sy-uu-uuu1, 0],
      [-sx+uu+ddd, sy-uuu1, 0],
      [sx-uu-ddd, sy-uuu1, 0],
      [sx-ddd, sy-uu-uuu1, 0],
      [sx-ddd, -sy+dd+uuu, 0],
      [sx-dd-ddd, -sy+uuu, 0],

      [-sx+dd+ddd, -sy+uuu, 0],
      [-sx+ddd, -sy+dd+uuu, 0],
      [-sx+ddd, sy-uu-uuu1, 0],
      [-sx+uu+ddd, sy-uuu1, 0],
      [sx-uu-ddd, sy-uuu1, 0],
      [sx-ddd, sy-uu-uuu1, 0],
      [sx-ddd, -sy+dd+uuu, 0],
      [sx-dd-ddd, -sy+uuu, 0],

    ];
    // modify points
    let mRx = 5;
    for (let p in points) {
      points[p][0] += mDx;
      points[p][1] += mDy;
      let alpha = n*mA1;
      let alpha2 = n*mRx;
      if (p >= 8) {
        alpha = (n+1)*mA1 - mA2;
        alpha2 = (n+1)*mRx;
        if (p >= 28) {
          alpha = (n+1)*mA1;
        }
      }
      if (points[p][0] > 0 && alpha > 0) {
        alpha -= mA3;
      }
      points[p] = rotY(points[p], -alpha);
      points[p][0] -= mDx;
      points[p] = rotX(points[p], alpha2);
      points[p][1] -= mDy;
      points[p] = rotZ(points[p], mRz);


      if (points[p][2] == 0) {
        points[p][2] -= 0.25; //немного не хватает in для сцены
      }
    }

    points[16] = vecHalf(points[2-1], points[10-1]);
    points[17] = vecHalf(points[1-1], points[9-1]);
    points[18] = vecHalf(points[8-1], points[16-1]);
    points[19] = vecHalf(points[7-1], points[15-1]);

    // push points
    for (let p in points) {
      model.v.push(points[p]);
    }
    // push polygons
    let nn = n*36;
    clr = n%2 == 0 ? 0 : 1;

    model.f.push([colors[clr][0], nn+2, nn+3, nn+11, nn+10]);
    //model.f.push([colors[clr][0], nn+11, nn+10, nn+2]);
    model.f.push([colors[clr][1], nn+3, nn+4, nn+12, nn+11]);
    //model.f.push([colors[clr][1], nn+12, nn+11, nn+3]);
    model.f.push([colors[clr][2], nn+4, nn+5, nn+13, nn+12]);
    //model.f.push([colors[clr][2], nn+13, nn+12, nn+4]);
    model.f.push([colors[clr][1], nn+5, nn+6, nn+14, nn+13]);
    //model.f.push([colors[clr][1], nn+14, nn+13, nn+5]);
    model.f.push([colors[clr][0], nn+6, nn+7, nn+15, nn+14]);
    //model.f.push([colors[clr][0], nn+15, nn+14, nn+6]);

    model.f.push([colors[clr][3], nn+18, nn+1, nn+2, nn+17]);
    //model.f.push([colors[clr][4], nn+2, nn+17, nn+18]);
    model.f.push([colors[clr][4], nn+9, nn+18, nn+17, nn+10]);
    //model.f.push([colors[clr][3], nn+17, nn+10, nn+9]);

    model.f.push([colors[clr][3], nn+20, nn+7, nn+8, nn+19]);
    //model.f.push([colors[clr][4], nn+8, nn+19, nn+20]);
    model.f.push([colors[clr][4], nn+15, nn+20, nn+19, nn+16]);
    //model.f.push([colors[clr][3], nn+19, nn+16, nn+15]);

    model.f.push([colors[clr][5], nn+1, nn+18, nn+19, nn+8]);
    //model.f.push([colors[clr][5], nn+19, nn+8, nn+1]);
    model.f.push([colors[clr][6], nn+18, nn+9, nn+16, nn+19]);
    //model.f.push([colors[clr][6], nn+16, nn+19, nn+18]);

    model.f.push([colors[clr][10], nn+10, nn+22, nn+21, nn+9]);
    //model.f.push([colors[clr][10], nn+21, nn+9, nn+10]);

    model.f.push([colors[clr][9], nn+11, nn+23, nn+22, nn+10]);
    //model.f.push([colors[clr][9], nn+22, nn+10, nn+11]);

    model.f.push([colors[clr][8], nn+12, nn+24, nn+23, nn+11]);
    //model.f.push([colors[clr][8], nn+23, nn+11, nn+12]);

    model.f.push([colors[clr][7], nn+13, nn+25, nn+24, nn+12]);
    //model.f.push([colors[clr][7], nn+24, nn+12, nn+13]);

    model.f.push([colors[clr][8], nn+14, nn+26, nn+25, nn+13]);
    //model.f.push([colors[clr][8], nn+25, nn+13, nn+14]);

    model.f.push([colors[clr][9], nn+15, nn+27, nn+26, nn+14]);
    //model.f.push([colors[clr][9], nn+26, nn+14, nn+15]);

    model.f.push([colors[clr][10], nn+16, nn+28, nn+27, nn+15]);
    //model.f.push([colors[clr][10], nn+27, nn+15, nn+16]);

    model.f.push([colors[clr][11], nn+9, nn+21, nn+28, nn+16]);
    //model.f.push([colors[clr][11], nn+28, nn+16, nn+9]);

    // border-h
    model.f.push([colors[clr][12], nn+24, nn+25, nn+33, nn+32]);
    //model.f.push([colors[clr][12], nn+33, nn+32, nn+24]);
    for (let i = 1; i < 4; i++) {
      model.f.push([colors[clr][12+i], nn+24+i, nn+25+i, nn+33+i, nn+32+i]);
      //model.f.push([colors[clr][12+i], nn+33+i, nn+32+i, nn+24+i]);
      model.f.push([colors[clr][12+i], nn+24-i, nn+25-i, nn+33-i, nn+32-i]);
      //model.f.push([colors[clr][12+i], nn+33-i, nn+32-i, nn+24-i]);
    }
    model.f.push([colors[clr][16], nn+21, nn+29, nn+36, nn+28]);
    //model.f.push([colors[clr][16], nn+36, nn+28, nn+21]);

  }


  // model to model
  for (let v in model.v) {
    model.v[v] = rotY(model.v[v], 100);
    model.v[v] = rotX(model.v[v], 9);
    model.v[v] = rotZ(model.v[v], 6);
    model.v[v][0] += 13.9 -0.0253 + 0.85+0.3;
    model.v[v][2] += 6.75 - 0.75;
    model.v[v][1] += 0.4;
  }

  for (cp in camPathList['tonnel3']) {
    let c = camPathList['tonnel3'][cp];
    if (c['frame'] >= 272) {


    c.picoEye = rotY(c.picoEye, 101);
    c.picoEye = rotX(c.picoEye, 10);
    c.picoEye = rotZ(c.picoEye, 10);

    c.picoDir = normalize(rotY(c.picoDir, 101));
    c.picoDir = normalize(rotX(c.picoDir, 10));
    c.picoDir = normalize(rotZ(c.picoDir, 10));

    c.picoUp = normalize(rotY(c.picoUp, 101));
    c.picoUp = normalize(rotX(c.picoUp, 10));
    c.picoUp = normalize(rotZ(c.picoUp, 10));

    c.picoEye[0] += 13.9 -0.025 +0.5;
    c.picoEye[2] += 6.75;
    c.picoEye[1] += 0.6;
    camPathList['tonnel3'][cp] = c;
    }
  }

  models['tonnel3'] = model;

}


function init_tonnel2() {
  modelRenderList.push({
    model: 'tonnel2',
    campath: 'tonnel2',
  });
  let model = {
		fstart: useFrameLimit ? models_tonnel2_fstart : 0,
		fend: useFrameLimit ? models_tonnel2_fend : 9999,
    v: [],
    f: [],
  }

  let colors = [
    [
      '#5F5F5F', '#2F2F2F', '#3F3F3F', '#4F4F4F',
      '#4F4F4F', '#1F1F1F', '#2F2F2F', '#3F3F3F',
      '#6F6F6F', '#3F3F3F', '#4F4F4F', '#5F5F5F'
    ],[
      '#1F4F6F', '#0F1F3F', '#0F2F4F', '#0F3F5F',
      '#0F3F5F', '#0F0F2F', '#0F1F3F', '#0F2F4F',
      '#2F5F7F', '#0F2F4F', '#0F3F5F', '#1F4F6F'
    ],
  ];
  let colors2 = [
    '#2F5F7F', '#0F2F4F', '#0F1F3F', '#0F3F5F', '#1F4F6F',
  ];

  /*colors2 = [
    '#7F5F2F', '#4F2F0F', '#3F1F0F', '#5F3F0F', '#6F4F1F',
  ];*/

  let nqty = 6;
  let sx = 2;
  let sy = 1.15;
  let bsx = 0.6;
  let bsy = 0.2;
  let pqty = 16;

  let mDx = sx*4.0;
  let mA1 = 17;
  let mA2 = 3;

  picoEye = [0.16315171008539667, 0.010040940234602069, -2.0926391519412997];
  picoDir = [-0.16676849271283986, 0.001745328365898307, 0.9859945353130425];
  picoUp = [0.18223551240280153, 0.9832534076734651, -0.0017188129062887829];

  camPathList['tonnel2'] = [];
  camMovDir(0.1);
  camPathList['tonnel2'].push({"frame":-1, "picoEye":picoEye, "picoDir":picoDir, "picoUp":picoUp});
  camMovDir(-0.1);
  camPathList['tonnel2'].push({"frame":173, "picoEye":picoEye, "picoDir":picoDir, "picoUp":picoUp});

  resetCam();
  camRotDir(-10);
  picoEye[2] += 1.90;
  picoEye[0] += 0.35;
  picoEye[1] -= 0.35;
  camPathList['tonnel2'].push({"frame":177, "picoEye":picoEye, "picoDir":picoDir, "picoUp":picoUp});

  picoEye = [1.2118811795646676, -0.1618976747122177, 4.208205932368166];
  picoDir = [0.5272266745256553, 0.0020149889469579653, 0.8497222919802461];
  picoUp = [0.20176649522500978, 0.9794326527627227, -0.0014000381394823859];
  camPathList['tonnel2'].push({"frame":187, "picoEye":picoEye, "picoDir":picoDir, "picoUp":picoUp});

  picoEye = [3.532078964740238, 0.015360282490033352, 6.963128908785274];
  picoDir = [0.31329695543941616, 0.1907433223191845, 0.9303021029230409];
  picoUp = [0.03888747046026384, 0.9822045838855412, -0.1837441700719594];


  picoEye = [3.9953554568028538, 0.053869481702889986, 7.021321319454586];
  picoDir = [0.20217624291370961, 0.2004399736097274, 0.9586180593858163];
  picoUp = [0.0832360261211493, 0.9778231447376399, -0.19218132471952662];

  picoEye = [3.9894126927305984, -0.38618852218595257, 7.275751923254845];
  picoDir = [0.2154863640136507, 0.3395420261049911, 0.9155745952311554];
  picoUp = [0.050595572335059104, 0.9425465808082624, -0.33022118506652687];

  camPathList['tonnel2'].push({"frame":196, "picoEye":picoEye, "picoDir":picoDir, "picoUp":picoUp});

    picoEye = [6.288305489964638, -0.09382970283748764, 8.097398648591554];
  picoDir = [0.2921571597249339, 0.22181894557153808, 0.9302905725669752];
  picoUp = [0.09971676123145778, 0.973440729217379, -0.20608181440934106];
  camPathList['tonnel2'].push({"frame":202, "picoEye":picoEye, "picoDir":picoDir, "picoUp":picoUp});


  picoEye = [7.249540162239529, 0.16587842382352205, 8.177759269839711];
  picoDir = [0.411937262439406, 0.011982624763623545, 0.9111334197128883];
  picoUp = [0.16332691990534992, 0.9865483178619379, -0.006836209330652075];
  camPathList['tonnel2'].push({"frame":205, "picoEye":picoEye, "picoDir":picoDir, "picoUp":picoUp});

  picoEye = [9.098963866438767, 0.19901087454294347, 8.304368124551361];
  picoDir = [0.503682237433584, 0.04710143358156212, 0.8626039987436069];
  picoUp = [0.16332691990534992, 0.9865483178619379, -0.006836209330652075];

  picoEye = [9.050801667693284, 0.11970560236484148, 8.345098414735874];
  picoDir = [0.522318828757763, 0.03569052771316494, 0.8520030676920562];
  picoUp = [0.16393881114674486, 0.9864603669797756, -0.0044733184459234505];

  camPathList['tonnel2'].push({"frame":211, "picoEye":picoEye, "picoDir":picoDir, "picoUp":picoUp});

  picoEye = [10.032045235345297, 0.16731293041299433, 8.020386939462579];
  picoDir = [0.5287322917576924, 0.042927043930271296, 0.8477024434033837];
  picoUp = [0.16474680532750335, 0.9863050653592488, -0.007797960058231747];
  camPathList['tonnel2'].push({"frame":217, "picoEye":picoEye, "picoDir":picoDir, "picoUp":picoUp});

  picoEye = [10.228942876385824, 0.023111666460030378, 8.350297328292744];
  picoDir = [0.7556264046780922, 0.0039524560092992905, 0.6549909271468993];
  picoUp = [0.16332691990534992, 0.9865483178619379, -0.006836209330652075];

  picoEye = [10.832358050029931, 0.08819897432894037, 7.591132280038919];
  picoDir = [0.6580881738383751, 0.02657996084437284, 0.752471568323737];
  picoUp = [0.2811179120930983, 0.9526046258113152, -0.11626326325757995];
  camPathList['tonnel2'].push({"frame":230, "picoEye":picoEye, "picoDir":picoDir, "picoUp":picoUp});

  picoEye = [10.492434925654488, 0.4342351447591723, 7.096081223925469];
  picoDir = [0.8213540676722539, -0.028710994850706342, 0.5696956856892328];
  picoUp = [0.29805875767065104, 0.9398715731812826, -0.16674052567258238];
  camPathList['tonnel2'].push({"frame":238, "picoEye":picoEye, "picoDir":picoDir, "picoUp":picoUp});

  picoEye = [10.503151781265018, 1.3908959111776178, 6.267721232053096];
  picoDir = [0.8059069517475019, -0.27005206500662776, 0.5268641829833434];
  picoUp = [0.4836043001164522, 0.8732981211360372, -0.05896840280305724];
  camPathList['tonnel2'].push({"frame":248, "picoEye":picoEye, "picoDir":picoDir, "picoUp":picoUp});

  picoEye = [10.809885497501924, 1.6685539041869812, 6.189395450549603];
  picoDir = [0.8536749259988414, -0.3891588598513407, 0.34611342435692516];
  picoUp = [0.5460884825845248, 0.8361182379891694, -0.05190049412498833];
  camPathList['tonnel2'].push({"frame":258, "picoEye":picoEye, "picoDir":picoDir, "picoUp":picoUp});

  picoEye = [12.134608921353186, 1.0294400021359373, 6.341119408659993];
  picoDir = [0.9823712566594063, -0.1633072490619756, 0.09098052809930803];
  picoUp = [0.2955135331537509, 0.9441069093978508, -0.14606127258868254];
  camPathList['tonnel2'].push({"frame":265, "picoEye":picoEye, "picoDir":picoDir, "picoUp":picoUp});


  // tonnel 3
  picoEye = [13.748000755224625, 0.3212551769883694, 6.035382116767029];
  picoDir = [0.9667918739663479, 0.2472922723303494, 0.06449809670315627];
  picoUp = [-0.11021826653642032, 0.9766696902019215, -0.18430477466031459];
  camPathList['tonnel2'].push({"frame":272, "picoEye":picoEye, "picoDir":picoDir, "picoUp":picoUp});

  picoEye = [17.326249812999624, 0.707675320734195, 6.410938973724587];
  picoDir = [0.8832626305748209, 0.4036092715371722, 0.23863503799585006];
  picoUp = [-0.2613329871713464, 0.9552186068333138, -0.13878934748576366];
  camPathList['tonnel2'].push({"frame":287, "picoEye":picoEye, "picoDir":picoDir, "picoUp":picoUp});

  picoEye = [21.092609702158267, 1.8388679167495754, 7.472135394367722];
  picoDir = [0.6942830768855234, 0.5350346361581032, 0.4813615556538938];
  picoUp = [-0.4285936675846266, 0.894633642370126, -0.1262462436903379];
  camPathList['tonnel2'].push({"frame":305, "picoEye":picoEye, "picoDir":picoDir, "picoUp":picoUp});

  picoEye = [23.36902477833356, 3.5999814013794658, 9.510123455069872];
  picoDir = [0.5755214026760941, 0.3365345698459256, 0.7453318712898028];
  picoUp = [-0.4113824015498961, 0.9090225186301493, 0.06665268425457566];
  camPathList['tonnel2'].push({"frame":325, "picoEye":picoEye, "picoDir":picoDir, "picoUp":picoUp});

  picoEye = [24.429482985820712, 4.711449471473089, 11.36641355260299];
  picoDir = [0.42797510172631814, -0.04725084725535299, 0.9025545245224794];
  picoUp = [-0.314135488927993, 0.8915287660848609, 0.32633625884841];
  camPathList['tonnel2'].push({"frame":340, "picoEye":picoEye, "picoDir":picoDir, "picoUp":picoUp});


  picoEye = [24.78879976657358, 4.870387194743223, 11.97632396618108];
  picoDir = [0.32304696590359705, -0.09838874277071898, 0.9412546483903691];
  picoUp = [-0.33381146797772293, 0.882196340158097, 0.33211371735930584];
  camPathList['tonnel2'].push({"frame":345, "picoEye":picoEye, "picoDir":picoDir, "picoUp":picoUp});

  camMovDir(0.1);
  camPathList['tonnel2'].push({"frame":-1, "picoEye":picoEye, "picoDir":picoDir, "picoUp":picoUp});


  for (let n = 0; n < nqty; n++) {

    // create points
    let points = [
      [-sx, -sy, 0],
      [-sx,  sy, 0],
      [ sx,  sy, 0],
      [ sx, -sy, 0],

      [-sx, -sy, 0],
      [-sx,  sy, 0],
      [ sx,  sy, 0],
      [ sx, -sy, 0],

      [-sx+bsx, -sy+bsy, 0],
      [-sx+bsx,  sy-bsy, 0],
      [ sx-bsx,  sy-bsy, 0],
      [ sx-bsx, -sy+bsy, 0],

      [-sx+bsx, -sy+bsy, 0],
      [-sx+bsx,  sy-bsy, 0],
      [ sx-bsx,  sy-bsy, 0],
      [ sx-bsx, -sy+bsy, 0],

    ];

    // modify points
    for (let p in points) {
      points[p][0] -= mDx;
      let alpha = n*mA1;
      if (p >= 4) {
        alpha = (n+1)*mA1 - mA2;
      }
      if (p >= 12) {
        alpha = (n+1)*mA1;
      }
      points[p] = rotY(points[p], alpha);
      points[p][0] += mDx;
      points[p] = rotX(points[p], 2);
    }

    // push points
    for (let p in points) {
      model.v.push(points[p]);
    }
    // push polygons
    if (n < nqty) {
      let nn = n*pqty;
      let n1 = 4;
      let n2 = 8;
      model.f.push([colors[n%2][0], nn+1, nn+2, nn+6, nn+5]);
      //model.f.push([colors[n%2][0], nn+6, nn+5, nn+1]);
      model.f.push([colors[n%2][1], nn+2, nn+3, nn+7, nn+6]);
      //model.f.push([colors[n%2][1], nn+7, nn+6, nn+2]);
      model.f.push([colors[n%2][2], nn+3, nn+4, nn+8, nn+7]);
      //model.f.push([colors[n%2][2], nn+8, nn+7, nn+3]);
      model.f.push([colors[n%2][3], nn+4, nn+1, nn+5, nn+8]);
      //model.f.push([colors[n%2][3], nn+5, nn+8, nn+4]);
      //---
      model.f.push([colors[n%2][4], nn+n1+1, nn+n1+2, nn+n1+6, nn+n1+5]);
      //model.f.push([colors[n%2][4], nn+n1+6, nn+n1+5, nn+n1+1]);
      model.f.push([colors[n%2][5], nn+n1+2, nn+n1+3, nn+n1+7, nn+n1+6]);
      //model.f.push([colors[n%2][5], nn+n1+7, nn+n1+6, nn+n1+2]);
      model.f.push([colors[n%2][6], nn+n1+3, nn+n1+4, nn+n1+8, nn+n1+7]);
      //model.f.push([colors[n%2][6], nn+n1+8, nn+n1+7, nn+n1+3]);
      model.f.push([colors[n%2][7], nn+n1+4, nn+n1+1, nn+n1+5, nn+n1+8]);
      //model.f.push([colors[n%2][7], nn+n1+5, nn+n1+8, nn+n1+4]);
      //---
      model.f.push([colors[n%2][8], nn+n2+1, nn+n2+2, nn+n2+6, nn+n2+5]);
      //model.f.push([colors[n%2][8], nn+n2+6, nn+n2+5, nn+n2+1]);
      model.f.push([colors[n%2][9], nn+n2+2, nn+n2+3, nn+n2+7, nn+n2+6]);
      //model.f.push([colors[n%2][9], nn+n2+7, nn+n2+6, nn+n2+2]);
      model.f.push([colors[n%2][10], nn+n2+3, nn+n2+4, nn+n2+8, nn+n2+7]);
      //model.f.push([colors[n%2][10], nn+n2+8, nn+n2+7, nn+n2+3]);
      model.f.push([colors[n%2][11], nn+n2+4, nn+n2+1, nn+n2+5, nn+n2+8]);
      //model.f.push([colors[n%2][11], nn+n2+5, nn+n2+8, nn+n2+4]);
    }
  }

  sx = 2;
  sy = 1.75;//1.75;
  sz = 2.2;
  let bs = 0.25;
  bsx = 0.15;
  //--- squad
  points = [
    [-sx, -sy, -sz],
    [-sx,  0,  -sz],
    [-sx,  sy, -sz],

    [-sx, -sy, 0],
    [-sx,  0,  0],
    [-sx,  sy, 0],

    [-sx, -sy, sz],
    [-sx,  0,  sz],
    [-sx,  sy, sz],

    [-sx-bsx, -sy + bs, -sz + bs],
    [-sx-bsx,  0 - bs,  -sz + bs],
    [-sx-bsx,  0 - bs,  0 - bs],
    [-sx-bsx, -sy + bs, 0 - bs],

    [-sx-bsx,  0 + bs,  0 + bs],
    [-sx-bsx,  sy - bs, 0 + bs],
    [-sx-bsx,  sy - bs, sz - bs],
    [-sx-bsx,  0 + bs,  sz - bs],
  ];
  let points2 = [];
  for (let p in points) {
    points[p][1] += 0.25;
    let pp = points[p];
    pp = rotY(pp, 180);
    points2.push(pp);
  }

  // modify points
  let alpha2 = -15;
  let nstp = 0.8;
  for (let p in points) {
    points[p] = rotY(points[p], alpha2);
    alpha = (nqty+nstp)*mA1;
    points[p][0] -= mDx;
    points[p] = rotY(points[p], alpha);
    points[p][0] += mDx;
    points[p] = rotX(points[p], 2);
  }
  for (let p in points2) {
    points2[p] = rotY(points2[p], alpha2);
    alpha = (nqty+nstp)*mA1;
    points2[p][0] -= mDx;
    points2[p] = rotY(points2[p], alpha);
    points2[p][0] += mDx;
    points2[p] = rotX(points2[p], 2);
  }

  // push points
  for (let p in points) {
    model.v.push(points[p]);
  }
  for (let p in points2) {
    model.v.push(points2[p]);
  }
  // push polygons
  for (let k = 0; k < 2; k++) {
    let nn = nqty*pqty + 17*k;
    model.f.push([colors2[0], nn+2, nn+3, nn+6, nn+5]);
    //model.f.push([colors2[0], nn+6, nn+5, nn+2]);
    model.f.push([colors2[0], nn+4, nn+5, nn+8, nn+7]);
    //model.f.push([colors2[0], nn+8, nn+7, nn+4]);
    for (let m = 0; m < 2; m++) {
      nn += m*4;
      model.f.push([colors2[0], nn+10, nn+11, nn+12, nn+13]);
      //model.f.push([colors2[0], nn+12, nn+13, nn+10]);
      model.f.push([colors2[1], nn+1, nn+2, nn+11, nn+10]);
      //model.f.push([colors2[1], nn+11, nn+10, nn+1]);
      model.f.push([colors2[2], nn+2, nn+5, nn+12, nn+11]);
      //model.f.push([colors2[2], nn+12, nn+11, nn+2]);
      model.f.push([colors2[3], nn+5, nn+4, nn+13, nn+12]);
      //model.f.push([colors2[3], nn+13, nn+12, nn+5]);
      model.f.push([colors2[4], nn+4, nn+1, nn+10, nn+13]);
      //model.f.push([colors2[4], nn+10, nn+13, nn+4]);
    }
  }
  let nn = nqty*pqty;
  model.f.push([colors2[1], nn+3+17, nn+9, nn+3, nn+9+17]);
  //model.f.push([colors2[1], nn+3, nn+9+17, nn+3+17]);

  model.f.push([colors2[3], nn+1, nn+7, nn+1+17, nn+7+17]);
  //model.f.push([colors2[3], nn+1+17, nn+7+17, nn+1]);

  // tonnel3 portal
  sx = 2;
  sy = 1.75;
  let dx = 0.2;
  let dy = 0.32;
  let dz = 0.15;
  nnqty = 5;

  let v3 = normalize(vSub(model.v[nn+4-1], model.v[nn+1-1]));
  let v3mv = 2.2;

  let colors3 = [
    ['#7F7F0F','#1F4F6F','#7F7F0F','#1F4F6F'],
    ['#1F4F6F','#0F3F5F','#0F2F4F','#2F5F7F'],
    ['#7F7F0F','#7F7F0F','#7F7F0F','#7F7F0F'],
    ['#1F4F6F','#0F3F5F','#0F2F4F','#2F5F7F'],
  ];

  for (let n = 0; n < nnqty; n++) {
    nn = model.v.length;
    let ddx = dx*n;
    let ddy = dy*n;
    let ddz = Math.floor(n/2) * n * dz;
    points = [
      [-sx+ddx, -sy+ddy, ddz],
      [-sx+ddx, sy-ddy, ddz],
      [sx-ddx, sy-ddy, ddz],
      [sx-ddx, -sy+ddy, ddz],
    ];
    for (let p in points) {
      points[p][1] += 0.25;
      points[p] = rotY(points[p], alpha2);
      alpha = (nqty+nstp)*mA1;
      points[p][0] -= mDx;
      points[p] = rotY(points[p], alpha);
      points[p][0] += mDx;
      points[p] = rotX(points[p], 2);
      points[p][0] += v3[0] * v3mv;
      points[p][1] += v3[1] * v3mv;
      points[p][2] += v3[2] * v3mv;
    }

    for (p in points) {
      model.v.push(points[p]);
    }
    if (n < nnqty-1) {


      model.f.push([colors3[n][0], nn+1, nn+2, nn+6, nn+5]);
      //model.f.push([colors3[n][0], nn+6, nn+5, nn+1]);
      model.f.push([colors3[n][1], nn+2, nn+3, nn+7, nn+6]);
      //model.f.push([colors3[n][1], nn+7, nn+6, nn+2]);
      model.f.push([colors3[n][2], nn+3, nn+4, nn+8, nn+7]);
      //model.f.push([colors3[n][2], nn+8, nn+7, nn+3]);
      model.f.push([colors3[n][3], nn+4, nn+1, nn+5, nn+8]);
      //model.f.push([colors3[n][3], nn+5, nn+8, nn+4]);

    }
  }

  models['tonnel2'] = model;
}


function init_tonnel4_NEW() {
  modelRenderList.push({
    model: 'tonnel4',
    campath: 'rotor',
  });
  let model = {
		fstart: useFrameLimit ? models_tonnel4_fstart : 0,
		fend: useFrameLimit ? models_tonnel4_fend : 9999,
    v: [],
    f: [],
  }
  let colors = [
    ['#7f7f0f', '#2f3f2f' ,'#5f6f5f'],
    ['#0f1f0f', '#1f2f1f' ,'#4f5f4f'],
  ];
  var ml = 0.5;
  const sx = ml*2.5;
  const sy = ml*1;
  const sz = 1;
  const nqty = 20;
  const rz = -(180 / nqty);
  const rx = -1;
  
  for (let n = 0; n <= nqty; n++) {

    // create points
    let points = [
			[-sx, -sy, 0],
			[-sx, sy, 0],
			[sx, sy, 0],
			[sx, -sy, 0],
    ];
    // push points
    let nn = model.v.length;
    for (let p in points) {
      model.v.push(points[p]);
    }
    //modify points
    
    for (let v in model.v) {
      model.v[v] = vMov(model.v[v], [0,0,1], sz)
      model.v[v] = rotX(model.v[v], 2*rx);
    }
    for (let v in model.v) {
      model.v[v] = rotZ(model.v[v], rz);
    }
    
    

    // push polygons
    if (n < nqty) {
      let nn = n*4;
      model.f.push([colors[n%2][0], nn+1, nn+5, nn+6, nn+2]);
      //model.f.push([colors[n%2][0], nn+6, nn+2, nn+1]);
      model.f.push([colors[n%2][1], nn+2, nn+6, nn+7, nn+3]);
      //model.f.push([colors[n%2][1], nn+7, nn+3, nn+2]);
      model.f.push([colors[n%2][0], nn+3, nn+7, nn+8, nn+4]);
      //model.f.push([colors[n%2][0], nn+8, nn+4, nn+3]);
      model.f.push([colors[n%2][2], nn+4, nn+8, nn+5, nn+1]);
      //model.f.push([colors[n%2][2], nn+5, nn+1, nn+4]);
    }
  }
    for (let v in model.v) {
      //model.v[v] = rotZ(model.v[v], -rz*0.85);
      model.v[v][2] -= 2;
    }
  models['tonnel4'] = model;
  resetCam();
}


function init_tonnel4() {
  modelRenderList.push({
    model: 'tonnel4',
    campath: 'tonnel3',// 'tonnel3',
  });
  let model = {
		fstart: useFrameLimit ? models_tonnel4_fstart : 0,
		fend: useFrameLimit ? models_tonnel4_fend : 9999,
    v: [],
    f: [],
  }
  let colors = [
    ['#8f1f0f', '#1f2f1f' ,'#4f5f4f'],
    ['#7f7f0f', '#2f3f2f' ,'#5f6f5f'],
  ];

  /*
  colors = [
    ['#404040', '#ff0000' ,'#ff0000'],
    ['#ffffff', '#0000a0' ,'#0000a0'],
  ];
  */

  var ml = 0.5;
  const sx = ml*2.5;
  const sy = ml*1;
  const sz = 1.0;
  const nqty = 20;
  const rz = -(180 / nqty);
  const rx = -1;
  let prevPoints = [];

  // first for spline
  camPathList['tonnel4'] = [];

  for (let n = 0; n <= nqty; n++) {

    // create points
    let points = [
			[-sx, -sy, sz*n],
			[-sx, sy, sz*n],
			[sx, sy, sz*n],
			[sx, -sy, sz*n],
    ];

    // modify points
    for (let p in points) {
      points[p] = rotX(points[p], rx*n);
      points[p] = rotZ(points[p], rz*n);
      points[p] = rotZ(points[p], -15);
    }


    //model to model
    for (let p in points) {
      points[p] = rotZ(points[p],17);
      points[p][2] += 2.25;
      points[p][1] -= 2.85;
      points[p] = rotY(points[p],45);
    }

    resetCam();
    picoEye[0] = (points[0][0] + points[1][0] + points[2][0] + points[3][0]) / 4;
    picoEye[1] = (points[0][1] + points[1][1] + points[2][1] + points[3][1]) / 4;
    picoEye[2] = (points[0][2] + points[1][2] + points[2][2] + points[3][2]) / 4;
    picoUp = normalize(vSub(points[2-1], points[1-1]));
    let vh = normalize(vSub(points[4-1], points[1-1]));
    picoDir = normalize(cross(vh, picoUp));
    camRotDir(-rz*n);
    if (n == 0) {
      camMovDir(-0.1);
      camPathList['tonnel4'].push({"frame":-1, "picoEye":picoEye, "picoDir":picoDir, "picoUp":picoUp});
      camMovDir(+0.1);
    }
    camPathList['tonnel4'].push({"frame":590 + n*7, "picoEye":picoEye, "picoDir":picoDir, "picoUp":picoUp});

    
    for (let p in points) {
      prevPoints[p] = [];
      prevPoints[p][0] = points[p][0];
      prevPoints[p][1] = points[p][1];
      prevPoints[p][2] = points[p][2];
    }

    // push points
    for (let p in points) {
      model.v.push(points[p]);
    }
    // push polygons
    if (n < nqty) {
      let nn = n*4;
      model.f.push([colors[n%2][0], nn+1, nn+2, nn+6, nn+5]);
      //model.f.push([colors[n%2][0], nn+6, nn+5, nn+1]);
      model.f.push([colors[n%2][1], nn+2, nn+3, nn+7, nn+6]);
      //model.f.push([colors[n%2][1], nn+7, nn+6, nn+2]);
      model.f.push([colors[n%2][0], nn+3, nn+4, nn+8, nn+7]);
      //model.f.push([colors[n%2][0], nn+8, nn+7, nn+3]);
      model.f.push([colors[n%2][2], nn+4, nn+1, nn+5, nn+8]);
      //model.f.push([colors[n%2][2], nn+5, nn+8, nn+4]);
    }
  }
  models['tonnel4'] = model;
}


function init_arch1() {
  modelRenderList.push({
    model: 'arch1',
    campath: 'arch1',
  });
  let model = {
		fstart: useFrameLimit ? models_arch1_fstart : 0,
		fend: useFrameLimit ? models_arch1_fend : 9999,
    v: [],
    f: [],
  }
  camPathList['arch1'] = [];
  let colors = [
    [
      '#6F4F2F',
      '#6F4F2F', '#5F3F1F', '#4F2F0F', '#5F3F1F', '#7F5F3F',
      '#5F3F1F', '#4F2F0F', '#3F1F0F', '#4F2F0F', '#6F4F2F',
    ],[
      '#7F5F4F',
      '#7F5F4F', '#6F4F3F', '#5F3F2F', '#6F4F3F', '#7F6F5F', 
      '#6F4F3F', '#5F3F2F', '#4F2F1F', '#5F3F2F', '#7F5F4F',
    ],
  ];

  let sx = 1.5;
  let sy = 2.75;
  let sy1 = 0.2;
  let sx1 = 0.2;
  let dd = 0.2;

  for (let j = 0; j < 2; j++) {
    let jj = j * 49;
    let zmv = sx*j*6;
    var points = [
      //top
      [0, sy*1.25, 0],
      
      //bott
      [-sx, -sy, sx],
      [sx, -sy, sx],
      [sx, -sy, -sx],
      [-sx, -sy, -sx],
      
      //midl
      [-sx-dd, sy1, sx+dd],
      [sx+dd, sy1, sx+dd],
      [sx+dd, sy1, -sx-dd],
      [-sx-dd, sy1, -sx-dd],
    ];
    for (p in points) {
      points[p][2] += zmv;
      model.v.push(points[p]);
    }  
    model.f.push([colors[j][0], jj+2, jj+3, jj+4, jj+5]);
    //model.f.push([colors[j][0], jj+4, jj+5, jj+2]);

    let rotList = [0,90,2*90,3*90];
    
    let cList = [
      [0, 1,2,3,4,5, 6,7,8,9,10],
      [0, 1,2,3,4,5, 6,7,8,9,10],
      [0, 4,3,2,1,5, 9,8,7,6,10],
      [0, 1,2,3,4,5, 6,7,8,9,10],
    ]

    for (n = 0; n < 4; n++) {
      let ni = n*10 + jj;
      var points2 = [
        [-sx, -sy, sx + 2*sx*sx1],
        [-sx-dd, sy1, sx + 2*sx*sx1+dd],
        [0, sy, sx + 2*sx*sx1],
        [sx+dd, sy1, sx + 2*sx*sx1+dd],
        [sx, -sy, sx + 2*sx*sx1],
        
        [-sx, -sy, sx + 2*sx],
        [-sx-dd, sy1, sx + 2*sx],
        [0, sy, sx + 2*sx],
        [sx+dd, sy1, sx + 2*sx],
        [sx, -sy, sx + 2*sx],
      ];
      for (p in points2) {
        let point = rotY(points2[p], rotList[n]);
        point[2] += zmv;
        model.v.push(point);
      }
      
      let p1 = jj + 1;
      let p2 = jj + n+2;
      let p6 = jj + n+6;
      let p3 = jj + (n+3 <= 5 ? n+3 : 2);
      let p7 = jj + (n+7 <= 9 ? n+7 : 6);

      model.f.push([colors[j][cList[n][1]], p2, p6, ni+11, ni+10]);
      //model.f.push([colors[j][cList[n][1]], ni+11, ni+10, p2]);

      model.f.push([colors[j][cList[n][2]], p6, p1, ni+12, ni+11]);
      //model.f.push([colors[j][cList[n][2]], ni+12, ni+11, p6]);

      model.f.push([colors[j][cList[n][3]], p1, p7, ni+13, ni+12]);
      //model.f.push([colors[j][cList[n][3]], ni+13, ni+12, p1]);
      
      model.f.push([colors[j][cList[n][4]], p7, p3, ni+14, ni+13]);
      //model.f.push([colors[j][cList[n][4]], ni+14, ni+13, p7]);

      model.f.push([colors[j][cList[n][5]], p3, p2, ni+10, ni+14]);
      //model.f.push([colors[j][cList[n][5]], ni+10, ni+14, p3]);
      
      model.f.push([colors[j][cList[n][6]], ni+10, ni+11, ni+16, ni+15]);
      //model.f.push([colors[j][cList[n][6]], ni+16, ni+15, ni+10]);
      
      model.f.push([colors[j][cList[n][7]], ni+11, ni+12, ni+17, ni+16]);
      //model.f.push([colors[j][cList[n][7]], ni+17, ni+16, ni+11]);

      model.f.push([colors[j][cList[n][8]], ni+12, ni+13, ni+18, ni+17]);
      //model.f.push([colors[j][cList[n][8]], ni+18, ni+17, ni+12]);

      model.f.push([colors[j][cList[n][9]], ni+13, ni+14, ni+19, ni+18]);
      //model.f.push([colors[j][cList[n][9]], ni+19, ni+18, ni+13]);

      model.f.push([colors[j][cList[n][10]], ni+14, ni+10, ni+15, ni+19]);
      //model.f.push([colors[j][cList[n][10]], ni+15, ni+19, ni+14]);
    }
  }


  let colors3 = [
    '#5F6F5F', '#3F4F3F', '#2F3F2F', '#2F3F2F', '#1F2F1F',
    '#4F5F4F',
    
    '#3F4F3F', '#2F3F2F', '#1F2F1F',
    '#4F5F4F', '#2F3F2F', '#1F2F1F', '#0F1F0F',
    
  ];

  let dzz = 0.1;
  let points3 = [
    [0, sy*1.25, -sx*2],

    [-sx-dd, -sy, -sx*2],
    [-sx-dd, sy, -sx*2],
    [sx+dd, sy, -sx*2],
    [sx+dd, -sy, -sx*2],

    [-sx-dd, -sy, 0],
    [-sx-dd, sy1, 0],
    [sx+dd, sy1, 0],
    [sx+dd, -sy, 0],

    [-sx-dd, -sy, sx*2],
    [-sx-dd, sy1, sx*2],
    
    [sx+dd + sx*4, sy1, sx*2],
    [sx+dd + sx*4, -sy, sx*2],
    [sx+dd + sx*4, sy1, 0],
    [sx+dd + sx*4, -sy, 0],
    
    [sx+dd + sx*10, sy1, sx*2 +dzz],
    [sx+dd + sx*10, -sy, sx*2+dzz],
    [sx+dd + sx*10, sy1, 0+dzz],
    [sx+dd + sx*10, -sy, 0+dzz],    
    
  ]
  
  
  let nn = model.v.length;
  //console.log('nn', nn);
  let zmv2 = sx*11;
  for (p in points3) {
    points3[p][2] += zmv2;
    model.v.push(points3[p]);
  }
  model.f.push([colors3[0], nn+5, nn+2, nn+6, nn+9]);
  //model.f.push([colors3[0], nn+6, nn+9, nn+5]);
  model.f.push([colors3[1], nn+2, nn+3, nn+7, nn+6]);
  //model.f.push([colors3[1], nn+7, nn+6, nn+2]);

  model.f.push([colors3[2], nn+3, nn+1, nn+7    , nn+1]); //triangle
  model.f.push([colors3[3], nn+8, nn+1, nn+4    , nn+1]); //triangle
  
  model.f.push([colors3[4], nn+9, nn+8, nn+4, nn+5]);
  //model.f.push([colors3[4], nn+4, nn+5, nn+9]);
  
  model.f.push([colors3[2], nn+6, nn+7, nn+11, nn+10]);
  //model.f.push([colors3[2], nn+11, nn+10, nn+6]);

  model.f.push([colors3[4], nn+7, nn+1, nn+11   , nn+1]); //triangle
  model.f.push([colors3[5], nn+9, nn+6, nn+10   , nn+6]); //triangle
  model.f.push([colors3[4], nn+11, nn+1, nn+8   , nn+1]); //triangle
  
  model.f.push([colors3[6], nn+10, nn+11, nn+12, nn+13]);
  //model.f.push([colors3[6], nn+12, nn+13, nn+10]);

  model.f.push([colors3[7], nn+8, nn+11, nn+12, nn+14]);
  //model.f.push([colors3[7], nn+12, nn+14, nn+8]);
  
  model.f.push([colors3[0], nn+9, nn+10, nn+13, nn+15]);
  //model.f.push([colors3[0], nn+13, nn+15, nn+9]);
  
  model.f.push([colors3[6], nn+14, nn+8, nn+9, nn+15]);
  //model.f.push([colors3[6], nn+9, nn+15, nn+14]);
  
  //9
  model.f.push([colors3[10], nn+13, nn+12, nn+16, nn+17]);
  //model.f.push([colors3[10], nn+16, nn+17, nn+13]);

  model.f.push([colors3[11], nn+12, nn+14, nn+18, nn+16]);
  //model.f.push([colors3[11], nn+18, nn+16, nn+12]);

  model.f.push([colors3[12], nn+14, nn+15, nn+19, nn+18]);
  //model.f.push([colors3[12], nn+19, nn+18, nn+14]);

  model.f.push([colors3[9], nn+15, nn+13, nn+17, nn+19]);
  //model.f.push([colors3[9], nn+17, nn+19, nn+15]);


  //move model up
  for (v in model.v) {
    model.v[v][1] += sy-2;
  }
  
  models['arch1'] = model;
  
  resetCam();
  
  //723
  picoEye = [0.11484566126632026, 0.47259810767827265, -4.2065662873773455];
  picoDir = [0.04000258131116996, -0.1674866528775259, 0.985062441978338];
  picoUp = [-0.3230266739648757, 0.9307450749888955, 0.1713691141691099];
  camPathList['arch1'].push({"frame":-1, "picoEye":picoEye, "picoDir":picoDir, "picoUp":picoUp});
  camPathList['arch1'].push({"frame":723, "picoEye":picoEye, "picoDir":picoDir, "picoUp":picoUp});
  
  //753
  picoEye = [0.17202935661496702, 0.4843191535702412, 4.242364610555954];
  picoDir = [0.28863044609638255, -0.08854064510417704, 0.953337830860991];
  picoUp = [-0.27812684950939076, 0.9450240966948974, 0.1719735800870995];
  picoEye = [0.35929606074025094, 0.5791275313315234, 4.961706404098475];
  picoDir = [0.2982694731260076, -0.21923568080905242, 0.9289623445874031];
  picoUp = [-0.23505477607740483, 0.9264182560366196, 0.29410621742028753];
  camPathList['arch1'].push({"frame":753, "picoEye":picoEye, "picoDir":picoDir, "picoUp":picoUp});
  
  //788
  picoEye = [0.5857844022594767, 0.05063321222484095, 13.205256303890724];
  picoDir = [0.48113326920972405, -0.17744192408687356, 0.8585016836535101];
  picoUp = [-0.15052100064703658, 0.9480362425012382, 0.280304675787523];
  camPathList['arch1'].push({"frame":788, "picoEye":picoEye, "picoDir":picoDir, "picoUp":picoUp});
  
  //802
  picoEye = [0.04505337879213915, -0.5601643211703359, 16.313553072835926];
  picoDir = [0.7923636449312694, -0.05752276944484389, 0.6073310342693089];
  picoUp = [-0.16973444746906755, 0.935447128700602, 0.3100465880285896];
  camPathList['arch1'].push({"frame":802, "picoEye":picoEye, "picoDir":picoDir, "picoUp":picoUp});
  
  //826
  picoEye = [-1.4791506422638072, -0.695926749914624, 18.805401647372953];
  picoDir = [0.8595396223400138, -0.09200315141386002, 0.5027196612004597];
  picoUp = [-0.06952015919461421, 0.953471054785015, 0.2933596685856906];
  
  picoEye = [-0.263132192261912, 0.009707007319023754, 18.780053707716363];
  picoDir = [0.8486936028598389, -0.17749390336975238, 0.4982118853774518];
  picoUp = [0.009329180839097435, 0.9468819906361478, 0.32144589310457444];
  camPathList['arch1'].push({"frame":826, "picoEye":picoEye, "picoDir":picoDir, "picoUp":picoUp});

  //870
  picoEye = [5.072155831042067, -0.06829807974738498, 18.86944245601741];
  picoDir = [0.9977509085365643, -0.025935197346167328, 0.061810112870596325];
  picoUp = [0.008468353707385362, 0.947160231580952, 0.32064900233277566];
  camPathList['arch1'].push({"frame":870, "picoEye":picoEye, "picoDir":picoDir, "picoUp":picoUp});
  

  //900
  picoEye = [8.560787006761341, -0.6253676918137399, 18.52725195101287];
  picoDir = [0.9982633939884555, 0.014328959021582963, -0.057139103563213514];
  picoUp = [0.009185312173469764, 0.9431730709587824, 0.3321749362285717];
  camPathList['arch1'].push({"frame":900, "picoEye":picoEye, "picoDir":picoDir, "picoUp":picoUp});
  
  //930
  picoEye = [13.795039211716912, -0.2206920900376906, 18.23997501824834];
  picoDir = [0.9826118802803139, -0.019165528724565235, 0.18467965573038672];
  picoUp = [-0.03816261285116531, 0.9462083343709203, 0.32129955329471077];
  camPathList['arch1'].push({"frame":930, "picoEye":picoEye, "picoDir":picoDir, "picoUp":picoUp});
  
  //941
  picoEye = [16.232524088034207, -0.2670726600250243, 18.694666200938613];
  picoDir = [0.9861848992339112, -0.012401168432870696, 0.16518339972436813];
  picoUp = [-0.03816261285116531, 0.9462083343709203, 0.32129955329471077];
  camPathList['arch1'].push({"frame":941, "picoEye":picoEye, "picoDir":picoDir, "picoUp":picoUp});
  
  camPathList['arch1'].push({"frame":-1, "picoEye":picoEye, "picoDir":picoDir, "picoUp":picoUp});
  
}


function init_arch2() {
  modelRenderList.push({
    model: 'arch2',
    campath: 'arch2',
  });
  let model = {
		fstart: useFrameLimit ? models_arch2_fstart : 0,
		fend: useFrameLimit ? models_arch2_fend : 9999,
    v: [],
    f: [],
  }
  camPathList['arch2'] = [];
  let colors = [
    [
      '#3F5F4F','#4F6F5F','#2F4F3F','#1F3F2F',
      '#4F6F5F','#3F5F4F','#1F3F2F','#0F2F1F',
      '#5F7F6F','#4F6F5F','#2F4F3F','#1F3F2F',
    ],[
      '#4F6F4F','#5F7F5F','#3F5F3F','#2F4F2F',
      '#5F7F5F','#4F6F4F','#2F4F2F','#1F3F1F',
      '#6F7F6F','#5F7F5F','#3F5F3F','#2F4F2F',
    ],[
      '#4F6F4F','#3F5F3F','#1F3F1F','#2F4F2F'
    ]
  ];
  
  let nqty = 5;
  let sx = 1.05;
  let sy = 1.415;
  let dsy = -0.9;
  let dsx = 0.35;
  let sz = 3;
  let szd = 0.2;
  let dd1 = 0.135;
  let dd2 = 0.25;
  let dd3 = 0;

  let sz2 = sz;
  
  let rotList = [40,15,-25,-25,0];
  
  for (let n = 0; n < nqty; n++) {
    
    let points = [
      [-sx,         -sy,        0],
      [-sx,         sy+dsy*sy,  0],
      [-sx+dsx*sx,  sy,         0],
      [sx-dsx*sx,   sy,         0],
      [sx,          sy+dsy*sy,  0],
      [sx,          -sy,        0],

      [-sx,         -sy,          sz-szd*sz],
      [-sx,         sy+dsy*sy,    sz-szd*sz],
      [-sx+dsx*sx,  sy,           sz-szd*sz],
      [sx-dsx*sx,   sy,           sz-szd*sz],
      [sx,          sy+dsy*sy,    sz-szd*sz],
      [sx,          -sy,          sz-szd*sz],

      [-sx+dd1,         -sy+dd2,        sz-szd*sz],
      [-sx+dd1,         sy-dd3+dsy*sy,  sz-szd*sz],
      [-sx+dd1+dsx*sx,  sy-dd1,         sz-szd*sz],
      [sx-dd1-dsx*sx,   sy-dd1,         sz-szd*sz],
      [sx-dd1,          sy-dd3+dsy*sy,  sz-szd*sz],
      [sx-dd1,          -sy+dd2,        sz-szd*sz],

      [-sx+dd1,         -sy+dd2,        sz],
      [-sx+dd1,         sy-dd3+dsy*sy,  sz],
      [-sx+dd1+dsx*sx   ,sy-dd1,        sz],
      [sx-dd1-dsx*sx,   sy-dd1,         sz],
      [sx-dd1,          sy-dd3+dsy*sy,  sz],
      [sx-dd1,          -sy+dd2,         sz],
    ]

    let ddx = 0.45;
    let ddy1 = 1.75;
    let ddy2 = 0.25;
    if (n == 0) {
      let points2 = [
        [-sx, -sy, sz],
        [-sx, sy, sz],
        [sx, sy, sz],
        [sx, -sy, sz],
        
        [-sx+ddx*sx, -sy-ddy2*sy, sz+sz2],
        [-sx+ddx*sx, sy-ddy1*sy, sz+sz2],
        [sx-ddx*sx, sy-ddy1*sy, sz+sz2],
        [sx-ddx*sx, -sy-ddy2*sy, sz+sz2],
       
      ];
      for (let p in points2) {
        model.v.push(points2[p]);
      }
      let nn = 0;
      model.f.push([colors[2][1], nn+1, nn+2, nn+6, nn+5]);
      //model.f.push([colors[2][1], nn+6, nn+5, nn+1]);
      model.f.push([colors[2][2], nn+2, nn+3, nn+7, nn+6]);
      //model.f.push([colors[2][2], nn+7, nn+6, nn+2]);
      model.f.push([colors[2][3], nn+3, nn+4, nn+8, nn+7]);
      //model.f.push([colors[2][3], nn+8, nn+7, nn+3]);
      model.f.push([colors[2][0], nn+4, nn+1, nn+5, nn+8]);
      //model.f.push([colors[2][0], nn+5, nn+8, nn+4]);
    }

    // push points
    vsz = model.v.length;
    for (let p in points) {
      model.v.push(points[p]);
    }
    // modify
    for (v in model.v) {
      if (v < vsz || v > vsz + 5) {
        model.v[v] = rotY(model.v[v], rotList[n]);
      }
      model.v[v][2] += sz;
    }

    // push polygons
    let colorList = [1,2,3,2,1];
    for (var j = 0; j < 3; j++) {
      let nn = n*24 + j*6 + 8;
      for (var i = 0; i < 5; i++) {
        model.f.push([colors[n%2][j*4+colorList[i]], nn+1+i, nn+2+i, nn+8+i, nn+7+i]);
       //model.f.push([colors[n%2][j*4+colorList[i]], nn+8+i, nn+7+i, nn+1+i]);
      }
      model.f.push([colors[n%2][j*4+0], nn+12, nn+6, nn+1, nn+7]);
      //model.f.push([colors[n%2][j*4+0], nn+1, nn+7, nn+12]);
    }
  }
  models['arch2'] = model;

  //925
  picoEye = [-0.8598426532302706, -0.35349961296552146, 1.0817963164210929];
  picoDir = [0.21503782986872422, 0.0380026200547408, 0.9758660423410196];
  picoUp = [-0.32953276747259136, 0.9434623625702654, 0.03587374492840594];
  camPathList['arch2'].push({"frame":-1, "picoEye":picoEye, "picoDir":picoDir, "picoUp":picoUp});
  camPathList['arch2'].push({"frame":925, "picoEye":picoEye, "picoDir":picoDir, "picoUp":picoUp});
  
  //957
  picoEye = [-0.04644116658274998, 0.023309606823571753, 3.9174586594046756];
  picoDir = [-0.12703399744854244, 0.0013005806072383824, 0.9918975108257546];
  picoUp = [-0.3423572092908686, 0.9384879443444875, -0.045076818506042685];
  camPathList['arch2'].push({"frame":957, "picoEye":picoEye, "picoDir":picoDir, "picoUp":picoUp});
  
  //997
  picoEye = [-0.6434957299906102, 0.1400125795719423, 6.557687434723405];
  picoDir = [-0.43914450133406563, 0.017682707896304915, 0.898242410927868];
  picoUp = [-0.27315874099124804, 0.9498452895305872, -0.15224397583034668];
  
  
  picoEye = [-0.21225539854483114, 0.10417495971589374, 6.769223345475186];
  picoDir = [-0.43914450133406563, 0.017682707896304915, 0.898242410927868];
  picoUp = [-0.26867362202731593, 0.9514670412379687, -0.1500831578312131];
  
  camPathList['arch2'].push({"frame":997, "picoEye":picoEye, "picoDir":picoDir, "picoUp":picoUp});
  
  
  //picoEye = [-1.310643227934061, 0.03602009242347634, 8.231741000631523];
  //picoDir = [-0.8464457538103461, 0.05391272905630722, 0.5297386180958833];
  //picoUp = [-0.11548331813245116, 0.9515788410934742, -0.28488824548640074];
  //camPathList['arch2'].push({"frame":1021, "picoEye":picoEye, "picoDir":picoDir, "picoUp":picoUp});
  
  //1035
  picoEye = [-2.3122132779618987, 0.10440123276589713, 8.540248213608823];
  picoDir = [-0.8082067982274096, 0.009918439416325687, 0.5888152476444067];
  picoUp = [-0.18561740212401198, 0.9446021721534561, -0.2706897049976327];
  
  picoEye = [-2.100347097907221, 0.22230928215276835, 8.80349698931441];
  picoDir = [-0.8572152943505835, -0.020999469001588195, 0.5145298450363146];
  picoUp = [-0.1695895389059576, 0.9549426594444272, -0.24356499228515868];
  
  camPathList['arch2'].push({"frame":1035, "picoEye":picoEye, "picoDir":picoDir, "picoUp":picoUp});

  //1075
  picoEye = [-3.8477691374086906, -0.08977455607678658, 11.558865095358119];
  picoDir = [-0.5465413250505908, 0.0015413173287053984, 0.8374307161507969];
  picoUp = [-0.27228733506952485, 0.9453353094293807, -0.17944570183426914];
  
  picoEye = [-3.852181660059961, -0.1657285552824447, 11.555499876711806];
  picoDir = [-0.5455875351623002, -0.0017585280972478928, 0.83805199662936];
  picoUp = [-0.2741934614516677, 0.9453349303246871, -0.17652142987516312];
  
  picoEye = [-4.095857371201503, -0.1814087163616058, 11.396829525517264];
  picoDir = [-0.5455875351623003, -0.001758528097247893, 0.8380519966293601];
  picoUp = [-0.2741934614516677, 0.9453349303246871, -0.17652142987516312];
  
  camPathList['arch2'].push({"frame":1075, "picoEye":picoEye, "picoDir":picoDir, "picoUp":picoUp});

  //1135
  picoEye = [-5.2302520878087355, -0.20439112212620844, 14.25514340117561];
  picoDir = [0.01067514708391592, 0.04414123218133798, 0.998968264188733];
  picoUp = [-0.3282784634319882, 0.9438084165838624, -0.038195853599513066];
  
  picoEye = [-5.173588692715296, -0.1846657073606614, 14.255552874999175];
  picoDir = [-0.018998231593679266, 0.03383142176377412, 0.9992469675199193];
  picoUp = [-0.3282784634319882, 0.9438084165838624, -0.038195853599513066];
  camPathList['arch2'].push({"frame":1135, "picoEye":picoEye, "picoDir":picoDir, "picoUp":picoUp});

  //1187
  picoEye = [-4.897541951396857, -1.206557776855565, 18.336087299357104];
  picoDir = [0.14899249385994132, -0.11435833436633895, 0.9822033435772615];
  picoUp = [-0.2891009547277195, 0.9448526524733504, 0.15386391093949042];
  //camPathList['arch2'].push({"frame":1187, "picoEye":picoEye, "picoDir":picoDir, "picoUp":picoUp});

  //1193
  camMovDir(0.535);
  camPathList['arch2'].push({"frame":1193, "picoEye":picoEye, "picoDir":picoDir, "picoUp":picoUp});

  camPathList['arch2'].push({"frame":-1, "picoEye":picoEye, "picoDir":picoDir, "picoUp":picoUp});
  
  /*let showCP = 6;
  picoEye = camPathList['arch2'][showCP].picoEye;
  picoDir = camPathList['arch2'][showCP].picoDir;
  picoUp = camPathList['arch2'][showCP].picoUp;
  */
  
}

function init_cubes() {
  modelRenderList.push({
    model: 'cubes',
    campath: 'room',
  });
  modelRenderList.push({
    model: 'cubes2',
    campath: 'room',
  });
  let model = {
		fstart: useFrameLimit ? models_cubes_fstart : 0,
		fend: useFrameLimit ? models_cubes_fend : 9999,
    v: [],
    f: [],
  }
  let model2 = {
		fstart: useFrameLimit ? models_cubes2_fstart : 0,
		fend: useFrameLimit ? models_cubes2_fend : 9999,
    v: [],
    f: [],
  }
  camPathList['cubes'] = [];
  let colors = [
    
    '#3F0F3F', //top
    '#4F1F3F', // back
    '#5F2F3F', // bott
    '#6F3F3F', //front
    '#7F4F3F', // right
    '#7F5F3F', // left
  ];

  var sz = 1;
  var dsz = 1;
  var mlt = 0.985;
  var xqty = 5;
  var yqty = 3;
  var zqty = 4;

  var n1 = 0;
  var n2 = 0;
  for (var z = 0; z < zqty; z++) {
    for (var y = 0; y < yqty; y++) {
      for (var x = 0; x < xqty; x++) {
        var tgtModel = z < 2 ? model : model2;

        var points = [
          [-sz, -sz, -sz],
          [-sz, sz, -sz],
          [sz, sz, -sz],
          [sz, -sz, -sz],

          [-sz, -sz, sz],
          [-sz, sz, sz],
          [sz, sz, sz],
          [sz, -sz, sz],
        ];
        for (p in points) {
          points[p][0] = mlt * ( points[p][0] + (2 *sz + dsz)*x + sz - ((xqty * 2 * sz + (xqty-1)*dsz)/2) );
          points[p][1] = mlt * ( points[p][1] + (2 *sz + dsz)*y + sz - ((yqty * 2 *sz + (yqty-1)*dsz)/2) );
          points[p][2] = mlt * ( points[p][2] + (2 *sz + dsz)*z + sz); // - ((zqty * 2 *sz + (zqty-1)*dsz)/2) );
          tgtModel.v.push(points[p]);
        }
        
        if (true) { //y == 0 for modelling
        let nn = (z < 2 ? n1 : n2)  * 8;
          //front
          tgtModel.f.push([colors[0], nn+1, nn+2, nn+3, nn+4]);
          //model.f.push([colors[0], nn+3, nn+4, nn+1]);
          //top
          tgtModel.f.push([colors[1], nn+2, nn+6, nn+7, nn+3]);
          //model.f.push([colors[1], nn+7, nn+3, nn+2]);
          //back
          tgtModel.f.push([colors[2], nn+6, nn+5, nn+8, nn+7]);
          //model.f.push([colors[2], nn+8, nn+7, nn+6]);
          //bottom
          tgtModel.f.push([colors[3], nn+5, nn+1, nn+4, nn+8]);
          //model.f.push([colors[3], nn+4, nn+8, nn+5]);
          //right
          tgtModel.f.push([colors[4], nn+4, nn+3, nn+7, nn+8]);
          //model.f.push([colors[4], nn+7, nn+8, nn+4]);
          //left
          tgtModel.f.push([colors[5], nn+5, nn+6, nn+2, nn+1]);
          //model.f.push([colors[5], nn+2, nn+1, nn+5]);
        }
        if (z < 2) {n1++;} else {n2++;}
      }
    }
  }
  
  // model to model
  for (v in model.v) {
    model.v[v][1] += 14.3;
    model.v[v][2] -= 7.5+3;
    model.v[v][0] -= 4;
  }
  for (v in model2.v) {
    model2.v[v][1] += 14.3;
    model2.v[v][2] -= 7.5+3;
    model2.v[v][0] -= 4;
  }

  
  models['cubes'] = model;
  models['cubes2'] = model2;
  
}

function init_room() {
  modelRenderList.push({
    model: 'room',
    campath: 'room',
  });
  let model = {
		fstart: useFrameLimit ? models_room_fstart : 0,
		fend: useFrameLimit ? models_room_fend : 9999,
    v: [],
    f: [],
  }
  camPathList['room'] = [];
  var colors = [
    [
      '#7F7F0F', '#7F4F0F', '#7F3F0F', '#6F2F0F', '#5F1F0F', '#4F0F0F', '#3F0F0F', '#7F4F0F',
      '#5F1F0F', '#4F0F0F', '#5F1F0F', '#FFFFFF'
    ],[
      '#7F4F0F', '#7F3F0F', '#6F2F0F', '#5F1F0F', '#4F0F0F', '#3F0F0F', '#2F0F0F', '#7F3F0F',
      '#4F0F0F', '#3F0F0F', '#2F0F0F', '#FFFFFF'
    ],[
      '#7F3F0F'
    ], [
      '#ffffff','#808080'
    ]
  ];
  
  colors[0] = changeColors(colors[0]);
  colors[1] = changeColors(colors[1]);
  colors[2] = changeColors(colors[2]);
  
  var alpha = 13.47751218593;
  var alphaList = [+alpha, -alpha];
  var r0 = 0.05;
  var drr = 1.05;
  var drr2 = 1;
  
  var radList = [
    0.95,  1.15,  2.15,  2.575,  3,
    4, 5,
    5,
    5, 4,
    3,  2.575
  ];
  var lenList = [
    0.75, 0.75+0.2,  3.15,  1.825,  0.5,
    -0.5,  -1.5,
    -2.125,
    -2.75, -3.75,
    -4.75, 
    -7
  ];
  
  var nmax = radList.length;
  for (var n = 0; n < nmax; n++) {
  //for (var n in radList) {
    var m = 0;
    for (var a = 360-45; a > 0; a -= 90) {
      for (var al in alphaList) {
        var r = radList[n] - r0;
        var L = (a + alphaList[al])*Math.PI/180;
        var x = r * Math.cos(L);
        var y = r * Math.sin(L);
        var z = lenList[n];
        var point = [x, y, z];
        point = rotZ(point,-90);
        point[1] *= drr;
        point[0] *= drr2;
        //подгонка под кадр (потом убрать)
        point = rotX(point,2.75);

        model.v.push(point);
        m++;
      }
    }
    if (n < nmax - 1) {
      for (var i = 0; i < 8; i++) {
        var nn = n*8 + i;
        var n2 = nn+2 - (i+2 > 8 ? 8 : 0);
        var n10 = nn+10 - (i+10 > 16 ? 8 : 0);
        if ( n == 6 && i == 3) {
          var p1 = nn+1;
          var p2 = nn+9;
          var p3 = n10;
          var p4 = n2;
          var clr = colors[i&1][n];
        } else {
          model.f.push([colors[i&1][n], nn+1, nn+9, n10, n2]);
          //model.f.push([colors[i&1][n], n10, n2, nn+1]);
        }
      }
    }
  }

  //hole
  var holeDx = 0.4;
  var holeDy = 0.25;
  var vv = model.v.length;
  var dirH = normalize(vSub(model.v[p3-1], model.v[p2-1]));
  var dirV = normalize(vSub(model.v[p2-1], model.v[p1-1]));

  var point = model.v[p1-1];
  point = vMov(point, dirH ,holeDx);
  point = vMov(point, dirV ,holeDy);
  model.v.push(point);
  
  point = model.v[p2-1];
  point = vMov(point, dirH ,holeDx);
  point = vMov(point, dirV ,-holeDy);
  model.v.push(point);
  
  point = model.v[p3-1];
  point = vMov(point, dirH ,-holeDx);
  point = vMov(point, dirV ,-holeDy);
  model.v.push(point);

  point = model.v[p4-1];
  point = vMov(point, dirH ,-holeDx);
  point = vMov(point, dirV ,holeDy);
  model.v.push(point);
  
  model.f.push([clr, p1, p2, vv+2, vv+1]);
  //model.f.push([clr, vv+2, vv+1, p1]);
  
  model.f.push([clr, p2, p3, vv+3, vv+2]);
  //model.f.push([clr, vv+3, vv+2, p2]);

  model.f.push([clr, p3, p4, vv+4, vv+3]);
  //model.f.push([clr, vv+4, vv+3, p3]);

  model.f.push([clr, p4, p1, vv+1, vv+4]);
  //model.f.push([clr, vv+1, vv+4, p4]);

  // center poligons
  /*for (var i = 0; i < 6; i++) {
    model.f.push([colors[2][0], 1, i+2, i+3, i+2]);
  }*/
  // new center poligons
  model.f.push([colors[2][0], 1, 2, 3, 4]);
  model.f.push([colors[2][0], 1, 4, 5, 8]);
  model.f.push([colors[2][0], 5, 6, 7, 8]);

  models['room'] = model;

  resetCam();

  picoEye = [-1.2246132552957654, 0.43779695999867374, -6.399339515808495];
  picoDir = [-0.9721938223303, 0.17486551838303963, 0.1557601435009347];
  picoUp = [-0.27402289091808474, -0.32797983858992125, -0.9040689579514523];
  camPathList['room'].push({"frame":-1, "picoEye":picoEye, "picoDir":picoDir, "picoUp":picoUp});
  camPathList['room'].push({"frame":1343, "picoEye":picoEye, "picoDir":picoDir, "picoUp":picoUp});
  
  picoEye = [-1.2246132552957654, 0.43779695999867374, -6.399339515808495];
  picoDir = [-0.9721938223303, 0.17486551838303963, 0.1557601435009347];
  picoUp = [-0.27402289091808474, -0.32797983858992125, -0.9040689579514523];
  camPathList['room'].push({"frame":1352, "picoEye":picoEye, "picoDir":picoDir, "picoUp":picoUp});
  
  picoEye = [-1.101579899748767, -0.07703025225498565, -5.849388308050297];
  picoDir = [-0.9109872368276696, -0.3785740467429317, 0.16365801376580424];
  picoUp = [-0.05270666559674253, -0.40714334848615497, -0.9118422567446381];
  camPathList['room'].push({"frame":1367, "picoEye":picoEye, "picoDir":picoDir, "picoUp":picoUp});
  
  picoEye = [1.06219922232528, 1.7839214514072315, -3.885877960195355];
  picoDir = [0.5206965977735927, -0.8378189797494002, 0.16411706260678513];
  picoUp = [0.3616286468007087, -0.006328737705283129, -0.932300739510672];
  camPathList['room'].push({"frame":1400, "picoEye":picoEye, "picoDir":picoDir, "picoUp":picoUp});
  
  
  picoEye = [-2.8283857968378343, -0.42697674476829656, -3.3811563639147293];
  picoDir = [0.9563535724362506, 0.2660608213941003, 0.12082832369737577];
  picoUp = [0.0585608628778586, 0.35699980485005434, -0.9322670028892065];
  camPathList['room'].push({"frame":1450, "picoEye":picoEye, "picoDir":picoDir, "picoUp":picoUp});
  
  picoEye = [-2.3789418675268332, -2.5764910221601256, -1.8030954974651208];
  picoDir = [0.786685339054816, 0.5986843175166268, 0.1506760275420754];
  picoUp = [-0.05733593277993712, 0.34320045910221975, -0.9375105523055621];
  picoEye = [-2.31133520672145, -2.4274675282571527, -2.023850152362255];
  picoDir = [0.788486247532753, 0.5885768312152666, 0.17851260798138022];
  picoUp = [-0.033935939108118776, 0.3606188271555752, -0.9320957105028365];
  camPathList['room'].push({"frame":1493, "picoEye":picoEye, "picoDir":picoDir, "picoUp":picoUp});
  

  picoEye = [-0.08617177850283218, -2.915735228747263, -2.5154866908391];
  picoDir = [0.10071350320492653, 0.8711591245831845, 0.4805606828774604];
  picoUp = [-0.2863519934995061, 0.4879594381549821, -0.8245593505226492];
  camPathList['room'].push({"frame":1538, "picoEye":picoEye, "picoDir":picoDir, "picoUp":picoUp});
  
  picoEye = [2.03785758495921, -1.904919193018332, -2.4573104775540973];
  picoDir = [-0.5713398446386186, 0.6169325314840413, 0.5412624442218502];
  picoUp = [-0.5673796863997169, 0.17961088018623866, -0.8036294066170574];
  camPathList['room'].push({"frame":1565, "picoEye":picoEye, "picoDir":picoDir, "picoUp":picoUp});
  
  picoEye = [1.856841733944268, -0.21380351831538608, -2.4892915991391935];
  picoDir = [-0.5403871341587289, 0.6726828965498378, 0.5054497659758448];
  picoUp = [-0.5390019599590818, 0.18453043873604735, -0.8218426883170223];
  camPathList['room'].push({"frame":1585, "picoEye":picoEye, "picoDir":picoDir, "picoUp":picoUp});
  
  picoEye = [0.2734179136910122, 3.6974848014553365, -2.069942665974733];
  picoDir = [-0.18685457775855932, 0.9490221547746975, 0.2538549123366744];
  picoUp = [-0.2650333377250863, 0.20012610898764824, -0.9432427420318507];
  camPathList['room'].push({"frame":1615, "picoEye":picoEye, "picoDir":picoDir, "picoUp":picoUp});
  
  picoEye = [0.16095173105482394, 9.97346422533326, -1.8219755085608407];
  picoDir = [-0.575192526120812, 0.8022380888822742, 0.1598987387107089];
  picoUp = [-0.18058219472143383, 0.06612086599477994, -0.9813348572376763];
  camPathList['room'].push({"frame":1640, "picoEye":picoEye, "picoDir":picoDir, "picoUp":picoUp});
  
  picoEye = [0.6666571024287922, 16.79025418470249, -2.0245419295351135];
  picoDir = [-0.963285857021486, 0.2576792060321931, 0.07537761233284093];
  picoUp = [-0.105085270632809, -0.1035167322963368, -0.989060853552863];
 
  picoEye = [0.690126230394534, 16.789241269873692, -1.9864870476396574];
  picoDir = [-0.964987155638782, 0.25096624336891604, 0.0762609607955943];
  picoUp = [-0.105085270632809, -0.1035167322963368, -0.989060853552863];
  picoEye = [0.786624945958412, 16.764144645536792, -1.9941131437192168];
  picoDir = [-0.964987155638782, 0.25096624336891604, 0.0762609607955943];
  picoUp = [-0.105085270632809, -0.1035167322963368, -0.989060853552863];
  camPathList['room'].push({"frame":1679, "picoEye":picoEye, "picoDir":picoDir, "picoUp":picoUp});
  
  picoEye = [0.2747315946707258, 18.68829350542814, -2.2631200335677395];
  picoDir = [-0.9973460570088052, 0.05318073908411532, 0.04972576353819412];
  picoUp = [-0.05459475245937595, -0.11184958405307076, -0.9922243111066442];
  picoEye = [0.008238630618206086, 18.555232454013844, -2.4751356619350555];
  picoDir = [-0.9977981110777385, -0.030039451495781157, 0.05913172484825467];
  picoUp = [-0.05459475245937595, -0.11184958405307076, -0.9922243111066442];
  camPathList['room'].push({"frame":1706, "picoEye":picoEye, "picoDir":picoDir, "picoUp":picoUp});
  
  picoEye = [-3.9916675061894242, 18.551947407296435, -3.8615485581601456];
  picoDir = [-0.8568021127075283, -0.5135466321659026, 0.04647575982138701];
  picoUp = [-0.014849350570148974, -0.06389915620588695, -0.9978458771893686];
  camPathList['room'].push({"frame":1742, "picoEye":picoEye, "picoDir":picoDir, "picoUp":picoUp});
  
  picoEye = [-7.301925824553604, 18.803862576558185, -4.648973050092361];
  picoDir = [-0.7624621250116146, -0.6373806300449806, -0.11134379356855378];
  picoUp = [0.17120984908152848, -0.03193306467959137, -0.9847169476340141];
  camPathList['room'].push({"frame":1768, "picoEye":picoEye, "picoDir":picoDir, "picoUp":picoUp});
  
  picoEye = [-8.735118477603116, 16.66024958956873, -6.10827658149331];
  picoDir = [-0.7926546810170815, -0.6062315195679682, -0.06466762206870541];
  picoUp = [0.16221612401142482, -0.1065566729110716, -0.9809850175047696];
  camPathList['room'].push({"frame":1790, "picoEye":picoEye, "picoDir":picoDir, "picoUp":picoUp});
  
  picoEye = [-8.464187647803858, 14.943807057080956, -6.261179098817448];
  picoDir = [-0.9252704574216493, -0.3597602367080351, -0.12019630903863274];
  picoUp = [0.16774528275929823, -0.10232140981767666, -0.9805059149260275];
  camPathList['room'].push({"frame":1799, "picoEye":picoEye, "picoDir":picoDir, "picoUp":picoUp});
  
  camPathList['room'].push({"frame":-1, "picoEye":picoEye, "picoDir":picoDir, "picoUp":picoUp});
}


function init_testcube() {
	let sz = 1;
	models['testcube'] = {
		fstart: 0,
		fend: 9999,
		v:[
			[-sz, -sz, -sz],
			[-sz, sz, -sz],
			[sz, sz, -sz],
			[sz, -sz, -sz],

			[-sz, -sz, sz],
			[-sz, sz, sz],
			[sz, sz, sz],
			[sz, -sz, sz],
		],
		f:[
			['#000080', 5, 6, 7],
      ['#0000ff', 7, 8, 5],

      ['#ff0000', 1, 2, 6],
      ['#800000', 6, 5, 1],

      ['#00ff00', 2, 3, 7],
      ['#008000', 7, 6, 2],

      ['#ff00ff', 3, 4, 8],
      ['#800080', 8, 7, 3],

      ['#ffff00', 4, 1, 5],
      ['#808000', 5, 8, 4],

		]
	};
	console.log(models);

}


function init_oxygene() { 	// transform base model oxygene

  let colors = [
    '#7F7F0F',
    '#6F3F0F', '#5F2F0F', '#4F1F0F', '#3F0F0F',
  ]
  

  let models_oxygene = {
   "O": {
      fstart: models_oxygene_fstart,
      fend: models_oxygene_fend,
      v: [[1.083343,0.0,-1.158421], [1.083343,0.0,-2.707567], [1.126741,0.0,-2.873927], [1.193991,0.0,-2.903602], [1.119508,0.0,-1.02461], [1.30464,0.0,-1.158421], [1.30464,0.0,-2.707567], [1.261242,0.0,-2.873927], [1.268475,0.0,-1.02461], [1.193991,0.0,-0.994583], [1.083343,0.593809,-1.158421], [1.083343,0.593809,-2.707567], [1.126741,0.593809,-2.873927], [1.193991,0.593809,-2.903602], [1.119508,0.593809,-1.02461], [1.193991,0.593809,-0.994583], [1.30464,0.593809,-1.158421], [1.30464,0.593809,-2.707567], [1.261242,0.593809,-2.873927], [1.268475,0.593809,-1.02461], [0.487887,0.0,-1.158421], [0.404128,0.13204,-1.158421], [0.404128,0.13204,-2.707567], [0.487947,0.0,-2.707567], [0.461992,0.13204,-2.949873], [0.544248,0.0,-2.940476], [0.621119,0.13204,-3.145165], [0.688988,0.0,-3.116547], [0.903659,0.13204,-3.291667], [0.938557,0.0,-3.245022], [0.569968,0.0,-0.917111], [0.490925,0.13204,-0.901649], [1.193991,0.13204,-3.331781], [1.193991,0.0,-3.280005], [0.753714,0.0,-0.719275], [0.693935,0.13204,-0.681896], [1.193991,0.0,-0.604892], [1.193991,0.13204,-0.55109], [0.88433,0.13204,-0.600505], [0.921728,0.0,-0.6481], [1.983855,0.13204,-1.158421], [1.900095,0.0,-1.158421], [1.900036,0.0,-2.707567], [1.983855,0.13204,-2.707567], [1.843735,0.0,-2.940476], [1.92599,0.13204,-2.949873], [1.698995,0.0,-3.116547], [1.766864,0.13204,-3.145165], [1.449426,0.0,-3.245022], [1.484324,0.13204,-3.291667], [1.897058,0.13204,-0.901649], [1.818015,0.0,-0.917111], [1.694048,0.13204,-0.681896], [1.634269,0.0,-0.719275], [1.503653,0.13204,-0.600505], [1.466254,0.0,-0.6481], [0.487947,0.593809,-2.707567], [0.404128,0.461769,-2.707567], [0.404128,0.461769,-1.158421], [0.487887,0.593809,-1.158421], [0.544248,0.593809,-2.940476], [0.461992,0.461769,-2.949873], [0.688988,0.593809,-3.116547], [0.621119,0.461769,-3.145165], [0.490925,0.461769,-0.901649], [0.569968,0.593809,-0.917111], [0.938557,0.593809,-3.245022], [0.903659,0.461769,-3.291667], [1.193991,0.593809,-3.280005], [1.193991,0.461769,-3.331781], [0.693935,0.461769,-0.681896], [0.753714,0.593809,-0.719275], [0.921728,0.593809,-0.6481], [0.88433,0.461769,-0.600505], [1.193991,0.461769,-0.55109], [1.193991,0.593809,-0.604892], [1.983855,0.461769,-2.707567], [1.900036,0.593809,-2.707567], [1.900095,0.593809,-1.158421], [1.983855,0.461769,-1.158421], [1.92599,0.461769,-2.949873], [1.843735,0.593809,-2.940476], [1.766864,0.461769,-3.145165], [1.698995,0.593809,-3.116547], [1.818015,0.593809,-0.917111], [1.897058,0.461769,-0.901649], [1.484324,0.461769,-3.291667], [1.449426,0.593809,-3.245022], [1.634269,0.593809,-0.719275], [1.694048,0.461769,-0.681896], [1.466254,0.593809,-0.6481], [1.503653,0.461769,-0.600505], ],
      f: [["#7F7F0F",1,31,21], ["#7F7F0F",10,56,37], ["#7F7F0F",9,54,10], ["#7F7F0F",6,52,9],
      ["#7F7F0F",23,62,25], ["#7F7F0F",25,64,27], ["#7F7F0F",27,68,29], ["#7F7F0F",29,70,33], ["#7F7F0F",32,59,22], ["#7F7F0F",36,65,32], ["#7F7F0F",38,74,39],
      ["#7F7F0F",46,77,44], ["#7F7F0F",48,81,46], ["#7F7F0F",33,87,50], ["#7F7F0F",41,86,51], ["#7F7F0F",51,90,53], ["#7F7F0F",11,57,60], ["#7F7F0F",55,75,38], ["#808080",12,61,57], ["#7F7F0F",11,66,15], ["#7F7F0F",63,14,67], ["#7F7F0F",15,72,16], ["#7F7F0F",88,69,14], ["#7F7F0F",13,63,61], ["#7F7F0F",67,14,69], ["#7F7F0F",16,73,76], ["#7F7F0F",16,76,91], ["#7F7F0F",82,18,78], ["#7F7F0F",17,85,79], ["#7F7F0F",84,88,14], ["#7F7F0F",20,89,85], ["#7F7F0F",16,72,73], ["#7F7F0F",84,19,82], ["#7F7F0F",16,91,89], ["#7F7F0F",78,17,79], ["#7F7F0F",8,47,45], ["#7F7F0F",49,4,34], ["#7F7F0F",44,80,41], ["#7F7F0F",50,83,48], ["#7F7F0F",10,37,40], ["#7F7F0F",3,12,2], ["#7F7F0F",7,45,43], ["#7F7F0F",10,40,35], ["#7F7F0F",28,3,26], ["#7F7F0F",47,4,49], ["#7F7F0F",4,13,3], ["#7F7F0F",8,14,4], ["#7F7F0F",28,30,4], ["#7F7F0F",5,16,10], ["#7F7F0F",26,2,24], ["#7F7F0F",9,17,6], ["#7F7F0F",6,43,42], ["#7F7F0F",53,92,55], ["#7F7F0F",30,34,4], ["#7F7F0F",10,54,56], ["#7F7F0F",6,18,7], ["#7F7F0F",24,1,21], ["#7F7F0F",5,35,31], ["#7F7F0F",10,20,9], ["#7F7F0F",2,11,1], ["#7F7F0F",7,19,8], ["#7F7F0F",1,15,5], ["#7F7F0F",39,71,36], ["#7F7F0F",22,58,23], ["#7F7F0F",1,5,31], ["#7F7F0F",23,58,62], ["#7F7F0F",25,62,64], ["#7F7F0F",27,64,68], ["#7F7F0F",29,68,70], ["#7F7F0F",32,65,59], ["#7F7F0F",36,71,65], ["#7F7F0F",38,75,74], ["#7F7F0F",6,42,52], ["#7F7F0F",46,81,77], ["#7F7F0F",48,83,81], ["#7F7F0F",9,52,54], ["#7F7F0F",33,70,87], ["#7F7F0F",41,80,86], ["#7F7F0F",51,86,90], ["#7F7F0F",11,12,57], ["#7F7F0F",55,92,75], ["#7F7F0F",12,13,61], ["#7F7F0F",11,60,66], ["#7F7F0F",15,66,72], ["#7F7F0F",13,14,63], ["#7F7F0F",82,19,18], ["#7F7F0F",17,20,85], ["#7F7F0F",20,16,89], ["#7F7F0F",84,14,19], ["#7F7F0F",78,18,17], ["#7F7F0F",8,4,47], ["#7F7F0F",44,77,80], ["#7F7F0F",50,87,83], ["#7F7F0F",3,13,12], ["#7F7F0F",7,8,45], ["#7F7F0F",28,4,3], ["#6F3F0F",4,14,13], ["#6F3F0F",8,19,14], ["#7F7F0F",5,15,16], ["#7F7F0F",26,3,2], ["#6F3F0F",9,20,17], ["#7F7F0F",6,7,43], ["#7F7F0F",53,90,92], ["#6F3F0F",6,17,18], ["#7F7F0F",24,2,1], ["#7F7F0F",5,10,35], ["#6F3F0F",10,16,20], ["#6F3F0F",2,12,11], ["#6F3F0F",7,18,19], ["#6F3F0F",1,11,15], ["#7F7F0F",39,74,71], ["#7F7F0F",22,59,58], ["#6F3F0F",21,23,24], ["#6F3F0F",24,25,26], ["#6F3F0F",26,27,28], ["#6F3F0F",21,32,22], ["#6F3F0F",28,29,30], ["#6F3F0F",30,33,34], ["#6F3F0F",31,36,32], ["#6F3F0F",40,38,39], ["#6F3F0F",35,39,36], ["#6F3F0F",44,42,43], ["#6F3F0F",46,43,45], ["#6F3F0F",48,45,47], ["#6F3F0F",51,42,41], ["#6F3F0F",50,47,49], ["#6F3F0F",53,52,51], ["#6F3F0F",55,54,53], ["#6F3F0F",33,49,34], ["#6F3F0F",38,56,55], ["#6F3F0F",58,60,57], ["#6F3F0F",62,57,61], ["#6F3F0F",64,61,63], ["#6F3F0F",65,60,59], ["#6F3F0F",68,63,67], ["#6F3F0F",70,67,69], ["#6F3F0F",71,66,65], ["#6F3F0F",75,73,74], ["#6F3F0F",74,72,71], ["#6F3F0F",79,77,78], ["#6F3F0F",78,81,82], ["#6F3F0F",82,83,84], ["#6F3F0F",79,86,80], ["#6F3F0F",84,87,88], ["#6F3F0F",85,90,86], ["#6F3F0F",89,92,90], ["#6F3F0F",88,70,69], ["#6F3F0F",91,75,92], ["#6F3F0F",21,22,23], ["#6F3F0F",24,23,25], ["#6F3F0F",26,25,27], ["#6F3F0F",21,31,32], ["#6F3F0F",28,27,29], ["#6F3F0F",30,29,33], ["#6F3F0F",31,35,36], ["#6F3F0F",40,37,38], ["#6F3F0F",35,40,39], ["#6F3F0F",44,41,42], ["#6F3F0F",46,44,43], ["#6F3F0F",48,46,45], ["#6F3F0F",51,52,42], ["#6F3F0F",50,48,47], ["#6F3F0F",53,54,52], ["#6F3F0F",55,56,54], ["#6F3F0F",33,50,49], ["#6F3F0F",38,37,56], ["#6F3F0F",58,59,60], ["#6F3F0F",62,58,57], ["#6F3F0F",64,62,61], ["#6F3F0F",65,66,60], ["#6F3F0F",68,64,63], ["#6F3F0F",70,68,67], ["#6F3F0F",71,72,66], ["#6F3F0F",75,76,73], ["#6F3F0F",74,73,72], ["#6F3F0F",79,80,77], ["#6F3F0F",78,77,81], ["#6F3F0F",82,81,83], ["#6F3F0F",79,85,86], ["#6F3F0F",84,83,87], ["#6F3F0F",85,89,90], ["#6F3F0F",89,91,92], ["#6F3F0F",88,87,70], ["#6F3F0F",91,76,75], ],
    },
    "X": {
      fstart: models_oxygene_fstart,
      fend: models_oxygene_fend,
      v: [[2.906912,-6.1e-05,-2.061697], [2.906912,0.593748,-2.061697], [2.369041,-6.1e-05,-1.582474], [2.292071,0.131979,-1.582474], [3.547069,0.131979,-1.582474], [3.469565,-6.1e-05,-1.582474], [2.288455,0.131979,-2.540919], [2.365452,-6.1e-05,-2.540919], [3.429864,-6.1e-05,-2.540919], [3.507288,0.131979,-2.540919], [2.92006,-6.1e-05,-2.000535], [2.935844,0.131979,-1.582474], [2.927768,-6.1e-05,-2.168767], [2.932228,0.131979,-2.540919], [2.3861,0.131979,-2.061697], [2.463089,-6.1e-05,-2.061697], [3.427724,0.131979,-2.061697], [3.350268,-6.1e-05,-2.061697], [3.666414,0.131979,-3.264221], [3.572358,-6.1e-05,-3.188616], [3.152135,-6.1e-05,-3.188616], [3.091354,0.131979,-3.264221], [2.239152,-6.1e-05,-3.188616], [2.14741,0.131979,-3.264221], [2.791184,0.131979,-3.264221], [2.728898,-6.1e-05,-3.188616], [2.125711,0.131979,-0.609632], [2.2156,-6.1e-05,-0.685238], [2.729366,-6.1e-05,-0.685238], [2.7948,0.131979,-0.609632], [3.693024,-6.1e-05,-0.685238], [3.789376,0.131979,-0.609632], [3.152835,0.131979,-0.609632], [3.213435,-6.1e-05,-0.685238], [2.463089,0.593748,-2.061697], [2.3861,0.461708,-2.061697], [2.292071,0.461708,-1.582474], [2.369041,0.593748,-1.582474], [2.935844,0.461708,-1.582474], [2.92006,0.593748,-2.000535], [3.469565,0.593748,-1.582474], [3.547069,0.461708,-1.582474], [3.350268,0.593748,-2.061697], [3.427724,0.461708,-2.061697], [3.507288,0.461708,-2.540919], [3.429864,0.593748,-2.540919], [2.932228,0.461708,-2.540919], [2.927768,0.593748,-2.168767], [2.365452,0.593748,-2.540919], [2.288455,0.461708,-2.540919], [3.572358,0.593748,-3.188616], [3.666414,0.461708,-3.264221], [3.091354,0.461708,-3.264221], [3.152135,0.593748,-3.188616], [2.728898,0.593748,-3.188616], [2.791184,0.461708,-3.264221], [2.14741,0.461708,-3.264221], [2.239152,0.593748,-3.188616], [2.2156,0.593748,-0.685238], [2.125711,0.461708,-0.609632], [2.7948,0.461708,-0.609632], [2.729366,0.593748,-0.685238], [3.213435,0.593748,-0.685238], [3.152835,0.461708,-0.609632], [3.789376,0.461708,-0.609632], [3.693024,0.593748,-0.685238], ],
      f: [["#7F7F0F",21,9,13], ["#7F7F0F",15,50,7], ["#7F7F0F",29,3,11], ["#7F7F0F",17,42,5], ["#7F7F0F",19,45,10], ["#7F7F0F",7,57,24], ["#7F7F0F",27,37,4], ["#7F7F0F",5,65,32], ["#7F7F0F",46,54,48], ["#7F7F0F",38,62,40], ["#7F7F0F",35,48,49], ["#7F7F0F",43,48,2], ["#7F7F0F",49,55,58], ["#7F7F0F",41,63,66], ["#7F7F0F",40,43,2], ["#7F7F0F",11,18,6], ["#7F7F0F",16,11,3], ["#7F7F0F",30,60,27], ["#7F7F0F",8,26,13], ["#7F7F0F",14,53,22], ["#7F7F0F",16,13,1], ["#7F7F0F",13,18,1], ["#7F7F0F",22,52,19], ["#7F7F0F",32,64,33], ["#7F7F0F",33,39,12], ["#7F7F0F",24,56,25], ["#7F7F0F",6,34,11], ["#7F7F0F",25,47,14], ["#7F7F0F",40,35,38], ["#7F7F0F",12,61,30], ["#7F7F0F",10,44,17], ["#7F7F0F",4,36,15], ["#7F7F0F",21,20,9], ["#7F7F0F",15,36,50], ["#7F7F0F",29,28,3], ["#7F7F0F",17,44,42], ["#7F7F0F",19,52,45], ["#7F7F0F",7,50,57], ["#7F7F0F",27,60,37], ["#7F7F0F",5,42,65], ["#7F7F0F",46,51,54], ["#7F7F0F",38,59,62], ["#7F7F0F",35,2,48], ["#7F7F0F",43,46,48], ["#7F7F0F",49,48,55], ["#7F7F0F",41,40,63], ["#7F7F0F",40,41,43], ["#7F7F0F",11,1,18], ["#7F7F0F",16,1,11], ["#7F7F0F",30,61,60], ["#7F7F0F",8,23,26], ["#7F7F0F",14,47,53], ["#7F7F0F",16,8,13], ["#7F7F0F",13,9,18], ["#7F7F0F",22,53,52], ["#7F7F0F",32,65,64], ["#7F7F0F",33,64,39], ["#7F7F0F",24,57,56], ["#7F7F0F",6,31,34], ["#7F7F0F",25,56,47], ["#7F7F0F",40,2,35], ["#7F7F0F",12,39,61], ["#7F7F0F",10,45,44], ["#7F7F0F",4,37,36], ["#6F3F0F",3,15,16], ["#6F3F0F",9,17,18], ["#6F3F0F",8,15,7], ["#6F3F0F",6,17,5], ["#6F3F0F",20,22,19], ["#6F3F0F",21,14,22], ["#6F3F0F",20,10,9], ["#6F3F0F",23,25,26], ["#6F3F0F",23,7,24], ["#6F3F0F",26,14,13], ["#6F3F0F",28,30,27], ["#6F3F0F",29,12,30], ["#6F3F0F",28,4,3], ["#6F3F0F",31,33,34], ["#6F3F0F",31,5,32], ["#6F3F0F",34,12,11], ["#6F3F0F",36,38,35], ["#6F3F0F",44,46,43], ["#6F3F0F",36,49,50], ["#6F3F0F",44,41,42], ["#6F3F0F",53,51,52], ["#6F3F0F",47,54,53], ["#6F3F0F",45,51,46], ["#6F3F0F",56,58,55], ["#6F3F0F",50,58,57], ["#6F3F0F",47,55,48], ["#6F3F0F",61,59,60], ["#6F3F0F",39,62,61], ["#6F3F0F",37,59,38], ["#6F3F0F",64,66,63], ["#6F3F0F",42,66,65], ["#6F3F0F",39,63,40], ["#6F3F0F",3,4,15], ["#6F3F0F",9,10,17], ["#6F3F0F",8,16,15], ["#6F3F0F",6,18,17], ["#6F3F0F",20,21,22], ["#6F3F0F",21,13,14], ["#6F3F0F",20,19,10], ["#6F3F0F",23,24,25], ["#6F3F0F",23,8,7], ["#6F3F0F",26,25,14], ["#6F3F0F",28,29,30], ["#6F3F0F",29,11,12], ["#6F3F0F",28,27,4], ["#6F3F0F",31,32,33], ["#6F3F0F",31,6,5], ["#6F3F0F",34,33,12], ["#6F3F0F",36,37,38], ["#6F3F0F",44,45,46], ["#6F3F0F",36,35,49], ["#6F3F0F",44,43,41], ["#6F3F0F",53,54,51], ["#6F3F0F",47,48,54], ["#6F3F0F",45,52,51], ["#6F3F0F",56,57,58], ["#6F3F0F",50,49,58], ["#6F3F0F",47,56,55], ["#6F3F0F",61,62,59], ["#6F3F0F",39,40,62], ["#6F3F0F",37,60,59], ["#6F3F0F",64,65,66], ["#6F3F0F",42,41,66], ["#6F3F0F",39,64,63], ],
    },
    "Y": {
      fstart: models_oxygene_fstart,
      fend: models_oxygene_fend,
      v: [[4.29684,-6.1e-05,-0.686928], [4.221234,0.131979,-0.611322], [4.800286,-6.1e-05,-0.686928], [4.875891,0.131979,-0.611322], [4.221234,0.131979,-1.580616], [4.29684,-6.1e-05,-1.590858], [4.800286,-6.1e-05,-1.591433], [4.875891,0.131979,-1.580616], [4.543508,-6.1e-05,-1.76226], [4.548563,0.131979,-2.217122], [5.367134,0.131979,-3.262295], [5.266731,-6.1e-05,-3.188221], [4.73843,0.131979,-3.271939], [4.801466,-6.1e-05,-3.195358], [3.855995,-6.1e-05,-3.188205], [3.757115,0.131979,-3.262295], [4.382806,0.131979,-3.271939], [4.318311,-6.1e-05,-3.19533], [4.29684,0.593748,-1.590858], [4.221234,0.461708,-1.580616], [4.221234,0.461708,-0.611322], [4.29684,0.593748,-0.686928], [4.875891,0.461708,-0.611322], [4.800286,0.593748,-0.686928], [4.875891,0.461708,-1.580616], [4.800286,0.593748,-1.591433], [4.801466,0.593748,-3.195358], [4.73843,0.461708,-3.271939], [4.548563,0.461708,-2.217122], [4.543508,0.593748,-1.76226], [5.266731,0.593748,-3.188221], [5.367134,0.461708,-3.262295], [4.318311,0.593748,-3.19533], [4.382806,0.461708,-3.271939], [3.757115,0.461708,-3.262295], [3.855995,0.593748,-3.188205], ],
      f: [
        //["#00ff00",4,21,2], ["#00ff00",4,23,21],
        ["#7F7F0F",15,9,6], ["#7F7F0F",11,25,8], ["#7F7F0F",5,35,16], ["#7F7F0F",19,26,30], ["#7F7F0F",30,36,19], ["#7F7F0F",30,31,27], ["#7F7F0F",6,9,7], ["#7F7F0F",24,19,22], ["#7F7F0F",16,34,17], ["#7F7F0F",9,12,7], ["#7F7F0F",6,3,1], ["#7F7F0F",17,29,10], ["#7F7F0F",13,32,11], ["#7F7F0F",8,23,4], ["#7F7F0F",10,28,13], ["#7F7F0F",2,20,5], ["#7F7F0F",15,18,9], ["#7F7F0F",11,32,25], ["#7F7F0F",5,20,35], ["#7F7F0F",30,33,36], ["#7F7F0F",30,26,31], ["#7F7F0F",24,26,19], ["#7F7F0F",16,35,34], ["#7F7F0F",9,14,12], ["#7F7F0F",6,7,3], ["#7F7F0F",17,34,29], ["#7F7F0F",13,28,32], ["#7F7F0F",8,25,23], ["#7F7F0F",10,29,28], ["#7F7F0F",2,21,20], ["#6F3F0F",1,5,6], ["#6F3F0F",3,2,1], ["#6F3F0F",3,8,4], ["#6F3F0F",14,10,13], ["#6F3F0F",12,13,11], ["#6F3F0F",12,8,7], ["#6F3F0F",15,17,18], ["#6F3F0F",15,5,16], ["#6F3F0F",18,10,9], ["#6F3F0F",20,22,19], ["#6F3F0F",23,22,21], ["#6F3F0F",25,24,23], ["#6F3F0F",29,27,28], ["#6F3F0F",28,31,32], ["#6F3F0F",25,31,26], ["#6F3F0F",34,36,33], ["#6F3F0F",20,36,35], ["#6F3F0F",29,33,30], ["#6F3F0F",1,2,5], ["#6F3F0F",3,4,2], ["#6F3F0F",3,7,8], ["#6F3F0F",14,9,10], ["#6F3F0F",12,14,13], ["#6F3F0F",12,11,8], ["#6F3F0F",15,16,17], ["#6F3F0F",15,6,5], ["#6F3F0F",18,17,10], ["#6F3F0F",20,21,22], ["#6F3F0F",23,24,22], ["#6F3F0F",25,26,24], ["#6F3F0F",29,30,27], ["#6F3F0F",28,27,31], ["#6F3F0F",25,32,31], ["#6F3F0F",34,35,36], ["#6F3F0F",20,19,36], ["#6F3F0F",29,34,33],
      ],
    },
    "G": {
      fstart: models_oxygene_fstart,
      fend: models_oxygene_fend,
      v: [[6.498119,-6.1e-05,-1.205883], [6.421922,0.131979,-1.205883], [7.080195,0.131979,-1.205883], [7.00459,-6.1e-05,-1.205883], [6.421922,0.131979,-1.634507], [6.498097,-6.1e-05,-1.710112], [7.00459,-6.1e-05,-1.634507], [7.080195,0.131979,-1.634507], [6.421922,-6.1e-05,-1.958225], [6.421922,0.131979,-2.033831], [7.080195,0.131979,-2.033831], [7.00459,-6.1e-05,-1.958225], [6.36442,-6.1e-05,-1.710112], [6.288815,0.131979,-1.634507], [6.288815,0.131979,-2.033831], [6.36442,-6.1e-05,-1.958225], [6.458818,-6.1e-05,-0.986322], [6.391785,0.131979,-1.037614], [7.080195,0.131979,-0.997431], [7.00459,-6.1e-05,-0.997303], [6.599935,0.131979,-0.794495], [6.638137,-6.1e-05,-0.940649], [7.081205,0.131979,-0.60784], [7.005405,-6.1e-05,-0.682723], [6.652418,0.131979,-0.603737], [6.709879,-6.1e-05,-0.679895], [6.290078,-6.1e-05,-0.903367], [6.298032,0.131979,-0.991525], [6.491104,0.131979,-0.666829], [6.45582,-6.1e-05,-0.726168], [6.208699,-6.1e-05,-0.918048], [6.222335,0.131979,-1.005655], [6.332786,-6.1e-05,-0.653212], [6.340416,0.131979,-0.578927], [6.151677,0.131979,-0.551676], [6.163478,-6.1e-05,-0.627503], [6.080777,-6.1e-05,-1.147113], [6.167222,0.131979,-1.105067], [5.891809,0.131979,-0.609231], [5.929976,-6.1e-05,-0.677943], [6.080343,-6.1e-05,-2.74923], [6.167222,0.131979,-2.749858], [5.69741,-6.1e-05,-0.846096], [5.623082,0.131979,-0.805125], [5.496741,0.131979,-1.100223], [5.587658,-6.1e-05,-1.100879], [5.496741,0.131979,-2.745013], [5.588007,-6.1e-05,-2.745673], [6.137058,-6.1e-05,-2.888296], [6.218091,0.131979,-2.871943], [5.572318,0.131979,-3.002264], [5.659758,-6.1e-05,-2.984619], [6.319271,-6.1e-05,-2.956308], [6.285648,0.131979,-2.896667], [5.822302,0.131979,-3.233354], [5.883885,-6.1e-05,-3.188606], [6.269999,0.131979,-3.327792], [6.2722,-6.1e-05,-3.267159], [6.088325,0.131979,-3.317619], [6.115512,-6.1e-05,-3.25962], [6.538131,0.131979,-3.299003], [6.50261,-6.1e-05,-3.242399], [6.430145,-6.1e-05,-2.917721], [6.360332,0.131979,-2.870911], [6.814011,0.131979,-3.175107], [6.750108,-6.1e-05,-3.13226], [6.473283,-6.1e-05,-2.77057], [6.396491,0.131979,-2.748689], [7.020043,0.131979,-2.926365], [6.940786,-6.1e-05,-2.903781], [6.475748,-6.1e-05,-2.584281], [6.398822,0.131979,-2.582975], [7.080517,0.131979,-2.594548], [6.998173,-6.1e-05,-2.59315], [6.398822,0.131979,-2.287611], [6.475697,-6.1e-05,-2.364532], [6.998432,-6.1e-05,-2.373407], [7.080517,0.131979,-2.299184], [6.498097,0.593748,-1.710112], [6.421922,0.461708,-1.634507], [6.421922,0.461708,-1.205883], [6.498119,0.593748,-1.205883], [7.00459,0.593748,-1.205883], [7.080195,0.461708,-1.205883], [7.080195,0.461708,-1.634507], [7.00459,0.593748,-1.634507], [7.00459,0.593748,-1.958225], [7.080195,0.461708,-2.033831], [6.421922,0.461708,-2.033831], [6.421922,0.593748,-1.958225], [6.36442,0.593748,-1.958225], [6.288815,0.461708,-2.033831], [6.288815,0.461708,-1.634507], [6.36442,0.593748,-1.710112], [6.391785,0.461708,-1.037614], [6.458818,0.593748,-0.986322], [7.00459,0.593748,-0.997303], [7.080195,0.461708,-0.997431], [7.005405,0.593748,-0.682723], [7.081205,0.461708,-0.60784], [6.709879,0.593748,-0.679895], [6.652418,0.461708,-0.603737], [6.638137,0.593748,-0.940649], [6.599935,0.461708,-0.794495], [6.298032,0.461708,-0.991525], [6.290078,0.593748,-0.903367], [6.45582,0.593748,-0.726168], [6.491104,0.461708,-0.666829], [6.163478,0.593748,-0.627503], [6.151677,0.461708,-0.551676], [6.340416,0.461708,-0.578927], [6.332786,0.593748,-0.653212], [6.222335,0.461708,-1.005655], [6.208699,0.593748,-0.918048], [6.167222,0.461708,-1.105067], [6.080777,0.593748,-1.147113], [5.929976,0.593748,-0.677943], [5.891809,0.461708,-0.609231], [5.587658,0.593748,-1.100879], [5.496741,0.461708,-1.100223], [5.623082,0.461708,-0.805125], [5.69741,0.593748,-0.846096], [5.588007,0.593748,-2.745673], [5.496741,0.461708,-2.745013], [6.167222,0.461708,-2.749858], [6.080343,0.593748,-2.74923], [6.218091,0.461708,-2.871943], [6.137058,0.593748,-2.888296], [5.659758,0.593748,-2.984619], [5.572318,0.461708,-3.002264], [6.285648,0.461708,-2.896667], [6.319271,0.593748,-2.956308], [5.883885,0.593748,-3.188606], [5.822302,0.461708,-3.233354], [6.115512,0.593748,-3.25962], [6.088325,0.461708,-3.317619], [6.2722,0.593748,-3.267159], [6.269999,0.461708,-3.327792], [6.50261,0.593748,-3.242399], [6.538131,0.461708,-3.299003], [6.360332,0.461708,-2.870911], [6.430145,0.593748,-2.917721], [6.750108,0.593748,-3.13226], [6.814011,0.461708,-3.175107], [6.396491,0.461708,-2.748689], [6.473283,0.593748,-2.77057], [6.940786,0.593748,-2.903781], [7.020043,0.461708,-2.926365], [6.398822,0.461708,-2.582975], [6.475748,0.593748,-2.584281], [6.998173,0.593748,-2.59315], [7.080517,0.461708,-2.594548], [6.475697,0.593748,-2.364532], [6.398822,0.461708,-2.287611], [7.080517,0.461708,-2.299184], [6.998432,0.593748,-2.373407], ],
      f: [["#7F7F0F",20,1,4], ["#7F7F0F",13,9,6], ["#7F7F0F",5,93,14], ["#7F7F0F",18,81,2], ["#7F7F0F",30,17,22], ["#7F7F0F",25,104,21], ["#7F7F0F",28,95,18], ["#7F7F0F",36,27,33], ["#7F7F0F",32,105,28], ["#7F7F0F",38,113,32], ["#7F7F0F",43,46,37], ["#7F7F0F",48,37,46], ["#7F7F0F",42,115,38], ["#7F7F0F",50,125,42], ["#7F7F0F",54,127,50], ["#7F7F0F",62,63,53], ["#7F7F0F",58,62,53], ["#7F7F0F",53,60,58], ["#7F7F0F",64,131,54], ["#7F7F0F",68,141,64], ["#7F7F0F",72,145,68], ["#7F7F0F",75,149,72], ["#7F7F0F",79,87,90], ["#7F7F0F",90,94,79], ["#7F7F0F",82,97,83], ["#7F7F0F",97,96,103], ["#7F7F0F",96,107,103], ["#7F7F0F",107,106,112], ["#7F7F0F",97,101,99], ["#7F7F0F",106,109,112], ["#7F7F0F",114,117,109], ["#7F7F0F",117,116,122], ["#7F7F0F",122,116,119], ["#7F7F0F",116,123,119], ["#7F7F0F",126,129,123], ["#7F7F0F",128,133,129], ["#7F7F0F",133,132,135], ["#7F7F0F",143,146,147], ["#7F7F0F",137,132,139], ["#7F7F0F",139,142,143], ["#7F7F0F",132,137,135], ["#7F7F0F",146,151,147], ["#7F7F0F",150,156,151], ["#7F7F0F",11,85,8], ["#7F7F0F",39,121,44], ["#7F7F0F",40,31,36], ["#7F7F0F",66,67,63], ["#7F7F0F",14,92,15], ["#7F7F0F",55,136,59], ["#7F7F0F",56,49,52], ["#7F7F0F",6,12,7], ["#7F7F0F",44,120,45], ["#7F7F0F",29,111,34], ["#7F7F0F",74,67,70], ["#7F7F0F",8,84,3], ["#7F7F0F",65,148,69], ["#7F7F0F",20,26,22], ["#7F7F0F",56,60,53], ["#7F7F0F",1,7,4], ["#7F7F0F",40,43,37], ["#7F7F0F",30,33,27], ["#7F7F0F",51,134,55], ["#7F7F0F",34,110,35], ["#7F7F0F",77,71,74], ["#7F7F0F",59,138,57], ["#7F7F0F",3,98,19], ["#7F7F0F",45,124,47], ["#7F7F0F",69,152,73], ["#7F7F0F",57,140,61], ["#7F7F0F",52,41,48], ["#7F7F0F",82,86,79], ["#7F7F0F",21,108,29], ["#7F7F0F",15,89,10], ["#7F7F0F",47,130,51], ["#7F7F0F",78,154,75], ["#7F7F0F",73,155,78], ["#7F7F0F",23,102,25], ["#7F7F0F",61,144,65], ["#7F7F0F",10,88,11], ["#7F7F0F",19,100,23], ["#7F7F0F",20,22,17], ["#7F7F0F",35,118,39], ["#7F7F0F",2,80,5], ["#7F7F0F",20,17,1], ["#7F7F0F",13,16,9], ["#7F7F0F",5,80,93], ["#7F7F0F",18,95,81], ["#7F7F0F",30,27,17], ["#7F7F0F",25,102,104], ["#7F7F0F",28,105,95], ["#7F7F0F",36,31,27], ["#7F7F0F",32,113,105], ["#7F7F0F",38,115,113], ["#7F7F0F",48,41,37], ["#7F7F0F",42,125,115], ["#7F7F0F",50,127,125], ["#7F7F0F",54,131,127], ["#7F7F0F",62,66,63], ["#7F7F0F",64,141,131], ["#7F7F0F",68,145,141], ["#7F7F0F",72,149,145], ["#7F7F0F",75,154,149], ["#7F7F0F",79,86,87], ["#7F7F0F",90,91,94], ["#7F7F0F",82,96,97], ["#7F7F0F",96,106,107], ["#7F7F0F",97,103,101], ["#7F7F0F",106,114,109], ["#7F7F0F",114,116,117], ["#7F7F0F",116,126,123], ["#7F7F0F",126,128,129], ["#7F7F0F",128,132,133], ["#7F7F0F",143,142,146], ["#7F7F0F",139,132,142], ["#7F7F0F",146,150,151], ["#7F7F0F",150,153,156], ["#7F7F0F",11,88,85], ["#7F7F0F",39,118,121], ["#7F7F0F",40,37,31], ["#7F7F0F",66,70,67], ["#7F7F0F",14,93,92], ["#7F7F0F",55,134,136], ["#7F7F0F",56,53,49], ["#7F7F0F",6,9,12], ["#7F7F0F",44,121,120], ["#7F7F0F",29,108,111], ["#7F7F0F",74,71,67], ["#7F7F0F",8,85,84], ["#7F7F0F",65,144,148], ["#7F7F0F",20,24,26], ["#7F7F0F",1,6,7], ["#7F7F0F",51,130,134], ["#7F7F0F",34,111,110], ["#7F7F0F",77,76,71], ["#7F7F0F",59,136,138], ["#7F7F0F",3,84,98], ["#7F7F0F",45,120,124], ["#7F7F0F",69,148,152], ["#7F7F0F",57,138,140], ["#7F7F0F",52,49,41], ["#7F7F0F",82,83,86], ["#7F7F0F",21,104,108], ["#7F7F0F",15,92,89], ["#7F7F0F",47,124,130], ["#7F7F0F",78,155,154], ["#7F7F0F",73,152,155], ["#7F7F0F",23,100,102], ["#7F7F0F",61,140,144], ["#7F7F0F",10,89,88], ["#7F7F0F",19,98,100], ["#7F7F0F",35,110,118], ["#7F7F0F",2,81,80], ["#6F3F0F",1,5,6], ["#6F3F0F",7,3,4], ["#6F3F0F",12,10,11], ["#6F3F0F",12,8,7], ["#6F3F0F",13,15,16], ["#6F3F0F",13,5,14], ["#6F3F0F",16,10,9], ["#6F3F0F",4,19,20], ["#6F3F0F",1,18,2], ["#6F3F0F",24,19,23], ["#6F3F0F",24,25,26], ["#6F3F0F",26,21,22], ["#6F3F0F",30,21,29], ["#6F3F0F",17,28,18], ["#6F3F0F",36,34,35], ["#6F3F0F",33,29,34], ["#6F3F0F",31,28,27], ["#6F3F0F",40,35,39], ["#6F3F0F",31,38,32], ["#6F3F0F",46,44,45], ["#6F3F0F",43,39,44], ["#6F3F0F",46,47,48], ["#6F3F0F",37,42,38], ["#6F3F0F",48,51,52], ["#6F3F0F",49,42,41], ["#6F3F0F",52,55,56], ["#6F3F0F",53,50,49], ["#6F3F0F",56,59,60], ["#6F3F0F",57,60,59], ["#6F3F0F",57,62,58], ["#6F3F0F",66,61,65], ["#6F3F0F",53,64,54], ["#6F3F0F",70,65,69], ["#6F3F0F",67,64,63], ["#6F3F0F",74,69,73], ["#6F3F0F",71,68,67], ["#6F3F0F",77,75,76], ["#6F3F0F",77,73,78], ["#6F3F0F",76,72,71], ["#6F3F0F",80,82,79], ["#6F3F0F",85,83,84], ["#6F3F0F",89,87,88], ["#6F3F0F",85,87,86], ["#6F3F0F",93,91,92], ["#6F3F0F",80,94,93], ["#6F3F0F",89,91,90], ["#6F3F0F",98,83,97], ["#6F3F0F",95,82,81], ["#6F3F0F",98,99,100], ["#6F3F0F",102,99,101], ["#6F3F0F",104,101,103], ["#6F3F0F",104,107,108], ["#6F3F0F",105,96,95], ["#6F3F0F",111,109,110], ["#6F3F0F",108,112,111], ["#6F3F0F",105,114,106], ["#6F3F0F",110,117,118], ["#6F3F0F",115,114,113], ["#6F3F0F",121,119,120], ["#6F3F0F",118,122,121], ["#6F3F0F",124,119,123], ["#6F3F0F",125,116,115], ["#6F3F0F",130,123,129], ["#6F3F0F",125,128,126], ["#6F3F0F",134,129,133], ["#6F3F0F",127,132,128], ["#6F3F0F",136,133,135], ["#6F3F0F",135,138,136], ["#6F3F0F",139,138,137], ["#6F3F0F",140,143,144], ["#6F3F0F",141,132,131], ["#6F3F0F",144,147,148], ["#6F3F0F",141,146,142], ["#6F3F0F",148,151,152], ["#6F3F0F",145,150,146], ["#6F3F0F",154,156,153], ["#6F3F0F",152,156,155], ["#6F3F0F",149,153,150], ["#6F3F0F",1,2,5], ["#6F3F0F",7,8,3], ["#6F3F0F",12,9,10], ["#6F3F0F",12,11,8], ["#6F3F0F",13,14,15], ["#6F3F0F",13,6,5], ["#6F3F0F",16,15,10], ["#6F3F0F",4,3,19], ["#6F3F0F",1,17,18], ["#6F3F0F",24,20,19], ["#6F3F0F",24,23,25], ["#6F3F0F",26,25,21], ["#6F3F0F",30,22,21], ["#6F3F0F",17,27,28], ["#6F3F0F",36,33,34], ["#6F3F0F",33,30,29], ["#6F3F0F",31,32,28], ["#6F3F0F",40,36,35], ["#6F3F0F",31,37,38], ["#6F3F0F",46,43,44], ["#6F3F0F",43,40,39], ["#6F3F0F",46,45,47], ["#6F3F0F",37,41,42], ["#6F3F0F",48,47,51], ["#6F3F0F",49,50,42], ["#6F3F0F",52,51,55], ["#6F3F0F",53,54,50], ["#6F3F0F",56,55,59], ["#6F3F0F",57,58,60], ["#6F3F0F",57,61,62], ["#6F3F0F",66,62,61], ["#6F3F0F",53,63,64], ["#6F3F0F",70,66,65], ["#6F3F0F",67,68,64], ["#6F3F0F",74,70,69], ["#6F3F0F",71,72,68], ["#6F3F0F",77,78,75], ["#6F3F0F",77,74,73], ["#6F3F0F",76,75,72], ["#6F3F0F",80,81,82], ["#6F3F0F",85,86,83], ["#6F3F0F",89,90,87], ["#6F3F0F",85,88,87], ["#6F3F0F",93,94,91], ["#6F3F0F",80,79,94], ["#6F3F0F",89,92,91], ["#6F3F0F",98,84,83], ["#6F3F0F",95,96,82], ["#6F3F0F",98,97,99], ["#6F3F0F",102,100,99], ["#6F3F0F",104,102,101], ["#6F3F0F",104,103,107], ["#6F3F0F",105,106,96], ["#6F3F0F",111,112,109], ["#6F3F0F",108,107,112], ["#6F3F0F",105,113,114], ["#6F3F0F",110,109,117], ["#6F3F0F",115,116,114], ["#6F3F0F",121,122,119], ["#6F3F0F",118,117,122], ["#6F3F0F",124,120,119], ["#6F3F0F",125,126,116], ["#6F3F0F",130,124,123], ["#6F3F0F",125,127,128], ["#6F3F0F",134,130,129], ["#6F3F0F",127,131,132], ["#6F3F0F",136,134,133], ["#6F3F0F",135,137,138], ["#6F3F0F",139,140,138], ["#6F3F0F",140,139,143], ["#6F3F0F",141,142,132], ["#6F3F0F",144,143,147], ["#6F3F0F",141,145,146], ["#6F3F0F",148,147,151], ["#6F3F0F",145,149,150], ["#6F3F0F",154,155,156], ["#6F3F0F",152,151,156], ["#6F3F0F",149,154,153], ],
    },
    "E": {
      fstart: models_oxygene_fstart,
      fend: models_oxygene_fend,
      v: [[8.049336,0.131979,-2.730618], [7.973732,-6.1e-05,-2.806223], [8.429147,-6.1e-05,-2.806223], [8.504752,0.131979,-2.730618], [8.049336,-6.1e-05,-3.194213], [8.049336,0.131979,-3.269818], [8.429147,-6.1e-05,-3.194213], [8.504752,0.131979,-3.269818], [7.437772,-6.1e-05,-2.730618], [7.362167,0.131979,-2.730618], [7.362167,0.131979,-3.269818], [7.437772,-6.1e-05,-3.194213], [8.049336,0.131979,-2.237289], [7.973732,-6.1e-05,-2.161684], [7.437772,-6.1e-05,-2.237289], [7.362167,0.131979,-2.237289], [7.973732,-6.1e-05,-1.803268], [8.049336,0.131979,-1.727663], [7.437772,-6.1e-05,-1.727663], [7.362167,0.131979,-1.727663], [8.049336,0.131979,-1.142406], [7.973732,-6.1e-05,-1.0668], [7.437772,-6.1e-05,-1.142406], [7.362167,0.131979,-1.142406], [8.049336,-6.1e-05,-0.682523], [8.049336,0.131979,-0.606918], [7.362167,0.131979,-0.606918], [7.437772,-6.1e-05,-0.682523], [8.400311,-6.1e-05,-2.161684], [8.475917,0.131979,-2.237289], [8.475917,0.131979,-1.727663], [8.400311,-6.1e-05,-1.803268], [8.48,-6.1e-05,-1.0668], [8.555606,0.131979,-1.142406], [8.555606,0.131979,-0.606918], [8.48,-6.1e-05,-0.682523], [8.049336,0.461708,-3.269818], [8.049336,0.593748,-3.194213], [7.973732,0.593748,-2.806223], [8.049336,0.461708,-2.730618], [8.504752,0.461708,-2.730618], [8.429147,0.593748,-2.806223], [8.504752,0.461708,-3.269818], [8.429147,0.593748,-3.194213], [7.437772,0.593748,-3.194213], [7.362167,0.461708,-3.269818], [7.362167,0.461708,-2.730618], [7.437772,0.593748,-2.730618], [7.362167,0.461708,-2.237289], [7.437772,0.593748,-2.237289], [7.973732,0.593748,-2.161684], [8.049336,0.461708,-2.237289], [7.362167,0.461708,-1.727663], [7.437772,0.593748,-1.727663], [8.049336,0.461708,-1.727663], [7.973732,0.593748,-1.803268], [7.362167,0.461708,-1.142406], [7.437772,0.593748,-1.142406], [7.973732,0.593748,-1.0668], [8.049336,0.461708,-1.142406], [7.437772,0.593748,-0.682523], [7.362167,0.461708,-0.606918], [8.049336,0.461708,-0.606918], [8.049336,0.593748,-0.682523], [8.400311,0.593748,-1.803268], [8.475917,0.461708,-1.727663], [8.475917,0.461708,-2.237289], [8.400311,0.593748,-2.161684], [8.48,0.593748,-0.682523], [8.555606,0.461708,-0.606918], [8.555606,0.461708,-1.142406], [8.48,0.593748,-1.0668], ],
      f: [["#7F7F0F",4,40,1], ["#7F7F0F",14,9,2], ["#7F7F0F",1,52,13], ["#7F7F0F",29,17,14], ["#7F7F0F",31,55,18], ["#7F7F0F",33,25,22], ["#7F7F0F",13,67,30], ["#7F7F0F",21,71,34], ["#7F7F0F",48,51,39], ["#7F7F0F",42,38,39], ["#7F7F0F",50,56,51], ["#7F7F0F",56,68,51], ["#7F7F0F",59,61,64], ["#7F7F0F",64,72,59], ["#7F7F0F",54,59,56], ["#7F7F0F",34,70,35], ["#7F7F0F",22,19,17], ["#7F7F0F",20,49,16], ["#7F7F0F",10,46,11], ["#7F7F0F",18,60,21], ["#7F7F0F",24,53,20], ["#7F7F0F",39,45,48], ["#7F7F0F",22,28,23], ["#7F7F0F",5,3,2], ["#7F7F0F",27,57,24], ["#7F7F0F",8,41,4], ["#7F7F0F",35,63,26], ["#7F7F0F",17,15,14], ["#7F7F0F",30,66,31], ["#7F7F0F",6,43,8], ["#7F7F0F",11,37,6], ["#7F7F0F",26,62,27], ["#7F7F0F",16,47,10], ["#7F7F0F",2,12,5], ["#7F7F0F",4,41,40], ["#7F7F0F",14,15,9], ["#7F7F0F",1,40,52], ["#7F7F0F",29,32,17], ["#7F7F0F",31,66,55], ["#7F7F0F",33,36,25], ["#7F7F0F",13,52,67], ["#7F7F0F",21,60,71], ["#7F7F0F",48,50,51], ["#7F7F0F",42,44,38], ["#7F7F0F",50,54,56], ["#7F7F0F",56,65,68], ["#7F7F0F",59,58,61], ["#7F7F0F",64,69,72], ["#7F7F0F",54,58,59], ["#7F7F0F",34,71,70], ["#7F7F0F",22,23,19], ["#7F7F0F",20,53,49], ["#7F7F0F",10,47,46], ["#7F7F0F",18,55,60], ["#7F7F0F",24,57,53], ["#7F7F0F",39,38,45], ["#7F7F0F",22,25,28], ["#7F7F0F",5,7,3], ["#7F7F0F",27,62,57], ["#7F7F0F",8,43,41], ["#7F7F0F",35,70,63], ["#7F7F0F",17,19,15], ["#7F7F0F",30,67,66], ["#7F7F0F",6,37,43], ["#7F7F0F",11,46,37], ["#7F7F0F",26,63,62], ["#7F7F0F",16,49,47], ["#7F7F0F",2,9,12], ["#6F3F0F",3,1,2], ["#6F3F0F",7,4,3], ["#6F3F0F",7,6,8], ["#6F3F0F",12,10,11], ["#6F3F0F",12,6,5], ["#6F3F0F",2,13,14], ["#6F3F0F",15,10,9], ["#6F3F0F",19,16,15], ["#6F3F0F",17,21,22], ["#6F3F0F",23,20,19], ["#6F3F0F",28,26,27], ["#6F3F0F",28,24,23], ["#6F3F0F",29,31,32], ["#6F3F0F",29,13,30], ["#6F3F0F",32,18,17], ["#6F3F0F",36,34,35], ["#6F3F0F",33,21,34], ["#6F3F0F",36,26,25], ["#6F3F0F",40,42,39], ["#6F3F0F",43,42,41], ["#6F3F0F",37,44,43], ["#6F3F0F",47,45,46], ["#6F3F0F",37,45,38], ["#6F3F0F",40,51,52], ["#6F3F0F",49,48,47], ["#6F3F0F",53,50,49], ["#6F3F0F",55,59,60], ["#6F3F0F",57,54,53], ["#6F3F0F",63,61,62], ["#6F3F0F",57,61,58], ["#6F3F0F",67,65,66], ["#6F3F0F",52,68,67], ["#6F3F0F",55,65,56], ["#6F3F0F",71,69,70], ["#6F3F0F",60,72,71], ["#6F3F0F",63,69,64], ["#6F3F0F",3,4,1], ["#6F3F0F",7,8,4], ["#6F3F0F",7,5,6], ["#6F3F0F",12,9,10], ["#6F3F0F",12,11,6], ["#6F3F0F",2,1,13], ["#6F3F0F",15,16,10], ["#6F3F0F",19,20,16], ["#6F3F0F",17,18,21], ["#6F3F0F",23,24,20], ["#6F3F0F",28,25,26], ["#6F3F0F",28,27,24], ["#6F3F0F",29,30,31], ["#6F3F0F",29,14,13], ["#6F3F0F",32,31,18], ["#6F3F0F",36,33,34], ["#6F3F0F",33,22,21], ["#6F3F0F",36,35,26], ["#6F3F0F",40,41,42], ["#6F3F0F",43,44,42], ["#6F3F0F",37,38,44], ["#6F3F0F",47,48,45], ["#6F3F0F",37,46,45], ["#6F3F0F",40,39,51], ["#6F3F0F",49,50,48], ["#6F3F0F",53,54,50], ["#6F3F0F",55,56,59], ["#6F3F0F",57,58,54], ["#6F3F0F",63,64,61], ["#6F3F0F",57,62,61], ["#6F3F0F",67,68,65], ["#6F3F0F",52,51,68], ["#6F3F0F",55,66,65], ["#6F3F0F",71,72,69], ["#6F3F0F",60,59,72], ["#6F3F0F",63,70,69], ],
    },
    "N": {
      fstart: models_oxygene_fstart,
      fend: models_oxygene_fend,
      v: [[8.845105,-6.1e-05,-0.679901], [8.7695,0.131979,-0.604295], [9.264774,-6.1e-05,-0.679901], [9.34038,0.131979,-0.604295], [8.7695,0.131979,-1.809405], [8.845105,-6.1e-05,-1.809405], [9.264774,-6.1e-05,-2.137882], [9.34038,0.131979,-1.809405], [8.845105,-6.1e-05,-3.175215], [8.7695,0.131979,-3.265], [9.34038,0.131979,-3.265], [9.34038,-6.1e-05,-3.174647], [9.735525,-6.1e-05,-0.686142], [9.735525,0.131979,-0.59579], [9.735525,0.131979,-2.051384], [9.811131,-6.1e-05,-1.722907], [10.303123,0.131979,-0.59579], [10.227517,-6.1e-05,-0.685575], [10.227517,-6.1e-05,-2.051384], [10.303123,0.131979,-2.051384], [9.811131,-6.1e-05,-3.179368], [9.735525,0.131979,-3.254973], [10.303123,0.131979,-3.254973], [10.227517,-6.1e-05,-3.179368], [8.845105,0.593748,-1.809405], [8.7695,0.461708,-1.809405], [8.7695,0.461708,-0.604295], [8.845105,0.593748,-0.679901], [9.34038,0.461708,-0.604295], [9.264774,0.593748,-0.679901], [9.34038,0.461708,-1.809405], [9.264774,0.593748,-2.137882], [9.34038,0.593748,-3.174647], [9.34038,0.461708,-3.265], [8.7695,0.461708,-3.265], [8.845105,0.593748,-3.175215], [9.735525,0.461708,-0.59579], [9.735525,0.593748,-0.686142], [9.811131,0.593748,-1.722907], [9.735525,0.461708,-2.051384], [10.227517,0.593748,-0.685575], [10.303123,0.461708,-0.59579], [10.303123,0.461708,-2.051384], [10.227517,0.593748,-2.051384], [10.227517,0.593748,-3.179368], [10.303123,0.461708,-3.254973], [9.735525,0.461708,-3.254973], [9.811131,0.593748,-3.179368], ],
      f: [["#7F7F0F",4,27,2], ["#7F7F0F",5,35,10], ["#7F7F0F",14,31,8], ["#7F7F0F",17,37,14], ["#7F7F0F",15,47,22], ["#7F7F0F",32,36,25], ["#7F7F0F",32,39,33], ["#7F7F0F",39,41,44], ["#7F7F0F",44,48,39], ["#7F7F0F",10,34,11], ["#7F7F0F",30,25,28], ["#7F7F0F",23,43,20], ["#7F7F0F",6,3,1], ["#7F7F0F",20,42,17], ["#7F7F0F",11,40,15], ["#7F7F0F",8,29,4], ["#7F7F0F",16,18,13], ["#7F7F0F",22,46,23], ["#7F7F0F",16,7,12], ["#7F7F0F",21,19,16], ["#7F7F0F",9,7,6], ["#7F7F0F",2,26,5], ["#7F7F0F",4,29,27], ["#7F7F0F",5,26,35], ["#7F7F0F",14,37,31], ["#7F7F0F",17,42,37], ["#7F7F0F",15,40,47], ["#7F7F0F",32,33,36], ["#7F7F0F",32,38,39], ["#7F7F0F",39,38,41], ["#7F7F0F",44,45,48], ["#7F7F0F",10,35,34], ["#7F7F0F",30,32,25], ["#7F7F0F",23,46,43], ["#7F7F0F",6,7,3], ["#7F7F0F",20,43,42], ["#7F7F0F",11,34,40], ["#7F7F0F",8,31,29], ["#7F7F0F",16,19,18], ["#7F7F0F",22,47,46], ["#7F7F0F",16,13,7], ["#7F7F0F",21,24,19], ["#7F7F0F",9,12,7], ["#7F7F0F",2,27,26], ["#6F3F0F",1,5,6], ["#6F3F0F",3,2,1], ["#6F3F0F",3,8,4], ["#6F3F0F",9,11,12], ["#6F3F0F",9,5,10], ["#6F3F0F",12,15,16], ["#6F3F0F",13,8,7], ["#6F3F0F",18,20,17], ["#6F3F0F",18,14,13], ["#6F3F0F",21,23,24], ["#6F3F0F",21,15,22], ["#6F3F0F",24,20,19], ["#6F3F0F",26,28,25], ["#6F3F0F",27,30,28], ["#6F3F0F",31,30,29], ["#6F3F0F",34,36,33], ["#6F3F0F",26,36,35], ["#6F3F0F",40,33,39], ["#6F3F0F",31,38,32], ["#6F3F0F",43,41,42], ["#6F3F0F",37,41,38], ["#6F3F0F",47,45,46], ["#6F3F0F",40,48,47], ["#6F3F0F",43,45,44], ["#6F3F0F",1,2,5], ["#6F3F0F",3,4,2], ["#6F3F0F",3,7,8], ["#6F3F0F",9,10,11], ["#6F3F0F",9,6,5], ["#6F3F0F",12,11,15], ["#6F3F0F",13,14,8], ["#6F3F0F",18,19,20], ["#6F3F0F",18,17,14], ["#6F3F0F",21,22,23], ["#6F3F0F",21,16,15], ["#6F3F0F",24,23,20], ["#6F3F0F",26,27,28], ["#6F3F0F",27,29,30], ["#6F3F0F",31,32,30], ["#6F3F0F",34,35,36], ["#6F3F0F",26,25,36], ["#6F3F0F",40,34,33], ["#6F3F0F",31,37,38], ["#6F3F0F",43,44,41], ["#6F3F0F",37,42,41], ["#6F3F0F",47,48,45], ["#6F3F0F",40,39,48], ["#6F3F0F",43,46,45], ],
    },
    "E1": {
      fstart: models_oxygene_fstart,
      fend: models_oxygene_fend,
      v: [[11.376164,0.131979,-2.730618], [11.300559,-6.1e-05,-2.806223], [11.755975,-6.1e-05,-2.806223], [11.83158,0.131979,-2.730618], [11.376164,-6.1e-05,-3.194213], [11.376164,0.131979,-3.269818], [11.755975,-6.1e-05,-3.194213], [11.83158,0.131979,-3.269818], [10.764601,-6.1e-05,-2.730618], [10.688995,0.131979,-2.730618], [10.688995,0.131979,-3.269818], [10.764601,-6.1e-05,-3.194213], [11.376164,0.131979,-2.237289], [11.300559,-6.1e-05,-2.161684], [10.764601,-6.1e-05,-2.237289], [10.688995,0.131979,-2.237289], [11.300559,-6.1e-05,-1.803268], [11.376164,0.131979,-1.727663], [10.764601,-6.1e-05,-1.727663], [10.688995,0.131979,-1.727663], [11.376164,0.131979,-1.142406], [11.300559,-6.1e-05,-1.0668], [10.764601,-6.1e-05,-1.142406], [10.688995,0.131979,-1.142406], [11.376164,-6.1e-05,-0.682523], [11.376164,0.131979,-0.606918], [10.688995,0.131979,-0.606918], [10.764601,-6.1e-05,-0.682523], [11.727139,-6.1e-05,-2.161684], [11.802745,0.131979,-2.237289], [11.802745,0.131979,-1.727663], [11.727139,-6.1e-05,-1.803268], [11.806828,-6.1e-05,-1.0668], [11.882434,0.131979,-1.142406], [11.882434,0.131979,-0.606918], [11.806828,-6.1e-05,-0.682523], [11.376164,0.461708,-3.269818], [11.376164,0.593748,-3.194213], [11.300559,0.593748,-2.806223], [11.376164,0.461708,-2.730618], [11.83158,0.461708,-2.730618], [11.755975,0.593748,-2.806223], [11.83158,0.461708,-3.269818], [11.755975,0.593748,-3.194213], [10.764601,0.593748,-3.194213], [10.688995,0.461708,-3.269818], [10.688995,0.461708,-2.730618], [10.764601,0.593748,-2.730618], [10.688995,0.461708,-2.237289], [10.764601,0.593748,-2.237289], [11.300559,0.593748,-2.161684], [11.376164,0.461708,-2.237289], [10.688995,0.461708,-1.727663], [10.764601,0.593748,-1.727663], [11.376164,0.461708,-1.727663], [11.300559,0.593748,-1.803268], [10.688995,0.461708,-1.142406], [10.764601,0.593748,-1.142406], [11.300559,0.593748,-1.0668], [11.376164,0.461708,-1.142406], [10.764601,0.593748,-0.682523], [10.688995,0.461708,-0.606918], [11.376164,0.461708,-0.606918], [11.376164,0.593748,-0.682523], [11.727139,0.593748,-1.803268], [11.802745,0.461708,-1.727663], [11.802745,0.461708,-2.237289], [11.727139,0.593748,-2.161684], [11.806828,0.593748,-0.682523], [11.882434,0.461708,-0.606918], [11.882434,0.461708,-1.142406], [11.806828,0.593748,-1.0668], ],
      f: [["#7F7F0F",4,40,1], ["#7F7F0F",14,9,2], ["#7F7F0F",1,52,13], ["#7F7F0F",29,17,14], ["#7F7F0F",31,55,18], ["#7F7F0F",33,25,22], ["#7F7F0F",13,67,30], ["#7F7F0F",21,71,34], ["#7F7F0F",48,51,39], ["#7F7F0F",42,38,39], ["#7F7F0F",50,56,51], ["#7F7F0F",56,68,51], ["#7F7F0F",59,61,64], ["#7F7F0F",64,72,59], ["#7F7F0F",54,59,56], ["#7F7F0F",34,70,35], ["#7F7F0F",22,19,17], ["#7F7F0F",20,49,16], ["#7F7F0F",10,46,11], ["#7F7F0F",18,60,21], ["#7F7F0F",24,53,20], ["#7F7F0F",39,45,48], ["#7F7F0F",22,28,23], ["#7F7F0F",5,3,2], ["#7F7F0F",27,57,24], ["#7F7F0F",8,41,4], ["#7F7F0F",35,63,26], ["#7F7F0F",17,15,14], ["#7F7F0F",30,66,31], ["#7F7F0F",6,43,8], ["#7F7F0F",11,37,6], ["#7F7F0F",26,62,27], ["#7F7F0F",16,47,10], ["#7F7F0F",2,12,5], ["#7F7F0F",4,41,40], ["#7F7F0F",14,15,9], ["#7F7F0F",1,40,52], ["#7F7F0F",29,32,17], ["#7F7F0F",31,66,55], ["#7F7F0F",33,36,25], ["#7F7F0F",13,52,67], ["#7F7F0F",21,60,71], ["#7F7F0F",48,50,51], ["#7F7F0F",42,44,38], ["#7F7F0F",50,54,56], ["#7F7F0F",56,65,68], ["#7F7F0F",59,58,61], ["#7F7F0F",64,69,72], ["#7F7F0F",54,58,59], ["#7F7F0F",34,71,70], ["#7F7F0F",22,23,19], ["#7F7F0F",20,53,49], ["#7F7F0F",10,47,46], ["#7F7F0F",18,55,60], ["#7F7F0F",24,57,53], ["#7F7F0F",39,38,45], ["#7F7F0F",22,25,28], ["#7F7F0F",5,7,3], ["#7F7F0F",27,62,57], ["#7F7F0F",8,43,41], ["#7F7F0F",35,70,63], ["#7F7F0F",17,19,15], ["#7F7F0F",30,67,66], ["#7F7F0F",6,37,43], ["#7F7F0F",11,46,37], ["#7F7F0F",26,63,62], ["#7F7F0F",16,49,47], ["#7F7F0F",2,9,12], ["#6F3F0F",3,1,2], ["#6F3F0F",7,4,3], ["#6F3F0F",7,6,8], ["#6F3F0F",12,10,11], ["#6F3F0F",12,6,5], ["#6F3F0F",2,13,14], ["#6F3F0F",15,10,9], ["#6F3F0F",19,16,15], ["#6F3F0F",17,21,22], ["#6F3F0F",23,20,19], ["#6F3F0F",28,26,27], ["#6F3F0F",28,24,23], ["#6F3F0F",29,31,32], ["#6F3F0F",29,13,30], ["#6F3F0F",32,18,17], ["#6F3F0F",36,34,35], ["#6F3F0F",33,21,34], ["#6F3F0F",36,26,25], ["#6F3F0F",40,42,39], ["#6F3F0F",43,42,41], ["#6F3F0F",37,44,43], ["#6F3F0F",47,45,46], ["#6F3F0F",37,45,38], ["#6F3F0F",40,51,52], ["#6F3F0F",49,48,47], ["#6F3F0F",53,50,49], ["#6F3F0F",55,59,60], ["#6F3F0F",57,54,53], ["#6F3F0F",63,61,62], ["#6F3F0F",57,61,58], ["#6F3F0F",67,65,66], ["#6F3F0F",52,68,67], ["#6F3F0F",55,65,56], ["#6F3F0F",71,69,70], ["#6F3F0F",60,72,71], ["#6F3F0F",63,69,64], ["#6F3F0F",3,4,1], ["#6F3F0F",7,8,4], ["#6F3F0F",7,5,6], ["#6F3F0F",12,9,10], ["#6F3F0F",12,11,6], ["#6F3F0F",2,1,13], ["#6F3F0F",15,16,10], ["#6F3F0F",19,20,16], ["#6F3F0F",17,18,21], ["#6F3F0F",23,24,20], ["#6F3F0F",28,25,26], ["#6F3F0F",28,27,24], ["#6F3F0F",29,30,31], ["#6F3F0F",29,14,13], ["#6F3F0F",32,31,18], ["#6F3F0F",36,33,34], ["#6F3F0F",33,22,21], ["#6F3F0F",36,35,26], ["#6F3F0F",40,41,42], ["#6F3F0F",43,44,42], ["#6F3F0F",37,38,44], ["#6F3F0F",47,48,45], ["#6F3F0F",37,46,45], ["#6F3F0F",40,39,51], ["#6F3F0F",49,50,48], ["#6F3F0F",53,54,50], ["#6F3F0F",55,56,59], ["#6F3F0F",57,58,54], ["#6F3F0F",63,64,61], ["#6F3F0F",57,62,61], ["#6F3F0F",67,68,65], ["#6F3F0F",52,51,68], ["#6F3F0F",55,66,65], ["#6F3F0F",71,72,69], ["#6F3F0F",60,59,72], ["#6F3F0F",63,70,69], ],
    }
  };

  let a = 0.5;
  let nMult = [a, a, a, a, a, a, a, 0]
  let n = 0;
	for (var m in models_oxygene) {
		for (var v in models_oxygene[m]['v']) {
			models_oxygene[m].v[v][0] = (models_oxygene[m].v[v][0] - 4.5) + n * nMult[n] - 1.45;
			models_oxygene[m].v[v][1] -= 0;
			models_oxygene[m].v[v][2] += 1.565;
      models_oxygene[m].v[v][1] *= 1.5;
      models_oxygene[m].v[v][2] *= 1.05;
			models_oxygene[m].v[v] = rotX(models_oxygene[m].v[v], -90);
		}
    n++;
	}

  let oxygeneSortList = ['O', 'X', 'E1', 'N', 'E', 'G', 'Y'];
	for (var mi in oxygeneSortList) {
    var m = oxygeneSortList[mi];
    modelRenderList.push({
      model: m,
      campath: 'oxygene',
    });
    models[m] = models_oxygene[m];
  }

  let modelOxygeneIn = {
    fstart: models_oxygenein_fstart,
    fend: models_oxygenein_fend,
    v: [],
    f: [],
  };
  /*
    v: [[2.84759,1.0,-1.0], [2.84759,-1.0,-1.0], [2.84759,1.0,1.0], [2.84759,-1.0,1.0], [-2.84759,1.0,-1.0], [-2.84759,-1.0,-1.0], [-2.84759,1.0,1.0], [-2.84759,-1.0,1.0], [-8.009942,-1.0,-1.0], [-8.009942,-1.0,1.0], [-8.009942,1.0,1.0], [-8.009942,1.0,-1.0], [-13.306188,-1.0,-1.0], [-13.306188,-1.0,1.0], [-13.306188,1.0,1.0], [-13.306188,1.0,-1.0], [-18.722565,-1.0,-1.0], [-18.722565,-1.0,1.0], [-18.722565,1.0,1.0], [-18.722565,1.0,-1.0], [-24.094233,-1.0,-1.0], [-24.094233,-1.0,1.0], [-24.094233,1.0,1.0], [-24.094233,1.0,-1.0], ],
    f: [["#ff77a8",8,10,7], ["#ff77a8",6,9,8], ["#ff77a8",7,11,5], ["#ff77a8",5,12,6], ["#ff77a8",20,24,17], ["#ff77a8",17,21,18], ["#ff77a8",19,23,20], ["#ff77a8",18,22,19], ["#ff77a8",10,11,7], ["#ff77a8",9,10,8], ["#ff77a8",11,12,5], ["#ff77a8",12,9,6], ["#ff77a8",24,21,17], ["#ff77a8",21,22,18], ["#ff77a8",23,24,20], ["#ff77a8",22,23,19], ["#ab5236",1,3,5], ["#ab5236",4,8,3], ["#ab5236",6,8,2], ["#ab5236",6,2,5], ["#ab5236",3,7,5], ["#ab5236",8,7,3], ["#ab5236",8,4,2], ["#ab5236",2,1,5], ["#ffa300",12,16,9], ["#ffa300",9,13,10], ["#ffa300",11,15,12], ["#ffa300",10,14,11], ["#ffa300",16,13,9], ["#ffa300",13,14,10], ["#ffa300",15,16,12], ["#ffa300",14,15,11], ["#ab5236",15,19,16], ["#ab5236",14,18,15], ["#ab5236",16,20,13], ["#ab5236",13,17,14], ["#ab5236",19,20,16], ["#ab5236",18,19,15], ["#ab5236",20,17,13], ["#ab5236",17,18,14], ],
  */

  var colors2 = [

  
  
    ['#4F1F0F', '#3F0F0F', '#4F1F0F', '#5F2F0F'],
    ['#5F2F0F', '#4F1F0F', '#5F2F0F', '#6F3F0F'],
    ['#6F3F0F', '#5F2F0F', '#6F3F0F', '#7F4F0F'],
    ['#7F4F0F', '#6F3F0F', '#7F4F0F', '#7F5F0F'],
    ['#7F5F0F', '#7F4F0F', '#7F5F0F', '#7F7F0F'],
  ];
  
  var pointsListY = [21,2,4,23];
  var pointsList = [
    models_oxygene['Y'].v[pointsListY[0] - 1],
    models_oxygene['Y'].v[pointsListY[1] - 1],
    models_oxygene['Y'].v[pointsListY[2] - 1],
    models_oxygene['Y'].v[pointsListY[3] - 1],
  ];
  var dirX = normalize(vSub(pointsList[2],pointsList[1]));
  var dirY = normalize(vSub(pointsList[0],pointsList[1]));
  var dirZ = normalize(cross(dirX,dirY));
  
  
  
  
  var dz = -0.07;
  var dx = 0.2;//0.055;
  var dy = 0.15;//0.04;
  var ni0 = 1;
  var nii = 0;
  for (var ni = 0; ni <= 5; ni++) {
    var points = [
      pointsList[0],
      pointsList[1],
      pointsList[2],
      pointsList[3],
    ];
    
    
    if (ni < 4) {
      nii = ni0 * ni;
      if (ni != 0) {
        ni0 = ni0 / 1.4;
      }
    } else {
      nii += 0.03;
      console.log('nii', nii);
      
    }
    

    points[0] = vMov(points[0], dirX, nii*dx);
    points[1] = vMov(points[1], dirX, nii*dx);
    points[2] = vMov(points[2], dirX, -nii*dx);
    points[3] = vMov(points[3], dirX, -nii*dx);

    points[0] = vMov(points[0], dirY, -nii*dy);
    points[1] = vMov(points[1], dirY, nii*dy);
    points[2] = vMov(points[2], dirY, nii*dy);
    points[3] = vMov(points[3], dirY, -nii*dy);

    for (var p in points) {
      points[p] = vMov(points[p], dirZ, ni*dz);
      modelOxygeneIn.v.push(points[p]);
    }

    var nn = ni * 4;
    if (ni < 5) {
      modelOxygeneIn.f.push([colors2[ni][0], nn+1, nn+2, nn+6, nn+5]);
      modelOxygeneIn.f.push([colors2[ni][1], nn+2, nn+3, nn+7, nn+6]);
      modelOxygeneIn.f.push([colors2[ni][2], nn+3, nn+4, nn+8, nn+7]);
      modelOxygeneIn.f.push([colors2[ni][3], nn+4, nn+1, nn+5, nn+8]);
    }
    
  }
  console.log(modelOxygeneIn);
  
  
  

  models['oxygenein'] = modelOxygeneIn;
  modelRenderList.push({
    model: 'oxygenein',
    campath: 'oxygene',
  });

  
  camPathList['oxygene'] = [];
  //0
  resetCam();
	camSetLookAtDistRot([0,0,0], 8.70, 26, 14, -4.5);
  camMovDir(3);
  camPathList['oxygene'].push({"frame":-1, "picoEye":picoEye, "picoDir":picoDir, "picoUp":picoUp});
  camPathList['oxygene'].push({"frame":0, "picoEye":picoEye, "picoDir":picoDir, "picoUp":picoUp});
  //25
  camSetLookAtDistRot([0,0,0], 8.70, 44.5, 6, -3.0);
  camMovDir(6.2);
  camMov(-0.625, 0.2, 0);
  camPathList['oxygene'].push({"frame":25, "picoEye":picoEye, "picoDir":picoDir, "picoUp":picoUp});
  //50
  camSetLookAtDistRot([0,0,0], 1.7, 61, -2, 2);
  camMov(-0.55, 0, 0);
  camMovUp(-0.45);
  camMovDir(0.4);
  camPathList['oxygene'].push({"frame":50, "picoEye":picoEye, "picoDir":picoDir, "picoUp":picoUp});
  
  
  //60
  camSetLookAtDistRot([0,0,0], 1.372, 75, -3.2, 2);
  camMov(-0.425, 0, 0);
  camMovUp(-0.55);
  camMovDir(0.2);
  camPathList['oxygene'].push({"frame":66, "picoEye":picoEye, "picoDir":picoDir, "picoUp":picoUp});
  
  picoEye = [-0.40151354154529706, -0.9257584232874281, 0.4266731615211677];
  picoDir = [-0.039614551711312514, 0.9710261182937233, 0.2356670636388035];
  picoUp = [0.11028359982776455, 0.2385556690396207, -0.9648464750301411];  
  camPathList['oxygene'].push({"frame":80, "picoEye":picoEye, "picoDir":picoDir, "picoUp":picoUp});
  
  picoEye = [-0.4009997442846358, -0.8219847040381604, 0.4476572304089662];
  picoDir = [-0.02712444597533847, 0.9910110880705176, 0.13100109828478426];
  picoUp = [0.1187952374608479, 0.13325368016191116, -0.9839365570401011];
  camPathList['oxygene'].push({"frame":85, "picoEye":picoEye, "picoDir":picoDir, "picoUp":picoUp});
  
  picoEye = [-0.40357107926904645, -0.6616033226796021, 0.4427180780000171];
  picoDir = [-0.010883817965094994, 0.9998659189469598, -0.012234648946927228];
  picoUp = [0.18595365384907656, -0.010101017793092764, -0.982506594410298];
  camPathList['oxygene'].push({"frame":89, "picoEye":picoEye, "picoDir":picoDir, "picoUp":picoUp});
  camPathList['oxygene'].push({"frame":90, "picoEye":picoEye, "picoDir":picoDir, "picoUp":picoUp});
  camPathList['oxygene'].push({"frame":-1, "picoEye":picoEye, "picoDir":picoDir, "picoUp":picoUp});
 
}

// fake data
function init_tonnel1(){
  return;
  modelRenderList.push({
    model: 'tonnel1',
    campath: 'tonnel1',
  });
  camPathList['tonnel1'] = [];
  let model = {
		fstart: useFrameLimit ? models_tonnel1_fstart : 0,
		fend: useFrameLimit ? models_tonnel1_fend : 9999,
    v: [],
    f: [],
  }
  var nqty = 23;
  for (var n = 0; n < nqty; n++) {
    for (var i = 0; i < 13; i++) {
      model.v.push([0, 0, 0]);
    }
    if (n < nqty - 1) {
      for (var i = 0; i < 12; i++) {
        model.f.push(['#000000',1,2,3,4]);
      }
    }
  }
  models['tonnel1'] = model;
}

// вспомогательная функция для смены палитры
// чтобы лучше при наложении было видно
function changeColors(colors) {
  let colorsNew = [];
  for (let c in colors) {
    colorsNew.push(
      '#' + colors[c].substr(5,2)
          + colors[c].substr(3,2)
          + colors[c].substr(1,2)
    );
  }
  return colorsNew;
}