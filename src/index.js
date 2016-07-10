//This 'THREE' is needed for loading Color
window.THREE   = {};
require("three/src/math/Color");

require('./TransformationController.js');


var angular = require("angular");

//Bootstrapping angular
angular.module('WebFEMView', []);
require('./services/api');
require('./services/utilities');
require('./controllers/web-fem');
require('./directives/fem-view');
require('./directives/legend-view');