var angular = require("angular"),
    FEMView = require('../../FEMView');

angular.module('WebFEMView').controller('WebFEMController', ['$scope', 'ApiService', 'UtilitiesService',
  function ($scope, ApiService, UtilitiesService) {
    var femView    = new FEMView();
    femView.init();
    $scope.numSteps          = 512;

    ApiService.getPalettes().then(function (response) {
      $scope.palettes = response.data;
      //turn to Color objects
      $scope.palettes.forEach(function (palette) {
        palette.steps.forEach(function (step) {
          step.color = new THREE.Color(step.color[0], step.color[1], step.color[2]);
        });
      });
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
      delete $scope.mesh;
      femView.unload();
      ApiService.getMesh('example1').then(function (response) {
        try {
          var data = response.data;
          if (data.vertexData && data.vertexData.length
            && data.indexData && data.indexData.length
            && data.vectorData && data.vectorData.length) {

            $scope.mesh             = data;
            UtilitiesService.scalePaletteColorValues(data.minValue, data.maxValue, $scope.palettes.selectedPalette.steps);

            var colorArray        = UtilitiesService.initColorArray($scope.numSteps, $scope.palettes.selectedPalette, $scope.mesh.minValue, $scope.mesh.maxValue, $scope.inverted);
            $scope.mesh.colorData = UtilitiesService.prepareVector($scope.mesh, $scope.mesh.minValue, $scope.mesh.maxValue, $scope.palettes.selectedPalette, $scope.numSteps, $scope.inverted, colorArray);

            femView.recalibrateCamera($scope.mesh);
            femView.transformationController.zoomSpeed = Math.max($scope.mesh.maxX - $scope.mesh.minX, $scope.mesh.maxY - $scope.mesh.minY) / 10;
            femView.draw($scope.mesh, null, null);
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
      if ($scope.mesh) {
        femView.draw($scope.mesh, null, null);
      }
    };

    $scope.applyColorMap = function () {
      UtilitiesService.scalePaletteColorValues($scope.mesh.minValue, $scope.mesh.maxValue, $scope.palettes.selectedPalette.steps);
      var colorArray                 = UtilitiesService.initColorArray($scope.numSteps, $scope.palettes.selectedPalette, $scope.mesh.minValue, $scope.mesh.maxValue, $scope.inverted);
      $scope.mesh.colorData          = UtilitiesService.prepareVector($scope.mesh, $scope.mesh.minValue, $scope.mesh.maxValue, $scope.palettes.selectedPalette, $scope.numSteps, $scope.inverted, colorArray);
    };
  }]);