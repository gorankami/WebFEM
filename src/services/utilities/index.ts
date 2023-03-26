import { Color } from "three";
import { Mesh } from "../../Mesh";
import { Step } from "../../Palette";

export function prepareColorsVectorBuffer(
  mesh: Mesh,
  min: number,
  max: number,
  colorArray: Color[]
): number[] {
  const colors: number[] = [];
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

export function calibrateColorArray(
  numSteps: number,
  steps: Step[],
  minValue: number,
  maxValue: number,
  inverted: boolean
): Color[] {
  if (maxValue - minValue === 0) return [new Color(0x000000)];
  const n = !!numSteps ? numSteps : 1024;
  const colorArray: Color[] = [];
  const step = (maxValue - minValue) / n;
  for (let stepVal = minValue; stepVal <= maxValue; stepVal += step) {
    for (let i = 0; i < steps.length - 1; i++) {
      if (stepVal >= steps[i].scaledVal && stepVal < steps[i + 1].scaledVal) {
        const min = steps[i].scaledVal;
        const max = steps[i + 1].scaledVal;
        const minColor = new Color(steps[i].color);
        const maxColor = new Color(steps[i + 1].color);
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
  array: Color[]
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
  steps: Step[]
): Step[] {
  return steps.map((step, i) => ({
    ...step,
    scaledVal: min + (i * (max - min)) / (steps.length - 1),
  }));
}
