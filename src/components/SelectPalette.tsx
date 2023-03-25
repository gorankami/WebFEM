import React from "react";
import { Palette } from "../Palette";

//in:
//palettes
//selectedPalette
//out:
//onPaletteChange

export default function SelectPalette({
  palettes,
  selectedPalette,
  onPaletteChange,
}: {
  palettes: Palette[];
  selectedPalette?: Palette;
  onPaletteChange: Function;
}) {
  if (palettes && palettes.length) {
    const options = palettes.map((item) => {
      return (
        <option
          key={item.id}
          value={item.id}
          defaultValue={selectedPalette?.id}
        >
          {item.name}
        </option>
      );
    });
    return (
      <select onChange={(e) => onPaletteChange(e.target.value)}>
        {options}
      </select>
    );
  }
  return <select></select>;
}
