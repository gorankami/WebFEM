var angular = require("angular"),
    Color   = require('./../../webgl/Color');

angular
  .module('WebFEMView')
  .factory("ApiService", ApiService);

ApiService.$inject = ['$http'];

function ApiService($http) {
  var service = {
    getPalettes: getPalettes,
    getMesh    : getMesh
  };

  return service;

  /**
   * GET /data/palettes.json
   * Gets the palletes array for legend 2D view
   * @returns {HttpPromise}
   */
  function getPalettes() {
    return $http.get("/data/palettes.json").then(GetPalletesResponse);

    function GetPalletesResponse(response){
      //turn to Color objects
      response.data.forEach(function (palette) {
        palette.steps.forEach(function (step) {
          step.color = new Color(step.color[0], step.color[1], step.color[2]);
        });
      });
      return response;
    }
  }

  /**
   * GET /data/{meshName}.json
   * Gets viewable mesh
   * @param meshName {String}
   * @returns {HttpPromise}
   */
  function getMesh(meshName) {
    return $http.get("/data/examples/" + meshName + '.json');
  }
}