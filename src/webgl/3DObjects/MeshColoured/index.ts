/* eslint-disable react-hooks/rules-of-hooks */

import { mat4 } from "gl-matrix";
import { Mesh } from "../../../Mesh";
import { getRenderingContext } from "../../GL";
import { createShader } from "../../ShaderProgram";
import { vertexShaderSource, fragmentShaderSource } from "./shaders";
// import vertexShaderSource from "./vertex.glsl";
// import fragmentShaderSource from "./fragment.glsl";

export default class MeshColoured {
  private program;
  private aVertexPosition;
  private aVertexColor;
  private uMVMatrix;
  private uPMatrix;
  private vertexBuffer;
  private indexBuffer;
  private colorBuffer;
  private indexBufferArrayLength: number = 0;
  public enabled: boolean = true;

  constructor() {
    const renderingContext = getRenderingContext();
    if (!renderingContext) throw new Error("GL not initialized");

    this.program = createShader(vertexShaderSource, fragmentShaderSource);
    renderingContext.useProgram(this.program);

    //prepare variables and buffers
    this.aVertexPosition = renderingContext.getAttribLocation(
      this.program,
      "aVertexPosition"
    );
    this.aVertexColor = renderingContext.getAttribLocation(
      this.program,
      "aVertexColor"
    );
    this.uMVMatrix = renderingContext.getUniformLocation(
      this.program,
      "uMVMatrix"
    );
    this.uPMatrix = renderingContext.getUniformLocation(
      this.program,
      "uPMatrix"
    );

    this.vertexBuffer = renderingContext.createBuffer();
    this.indexBuffer = renderingContext.createBuffer();
    this.colorBuffer = renderingContext.createBuffer();
  }

  prepareProgram(mesh: Mesh) {
    const renderingContext: WebGL2RenderingContext = getRenderingContext();
    renderingContext.useProgram(this.program);
    renderingContext.bindBuffer(
      renderingContext.ARRAY_BUFFER,
      this.vertexBuffer
    );
    renderingContext.bufferData(
      renderingContext.ARRAY_BUFFER,
      new Float32Array(mesh.vertexData),
      renderingContext.DYNAMIC_DRAW
    );

    renderingContext.bindBuffer(
      renderingContext.ELEMENT_ARRAY_BUFFER,
      this.indexBuffer
    );
    renderingContext.bufferData(
      renderingContext.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(mesh.indexData),
      renderingContext.DYNAMIC_DRAW
    );
    this.indexBufferArrayLength = mesh.indexData.length;

    renderingContext.bindBuffer(
      renderingContext.ARRAY_BUFFER,
      this.colorBuffer
    );
    renderingContext.bufferData(
      renderingContext.ARRAY_BUFFER,
      new Float32Array(mesh.colorData),
      renderingContext.DYNAMIC_DRAW
    );
  }

  render(pMatrix: mat4, mvMatrix: mat4) {
    const renderingContext: WebGL2RenderingContext = getRenderingContext();

    renderingContext.useProgram(this.program);
    renderingContext.uniformMatrix4fv(this.uPMatrix, false, pMatrix);
    renderingContext.uniformMatrix4fv(this.uMVMatrix, false, mvMatrix);

    renderingContext.enableVertexAttribArray(this.aVertexPosition);
    renderingContext.bindBuffer(
      renderingContext.ARRAY_BUFFER,
      this.vertexBuffer
    );
    renderingContext.vertexAttribPointer(
      this.aVertexPosition,
      3,
      renderingContext.FLOAT,
      false,
      0,
      0
    );

    renderingContext.enableVertexAttribArray(this.aVertexColor);
    renderingContext.bindBuffer(
      renderingContext.ARRAY_BUFFER,
      this.colorBuffer
    );
    renderingContext.vertexAttribPointer(
      this.aVertexColor,
      3,
      renderingContext.FLOAT,
      false,
      0,
      0
    );

    renderingContext.bindBuffer(
      renderingContext.ELEMENT_ARRAY_BUFFER,
      this.indexBuffer
    );
    renderingContext.polygonOffset(2.0, 2.0);
    renderingContext.enable(renderingContext.POLYGON_OFFSET_FILL);
    renderingContext.drawElements(
      renderingContext.TRIANGLES,
      this.indexBufferArrayLength,
      renderingContext.UNSIGNED_SHORT,
      0
    );
    renderingContext.disable(renderingContext.POLYGON_OFFSET_FILL);
    renderingContext.flush();
  }
}
