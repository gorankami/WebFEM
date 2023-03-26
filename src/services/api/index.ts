import { Mesh, MeshResponse } from "../../Mesh";
import { Palette, PaletteResponse } from "../../Palette";
import { Color } from "three";

/**
 * GET /data/{name}.json
 * Gets viewable mesh
 * @param name {String}
 * @returns {Promise}
 */
export function getMesh(name: string = "example1"): Promise<Mesh> {
  return fetch(`data/examples/${name}.json`)
    .then((res) => res.json())
    .then((mesh: MeshResponse): Mesh => {
      return { ...mesh, colorData: [] };
    });
}

/**
 * GET /data/palettes.json
 * Gets the palletes array for legend 2D view
 * @returns {Promise}
 */
export function getPalettes(): Promise<Palette[]> {
  return fetch(`data/palettes.json`)
    .then((res) => res.json())
    .then(convertPaletteColors);
}

function convertPaletteColors(response: PaletteResponse[]): Palette[] {
  //turn to Color objects
  return response.map((palette: PaletteResponse): Palette => {
    return {
      ...palette,
      steps: palette.steps.map((step) => {
        const color: number[] = step.color as number[];
        return { ...step, scaledVal: 0, color: new Color(color[0], color[1], color[2]) };
      }),
    };
  });
}
