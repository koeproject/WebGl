import { initBuffers } from "./init-buffers";
import { drawScene } from "./draw-scene";

main();

function initShaderProgram(gl, vsSource, fsSource) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

  // create shader program
  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram.fragmentShader);
  gl.linkProgram(shaderProgram);

  // check failed and alert
  if ((!gl.getProgramParameter(shaderProgram), gl.LINK_STATUS)) {
    alert(
      `Unable to initialize the shader program: ${gl.getProgramInfoLog(
        shaderProgram
      )}`
    );
    return null;
  }
  return shaderProgram;
}

function loadShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert(
      `An error occurred compiling the shaders: ${gl.getShaderInfoLog(shader)}`
    );
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function main() {
  const canvas = document.querySelector("#gl-canvas");

  //innitialize the Gl context
  const gl = canvas.getContext("webgl");

  if (gl === null) {
    alert(
      "Unable to innitailize webGl. your browser or machine may not support it"
    );
    return;
  }
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  //initshaderProgram
  const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

  // vertex shader program
  const vsSource = `
    attribute vec4 aVertexPosition;
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectMatrix;
    void main(){
      gl_Position = uProjectMatrix * uModelViewMatrix * aVertexPosition;
      }
      `;

  // fragment shader program
  const fsSource = `
    void main(){
      gl_FragColor = vec4(1.0,1.0,1.0,1.0)
    }
  `;

  const programInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, "aVertexPosition"),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(
        shaderProgram,
        "uProjectionMatrix"
      ),
      modelViewMatrix: gl.getUniformLocation(shaderProgram, "uModelViewMatrix"),
    },
  };

  const buffers = initBuffers(gl);
  drawScene(gl,programInfo,buffers);

}
