'use strict';

// based on https://github.com/mdn/webgl-examples/blob/gh-pages/tutorial/sample5/webgl-demo.js

var drawType = 0;
var vertexCount = 0;

var shaderProgram;
var programInfo;

var cubeRot = 0;

var buffers;
/* = {
  position: [],
  color: [],
  indices: [],
};*/

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

//
// initBuffers
//
// Initialize the buffers we'll need. For this demo, we just
// have one object -- a simple three-dimensional cube.
//
function initBuffers(gl) {

  vertexCount = 0;
  var glPositions = [];
  var glIndices = [];
  var glColors = [];

  for (let m in models) {
    for (let f in models[m].f) {
      var color = getGlColor(models[m].f[f][0]);
      glColors.push(color[0], color[1], color[2], color[3]);
      glColors.push(color[0], color[1], color[2], color[3]);
      glColors.push(color[0], color[1], color[2], color[3]);
      var pos = models[m].v[ models[m].f[f][1] - 1 ];
      glPositions.push(pos[0]); glPositions.push(pos[1]); glPositions.push(-pos[2]);
      pos = models[m].v[ models[m].f[f][2] - 1 ];
      glPositions.push(pos[0]); glPositions.push(pos[1]); glPositions.push(-pos[2]);
      pos = models[m].v[ models[m].f[f][3] - 1 ];
      glPositions.push(pos[0]); glPositions.push(pos[1]); glPositions.push(-pos[2]);
      glIndices.push(vertexCount++);
      glIndices.push(vertexCount++);
      glIndices.push(vertexCount++);
    }
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

  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(glIndices), gl.STATIC_DRAW);

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

  // Create a perspective matrix, a special matrix that is
  // used to simulate the distortion of perspective in a camera.
  // Our field of view is 45 degrees, with a width/height
  // ratio that matches the display size of the canvas
  // and we only want to see objects between 0.1 units
  // and 100 units away from the camera.

  const fovAngle = 90;
  const fieldOfView = fovAngle * Math.PI / 180; // in radians
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const zNear = 0.1;
  const zFar = 100.0;
  let projectionMatrix = mat4.create();
  mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);
  
  // Calculate camera matrix

  var dir = [picoDir[0], picoDir[1], picoDir[2]];
  var up = [picoUp[0], picoUp[1], picoUp[2]];
  var eye = [picoEye[0], picoEye[1], -picoEye[2]];
	const zaxis = normalize(dir);
	const xaxis = normalize(cross(zaxis, up));
	const yaxis = normalize(cross(xaxis, zaxis));
	var modelViewMatrix = [
    xaxis[0], xaxis[1], xaxis[2], 0,
    yaxis[0], yaxis[1], yaxis[2], 0,
    zaxis[0], zaxis[1], zaxis[2], 0,
    -(xaxis[0]*eye[0] + yaxis[0]*eye[1] + zaxis[0]*eye[2]),
    -(xaxis[1]*eye[0] + yaxis[1]*eye[1] + zaxis[1]*eye[2]),
    -(xaxis[2]*eye[0] + yaxis[2]*eye[1] + zaxis[2]*eye[2]),
    1,
  ];

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
        offset);
    gl.enableVertexAttribArray(
        programInfo.attribLocations.vertexPosition);
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
        offset);
    gl.enableVertexAttribArray(
        programInfo.attribLocations.vertexColor);
  }

  // Tell WebGL which indices to use to index the vertices
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);

  // Tell WebGL to use our program when drawing
  gl.useProgram(programInfo.program);

  // Set the shader uniforms
  gl.uniformMatrix4fv(
      programInfo.uniformLocations.projectionMatrix,
      false,
      projectionMatrix);
  gl.uniformMatrix4fv(
      programInfo.uniformLocations.modelViewMatrix,
      false,
      modelViewMatrix);

  {
    const type = gl.UNSIGNED_SHORT;
    const offset = 0;
    //mode, count, type, offset
    gl.drawElements(drawType == 0 ? gl.TRIANGLES : gl.LINES, vertexCount, type, offset);
  }

  //cubeRot += 1;
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