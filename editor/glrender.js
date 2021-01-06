'use strict';

// based on https://github.com/mdn/webgl-examples/blob/gh-pages/tutorial/sample5/webgl-demo.js

var vertexCount = 0;
var shaderProgram;
var programInfo;
var buffers;
var glRenderList = {};

// Vertex shader program
const vsSource = `
  attribute vec4 aVertexPosition;
  attribute vec4 aVertexColor;
  uniform mat4 uModelViewMatrix;
  uniform mat4 uProjectionMatrix;
  varying lowp vec4 vColor;
  void main(void) {
    gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
    vColor = aVertexColor;
  }
`;

// Fragment shader program
const fsSource = `
  varying lowp vec4 vColor;
  void main(void) {
    gl_FragColor = vColor;
  }
`;

// init
function glInit(gl) {
  if (isGlCullFace) {
    gl.enable(gl.CULL_FACE);
  }
  shaderProgram = initShaderProgram(gl, vsSource, fsSource);
  programInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
      vertexColor: gl.getAttribLocation(shaderProgram, 'aVertexColor'),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
    },
  };

  buffers = initBuffers(gl);
}

// initBuffers
function initBuffers(gl) {

  vertexCount = 0;
  var glPositions = [];
  var glIndices = [];
  var glColors = [];
  var pos = 0;
  for (let m in models) {
    //console.log('init model: ' + m);
    let vertexCountStart = vertexCount;
    var vList = [];
    for (var v in models[m].v) {
      var rx = isRandomize ? (Math.random() * models[m].rnd - models[m].rnd/2) * 2 : 0;
      var ry = isRandomize ? (Math.random() * models[m].rnd - models[m].rnd/2) * 2 : 0;
      var rz = isRandomize ? (Math.random() * models[m].rnd - models[m].rnd/2) * 2 : 0;
      vList.push(
        [models[m].v[v][0]+rx, models[m].v[v][1]+ry, models[m].v[v][2]+rz]
      );
    }
  
    
    
    for (let f in models[m].f) {
      var color = getGlColor(models[m].f[f][0]);
      for (var c = 0; c < 3; c++) {
        glColors.push(color[0], color[1], color[2], color[3]);
      }
      pos = vList[ models[m].f[f][1] - 1 ];
      glPositions.push(pos[0]); glPositions.push(pos[1]); glPositions.push(pos[2]);
      pos = vList[ models[m].f[f][2] - 1 ];
      glPositions.push(pos[0]); glPositions.push(pos[1]); glPositions.push(pos[2]);
      pos = vList[ models[m].f[f][3] - 1 ];
      glPositions.push(pos[0]); glPositions.push(pos[1]); glPositions.push(pos[2]);
      glIndices.push(vertexCount++);
      glIndices.push(vertexCount++);
      glIndices.push(vertexCount++);
      //quad
      if (models[m].f[f].length == 5) {
        if (models[m].f[f][4] != models[m].f[f][2]) {
          for (var c = 0; c < 3; c++) {
            glColors.push(color[0], color[1], color[2], color[3]);
          }
          pos = vList[ models[m].f[f][3] - 1 ];
          glPositions.push(pos[0]); glPositions.push(pos[1]); glPositions.push(pos[2]);
          pos = vList[ models[m].f[f][4] - 1 ];
          glPositions.push(pos[0]); glPositions.push(pos[1]); glPositions.push(pos[2]);
          pos = vList[ models[m].f[f][1] - 1 ];
          glPositions.push(pos[0]); glPositions.push(pos[1]); glPositions.push(pos[2]);
          glIndices.push(vertexCount++);
          glIndices.push(vertexCount++);
          glIndices.push(vertexCount++);
        }
      } else {
        if (m.length > 2) {
          console.log('error', m, models[m].f[f]);
        }
      }
    }
    glRenderList[m] = {offset: vertexCountStart, count: vertexCount - vertexCountStart};
  }

  // Create a buffer for the cube's vertex positions.
  const positionBuffer = gl.createBuffer();

  // Select the positionBuffer as the one to apply buffer
  // operations to from here out.
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // Now pass the list of positions into WebGL to build the
  // shape. We do this by creating a Float32Array from the
  // JavaScript array, then use it to fill the current buffer.
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(glPositions), gl.STATIC_DRAW);

  const colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(glColors), gl.STATIC_DRAW);

  // Build the element array buffer; this specifies the indices
  // into the vertex arrays for each face's vertices.
  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

  // This array defines each face as two triangles, using the
  // indices into the vertex array to specify each triangle's
  // position.

  // Now send the element array to GL
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(glIndices), gl.STATIC_DRAW);

  return {
    position: positionBuffer,
    color: colorBuffer,
    indices: indexBuffer,
  };
}



