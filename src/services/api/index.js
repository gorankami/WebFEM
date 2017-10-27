import angular from "angular";
import Color   from "./../../webgl/Color";

angular
  .module('WebFEMView')
  .factory("ApiService", ApiService);

/* @ngInject */
function ApiService($http, $q) {
  const service = {
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
    return $http.get("/data/palettes.json")
      .then(GetPalletesResponse)
      .catch(GetPalletesError);

    function GetPalletesResponse(response) {
      //turn to Color objects
      response.data.forEach(function (palette) {
        palette.steps.forEach(function (step) {
          step.color = new Color(step.color[0], step.color[1], step.color[2]);
        });
      });
      return response;
    }

    function GetPalletesError(e) {
      $q.reject(e);
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
