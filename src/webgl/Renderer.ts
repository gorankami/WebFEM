/**
 Copyright 2014 Goran Antic

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

import { mat4 } from "gl-matrix";
import { Mesh } from "../Mesh";
import MeshColoured from "./3DObjects/MeshColoured";
import MeshWireframe from "./3DObjects/MeshWireframe";
import Camera from "./Camera";
import { getRenderingContext } from "./GL";

export default class Renderer {
  private meshColoured: MeshColoured;
  private meshWireframe: MeshWireframe;
  public modelLoaded: boolean;

  constructor() {
    this.modelLoaded = false;
    this.meshColoured = new MeshColoured();
    this.meshWireframe = new MeshWireframe();
  }

  prepare(mesh: Mesh) {
    this.modelLoaded = false;

    this.meshColoured.prepareProgram(mesh);
    this.meshWireframe.prepareProgram(mesh);
    this.modelLoaded = true;
  }

  render(
    camera: Camera,
    cvsWidth: number,
    cvsHeight: number,
    position: Array<number>,
    rotation: Array<number>
  ) {
    const renderingContext = getRenderingContext();
    clearScene();
    if (this.modelLoaded) {
      renderingContext.viewport(0, 0, cvsWidth, cvsHeight);

      const transformationMatrixModel = camera.mvMatrix;
      mat4.translate(
        transformationMatrixModel,
        transformationMatrixModel,
        camera.position
      );
      mat4.translate(
        transformationMatrixModel,
        transformationMatrixModel,
        [position[0] / 10, position[1] / 10, position[2]]
      );

      //moves mesh with center to the origin so it can be rotated
      mat4.translate(
        transformationMatrixModel,
        transformationMatrixModel,
        camera.pivot
      );
      mat4.rotateX(
        transformationMatrixModel,
        transformationMatrixModel,
        rotation[0]
      );
      mat4.rotateY(
        transformationMatrixModel,
        transformationMatrixModel,
        rotation[1]
      );
      //move back to the viewing position
      mat4.translate(transformationMatrixModel, transformationMatrixModel, [
        -camera.pivot[0],
        -camera.pivot[1],
        -camera.pivot[2],
      ]);

      this.meshColoured.render(camera.pMatrix, transformationMatrixModel);
      this.meshWireframe.render(camera.pMatrix, transformationMatrixModel);
    }
  }
}

function clearScene() {
  const renderingContext = getRenderingContext();
  renderingContext.clearColor(0, 0, 0, 1.0);
  renderingContext.clear(
    renderingContext.COLOR_BUFFER_BIT | renderingContext.DEPTH_BUFFER_BIT
  );
  renderingContext.enable(renderingContext.DEPTH_TEST);
}
