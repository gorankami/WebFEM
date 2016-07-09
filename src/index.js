//This 'THREE' is needed for loading Color
window.THREE   = {};
require("three/src/math/Color");

require('./TransformationController.js');
require('./FEMView.js');
require('./LegendView.js');


var angular = require("angular");

//Bootstraping angular
angular.module('WebFEMView', []);
require('./services/api');
require('./services/utilities');
require('./controllers/web-fem');