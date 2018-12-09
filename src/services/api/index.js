import Color from "./../../webgl/Color";
import 'whatwg-fetch';

export default {
  getPalettes: getPalettes,
  getMesh: getMesh
};

/**
 * GET /data/palettes.json
 * Gets the palletes array for legend 2D view
 * @returns {Promise}
 */
function getPalettes() {
  return fetch("./data/palettes.json").then(defaultHandler).then(GetPalletesResponse);
}

function GetPalletesResponse(response) {
  //turn to Color objects
  response.forEach(function (palette) {
    palette.steps.forEach(function (step) {
      step.color = new Color(step.color[0], step.color[1], step.color[2]);
    });
  });
  return response;
}

/**
 * GET /data/{meshName}.json
 * Gets viewable mesh
 * @param meshName {String}
 * @returns {Promise}
 */
function getMesh(meshName) {
  //return fetch("https://s3-eu-west-1.amazonaws.com/monolit-studio/webfem/example2.json").then(defaultHandler);
  return fetch("https://s3-eu-west-1.amazonaws.com/monolit-studio/webfem/example1.json").then(defaultHandler);
}

function defaultHandler(response) {
  if (response.ok) {
    return response.json();
  }
  throw new Error('Network response was not ok.');
}