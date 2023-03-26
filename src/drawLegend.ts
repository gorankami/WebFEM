import { Color } from "three";
import { Palette } from "./Palette";

export default function drawLegend(context: CanvasRenderingContext2D, colorMap: Palette, isInverted: boolean) {
    const startX = 25,
      startY = 25,
      width = 50,
      height = 450,
      stepsLength = colorMap.steps.length,
      gradient = isInverted ?
      context.createLinearGradient(0, startY, 0, startY + height) :
      context.createLinearGradient(0, startY + height, 0, startY),
      colorStopPercentage = 1 / (stepsLength - 1),
      tickHeight = (height + 1) / (stepsLength - 1);

    context.fillStyle = "Black";
    context.fillRect(0, 0, 150, 500);
    context.strokeStyle = "White";

    for (let i = 0; i < stepsLength; i++) {
      gradient.addColorStop(i * colorStopPercentage, (colorMap.steps[i].color as Color).getStyle());
    }
    context.fillStyle = gradient;
    context.fillRect(startX, startY, width, height);

    //table border
    context.beginPath();
    context.moveTo(startX - 0.5, startY - 0.5);
    context.lineTo(startX + width + 0.5, startY - 0.5);
    context.lineTo(startX + width + 0.5, startY + height + 0.5);
    context.lineTo(startX - 0.5, startY + height + 0.5);
    context.lineTo(startX - 0.5, startY - 0.5);
    context.stroke();
    // ...and ticks
    context.beginPath();
    context.font = "10px Verdana";
    context.fillStyle = "White";

    for (let i = 0; i < stepsLength; i++) {
      let xpos = startX + width;
      let ypos = Math.round(startY + tickHeight * (stepsLength - 1 - i)) - 0.5;
      context.moveTo(xpos - 5.5, ypos);
      context.lineTo(xpos + 5.5, ypos);
      debugger
      context.fillText(colorMap.steps[i].scaledVal ? colorMap.steps[i].scaledVal.toFixed(4) : "0", xpos + 10, ypos + 4);
    }
    context.stroke();
  }