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
* ColorMapUtility takes a color map with values and provides a few functions to help create the legend, get the right color for the value provided etc...
* The ColorMapUtility is partially inspired by Lut class created by 
* @author daron1337 / http://daron1337.github.io/
*
*/

ColorMapUtility = function() {}

ColorMapUtility.prototype = {
    min: 0,
    max: 0,
    colorMap: [],
    colorArray: [],

    parseSplittableColorMap: function (cm) {
        var new_cm = [];
        $.each(cm.split(";"), function (i, v) {
            var p = v.split(",");
            new_cm.push([parseFloat(p[0]), p[1]]);
        });
        return new_cm;
    },

    getColorMapSh: function () {
        var newCM = [];
        $(this.colorMap).each(function (i) {
            newCM[i] = {
                value: this.value,
                color: "#" + this.color,
                scaledValue: this.scaledValue
            }
        });
        return newCM;
    },

    getColorMap0x: function () {
        var newCM = [];
        $(this.colorMap).each(function (i) {
            newCM[i] = [this.value, "0x" + this.color];
        });
        return newCM;
    },

    convertColorMap: function (prefix) {
        var newCM = [];
        $(this.colorMap).each(function (i) {
            newCM[i] = {
                value: this.value,
                color: prefix + this.color,
                scaledValue: this.scaledValue
            }
        });
        return newCM;
    },

    reset: function (min, max, colorMap, numColors) {
        this.min = min ? min : 0;
        this.max = max ? max : 0;
        if (!!colorMap) this.parseColorMap(colorMap);
        this.initColorArray(numColors);
    },

    parseColorMap: function (colorMap) {
        if (!colorMap) colorMap = this.getDefaultColors();
        var scale = this.max - this.min;
        this.colorMap = []; 
        for (var i = 0; i < colorMap.length; i++) {
            var val = colorMap[i][0];
            var col = colorMap[i][1];

            var scaledVal = this.min + scale * val;
            this.colorMap[i] = {
                value: val,
                color: col,
                scaledValue: scaledVal
            };
        }
    },

    initColorArray: function (numColors) {
        this.n = !!numColors ? numColors : 1024;
        this.colorArray = [];
        var step = 1.0 / this.n;
        for (var i = 0; i <= 1; i += step) {
            for (var j = 0; j < this.colorMap.length - 1; j++) {
                if (i >= this.colorMap[j].value && i < this.colorMap[j + 1].value) {
                    var min = this.colorMap[j].value;
                    var max = this.colorMap[j + 1].value;

                    var color = new Color(0xffffff);
                    var minColor = new Color(0xffffff).setHex("0x" + this.colorMap[j].color);
                    var maxColor = new Color(0xffffff).setHex("0x" + this.colorMap[j + 1].color);

                    color = minColor.lerp(maxColor, (i - min) / (max - min));

                    this.colorArray.push(color);
                }
            }
        }
    },

    getColorFromArray: function ( alpha ) {
        if (alpha <= this.min || this.min == this.max) {
            alpha = this.min;
        } else if ( alpha >= this.max ) {
            alpha = this.max;
        }
        if (this.min == this.max) {
            alpha = 0;
        } else {
            alpha = (alpha - this.min) / (this.max - this.min);
        }
        var colorPosition = Math.round ( alpha * this.n );
        colorPosition == this.n ? colorPosition -= 1 : colorPosition;
        return this.colorArray[colorPosition];
    },

    getDefaultColors: function () {
        return [
            [1, "#FF0000"],
            [0.8, "#FFFF00"],
            [0.5, "#00FF00"],
            [0.2, "#00FFFF"],
            [0, "#0000FF"]
        ];
    }
}