import Color from "./../../webgl/Color";

export default {
  prepareVector          : prepareVector,
  initColorArray         : initColorArray,
  scalePaletteColorValues: scalePaletteColorValues
};

export function prepareVector(mesh, min, max, colorArray) {
  const colors = [];
  for (let i = 0; i < mesh.vectorData.length; i++) {
    const color       = getColorFromArray(mesh.vectorData[i], min, max, colorArray);
    colors[3 * i]     = color ? color.r : 0;
    colors[3 * i + 1] = color ? color.g : 0;
    colors[3 * i + 2] = color ? color.b : 0;
  }
  return colors;
}

export function initColorArray(numColors, steps, minValue, maxValue, inverted) {
  if (maxValue - minValue === 0) return [new Color(0x000000)];
  const n          = !!numColors ? numColors : 1024;
  const colorArray = [];
  const step       = (maxValue - minValue) / n;
  for (let stepVal = minValue; stepVal <= maxValue; stepVal += step) {
    for (let i = 0; i < steps.length - 1; i++) {
      if (stepVal >= steps[i].scaledVal && stepVal < steps[i + 1].scaledVal) {
        const min      = steps[i].scaledVal;
        const max      = steps[i + 1].scaledVal;
        const minColor = new Color(0xffffff).setHex("0x" + steps[i].color.getHexString());
        const maxColor = new Color(0xffffff).setHex("0x" + steps[i + 1].color.getHexString());
        const color    = minColor.lerp(maxColor, (stepVal - min) / (max - min));

        if (inverted) {
          colorArray.unshift(color);
        }
        else {
          colorArray.push(color);
        }
      }
    }
  }
  return colorArray;
}

export function getColorFromArray(alpha, min, max, array) {
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

export function scalePaletteColorValues(min, max, steps) {
  const newSteps = [];
  for (let i = 0; i < steps.length; i++) {
    newSteps.push({...steps[i], scaledVal: min + i * (max - min) / (steps.length - 1)});
  }
  return newSteps;
}
