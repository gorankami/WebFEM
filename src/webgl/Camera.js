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
 * Helpful camera class that holds transformation matrices and transformation utilities, simulating camera/eye
 * @author Goran Antic
 */

const mat4 = require('gl-matrix-mat4');

export default class Camera {

  /**
   * Contructor for Camera. Sets projection properties, calculates horizontal field of view,
   * and inits projection and model-view matrix as well as camera position in scene space.
   * @param {Number} verFoV - vertical field of view
   * @param {Number} aspect - aspect ratio of view
   * @param {Number} nearPlane - near plane of view frustum
   * @param {Number} farPlane - far plane of view frustum
   * @param {Array} position - camera position in 3D space
   */
  constructor(verFoV, aspect, nearPlane, farPlane, position) {
    this.verFoV   = verFoV;
    this.horFoV   = verFoV * aspect;
    this.aspect   = aspect;
    this.pMatrix  = mat4.create();
    this.mvMatrix = mat4.create();
    mat4.identity(this.mvMatrix);
    this.recalibrate(nearPlane, farPlane, position, [0, 0, 0]);
  }

  /**
   * Changes perspective matrix by given width and height
   * @param {Number} width
   * @param {Number} height
   */
  changePerspective(width, height) {
    this.aspect = width / height;
    mat4.perspective(this.pMatrix, this.verFoV, this.aspect, this.nearPlane, this.farPlane);
    this.horFoV = this.verFoV * this.aspect;
  }

  /**
   * Moves the camera to a new position and sets up near and far plane distances
   * @param {Number} position - 3 member array that represents x, y and z
   * @param {Number} nearPlane - distance of nearPlane from camera
   * @param {Number} farPlane - distance of farPlane from camera
   * @param {Array} pivot
   */
  recalibrate(nearPlane, farPlane, position, pivot) {
    this.position  = position;
    this.pivot     = pivot;
    this.nearPlane = nearPlane;
    this.farPlane  = farPlane;

    mat4.perspective(this.pMatrix, this.verFoV, this.aspect, nearPlane, farPlane);
  }

  /**
   * Should unproject a click from a screen (near plane) to paralel plane defined with objects z position.
   * @param {Number} xPercentage - percentage of horizontal field of view (half of it) which is clicked
   * @param {Number} yPercentage - percentage of vertical field of view (half of it) which is clicked
   * @param {Number} objectZ - object z coordinate in space
   * @type {Array} returns array containing x and y clicked coordinates on z plane
   */
  getClickVectorHorizontal(xPercentage, yPercentage, objectZ) {
    //get angles by percentage of field of view angles. Half is because we need a triangle with z as side
    let hor     = (xPercentage * this.horFoV / 2),
        ver     = (yPercentage * this.verFoV / 2);
    //Math.sin uses radians, so we need to convert from degrees
    hor *= (Math.PI / 180);
    ver *= (Math.PI / 180);
    //get coordinates on near plane
    const xNear = this.nearPlane * Math.sin(hor) / Math.cos(hor);
    const yNear = -this.nearPlane * Math.sin(ver) / Math.cos(ver);
    //return xNear;
    return [
      xNear * (-this.position[2] - objectZ),
      yNear * (-this.position[2] - objectZ)
    ];
  }
}