function glDrawFrame(gl) {
  gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
  gl.clearDepth(1.0);                 // Clear everything
  gl.enable(gl.DEPTH_TEST);           // Enable depth testing
  gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

  //??? gl.enable(gl.BLEND);
  //??? gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  // Clear the canvas before we start drawing on it.
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Tell WebGL how to pull out the positions from the position
  // buffer into the vertexPosition attribute
  {
    const numComponents = 3;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.vertexAttribPointer(
      programInfo.attribLocations.vertexPosition,
      numComponents,
      type,
      normalize,
      stride,
      offset
    );
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
  }

  // Tell WebGL how to pull out the colors from the color buffer
  // into the vertexColor attribute.
  {
    const numComponents = 4;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
    gl.vertexAttribPointer(
      programInfo.attribLocations.vertexColor,
      numComponents,
      type,
      normalize,
      stride,
      offset
    );
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexColor);
  }

  // Tell WebGL which indices to use to index the vertices
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);

  // Tell WebGL to use our program when drawing
  gl.useProgram(programInfo.program);






  const type = gl.UNSIGNED_SHORT;
  for (let mrlId in modelRenderList) {
    let mrl = modelRenderList[mrlId];
    let m = mrl.model;
    // render if model is visible
    if (models[m].fstart <= frameNumber && models[m].fend > frameNumber) {

      // clean z-buff
      if (isGlClearZBuff) {
        gl.clear(gl.DEPTH_BUFFER_BIT);
      }

      // get & spline cam
      if (isForceCamPath || (isNeedChangeCam || isPlay)) {
        changeCamPath(mrl.campath);
        spline_cam(mrl.campath);
      }

      // calculate & setcamera matrix
      var modelViewMatrix = mat4.create();
      var camCenter = [picoEye[0]+picoDir[0], picoEye[1]+picoDir[1], picoEye[2]+picoDir[2]];
      mat4.lookAt(modelViewMatrix, picoEye, camCenter, picoUp);
      gl.uniformMatrix4fv(
        programInfo.uniformLocations.modelViewMatrix,
        false,
        modelViewMatrix
      );
      
      // calculate & projection matrix
      var fovAngle = models[m].fov;
      var fieldOfView = fovAngle * Math.PI / 180; // in radians
      var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
      var zNear = 0.04;
      var zFar = 100.0;
      var projectionMatrix = mat4.create();
      mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);
      gl.uniformMatrix4fv(
        programInfo.uniformLocations.projectionMatrix,
        false,
        projectionMatrix
      );
      
      // render
      
      var offset = glRenderList[m].offset * 2;
      var count = glRenderList[m].count;
      if (count > 0) {
        gl.drawElements(wireframe == 0 ? gl.TRIANGLES : gl.LINES, count, type, offset);
      }

    }
  }
}

//
// Initialize a shader program, so WebGL knows how to draw our data
//
function initShaderProgram(gl, vsSource, fsSource) {

  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

  // Create the shader program
  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  // If creating the shader program failed, alert
  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
    return null;
  }

  return shaderProgram;
}

//
// creates a shader of the given type, uploads the source and
// compiles it.
//
function loadShader(gl, type, source) {
  const shader = gl.createShader(type);

  // Send the source to the shader object
  gl.shaderSource(shader, source);

  // Compile the shader program
  gl.compileShader(shader);

  // See if it compiled successfully
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

function getGlColor(color) {
  let r = parseInt(color.substr(1, 2), 16) / 255;
  let g = parseInt(color.substr(3, 2), 16) / 255;
  let b = parseInt(color.substr(5, 2), 16) / 255;
  return [r, g, b, 1.0];
}