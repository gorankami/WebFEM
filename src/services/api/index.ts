import { Mesh } from "../../Mesh";
import { Palette } from "../../Palette";
import { Color } from "three";

/**
 * GET /data/{meshName}.json
 * Gets viewable mesh
 * @param meshName {String}
 * @returns {Promise}
 */
export function getMesh(name: string): Promise<Mesh> {
  return fetch(`data/examples/example1.json`)
    .then((res) => res.json());
}

/**
 * GET /data/palettes.json
 * Gets the palletes array for legend 2D view
 * @returns {Promise}
 */
export function getPalettes(): Promise<Palette[]> {
  return fetch(`data/palettes.json`)
    .then((res) => res.json())
    .then(getPaletesResponse);
}

export function getPaletesResponse(response: Palette[]): Palette[] {
  //turn to Color objects
  response.forEach(function (palette: Palette) {
    palette.steps.forEach((step) => {
      const color: Array<number> = step.color as Array<number>;
      step.color = new Color(color[0], color[1], color[2]);
    });
  });
  return response;
}


