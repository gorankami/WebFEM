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
  const [palettes, setPalettes] = useState<Palette[]>([]);
  const [selectedPaletteIndex, setSelectedPaletteIndex] = useState<number>(0);
  const [isInverted, setIsInverted] = useState<boolean>(false);
  const [numSteps, setNumSteps] = useState<number>(512);
  const [mesh, setMesh] = useState<Mesh | undefined>(undefined);

  useEffect(() => {
    getPalettes().then((palettes) => {
      setPalettes(palettes);
      setSelectedPaletteIndex(0);
    });
  }, []);

  const onPaletteChange = (id: number) => {
    for (let i = 0; i < palettes.length; i++) {
      if (palettes[i].id === +id) {
        setSelectedPaletteIndex(i);
        break;
      }
    }
  };

  const onStepsChange = (e: React.SyntheticEvent) => {
    let currentTarget = e.currentTarget as HTMLInputElement;

    setNumSteps(+currentTarget.value);
  };

  const onInvertedChange = (e: React.SyntheticEvent) => {
    let target = e.target as HTMLInputElement;
    setIsInverted(target.value === "true");
  };

  const onApplyToMesh = (mesh: Mesh, palettes: Palette[]) => {
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
          selectedPalette={palettes[selectedPaletteIndex]}
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
        <LegendView
          palette={palettes[selectedPaletteIndex]}
          isInverted={isInverted}
        />
        <br />
        <BtnApplyToMesh
          selectedPalette={palettes[selectedPaletteIndex]}
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
