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

/**
* @author Goran Antic
*
* Legend draws a color map legend rectangle in a canvas displaying ticks of colors while at it
*
*/

Legend = function(canvasElement){
    this.cLegend = canvasElement;
    this.context2d = this.cLegend.getContext("2d");
    this.context2d.strokeStyle = "White";
}

Legend.prototype = {
    cLegend: null,
    context2d: null,
    constructor: Legend,

    reset: function (cmu,min,max) {
        this.context2d.fillStyle = "Black";
        this.context2d.fillRect(0, 0, 150, 500);
        //table colors
        var startX = 25,
            startY = 25,
            width = 50,
            height = 450;

        var colorMap = cmu.getColorMapSh();
        var cmLength = colorMap.length;
        var scale = max - min;
        //gradient
        var gradient = this.context2d.createLinearGradient(0, startY + height, 0, startY); //odozdo na gore, inace u suprotnom napisati "0, startY, 0, startY + height"
        var colorStopPercentage = 1 / (cmLength - 1).toFixed(2);
        for (var i = 0; i < cmLength; i++) {
            gradient.addColorStop(i * colorStopPercentage, colorMap[i]["color"]);
        }
        this.context2d.fillStyle = gradient;
        this.context2d.fillRect(startX, startY, width, height);

        //table border
        this.context2d.beginPath();
        this.context2d.moveTo(startX - 0.5, startY - 0.5);
        this.context2d.lineTo(startX + width + 0.5, startY - 0.5);
        this.context2d.lineTo(startX + width + 0.5, startY + height + 0.5);
        this.context2d.lineTo(startX - 0.5, startY + height + 0.5);
        this.context2d.lineTo(startX - 0.5, startY - 0.5);
        // ...and ticks
        this.context2d.font = "10px Verdana";
        this.context2d.fillStyle = "White";
        var tickHeight = (height + 1) / (cmLength - 1).toFixed(2);
        for (var i = 0; i < cmLength; i++) {
            var xpos = startX + width;
            var ypos = Math.round(startY + tickHeight * (cmLength - 1 - i)) - 0.5; //odozdo na gore, inace u suprotnom napisati samo "i" umesto "(cmu.cmLength-1-i)"
            this.context2d.moveTo(xpos - 5.5, ypos);
            this.context2d.lineTo(xpos + 5.5, ypos);
            var scaledVal = min + scale * colorMap[i].value;
            this.context2d.fillText(scaledVal.toFixed(4), xpos + 10, ypos + 4);
        }
        this.context2d.stroke();
    },

    draw: function (cmu) {
        
    }
}