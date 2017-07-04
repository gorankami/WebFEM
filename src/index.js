var angular = require("angular");

require("./assets/style.css");

angular
  .module('WebFEMView', []);

require('./services/api');
require('./services/utilities');
require('./directives/web-fem');
require('./directives/fem-view');
require('./directives/legend-view');