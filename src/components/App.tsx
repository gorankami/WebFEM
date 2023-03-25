import React, { useEffect, useState } from "react";
import "./App.css";
import SelectPalette from "./SelectPalette";
import LegendView from "./LegendView";
import MeshView from "./MeshView";
import { getPalettes } from "../services/api";
import BtnApplyToMesh from "./BtnApplyToMesh";
import { Mesh } from "../Mesh";
import { Palette } from "../Palette";

export default function App() {
  const [palettes, setPalettes] = useState<Array<any>>([]);
  const [selectedPalette, setSelectedPalette] = useState<Palette>();
  const [isInverted, setIsInverted] = useState<boolean>(false);
  const [numSteps, setNumSteps] = useState<number>(512);
  const [mesh, setMesh] = useState<Mesh | undefined>(undefined);

  useEffect(() => {
    getPalettes().then((palettes) => {
      setPalettes(palettes);
      setSelectedPalette(palettes[0]);
    });
  }, []);

  const onPaletteChange = (id: number) => {
    setSelectedPalette(palettes.find((item) => item.id === +id));
  };
  const onStepsChange = (e: React.SyntheticEvent) => {
    let currentTarget = e.currentTarget as HTMLInputElement;

    setNumSteps(+currentTarget.value);
  };

  const onInvertedChange = (e: React.SyntheticEvent) => {
    let target = e.target as HTMLInputElement;
    setIsInverted(target.value === "true");
  };

  const onApplyToMesh = (mesh: Mesh, palettes: Array<Palette>) => {
    setMesh(mesh);
    setPalettes(palettes);
  };

  return (
    <div>
      <div className="tool-panel right">
        <b>Palettes:</b>
        <br />
        <SelectPalette
          palettes={palettes}
          selectedPalette={selectedPalette}
          onPaletteChange={onPaletteChange}
        />
        <br />
        Number of steps:
        <br />
        <input type="number" value={numSteps} onChange={onStepsChange} />
        <br />
        <input
          type="checkbox"
          checked={isInverted}
          onChange={onInvertedChange}
        />
        Inverted
        <br />
        <LegendView palette={selectedPalette} isInverted={isInverted} />
        <br />
        <BtnApplyToMesh
          selectedPalette={selectedPalette}
          numSteps={numSteps}
          isInverted={isInverted}
          palettes={palettes}
          onApplyToMesh={onApplyToMesh}
        />
      </div>
      <MeshView mesh={mesh} />
    </div>
  );
}
