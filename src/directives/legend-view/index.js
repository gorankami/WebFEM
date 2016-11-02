var angular = require("angular"),
    $ = require("jquery"),
    _context = null;

angular
  .module("WebFEMView")
  .directive("legendView", LegendView);

function LegendView() {
  return {
    scope: {
      inverted: "="
    },
    restrict: "A",
    template:
    //"<b>Palettes:</b><br/>" +
    // "<select ng-model='palettes.selectedPalette'" +
    // "        ng-options='palette.name for palette in palettes track by palette.id'" +
    // "        ng-selected='drawLegend();reDraw();'></select><br/>" +
    // "Number of steps:<br/>" +
    // "<input id='tbNumSteps' type='number' ng-model='numSteps'/><br/>" +
    // "<input ng-model='inverted' type='checkbox' ng-change='drawLegend();reDraw();'/>Inverted<br/>" +
      "<canvas width='150' height='500'></canvas><br/>",
    // "<button class='btn' ng-click='downloadMesh(true)'>Apply</button>",
    link: function(scope, element){
      var canvas = $('canvas',element);
      if(canvas.length) canvas = canvas[0];
      _context = canvas.getContext("2d");
    },
    controller: function($scope){
      $scope.$on('legend:draw', function(event, params){
        var colorMap = params;

        _context.fillStyle = "Black";
        _context.fillRect(0, 0, 150, 500);
        _context.strokeStyle = "White";

        var startX = 25,
            startY = 25,
            width = 50,
            height = 450;
        var stepsLength = colorMap.steps.length;
        // var scale = max - min;

        //gradient
        var gradient = $scope.inverted ? _context.createLinearGradient(0, startY, 0, startY + height) : _context.createLinearGradient(0, startY + height, 0, startY);
        var colorStopPercentage = 1 / (stepsLength - 1).toFixed(2);

        var i;
        for (i = 0; i < stepsLength; i++) {
          gradient.addColorStop(i * colorStopPercentage, colorMap.steps[i].color.getStyle());
        }
        _context.fillStyle = gradient;
        _context.fillRect(startX, startY, width, height);

        //table border
        _context.beginPath();
        _context.moveTo(startX - 0.5, startY - 0.5);
        _context.lineTo(startX + width + 0.5, startY - 0.5);
        _context.lineTo(startX + width + 0.5, startY + height + 0.5);
        _context.lineTo(startX - 0.5, startY + height + 0.5);
        _context.lineTo(startX - 0.5, startY - 0.5);
        _context.stroke();
        // ...and ticks
        _context.beginPath();
        _context.font = "10px Verdana";
        _context.fillStyle = "White";
        var tickHeight = (height + 1) / (stepsLength - 1).toFixed(2);
        for (i = 0; i < stepsLength; i++) {
          var xpos = startX + width;
          var ypos = Math.round(startY + tickHeight * (stepsLength - 1 - i)) - 0.5;
          _context.moveTo(xpos - 5.5, ypos);
          _context.lineTo(xpos + 5.5, ypos);
          _context.fillText(colorMap.steps[i].scaledVal ? colorMap.steps[i].scaledVal.toFixed(4) : 0, xpos + 10, ypos + 4);
        }
        _context.stroke();
      });
    }
  };
}