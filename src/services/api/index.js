var angular = require("angular"),
    Color   = require('./../../webgl/Color');

angular
  .module('WebFEMView')
  .service("ApiService", ["$http", ApiService]);

function ApiService($http) {
  /**
   * GET /data/palettes.json
   * Gets the palletes array for legend 2D view
   * @returns {HttpPromise}
   */
  this.getPalettes = function () {
    return $http.get("/data/palettes.json").then(function (response) {
      //turn to Color objects
      response.data.forEach(function (palette) {
        palette.steps.forEach(function (step) {
          step.color = new Color(step.color[0], step.color[1], step.color[2]);
        });
      });
      return response;
    });
  };

  /**
   * GET /data/{meshName}.json
   * Gets viewable mesh
   * @param meshName {String}
   * @returns {HttpPromise}
   */
  this.getMesh = function (meshName) {
    return $http.get("/data/examples/" + meshName + '.json');
  };
}