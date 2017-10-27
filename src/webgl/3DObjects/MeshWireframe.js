import ShaderProgram from '../ShaderProgram';
import GLService from './../GL';

const MeshWireframe = function () {
  const GL = GLService.context;
  const vertexShaderSource = `
    attribute vec3 aVertexPosition;
    uniform mat4 uMVMatrix;
    uniform mat4 uPMatrix;
    varying highp float vPosX;
    void main(void) {
      vPosX = vec4(aVertexPosition , 1.0)[0];
      gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
    }`;

  const fragmentShaderSource = `
    varying highp float vPosX;
    void main(void) {
      gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
    }`;

  this.program = ShaderProgram.createShader(vertexShaderSource, fragmentShaderSource);
  GL.useProgram(this.program);

  //prepare variables and buffers
  this.aVertexPosition = GL.getAttribLocation(this.program, "aVertexPosition");
  this.uMVMatrix = GL.getUniformLocation(this.program, "uMVMatrix");
  this.uPMatrix = GL.getUniformLocation(this.program, "uPMatrix");

  this.vertexBuffer = GL.createBuffer();
  this.indexBuffer = GL.createBuffer();
};

MeshWireframe.prototype = {
  program: null,
  constructor: MeshWireframe,

  aVertexPosition: null,
  uMVMatrix: null,
  uPMatrix: null,
  vertexBuffer: null,
  indexBuffer: null,

  enabled: true,

  prepareProgram: function (mesh) {
    const GL = GLService.context;
    GL.useProgram(this.program);
    GL.bindBuffer(GL.ARRAY_BUFFER, this.vertexBuffer);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(mesh.vertexData), GL.DYNAMIC_DRAW);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(mesh.edgeData), GL.DYNAMIC_DRAW);
    this.indexBuffer.arrayLength = mesh.edgeData.length;
  },

  render: function (pMatrix, mvMatrix) {
    const GL = GLService.context;
    GL.useProgram(this.program);
    GL.uniformMatrix4fv(this.uPMatrix, false, pMatrix);
    GL.uniformMatrix4fv(this.uMVMatrix, false, mvMatrix);

    GL.enableVertexAttribArray(this.aVertexPosition);
    GL.bindBuffer(GL.ARRAY_BUFFER, this.vertexBuffer);
    GL.vertexAttribPointer(this.aVertexPosition, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    GL.drawElements(GL.LINES, this.indexBuffer.arrayLength, GL.UNSIGNED_SHORT, 0);
    GL.flush();
  }
};

export default MeshWireframe;