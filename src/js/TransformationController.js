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

/**
 * @author Goran Antic
 * Needs Camera.js to be loaded
 *
 * TransformationController is based on OrbitControls.js (http://threejs.org/examples/#misc_controls_orbit) created by following authors (thanks):
 * @author qiao / https://github.com/qiao
 * @author mrdoob / http://mrdoob.com
 * @author alteredq / http://alteredqualia.com/
 * @author WestLangley / http://github.com/WestLangley
 * @author erich666 / http://erichaines.com
 *
 * the main difference is the use of WebGL instead of threejs and model geometry transformation instead of camera transformation,
 * although camera is still needed to unproject clicks on the object plane
 */

TransformationController = function (canvas, camera) {
  this.canvas = canvas;
  this.camera = camera;
  this.reset();
}

TransformationController.prototype = {
  //transformations on object
  rotation: null,
  position: null,

  //initial vectors for mouse position, rotation and pan value
  mouseS: null,
  rotS: null,
  panS: null,

  //current vectors for mouse position, rotation, pan value and zoom
  mouse: null,
  rot: null,
  pan: null,
  zoom: 0,

  //settings that change sensitivity of rotation and zoom
  rotationSensitivity: 0.01,
  zoomSpeed: 1.0,

  //rotation effect of momentum. 1 = no momentum, <1 added momentum.
  rotationMomentum: 1,

  constructor: TransformationController,

  /**
   * Updates transformations. Should be called at every animation frame BEFORE canvas rendering
   */
  update: function () {
    this.rotation[0] += (this.rot[1] - this.rotation[0]) * this.rotationMomentum;
    this.rotation[1] += (this.rot[0] - this.rotation[1]) * this.rotationMomentum;
    this.position[0] = this.pan[0] - this.panS[0];
    this.position[1] = this.pan[1] - this.panS[1];
    this.position[2] = this.zoom;
  },

  /**
   * Initializes panning operation by setting panS and pan to a unprojected coordinate from mouse click to objects plane.
   * Afterwards, panS is set to an offset from position
   * @param {Number[2]} coords
   */
  startPan: function (coords) {
    var hor = (coords[0] - (this.canvas.width / 2)) / (this.canvas.width / 2);
    var ver = (coords[1] - (this.canvas.height / 2)) / (this.canvas.height / 2);
    this.panS = this.camera.getClickVectorHorizontal(hor, ver, this.position[2]);
    this.pan = [this.panS[0], this.panS[1]];

    this.panS[0] -= this.position[0];
    this.panS[1] -= this.position[1];
  },

  /**
   * Sets new current clicked unprojected coordinate on objects plane
   * @param {Number[2]} coords
   */
  doPan: function (coords) {
    var hor = (coords[0] - (this.canvas.width / 2)) / (this.canvas.width / 2);
    var ver = (coords[1] - (this.canvas.height / 2)) / (this.canvas.height / 2);
    this.pan = this.camera.getClickVectorHorizontal(hor, ver, this.position[2]);
  },

  /**
   * Starts rotation by putting rotS to previously current value rot. mouseS is kept for later difference calculation
   * @param {Number[2]} coords
   */
  startRotate: function (coords) {
    this.mouseS = coords;
    this.rotS[0] = this.rot[0];
    this.rotS[1] = this.rot[1];
  },

  /**
   * Rotates by putting rotS to previously current value rot. mouseS is kept for later difference calculation
   * @param {Number[2]} coords
   */
  doRotate: function (coords) {
    this.mouse = coords;

    this.rot[1] = this.rot[1] + this.mouse[1] - this.mouseS[1];
    this.rot[1] *= this.rotationSensitivity;
    this.rot[1] += this.rotS[1];
    this.rot[1] = this.normalizeAngle(this.rot[1]);

    //if (this.rot[1] >= Math.PI / 2 || this.rot[1] <= -Math.PI / 2) {
    //    this.rot[0] = this.rot[0] - this.mouse[0] + this.mouseS[0];
    //} else {
    this.rot[0] = this.rot[0] + this.mouse[0] - this.mouseS[0];
    //}
    this.rot[0] *= this.rotationSensitivity;
    this.rot[0] += this.rotS[0];
    this.rot[0] = this.normalizeAngle(this.rot[0]);
    //limits rotation on x axis (flip) by frame of 180 degrees, so the max would display top side and min would display bottom of the object
    //if (this.rot[1] >= Math.PI / 2) this.rot[1] = Math.PI / 2;
    //if (this.rot[1] <= -Math.PI / 2) this.rot[1] = -Math.PI / 2;
  },

  //normalize angle within -Pi and +Pi
  normalizeAngle: function(angle){
    if (angle >= Math.PI*2) return angle - Math.PI*2;
    if (angle <= -Math.PI*2) return angle + Math.PI*2;
    return angle;
  },

  /**
   * Zooms in/out to the object (translates closer/farther of the camera) by a step. POsitive step zooms in, negative step zooms out
   * @param {Number[2]} coords
   */
  doZoom: function (delta) {
    if (delta > 0) {
      this.zoom += this.zoomSpeed;
    } else {
      this.zoom -= this.zoomSpeed;
    }
  },

  /**
   * Puts all transformation and helpful coordinates to default values
   */
  reset: function () {
    this.rotation = [0, 0, 0];
    this.position = [0, 0, 0];
    this.startPos = [0, 0];
    this.mouseS = [0, 0];
    this.rotS = [0, 0];
    this.panS = [0, 0];

    this.mouse = [0, 0];
    this.rot = [0, 0];
    this.pan = [0, 0];

    this.zoom = 0;
  }
}