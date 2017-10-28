import {createShader} from '../../ShaderProgram';
import GLService from '../../GL';
import vertexShaderSource from "./vertex.glsl";
import fragmentShaderSource from "./fragment.glsl";

export default class MeshColoured {
  constructor() {
    this.program         = null;
    this.aVertexPosition = null;
    this.aVertexColor    = null;
    this.uMVMatrix       = null;
    this.uPMatrix        = null;
    this.vertexBuffer    = null;
    this.indexBuffer     = null;
    this.colorBuffer     = null;

    this.enabled = true;

    const GL                 = GLService.context;

    this.program = createShader(vertexShaderSource, fragmentShaderSource);
    GL.useProgram(this.program);

    //prepare variables and buffers
    this.aVertexPosition = GL.getAttribLocation(this.program, "aVertexPosition");
    this.aVertexColor    = GL.getAttribLocation(this.program, "aVertexColor");
    this.uMVMatrix       = GL.getUniformLocation(this.program, "uMVMatrix");
    this.uPMatrix        = GL.getUniformLocation(this.program, "uPMatrix");

    this.vertexBuffer = GL.createBuffer();
    this.indexBuffer  = GL.createBuffer();
    this.colorBuffer  = GL.createBuffer();
  }


  prepareProgram(mesh) {
    const GL = GLService.context;
    GL.useProgram(this.program);
    GL.bindBuffer(GL.ARRAY_BUFFER, this.vertexBuffer);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(mesh.vertexData), GL.DYNAMIC_DRAW);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(mesh.indexData), GL.DYNAMIC_DRAW);
    this.indexBuffer.arrayLength = mesh.indexData.length;

    GL.bindBuffer(GL.ARRAY_BUFFER, this.colorBuffer);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(mesh.colorData), GL.DYNAMIC_DRAW);
  }

  render(pMatrix, mvMatrix) {
    const GL = GLService.context;
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
