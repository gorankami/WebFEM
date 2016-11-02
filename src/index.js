var angular = require("angular");

angular
  .module('WebFEMView', []);

require('./services/api');
require('./services/utilities');
require('./controllers/web-fem');
require('./directives/fem-view');
require('./directives/legend-view');