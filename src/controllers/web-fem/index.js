var angular = require("angular"),
    FEMView = require('../../FEMView');

angular.module('WebFEMView').controller('WebFEMController', ['$scope', 'ApiService', 'UtilitiesService',
  function ($scope, ApiService, UtilitiesService) {
    var legendView = new LegendView();
    var femView    = new FEMView();
    femView.init();
    $scope.numSteps          = 512;
    $scope.variables         = [{value: 0}];
    $scope.selectedVariable  = $scope.variables[0].value;
    $scope.components        = [{value: 0}];
    $scope.selectedComponent = $scope.components[0].value;
    $scope.selectedStep      = 1;
    $scope.appliedClipPlane  = false;
    $scope.clipPlane         = {
      active: false,
      base  : [0.0, 0.0, 0.0],
      normal: [1.0, 0.0, 0.0]
    };

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
      var min = 0,
          max = 0;
      if ($scope.mesh && $scope.mesh && $scope.mesh.vectorData) {
        min = $scope.mesh.minValue;
        max = $scope.mesh.maxValue;
      }

      if ($scope.palettes && $scope.palettes.length) {
        legendView.draw($scope.palettes.selectedPalette, min, max, $scope.inverted);
      }
    };

    $scope.downloadMesh = function (applyClipPlane) {
      $scope.toggleCurtain = true;
      //free memory
      delete $scope.mesh;
      femView.unload();
      $scope.appliedClipPlane = applyClipPlane;
      ApiService.getMesh('example1').then(function (response) {
        try {
          var data = response.data;
          if (data.vertexData && data.vertexData.length
            && data.indexData && data.indexData.length
            && data.vectorData && data.vectorData.length) {

            $scope.mesh             = data;
            $scope.clipPlane.active = false;
            UtilitiesService.scalePaletteColorValues(data.minValue, data.maxValue, $scope.palettes.selectedPalette.steps);

            var colorArray        = UtilitiesService.initColorArray($scope.numSteps, $scope.palettes.selectedPalette, $scope.mesh.minValue, $scope.mesh.maxValue, $scope.inverted);
            $scope.mesh.colorData = UtilitiesService.prepareVector($scope.mesh, $scope.mesh.minValue, $scope.mesh.maxValue, $scope.palettes.selectedPalette, $scope.numSteps, $scope.inverted, colorArray);

            if ($scope.mesh.clipArea) {
              $scope.clipPlane.base          = $scope.mesh.clipArea.base;
              $scope.clipPlane.normal        = $scope.mesh.clipArea.normal;
              $scope.mesh.clipArea.colorData = UtilitiesService.prepareVector($scope.mesh.clipArea, $scope.mesh.minValue, $scope.mesh.maxValue, $scope.palettes.selectedPalette, $scope.numSteps, $scope.inverted, colorArray);
            }
            else {
              $scope.centerPlaneForClipping();
            }
            $scope.calculateClipPlaneMesh();
            femView.recalibrateCamera($scope.mesh);
            femView.transformationController.zoomSpeed = Math.max($scope.mesh.maxX - $scope.mesh.minX, $scope.mesh.maxY - $scope.mesh.minY) / 10;
            femView.draw($scope.mesh, $scope.clipPlane, $scope.appliedClipPlane);
            $scope.drawLegend();
          }
          else {
            alert("Cannot load model for variable " + $scope.selectedVariable + ", component " + $scope.selectedComponent + " and step " + $scope.selectedStep);
          }
        } catch (ex) {
          alert("Error: " + ex.message);
        }
        $scope.toggleCurtain = false;
      });
    };

    $scope.reDraw = function () {
      if ($scope.mesh) {
        $scope.calculateClipPlaneMesh();
        femView.draw($scope.mesh, $scope.clipPlane, $scope.appliedClipPlane);
      }
    };

    $scope.centerPlaneForClipping = function () {
      $scope.clipPlane.base = [
        $scope.mesh.maxX - ($scope.mesh.maxX - $scope.mesh.minX) / 2,
        $scope.mesh.maxY - ($scope.mesh.maxY - $scope.mesh.minY) / 2,
        $scope.mesh.maxZ - ($scope.mesh.maxZ - $scope.mesh.minZ) / 2
      ];
    };

    $scope.calculateClipPlaneMesh = function () {
      var difference = 0;
      difference     = Math.max(difference, $scope.mesh.maxX - $scope.mesh.minX);
      difference     = Math.max(difference, $scope.mesh.maxY - $scope.mesh.minY);
      difference     = Math.max(difference, $scope.mesh.maxZ - $scope.mesh.minZ);
      difference     = difference / 2;

      $scope.clipPlane.mesh = {
        vertices: [
          0, 0 - difference, 0 - difference,
          0, 0 - difference, 0 + difference,
          0, 0 + difference, 0 + difference,
          0, 0 + difference, 0 - difference
        ],
        indices : [0, 1, 2, 2, 3, 0]
      };
    };

    $scope.applyColorMap = function () {
      UtilitiesService.scalePaletteColorValues($scope.mesh.minValue, $scope.mesh.maxValue, $scope.palettes.selectedPalette.steps);
      var colorArray                 = UtilitiesService.initColorArray($scope.numSteps, $scope.palettes.selectedPalette, $scope.mesh.minValue, $scope.mesh.maxValue, $scope.inverted);
      $scope.mesh.colorData          = UtilitiesService.prepareVector($scope.mesh, $scope.mesh.minValue, $scope.mesh.maxValue, $scope.palettes.selectedPalette, $scope.numSteps, $scope.inverted, colorArray);
      $scope.mesh.clipArea.colorData = UtilitiesService.prepareVector($scope.mesh.clipArea, $scope.mesh.minValue, $scope.mesh.maxValue, $scope.palettes.selectedPalette, $scope.numSteps, $scope.inverted, colorArray);
    };
  }]);