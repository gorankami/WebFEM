import angular from "angular";
import $ from "jquery";
import drawLegend from "../../drawLegend";

/**
 * @desc
 * @example
 */
angular
  .module("WebFEMView")
  .directive("monolitLegendView", LegendView);

function LegendView() {
  return {
    scope: {
      inverted: "="
    },
    restrict: "A",
    template: "<canvas width='150' height='500'></canvas><br/>",
    link: linkFunc,
    controller: ["$scope", LegendViewController],
    controllerAs: 'ctrl'
  };
}

function linkFunc(scope, element) {
  let canvas = $('canvas', element);
  if (canvas.length) canvas = canvas[0];
  scope.ctrl.context = canvas.getContext("2d");
}

/* @ngInject */
function LegendViewController($scope) {
  const vm = this;
  $scope.$on('legend:draw', (event, colorMap) => drawLegend(vm.context, colorMap));
}