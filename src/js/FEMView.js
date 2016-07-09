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

FEMView = function () {
  this.cvsFEM = $("#cvsFEM")[0];
  try {
    GL = this.cvsFEM.getContext("webgl") || this.cvsFEM.getContext("experimental-webgl");
  } catch (e) {
    alert("Error in retreiving WebGL, your browser might not support Webgl.");
    return;
  }
  if (!GL) {
    alert("Your browser does not support Webgl, the application will not work.");
    return;
  }
  this.camera = new Camera(45, this.cvsFEM.width / this.cvsFEM.height, 1, 100.0, vec3.create([0, 0, -10]));
  this.transformationController = new TransformationController(this.cvsFEM, this.camera);
}

FEMView.prototype = {
  constructor: FEMView,

  init: function () {
    this.renderer = new Renderer();
    this.resize(window.innerWidth, window.innerHeight);
    this.initEvents();
    this.animate();
  },
  initEvents: function(){
    //events
    $(window).resize(function () {
      this.resize($(document).width(), $(document).height());
    }.bind(this));

    //disable context menu
    this.cvsFEM.addEventListener('contextmenu', function (event) { event.preventDefault(); });

    //closure
    var scope = this;
    //mouse events
    var mouseMove = function (event) {
      event.preventDefault();
      var rect = scope.cvsFEM.getBoundingClientRect();
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
      var rect = scope.cvsFEM.getBoundingClientRect();
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

    var mouseWheel = function(event) {
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

    //touch events
    //this.cvsFEM.addEventListener('touchstart', touchStart, false);
    //this.cvsFEM.addEventListener('touchmove', touchMove, false);
    //this.cvsFEM.addEventListener('touchend', touchEnd, false);

    //keyboard events


    //var keyDown = function (e) {
    //    if (!scope.renderer.modelLoaded) return;

    //    switch (e.which) {
    //        case 37: // left
    //        case 65: // A
    //            scope.transformationController.startPan([0.0, 0.0]);
    //            scope.transformationController.doPan([-5, 0]);
    //            break;
    //        case 39: // right
    //        case 68: // D
    //            scope.transformationController.startPan([0.0, 0.0]);
    //            scope.transformationController.doPan([5, 0]);
    //            break;
    //        case 38: // up
    //        case 87: // W
    //            scope.transformationController.startPan([0.0, 0.0]);
    //            scope.transformationController.doPan([0, -5]);
    //            break;
    //        case 40: // down
    //        case 83: // S
    //            scope.transformationController.startPan([0.0, 0.0]);
    //            scope.transformationController.doPan([0, 5]);
    //            break;
    //        default: return; // exit this handler for other keys
    //    }
    //    e.preventDefault();
    //};
    //window.addEventListener('keydown', keyDown, false);
  },

  resize: function (width, height) {
    this.cvsFEM.width = width;
    this.cvsFEM.height = height;
    this.transformationController.camera.changePerspective(width, height);
  },

  draw: function (geometry, vector, clipPlane, appliedClipPlane) {
    this.renderer.prepare(geometry, vector, clipPlane, appliedClipPlane);
  },

  unload: function()
  {
    this.renderer.modelLoaded = false;
  },

  animate: function () {
    requestAnimationFrame(this.animate.bind(this),this.cvsFEM);
    this.transformationController.update();
    this.renderer.render(this.transformationController.camera , this.cvsFEM.width, this.cvsFEM.height, this.transformationController.position, this.transformationController.rotation);
    //  this.transformationController.position = [0, 0, 0]; this.transformationController.rotation = [0, 0];
  },

  recalibrateCamera: function (mesh) {
    var maxFrontSize = Math.max(mesh.maxX - mesh.minX, mesh.maxY - mesh.minY);
    var position = [
      -mesh.maxX + (mesh.maxX - mesh.minX) / 2,
      -mesh.maxY + (mesh.maxY - mesh.minY) / 2,
      mesh.minZ - maxFrontSize * 2
    ];
    var pivot = [
      mesh.maxX - (mesh.maxX - mesh.minX) / 2,
      mesh.maxY - (mesh.maxY - mesh.minY) / 2,
      mesh.maxZ - (mesh.maxZ - mesh.minZ) / 2
    ];
    var nearPlane = maxFrontSize / 100.0;
    var farPlane = maxFrontSize * 10;
    this.camera.recalibrate(nearPlane, farPlane, position, pivot);

    this.zoomSpeed = maxFrontSize / 10;
  }
}