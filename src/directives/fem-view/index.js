var angular = require("angular"),
    $ = require("jquery"),
    FEMView = require('../../FEMView');
var femView = null;

angular.module("WebFEMView").directive("femView", function () {
  return {
    scope: {},
    restrict: "A",
    template: "<canvas id='cvsFEM'></canvas>",
    link: function($scope, element){
      var canvas = $('canvas',element);
      if(canvas.length) canvas = canvas[0];

      try {
        GL = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        if (!GL) {
          alert("Your browser does not support Webgl, the application will not work.");
        } else {
          femView = new FEMView();
          femView.init(canvas);
          $scope.$on('fem:unload', function(){
            femView.unload();
          });

          $scope.$on('fem:loadmesh', function(e, mesh){
            femView.recalibrateCamera(mesh);
            femView.transformationController.zoomSpeed = Math.max(mesh.maxX - mesh.minX, mesh.maxY - mesh.minY) / 10;
            femView.draw(mesh);
          });

          $scope.$on('fem:load', function(e,mesh){
            femView.draw(mesh);
          });
        }
      } catch (e) {
        alert("Error in retreiving WebGL, your browser might not support Webgl.");
      }
    }
  };
});