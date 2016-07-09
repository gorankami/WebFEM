var angular = require("angular");

angular.module('WebFEMView').provider("ApiService", function () {
  this.$get = function ($http) {
    function ApiService() {
      /**
       * GET /data/palettes.json
       * Gets the palletes array for legend 2D view
       * @returns {HttpPromise}
       */
      this.getPalettes = function () {
        return $http.get("/data/palettes.json");
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

    return new ApiService();
  }
});