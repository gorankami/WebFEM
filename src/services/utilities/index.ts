import { Color } from "three";
import { Mesh } from "../../Mesh";
import { Step } from "../../Palette";

export function prepareVector(
  mesh: Mesh,
  min: number,
  max: number,
  colorArray: Array<Color>
): Array<number> {
  const colors: Array<number> = [];
  for (let i = 0; i < mesh.vectorData.length; i++) {
    const color: Color = getColorFromArray(
      mesh.vectorData[i],
      min,
      max,
      colorArray
    );
    colors[3 * i] = color ? color.r : 0;
    colors[3 * i + 1] = color ? color.g : 0;
    colors[3 * i + 2] = color ? color.b : 0;
  }
  return colors;
}

export function initColorArray(
  numColors: number,
  steps: Array<Step>,
  minValue: number,
  maxValue: number,
  inverted: boolean
): Array<Color> {
  if (maxValue - minValue === 0) return [new Color(0x000000)];
  const n = !!numColors ? numColors : 1024;
  const colorArray: Array<Color> = [];
  const step = (maxValue - minValue) / n;
  for (let stepVal = minValue; stepVal <= maxValue; stepVal += step) {
    for (let i = 0; i < steps.length - 1; i++) {
      if (stepVal >= steps[i].scaledVal && stepVal < steps[i + 1].scaledVal) {
        const min = steps[i].scaledVal;
        const max = steps[i + 1].scaledVal;
        const minColor = new Color(0xffffff).setHex(
          +(steps[i].color as Color).getHexString()
        );
        const maxColor = new Color(0xffffff).setHex(
          +(steps[i + 1].color as Color).getHexString()
        );
        const color = minColor.lerp(maxColor, (stepVal - min) / (max - min));

        if (inverted) {
          colorArray.unshift(color);
        } else {
          colorArray.push(color);
        }
      }
    }
  }
  return colorArray;
}

export function getColorFromArray(
  alpha: number,
  min: number,
  max: number,
  array: Array<Color>
): Color {
  if (alpha <= min || min === max) {
    alpha = min;
  } else if (alpha >= max) {
    alpha = max;
  } else {
    alpha = (alpha - min) / (max - min);
  }
  let colorPosition = Math.round(alpha * array.length);
  if (colorPosition === array.length) {
    colorPosition -= 1;
  }
  return array[colorPosition];
}

export function scalePaletteColorValues(
  min: number,
  max: number,
  steps: Array<Step>
) {
  const newSteps: Array<Step> = [];
  for (let i = 0; i < steps.length; i++) {
    newSteps.push({
      ...steps[i],
      scaledVal: min + (i * (max - min)) / (steps.length - 1),
    });
  }
  return newSteps;
}
