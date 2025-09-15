import { initBuffers } from "./init-buffers.js";
import { drawScene } from "./draw-scene.js";

main();

//start

function main() {
  const canvas = document.querySelector("#gl-canvas");

  // initalize the GL context
  const gl = canvas.getContext("webgl");

  // only continue if webGl is available and working
  if (gl === null) {
    alert(
      "Unable to initailize WebGl. Your browser or machine may not support it."
    );
    return;
  }

  // set clear color to black , fully opaque
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // claer the color buffer with specitied clear color
  gl.clear(gl.COLOR_BUFFER_BIT);

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

  const fsSource = `
    varying lowp vec4 vColor;
    void main() {
      gl_FragColor = vColor;
    }
  `;

  // initialize a shader program this is where all the light for the vertices and so froth is established
  const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

  // collect all the info needed to use the shader program
  // look up whicj attribute our shader program is using for aVertexPosition and look up uniform locations
  const programInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, "aVertexPosition"),
      vertexColor: gl.getAttribLocation(shaderProgram, "aVertexColor"),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(
        shaderProgram,
        "uProjectionMatrix"
      ),
      modelViewMatrix: gl.getUniformLocation(shaderProgram, "uModelViewMatrix"),
    },
  };

  // Here's where we call the routine that builds all the
  // objects we'll be drawing.
  const buffers = initBuffers(gl);

  // Draw the scene
  drawScene(gl, programInfo, buffers);
}

// initalize a shader program, so webGl knows how to draw our data
function initShaderProgram(gl, vsSource, fsSource) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

  // create the shader program
  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  // if creating the shader program failed, alert program
  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert(
      `Unable to initalize the shader program: ${gl.getProgramInfoLog(
        shaderProgram
      )}`
    );
    return null;
  }
  return shaderProgram;
}

// create a shader of the given type , upload the source and compiles it.
function loadShader(gl, type, source) {
  const shader = gl.createShader(type);

  //send the sourcr on the shader object
  gl.shaderSource(shader, source);

  //compile the shader program
  gl.compileShader(shader);

  // see if it complied successfully
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert(
      `An error occurred compilling the shader: ${gl.getShaderInfoLog(shader)}`
    );
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}
