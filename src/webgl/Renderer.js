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

var mat4              = require('gl-matrix-mat4'),
    MeshClipColoured  = require('./3DObjects/MeshClipColoured'),
    MeshClipWireframe = require('./3DObjects/MeshClipWireframe'),
    MeshColoured      = require('./3DObjects/MeshColoured'),
    MeshWireframe     = require('./3DObjects/MeshWireframe'),
    ClipPlane         = require('./3DObjects/ClipPlane'),
    OrientationHelper = require('./3DObjects/OrientationHelper');

var Renderer = function () {
  this.meshColoured              = new MeshColoured();
  this.meshWireframe             = new MeshWireframe();
  this.meshClipColoured          = new MeshClipColoured();
  this.meshClipColoured.enabled  = false;
  this.meshClipWireframe         = new MeshClipWireframe();
  this.meshClipWireframe.enabled = false;
  this.clipPlane                 = new ClipPlane();
  this.clipPlane.enabled         = false;
  this.orientationHelper         = new OrientationHelper();
}

Renderer.prototype = {

  modelLoaded: false,

  constructor: Renderer,

  prepare: function (mesh, clipPlane, appliedClipPlane) {
    this.modelLoaded              = false;
    this.clipPlane.enabled        = clipPlane.active;
    this.meshClipColoured.enabled = this.meshClipWireframe.enabled = !!mesh.clipArea;


    //orientation
    this.orientationHelper.prepareProgram();
    var tMCP = [];
    if (this.clipPlane.enabled) {
      //clip plane
      this.clipPlane.prepareProgram(clipPlane.mesh, clipPlane.base, clipPlane.normal);
      tMCP = this.clipPlane.tMatrix2;
    }
    this.meshColoured.prepareProgram(mesh, this.clipPlane.enabled || appliedClipPlane ? clipPlane : null, tMCP);
    this.meshWireframe.prepareProgram(mesh, this.clipPlane.enabled || appliedClipPlane ? clipPlane : null, tMCP);

    if (this.meshClipColoured.enabled && this.meshClipWireframe.enabled) {
      this.meshClipColoured.prepareProgram(mesh.clipArea);
      this.meshClipWireframe.prepareProgram(mesh.clipArea);
    }
    this.modelLoaded = true;
  },


  clearScene: function () {
    GL.clearColor(0, 0, 0, 1.0);
    GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);
    GL.enable(GL.DEPTH_TEST);
  },

  render: function (camera, cvsWidth, cvsHeight, position, rotation) {
    this.clearScene();
    if (this.modelLoaded) {
      GL.viewport(0, 0, cvsWidth, cvsHeight);

      var transformationMatrixModel = mat4.create(camera.mvMatrix);
      mat4.translate(transformationMatrixModel, transformationMatrixModel, camera.position);
      mat4.translate(transformationMatrixModel, transformationMatrixModel, [position[0] / 10, position[1] / 10, position[2]], transformationMatrixModel);

      //moves mesh with center to the origin so it can be rotated
      mat4.translate(transformationMatrixModel, transformationMatrixModel, camera.pivot);
      mat4.rotateX(transformationMatrixModel, transformationMatrixModel, rotation[0]);
      mat4.rotateY(transformationMatrixModel, transformationMatrixModel, rotation[1]);
      //move back to the viewing position
      mat4.translate(transformationMatrixModel, transformationMatrixModel, [-camera.pivot[0], -camera.pivot[1], -camera.pivot[2]]);

      this.meshColoured.render(camera.pMatrix, transformationMatrixModel);
      this.meshWireframe.render(camera.pMatrix, transformationMatrixModel);
      if (this.clipPlane.enabled) {
        this.clipPlane.render(camera.pMatrix, transformationMatrixModel);
      }

      if (this.meshClipColoured.enabled && this.meshClipWireframe.enabled) {
        this.meshClipColoured.render(camera.pMatrix, transformationMatrixModel);
        this.meshClipWireframe.render(camera.pMatrix, transformationMatrixModel);
      }

      //ORIENTATION HELPER
      var transformationMatrixOrient = mat4.create();
      mat4.translate(transformationMatrixOrient, camera.mvMatrix, [-2, -1, 6]);
      mat4.rotate(transformationMatrixOrient, transformationMatrixOrient, rotation[0], [1.0, 0.0, 0.0]);
      mat4.rotate(transformationMatrixOrient, transformationMatrixOrient, rotation[1], [0.0, 1.0, 0.0]);

      this.orientationHelper.render(camera.pMatrix, transformationMatrixOrient)
    }
  }
}

module.exports = Renderer;