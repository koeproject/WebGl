function initBuffers(gl) {
  const positionBuffer = initPositionBuffer(gl);
  const colorBuffer = initColorBuffer(gl);
  return { position: positionBuffer, color: colorBuffer };
}

function initPositionBuffer(gl) {
  // create a buffer for the square's position
  const positionBuffer = gl.createBuffer();

  //select the positionBuffer as the one to apply buffer operation to form here out.
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // now create an array of position for the square .
  const positions = [1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0];

  // now pass the list of positions into webGl to build the shape. we do this by creating a Float32Array from the Javascript array, then use it to fill the current buffer.
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  return positionBuffer;
}

function initColorBuffer(gl) {
  const colors = [
    1.0,
    1.0,
    1.0,
    1.0, // white
    1.0,
    0.0,
    0.0,
    1.0, // red
    0.0,
    1.0,
    0.0,
    1.0, // green
    0.0,
    0.0,
    1.0,
    1.0, // blue
  ];

  const colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bindData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

  return colorBuffer;                                                           
}

export { initBuffers };
