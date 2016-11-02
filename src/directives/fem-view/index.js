var angular = require("angular"),
    $       = require("jquery"),
    FEMView = require('../../webgl/FEMView'),
    GL      = require('../../webgl/GL');

var femView = null;

angular
  .module("WebFEMView")
  .directive("femView", FemView);

function FemView() {
  return {
    scope   : {},
    restrict: "A",
    template: "<canvas id='cvsFEM'></canvas>",
    link    : function ($scope, element) {
      var canvas = $('canvas', element);
      if (canvas.length) canvas = canvas[0];

      GL.init(canvas);
      femView = new FEMView();
      femView.init(canvas);
      $scope.$on('fem:unload', function () {
        femView.unload();
      });

      $scope.$on('fem:loadmesh', function (e, mesh) {
        femView.recalibrateCamera(mesh);
        femView.transformationController.zoomSpeed = Math.max(mesh.maxX - mesh.minX, mesh.maxY - mesh.minY) / 10;
        femView.draw(mesh);
      });

      $scope.$on('fem:load', function (e, mesh) {
        femView.draw(mesh);
      });

    }
  };
}