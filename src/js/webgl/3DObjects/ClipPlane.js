var ClipPlane = function () {
  var vertexShaderSource = [
    "attribute vec3 aVertexPosition;",
    "uniform mat4 uMVMatrix;",
    "uniform mat4 uPMatrix;",
    "void main(void) {",
    "  gl_Position = uPMatrix * (uMVMatrix * vec4(aVertexPosition, 1.0));",
    "}"
  ].join("\n");

  var fragmentShaderSource = [
    "void main(void) {",
    "   gl_FragColor = vec4(1.0, 1.0, 1.0, 0.5);",
    "}"
  ].join("\n");

  this.program = ShaderProgram.createShader(vertexShaderSource, fragmentShaderSource);
  GL.useProgram(this.program);

  //prepare variables and buffers
  this.aVertexPosition = GL.getAttribLocation(this.program, "aVertexPosition");
  this.uMVMatrix = GL.getUniformLocation(this.program, "uMVMatrix");
  this.uPMatrix = GL.getUniformLocation(this.program, "uPMatrix");

  this.vertexBuffer = GL.createBuffer();
  this.indexBuffer = GL.createBuffer();
}

ClipPlane.prototype = {
  program: null,
  constructor: ClipPlane,

  aVertexPosition: null,
  uMVMatrix: null,
  uPMatrix: null,
  vertexBuffer: null,
  indexBuffer: null,
  rotation: [0,0],
  enabled: true,

  prepareProgram: function (mesh, base, normal) {

    GL.useProgram(this.program);
    GL.bindBuffer(GL.ARRAY_BUFFER, this.vertexBuffer);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(mesh.vertices), GL.DYNAMIC_DRAW);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(mesh.indices), GL.DYNAMIC_DRAW);
    this.indexBuffer.arrayLength = mesh.indices.length;

    var quat = [], normal1 = [], normal2 = [];
    vec3.normalize([1, 0, 0], normal1);
    vec3.normalize(normal, normal2);
    vec3.rotationTo(normal1, normal2, quat);
    this.tMatrix = [];
    this.tMatrix2 = [];
    mat4.fromRotationTranslation(this.tMatrix, quat, base);
    var t3 = [];
    mat4.fromRotationTranslation(t3, quat, base);
    mat4.inverse(this.tMatrix2, t3);
  },

  render: function (pMatrix, mvMatrix) {

    var tMatrix = [];
    mat4.multiply(tMatrix, mvMatrix, this.tMatrix);
    //CLIP PLANE
    GL.blendFunc(GL.SRC_ALPHA, GL.ONE);
    GL.disable(GL.CULL_FACE);
    GL.enable(GL.BLEND);
    //GL.disable(GL.DEPTH_TEST);

    GL.useProgram(this.program);

    //Set matrix uniforms
    GL.uniformMatrix4fv(this.uPMatrix, false, pMatrix);
    GL.uniformMatrix4fv(this.uMVMatrix, false, tMatrix);

    //Draw
    GL.enableVertexAttribArray(this.aVertexPosition);
    GL.bindBuffer(GL.ARRAY_BUFFER, this.vertexBuffer);
    GL.vertexAttribPointer(this.aVertexPosition, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    GL.drawElements(GL.TRIANGLES, this.indexBuffer.arrayLength, GL.UNSIGNED_SHORT, 0);
    GL.flush();
    //GL.enable(GL.DEPTH_TEST);
    GL.disable(GL.BLEND);
    GL.enable(GL.CULL_FACE);
  }
}