import React from "react";
import { Palette } from "../Palette";
import { getMesh } from "../services/api";
import {
  scalePaletteColorValues,
  calibrateColorArray,
  prepareColorsVectorBuffer,
} from "../services/utilities";

export default function BtnApplyToMesh(props: any) {
  return (
    <button className="btn" onClick={() => applyToMesh(props)}>
      Apply to mesh
    </button>
  );
}

function applyToMesh({
  selectedPalette,
  numSteps,
  isInverted,
  palettes,
  onApplyToMesh,
}: {
  selectedPalette: Palette;
  numSteps: number;
  isInverted: boolean;
  palettes: Palette[];
  onApplyToMesh: Function;
}) {
  getMesh("example1").then((mesh) => {
    if (
      !mesh.vertexData.length ||
      !mesh.indexData.length ||
      !mesh.vectorData.length
    ) {
      throw new Error("Model data not available.");
    }

    const scaledSteps = scalePaletteColorValues(
      mesh.minValue,
      mesh.maxValue,
      selectedPalette.steps
    );

    const colorArray = calibrateColorArray(
      numSteps,
      scaledSteps,
      mesh.minValue,
      mesh.maxValue,
      isInverted
    );
    mesh.colorData = prepareColorsVectorBuffer(
      mesh,
      mesh.minValue,
      mesh.maxValue,
      colorArray
    );
    const palettesCopy = palettes.map((item) => {
      if (item === selectedPalette) {
        return { ...item, steps: scaledSteps };
      } else {
        return item;
      }
    });
    onApplyToMesh(mesh, palettesCopy);
  });
}
