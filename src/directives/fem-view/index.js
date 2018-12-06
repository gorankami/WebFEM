import angular from "angular";
import $ from "jquery";
import FEMView from '../../webgl/FEMView';
import GLService from '../../webgl/GL';

/**
 * @desc
 * @example
 */
angular
  .module("WebFEMView")
  .directive("monolitFemView", FemView);

function FemView() {
  return {
    scope: {},
    restrict: "A",
    template: "<canvas id='cvsFEM'></canvas>",
    link: linkFunc,
    controller: ["$scope", FemViewController],
    controllerAs: 'ctrl'
  };
}

function linkFunc($scope, element) {
  const canvas = document.getElementById("cvsFEM")
  GLService.init(canvas);
  $scope.ctrl.femView = new FEMView();
  $scope.ctrl.femView.init(canvas);
}

/* @ngInject */
function FemViewController($scope) {
  const vm = this;

  $scope.$on('fem:unload', function () {
    vm.femView.unload();
  });

  $scope.$on('fem:loadmesh', function (e, mesh) {
    vm.femView.recalibrateCamera(mesh);
    vm.femView.transformationController.zoomSpeed = Math.max(mesh.maxX - mesh.minX, mesh.maxY - mesh.minY) / 10;
    vm.femView.draw(mesh);
  });

  $scope.$on('fem:load', function (e, mesh) {
    vm.femView.draw(mesh);
  });
}