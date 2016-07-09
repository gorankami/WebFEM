var angular = require("angular");

angular.module('WebFEMView').provider("UtilitiesService", function () {
  this.$get = function(){
    function UtilitiesService(){
      var self = this;
      this.prepareVector = function (mesh, min, max, palette, numSteps, inverted, colorArray) {
        var colors = [];
        for (var i = 0; i < mesh.vectorData.length; i++) {
          var color = self.getColorFromArray(mesh.vectorData[i], min, max, colorArray);
          colors[3 * i] = color ? color.r : 0;
          colors[3 * i + 1] = color ? color.g : 0;
          colors[3 * i + 2] = color ? color.b : 0;
        }
        return colors;
      };

      this.initColorArray= function (numColors, palette, minValue, maxValue, inverted) {
        if (maxValue - minValue == 0) return [new THREE.Color(0x000000)];
        var n = !!numColors ? numColors : 1024;
        var colorArray = [];
        var step = (maxValue - minValue) / n;
        for (var stepVal = minValue; stepVal <= maxValue ; stepVal += step) {
          for (var i = 0; i < palette.steps.length - 1; i++) {
            if (stepVal >= palette.steps[i].scaledVal && stepVal < palette.steps[i + 1].scaledVal) {
              var min = palette.steps[i].scaledVal;
              var max = palette.steps[i + 1].scaledVal;

              var minColor = new THREE.Color(0xffffff).setHex("0x" + palette.steps[i].color.getHexString());
              var maxColor = new THREE.Color(0xffffff).setHex("0x" + palette.steps[i + 1].color.getHexString());

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
      };

      this.getColorFromArray = function (alpha, min, max, array) {
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
      };

      this.scalePaletteColorValues = function (min, max, steps) {
        for (var i = 0; i < steps.length; i++) {
          steps[i].scaledVal = min + i * (max - min) / (steps.length - 1);
        }
      };
    }

    return new UtilitiesService();
  };
});
