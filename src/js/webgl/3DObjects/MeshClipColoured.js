var MeshClipColoured = function () {
  var vertexShaderSource = [
    "attribute vec3 aVertexPosition;",
    "attribute vec3 aVertexColor;",
    "uniform mat4 uMVMatrix;",
    "uniform mat4 uPMatrix;",
    "varying lowp vec4 vColor;",
    "void main(void) {",
    "  gl_Position = uPMatrix * (uMVMatrix * vec4(aVertexPosition, 1.0));",
    "  vColor = vec4(aVertexColor, 1.0);",
    "}"
  ].join("\n");

  var fragmentShaderSource = [
    "varying lowp vec4 vColor;",
    "void main(void) {",
    "   gl_FragColor = vColor;", //vColor; vec4(1.0,0.0,0.0,1.0);
    "}"
  ].join("\n");

  this.program = ShaderProgram.createShader(vertexShaderSource, fragmentShaderSource);
  GL.useProgram(this.program);

  //prepare variables and buffers
  this.aVertexPosition = GL.getAttribLocation(this.program, "aVertexPosition");
  this.aVertexColor = GL.getAttribLocation(this.program, "aVertexColor");
  this.uMVMatrix = GL.getUniformLocation(this.program, "uMVMatrix");
  this.uPMatrix = GL.getUniformLocation(this.program, "uPMatrix");

  this.vertexBuffer = GL.createBuffer();
  this.indexBuffer = GL.createBuffer();
  this.colorBuffer = GL.createBuffer();
}

MeshClipColoured.prototype = {
  program: null,
  constructor: MeshClipColoured,

  aVertexPosition: null,
  aVertexColor: null,
  uMVMatrix: null,
  uPMatrix: null,
  vertexBuffer: null,
  indexBuffer: null,
  colorBuffer: null,

  enabled: true,

  prepareProgram: function (mesh) {
    GL.useProgram(this.program);
    GL.bindBuffer(GL.ARRAY_BUFFER, this.vertexBuffer);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(mesh.vertexData), GL.DYNAMIC_DRAW);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(mesh.indexData), GL.DYNAMIC_DRAW);
    this.indexBuffer.arrayLength = mesh.indexData.length;

    GL.bindBuffer(GL.ARRAY_BUFFER, this.colorBuffer);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(mesh.colorData), GL.DYNAMIC_DRAW);
  },

  render: function (pMatrix, mvMatrix) {
    GL.useProgram(this.program);
    GL.uniformMatrix4fv(this.uPMatrix, false, pMatrix);
    GL.uniformMatrix4fv(this.uMVMatrix, false, mvMatrix);

    GL.enableVertexAttribArray(this.aVertexPosition);
    GL.bindBuffer(GL.ARRAY_BUFFER, this.vertexBuffer);
    GL.vertexAttribPointer(this.aVertexPosition, 3, GL.FLOAT, false, 0, 0);

    GL.enableVertexAttribArray(this.aVertexColor);
    GL.bindBuffer(GL.ARRAY_BUFFER, this.colorBuffer);
    GL.vertexAttribPointer(this.aVertexColor, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    GL.polygonOffset(2.0, 2.0);
    GL.enable(GL.POLYGON_OFFSET_FILL);
    GL.drawElements(GL.TRIANGLES, this.indexBuffer.arrayLength, GL.UNSIGNED_SHORT, 0);
    GL.disable(GL.POLYGON_OFFSET_FILL);
    GL.flush();
  }
}