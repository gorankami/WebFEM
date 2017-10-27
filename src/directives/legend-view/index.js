import angular from "angular";
import $ from "jquery";

/**
 * @desc
 * @example
 */
angular
  .module("WebFEMView")
  .directive("monolitLegendView", LegendView);

function LegendView() {
  return {
    scope       : {
      inverted: "="
    },
    restrict    : "A",
    template    : "<canvas width='150' height='500'></canvas><br/>",
    link        : linkFunc,
    controller  : LegendViewController,
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
  $scope.$on('legend:draw', drawEvent);

  function drawEvent(event, colorMap) {

    const startX              = 25,
          startY              = 25,
          width               = 50,
          height              = 450,
          stepsLength         = colorMap.steps.length,
          gradient            = $scope.inverted ?
            vm.context.createLinearGradient(0, startY, 0, startY + height) :
            vm.context.createLinearGradient(0, startY + height, 0, startY),
          colorStopPercentage = 1 / (stepsLength - 1).toFixed(2),
          tickHeight          = (height + 1) / (stepsLength - 1).toFixed(2);

    vm.context.fillStyle = "Black";
    vm.context.fillRect(0, 0, 150, 500);
    vm.context.strokeStyle = "White";

    for (let i = 0; i < stepsLength; i++) {
      gradient.addColorStop(i * colorStopPercentage, colorMap.steps[i].color.getStyle());
    }
    vm.context.fillStyle = gradient;
    vm.context.fillRect(startX, startY, width, height);

    //table border
    vm.context.beginPath();
    vm.context.moveTo(startX - 0.5, startY - 0.5);
    vm.context.lineTo(startX + width + 0.5, startY - 0.5);
    vm.context.lineTo(startX + width + 0.5, startY + height + 0.5);
    vm.context.lineTo(startX - 0.5, startY + height + 0.5);
    vm.context.lineTo(startX - 0.5, startY - 0.5);
    vm.context.stroke();
    // ...and ticks
    vm.context.beginPath();
    vm.context.font      = "10px Verdana";
    vm.context.fillStyle = "White";

    for (let i = 0; i < stepsLength; i++) {
      let xpos = startX + width;
      let ypos = Math.round(startY + tickHeight * (stepsLength - 1 - i)) - 0.5;
      vm.context.moveTo(xpos - 5.5, ypos);
      vm.context.lineTo(xpos + 5.5, ypos);
      vm.context.fillText(colorMap.steps[i].scaledVal ? colorMap.steps[i].scaledVal.toFixed(4) : 0, xpos + 10, ypos + 4);
    }
    vm.context.stroke();
  }
}
