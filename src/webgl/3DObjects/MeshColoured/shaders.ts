export const fragmentShaderSource = `
  varying lowp vec4 vColor;
  varying highp float vPosX;
  void main(void) {
    gl_FragColor = vColor;
  }
  `;

export const vertexShaderSource = `
  attribute vec3 aVertexPosition;
  attribute vec3 aVertexColor;
  uniform mat4 uMVMatrix;
  uniform mat4 uPMatrix;
  varying lowp vec4 vColor;
  varying highp float vPosX;
  void main(void) {
    vPosX = vec4(aVertexPosition , 1.0)[0];
    gl_Position = uPMatrix * (uMVMatrix * vec4(aVertexPosition, 1.0));
    vColor = vec4(aVertexColor, 1.0);
  }
`;