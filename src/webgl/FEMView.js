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
var $        = require('jquery'),
    vec3     = require('gl-matrix-vec3'),
    Camera   = require('./Camera'),
    Renderer = require('./Renderer');

function FEMView() {
}

FEMView.prototype.constructor = FEMView;

FEMView.prototype.init = function (canvas) {
  this.cvsFEM                   = canvas;
  this.camera                   = new Camera(45, this.cvsFEM.width / this.cvsFEM.height, 1, 100.0, vec3.create([0, 0, -10]));
  this.transformationController = new TransformationController(this.cvsFEM, this.camera);
  this.renderer                 = new Renderer();
  this.resize(window.innerWidth, window.innerHeight);
  this.initEvents();
  this.animate();
};


FEMView.prototype.initEvents = function () {
  //events
  $(window).resize(function () {
    this.resize($(document).width(), $(document).height());
  }.bind(this));

  //disable context menu
  this.cvsFEM.addEventListener('contextmenu', function (event) {
    event.preventDefault();
  });

  //closure
  var scope     = this;
  //mouse events
  var mouseMove = function (event) {
    event.preventDefault();
    var rect   = scope.cvsFEM.getBoundingClientRect();
    var coords = [event.clientX - rect.left, event.clientY - rect.top];

    if (event.buttons === 1) {
      scope.transformationController.doRotate(coords);
    }
    else if (event.buttons === 2) {
      scope.transformationController.doPan(coords);
    }
  };

  var mouseDown = function (event) {
    event.preventDefault();
    var rect   = scope.cvsFEM.getBoundingClientRect();
    var coords = [event.clientX - rect.left, event.clientY - rect.top];

    if (event.buttons === 1) {
      scope.transformationController.startRotate(coords);
    }
    else if (event.buttons === 2) {
      scope.transformationController.startPan(coords);
    }

    //add events to detect while mouse down
    scope.cvsFEM.addEventListener('mousemove', mouseMove, false);
    scope.cvsFEM.addEventListener('mouseup', mouseOut, false);
    scope.cvsFEM.addEventListener('mouseout', mouseOut, false);
  };

  var mouseOut = function () {
    scope.cvsFEM.removeEventListener('mousemove', mouseMove, false);
    scope.cvsFEM.removeEventListener('mouseup', mouseOut, false);
    scope.cvsFEM.removeEventListener('mouseout', mouseOut, false);
  };

  var mouseWheel = function (event) {
    event.preventDefault();
    event.stopPropagation();

    if (event.wheelDelta !== undefined) { // WebKit / Opera / Explorer 9
      scope.transformationController.doZoom(event.wheelDelta);
    } else if (event.detail !== undefined) { // Firefox
      scope.transformationController.doZoom(-event.detail);
    }
  };

  this.cvsFEM.addEventListener('mousedown', mouseDown, false);
  this.cvsFEM.addEventListener('mousewheel', mouseWheel, false);
  this.cvsFEM.addEventListener('DOMMouseScroll', mouseWheel, false); // firefox
};

FEMView.prototype.resize = function (width, height) {
  this.cvsFEM.width  = width;
  this.cvsFEM.height = height;
  this.transformationController.camera.changePerspective(width, height);
};

FEMView.prototype.draw = function (geometry, vector) {
  this.renderer.prepare(geometry, vector);
};

FEMView.prototype.unload = function () {
  this.renderer.modelLoaded = false;
};

FEMView.prototype.animate = function () {
  requestAnimationFrame(this.animate.bind(this), this.cvsFEM);
  this.transformationController.update();
  this.renderer.render(this.transformationController.camera, this.cvsFEM.width, this.cvsFEM.height, this.transformationController.position, this.transformationController.rotation);
  //  this.transformationController.position = [0, 0, 0]; this.transformationController.rotation = [0, 0];
};

FEMView.prototype.recalibrateCamera = function (mesh) {
  var maxFrontSize = Math.max(mesh.maxX - mesh.minX, mesh.maxY - mesh.minY);
  var position     = [
    -mesh.maxX + (mesh.maxX - mesh.minX) / 2,
    -mesh.maxY + (mesh.maxY - mesh.minY) / 2,
    mesh.minZ - maxFrontSize * 2
  ];
  var pivot        = [
    mesh.maxX - (mesh.maxX - mesh.minX) / 2,
    mesh.maxY - (mesh.maxY - mesh.minY) / 2,
    mesh.maxZ - (mesh.maxZ - mesh.minZ) / 2
  ];
  var nearPlane    = maxFrontSize / 100.0;
  var farPlane     = maxFrontSize * 10;
  this.camera.recalibrate(nearPlane, farPlane, position, pivot);

  this.zoomSpeed = maxFrontSize / 10;
};

module.exports = FEMView;