attribute vec3 aVertexPosition;
uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
varying highp float vPosX;
void main(void) {
  vPosX = vec4(aVertexPosition , 1.0)[0];
  gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
}
