var angular = require("angular"),
    Color   = require('./../../webgl/Color');

angular.module('WebFEMView')
  .factory("UtilitiesService", UtilitiesService);

function UtilitiesService() {
  var service = {
    prepareVector          : prepareVector,
    initColorArray         : initColorArray,
    getColorFromArray      : getColorFromArray,
    scalePaletteColorValues: scalePaletteColorValues
  };

  return service;

  function prepareVector(mesh, min, max, palette, numSteps, inverted, colorArray) {
    var colors = [];
    for (var i = 0; i < mesh.vectorData.length; i++) {
      var color         = getColorFromArray(mesh.vectorData[i], min, max, colorArray);
      colors[3 * i]     = color ? color.r : 0;
      colors[3 * i + 1] = color ? color.g : 0;
      colors[3 * i + 2] = color ? color.b : 0;
    }
    return colors;
  }

  function initColorArray(numColors, palette, minValue, maxValue, inverted) {
    if (maxValue - minValue == 0) return [new Color(0x000000)];
    var n          = !!numColors ? numColors : 1024;
    var colorArray = [];
    var step       = (maxValue - minValue) / n;
    for (var stepVal = minValue; stepVal <= maxValue; stepVal += step) {
      for (var i = 0; i < palette.steps.length - 1; i++) {
        if (stepVal >= palette.steps[i].scaledVal && stepVal < palette.steps[i + 1].scaledVal) {
          var min = palette.steps[i].scaledVal;
          var max = palette.steps[i + 1].scaledVal;

          var minColor = new Color(0xffffff).setHex("0x" + palette.steps[i].color.getHexString());
          var maxColor = new Color(0xffffff).setHex("0x" + palette.steps[i + 1].color.getHexString());

          var color = minColor.lerp(maxColor, (stepVal - min) / (max - min));

          if (inverted) {
            colorArray.unshift(color);
          }
          else {
            colorArray.push(color);
          }
        }
      }
    }
    return colorArray;
  }

  function getColorFromArray(alpha, min, max, array) {
    if (alpha <= min || min == max) {
      alpha = min;
    } else if (alpha >= max) {
      alpha = max;
    } else {
      alpha = (alpha - min) / (max - min);
    }
    var colorPosition = Math.round(alpha * array.length);
    colorPosition == array.length ? colorPosition -= 1 : colorPosition;
    return array[colorPosition];
  }

  function scalePaletteColorValues(min, max, steps) {
    for (var i = 0; i < steps.length; i++) {
      steps[i].scaledVal = min + i * (max - min) / (steps.length - 1);
    }
  }
}
