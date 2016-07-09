/**
 Copyright 2014 Goran Antic

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */
//requires jQuery

LegendView = function () {
  this.cvsLegend = $("#cvsLegend");
  this.context = this.cvsLegend[0].getContext("2d");
}

LegendView.prototype = {
  constructor: LegendView,

  //draw clear
  init: function(){
    this.context.fillStyle = "Black";
    this.context.fillRect(0, 0, 150, 500);
  },

  draw: function (colorMap, min, max, inverted) {
    this.context.fillStyle = "Black";
    this.context.fillRect(0, 0, 150, 500);
    this.context.strokeStyle = "White";

    var startX = 25,
        startY = 25,
        width = 50,
        height = 450;
    var stepsLength = colorMap.steps.length;
    var scale = max - min;

    //gradient
    var gradient = inverted ? this.context.createLinearGradient(0, startY, 0, startY + height) : this.context.createLinearGradient(0, startY + height, 0, startY);
    var colorStopPercentage = 1 / (stepsLength - 1).toFixed(2);
    for (var i = 0; i < stepsLength; i++) {
      gradient.addColorStop(i * colorStopPercentage, colorMap.steps[i].color.getStyle());
    }
    this.context.fillStyle = gradient;
    this.context.fillRect(startX, startY, width, height);

    //table border
    this.context.beginPath();
    this.context.moveTo(startX - 0.5, startY - 0.5);
    this.context.lineTo(startX + width + 0.5, startY - 0.5);
    this.context.lineTo(startX + width + 0.5, startY + height + 0.5);
    this.context.lineTo(startX - 0.5, startY + height + 0.5);
    this.context.lineTo(startX - 0.5, startY - 0.5);
    this.context.stroke();
    // ...and ticks
    this.context.beginPath();
    this.context.font = "10px Verdana";
    this.context.fillStyle = "White";
    var tickHeight = (height + 1) / (stepsLength - 1).toFixed(2);
    for (var i = 0; i < stepsLength; i++) {
      var xpos = startX + width;
      var ypos = Math.round(startY + tickHeight * (stepsLength - 1 - i)) - 0.5;
      this.context.moveTo(xpos - 5.5, ypos);
      this.context.lineTo(xpos + 5.5, ypos);
      this.context.fillText(colorMap.steps[i].scaledVal ? colorMap.steps[i].scaledVal.toFixed(4) : 0, xpos + 10, ypos + 4);
    }
    this.context.stroke();
  }
}