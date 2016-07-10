var angular = require("angular");

angular.module("WebFEMView").directive("femView", function () {
  return {
    scope: {},
    restrict: "A",
    template: "<canvas></canvas>",
    link: function(scope, element){
      var canvas = $('canvas',element);
      var _gl;
      function resize(width, height){
        canvas.width = width;
        canvas.height = height;
      }
      try {
        _gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        if (!_gl) {
          alert("Your browser does not support Webgl, the application will not work.");
        } else {
          //setup fem view
        }
      } catch (e) {
        alert("Error in retreiving WebGL, your browser might not support Webgl.");
      }
    }
  };
});