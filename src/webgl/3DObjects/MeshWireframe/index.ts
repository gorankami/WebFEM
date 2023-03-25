/* eslint-disable react-hooks/rules-of-hooks */

import { createShader } from "../../ShaderProgram";
import { getRenderingContext } from "../../GL";
// import vertexShaderSource from "./vertex.glsl";
// import fragmentShaderSource from "./fragment.glsl";

import { vertexShaderSource, fragmentShaderSource } from "./shaders";
import { Mesh } from "../../../Mesh";
import { mat4 } from "gl-matrix";

export default class MeshWireframe {
  private aVertexPosition: number;
  private uMVMatrix: WebGLUniformLocation | null = null;
  private uPMatrix: WebGLUniformLocation | null = null;
  private vertexBuffer: WebGLBuffer | null = null;
  private indexBuffer: WebGLBuffer | null = null;
  private program: WebGLProgram;
  private indexBufferArrayLength: number = 0;

  constructor() {

    const renderingContext = getRenderingContext()

    this.program = createShader(vertexShaderSource, fragmentShaderSource);
    renderingContext.useProgram(this.program);

    //prepare variables and buffers
    this.aVertexPosition = renderingContext.getAttribLocation(
      this.program,
      "aVertexPosition"
    );
    this.uMVMatrix = renderingContext.getUniformLocation(this.program, "uMVMatrix");
    this.uPMatrix = renderingContext.getUniformLocation(this.program, "uPMatrix");

    this.vertexBuffer = renderingContext.createBuffer();
    this.indexBuffer = renderingContext.createBuffer();
  }

  prepareProgram(mesh: Mesh) {
    const renderingContext = getRenderingContext()
    renderingContext.useProgram(this.program);
    renderingContext.bindBuffer(renderingContext.ARRAY_BUFFER, this.vertexBuffer);
    renderingContext.bufferData(
      renderingContext.ARRAY_BUFFER,
      new Float32Array(mesh.vertexData),
      renderingContext.DYNAMIC_DRAW
    );

    renderingContext.bindBuffer(renderingContext.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    renderingContext.bufferData(
      renderingContext.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(mesh.edgeData),
      renderingContext.DYNAMIC_DRAW
    );
    this.indexBufferArrayLength = mesh.edgeData.length;
  }

  render(pMatrix: mat4, mvMatrix: mat4) {
    const renderingContext = getRenderingContext()
    renderingContext.useProgram(this.program);
    renderingContext.uniformMatrix4fv(this.uPMatrix, false, pMatrix);
    renderingContext.uniformMatrix4fv(this.uMVMatrix, false, mvMatrix);

    renderingContext.enableVertexAttribArray(this.aVertexPosition);
    renderingContext.bindBuffer(renderingContext.ARRAY_BUFFER, this.vertexBuffer);
    renderingContext.vertexAttribPointer(this.aVertexPosition, 3, renderingContext.FLOAT, false, 0, 0);

    renderingContext.bindBuffer(renderingContext.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    renderingContext.drawElements(
      renderingContext.LINES,
      this.indexBufferArrayLength,
      renderingContext.UNSIGNED_SHORT,
      0
    );
    renderingContext.flush();
  }
}
