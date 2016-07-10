var angular = require("angular");

angular.module('WebFEMView').controller('WebFEMController', ['$scope', 'ApiService', 'UtilitiesService',
  function ($scope, ApiService, UtilitiesService) {
    var mesh = null;
    $scope.numSteps = 512;

    ApiService.getPalettes().then(function (response) {
      $scope.palettes = response.data;
      $scope.palettes.selectedPalette = $scope.palettes[0];
      $scope.drawLegend();
    });

    $scope.drawLegend = function () {
      if ($scope.palettes && $scope.palettes.length) {
        $scope.$broadcast('legend:draw', $scope.palettes.selectedPalette);
      }
    };

    $scope.downloadMesh = function () {
      $scope.toggleCurtain = true;
      //free memory
      delete mesh;
      $scope.$broadcast('fem:unload');

      ApiService.getMesh('example1').then(function (response) {
        try {
          if (response.data.vertexData.length && response.data.indexData.length && response.data.vectorData.length) {
            mesh = response.data;
            UtilitiesService.scalePaletteColorValues(mesh.minValue, mesh.maxValue, $scope.palettes.selectedPalette.steps);

            var colorArray        = UtilitiesService.initColorArray($scope.numSteps, $scope.palettes.selectedPalette, mesh.minValue, mesh.maxValue, $scope.inverted);
            mesh.colorData = UtilitiesService.prepareVector(mesh, mesh.minValue, mesh.maxValue, $scope.palettes.selectedPalette, $scope.numSteps, $scope.inverted, colorArray);

            $scope.$broadcast('fem:loadmesh',mesh);

            $scope.drawLegend();
          }
          else {
            alert("Cannot load model.");
          }
        } catch (ex) {
          alert("Error: " + ex.message);
        }
        $scope.toggleCurtain = false;
      });
    };

    $scope.reDraw = function () {
      if (mesh) {
        $scope.$broadcast('fem:draw',mesh);
        // femView.draw(mesh);
      }
    };
  }]);