import angular from "angular";
import UtilitiesService from "../../services/utilities";
import ApiService from "../../services/api";

angular.module('WebFEMView')
  .directive("webFem", LegendView);

function LegendView() {
  return {
    scope: {
      inverted: "="
    },
    restrict: "E",
    template: require("./index.html"),
    controller: Controller,
    controllerAs: 'vm',
    bindToController: true
  };
}

/* @ngInject */
function Controller($scope) {
  const vm = this;
  let mesh = null;
  vm.numSteps = 512;

  vm.drawLegend = drawLegend;
  vm.downloadMesh = downloadMesh;
  vm.reDraw = reDraw;

  activate();

  function activate() {
    return ApiService.getPalettes().then(function (response) {
      vm.palettes = response;
      vm.palettes.selectedPalette = vm.palettes[0];
      drawLegend();
      downloadMesh();
    });
  }

  function drawLegend() {
    if (vm.palettes && vm.palettes.length) {
      $scope.$broadcast('legend:draw', vm.palettes.selectedPalette);
    }
  }

  function downloadMesh() {
    // vm.toggleCurtain = true;
    //free memory
    mesh = null;
    $scope.$broadcast('fem:unload');

    ApiService.getMesh('example1').then(function (response) {
      try {
        if (response.vertexData.length && response.indexData.length && response.vectorData.length) {
          mesh = response;
          UtilitiesService.scalePaletteColorValues(mesh.minValue, mesh.maxValue, vm.palettes.selectedPalette.steps);

          let colorArray = UtilitiesService.initColorArray(vm.numSteps, vm.palettes.selectedPalette, mesh.minValue, mesh.maxValue, vm.inverted);
          mesh.colorData = UtilitiesService.prepareVector(mesh, mesh.minValue, mesh.maxValue, vm.palettes.selectedPalette, vm.numSteps, vm.inverted, colorArray);

          $scope.$broadcast('fem:loadmesh', mesh);

          drawLegend();
        } else {
          alert("Cannot load model.");
        }
      } catch (ex) {
        alert("Error: " + ex.message);
      }
      vm.toggleCurtain = false;
    });
  }

  function reDraw() {
    if (mesh) {
      $scope.$broadcast('fem:draw', mesh);
    }
  }
}