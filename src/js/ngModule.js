angular
  .module('WebFEMView', [])
  .controller('WebFEMController', ['$scope', '$http', function ($scope, $http) {
    var legendView = new LegendView();
    var femView = new FEMView();
    femView.init();
    $scope.numSteps = 512;
    $scope.variables = [
      { name: "DISPLACEMENT", value: 0 },
      { name: "VELOCITY", value: 1 },
      { name: "VELOCITY_GRADIENT", value: 2 },
      { name: "TEMPERATURE", value: 3 },
      { name: "OXIDIZED_LDL", value: 4 },
      { name: "MACROPHAGES", value: 5 },
      { name: "CYTOKINES", value: 6 },
      { name: "PRESSURE", value: 7 },
      { name: "SHEAR_STRESS", value: 8 },
      { name: "INTIMA_WALL_PRESSURE", value: 9 },
      { name: "POTENTIAL_AHTEROSCLEROSIS_GROW", value: 10 },
      { name: "CUSTOM", value: 11 },
      { name: "STREAM_FUNCTION", value: 12 },
      { name: "STRESS", value: 13 },
      { name: "STRAIN", value: 14 },
      { name: "FORCE", value: 15 },
      { name: "POTENTIAL", value: 16 },
      { name: "FLUID_PRESSURE", value: 17 },
      { name: "SWELLING_PRESSURE", value: 18 },
      { name: "PERMEABILITY", value: 19 },
      { name: "POROSITY", value: 20 },
      { name: "PORE_PRESSURE", value: 21 },
      { name: "STRAIN_AT_CENTER", value: 22 }
    ];
    $scope.selectedVariable = $scope.variables[0].value;
    $scope.components = [
      { name: "EFFECTIVE", value: 0 },
      { name: "X", value: 1 },
      { name: "Y", value: 2 },
      { name: "Z", value: 3 },
      { name: "RX", value: 4 },
      { name: "RY", value: 5 },
      { name: "RZ", value: 6 }
    ];
    $scope.selectedComponent = $scope.components[0].value;
    $scope.selectedStep = 1;
    $scope.appliedClipPlane = false;
    $scope.clipPlane = {
      active: false,
      base: [0.0, 0.0, 0.0],
      normal: [1.0, 0.0, 0.0]
    };

    $http.get("/data/palettes.json").success(function (data) {
      $scope.palettes = data;
      //turn to Color objects
      $scope.palettes.forEach(function (palette) {
        palette.steps.forEach(function (step) {
          step.color = new Color(step.color);
        });
      });
      $scope.palettes.selectedPalette = $scope.palettes[0];
      $scope.drawLegend();
    });

    $scope.drawLegend = function () {
      var min = 0,
          max = 0;
      if ($scope.mesh && $scope.mesh && $scope.mesh.vectorData) {
        min = $scope.mesh.minValue;
        max = $scope.mesh.maxValue;
      }

      if ($scope.palettes && $scope.palettes.length) {
        legendView.draw($scope.palettes.selectedPalette, min, max, $scope.inverted);
      }
    };

    $scope.downloadMesh = function (applyClipPlane) {
      $scope.toggleCurtain = true;
      //free memory
      delete $scope.mesh;
      femView.unload();
      var downloadUri = "data/examples/example1.json";//"/api/mesh/" + MESH_ID + "/" + $scope.selectedVariable + "/" + $scope.selectedComponent + "/" + $scope.selectedStep;
      if (applyClipPlane) {
        downloadUri += "?clipPlane=" + $scope.clipPlane.base + "," + $scope.clipPlane.normal;
      }
      $scope.appliedClipPlane = applyClipPlane;
      $http.get(downloadUri).success(function (data) {
        try {
          if (data.vertexData && data.vertexData.length
            && data.indexData && data.indexData.length
            && data.vectorData && data.vectorData.length) {

            $scope.mesh = data;
            $scope.clipPlane.active = false;
            scalePaletteColorValues(data.minValue, data.maxValue, $scope.palettes.selectedPalette.steps);

            var colorArray = initColorArray($scope.numSteps, $scope.palettes.selectedPalette, $scope.mesh.minValue, $scope.mesh.maxValue, $scope.inverted);
            $scope.mesh.colorData = prepareVector($scope.mesh, $scope.mesh.minValue, $scope.mesh.maxValue, $scope.palettes.selectedPalette, $scope.numSteps, $scope.inverted, colorArray);

            if ($scope.mesh.clipArea) {
              $scope.clipPlane.base = $scope.mesh.clipArea.base;
              $scope.clipPlane.normal = $scope.mesh.clipArea.normal;
              $scope.mesh.clipArea.colorData = prepareVector($scope.mesh.clipArea, $scope.mesh.minValue, $scope.mesh.maxValue, $scope.palettes.selectedPalette, $scope.numSteps, $scope.inverted, colorArray);
            }
            else {
              $scope.centerPlaneForClipping();
            }
            $scope.calculateClipPlaneMesh();
            femView.recalibrateCamera($scope.mesh);
            femView.transformationController.zoomSpeed = Math.max($scope.mesh.maxX - $scope.mesh.minX, $scope.mesh.maxY - $scope.mesh.minY) / 10;
            femView.draw($scope.mesh, $scope.clipPlane, $scope.appliedClipPlane);
            $scope.drawLegend();
          }
          else {
            alert("Cannot load model for variable " + $scope.selectedVariable + ", component " + $scope.selectedComponent + " and step " + $scope.selectedStep);
          }
        } catch (ex) {
          alert("Error: " + ex.message);
        }
        $scope.toggleCurtain = false;
      });
    };

    $scope.reDraw = function () {
      if ($scope.mesh) {
        $scope.calculateClipPlaneMesh();
        femView.draw($scope.mesh, $scope.clipPlane, $scope.appliedClipPlane);
      }
    };

    $scope.centerPlaneForClipping = function () {
      $scope.clipPlane.base = [
        $scope.mesh.maxX - ($scope.mesh.maxX - $scope.mesh.minX)/2,
        $scope.mesh.maxY - ($scope.mesh.maxY - $scope.mesh.minY)/2,
        $scope.mesh.maxZ - ($scope.mesh.maxZ - $scope.mesh.minZ)/2
      ];
    };

    $scope.calculateClipPlaneMesh = function () {
      var difference = 0;
      difference = Math.max(difference, $scope.mesh.maxX - $scope.mesh.minX);
      difference = Math.max(difference, $scope.mesh.maxY - $scope.mesh.minY);
      difference = Math.max(difference, $scope.mesh.maxZ - $scope.mesh.minZ);
      difference = difference / 2;

      $scope.clipPlane.mesh = {
        vertices: [
          0, 0 - difference, 0 - difference,
          0, 0 - difference, 0 + difference,
          0, 0 + difference, 0 + difference,
          0, 0 + difference, 0 - difference
        ],
        indices: [0, 1, 2, 2, 3, 0]
      };
    };

    $scope.applyColorMap = function () {
      scalePaletteColorValues($scope.mesh.minValue, $scope.mesh.maxValue, $scope.palettes.selectedPalette.steps);
      var colorArray = initColorArray($scope.numSteps, $scope.palettes.selectedPalette, $scope.mesh.minValue, $scope.mesh.maxValue, $scope.inverted);
      $scope.mesh.colorData = prepareVector($scope.mesh, $scope.mesh.minValue, $scope.mesh.maxValue, $scope.palettes.selectedPalette, $scope.numSteps, $scope.inverted, colorArray);
      $scope.mesh.clipArea.colorData = prepareVector($scope.mesh.clipArea, $scope.mesh.minValue, $scope.mesh.maxValue, $scope.palettes.selectedPalette, $scope.numSteps, $scope.inverted, colorArray);
    };
  }]);

function prepareVector(mesh, min, max, palette, numSteps, inverted, colorArray) {
  var colors = [];
  for (var i = 0; i < mesh.vectorData.length; i++) {
    var color = getColorFromArray(mesh.vectorData[i], min, max, colorArray);
    colors[3 * i] = color ? color.r : 0;
    colors[3 * i + 1] = color ? color.g : 0;
    colors[3 * i + 2] = color ? color.b : 0;
  }
  return colors;
}

function initColorArray(numColors, palette, minValue, maxValue, inverted) {
  if (maxValue - minValue == 0) return [new Color(0x000000)];
  var n = !!numColors ? numColors : 1024;
  var colorArray = [];
  var step = (maxValue - minValue) / n;
  for (var stepVal = minValue; stepVal <= maxValue ; stepVal += step) {
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