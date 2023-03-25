import React, { useEffect, useRef, useState } from "react";
import { Mesh } from "../Mesh";
import FEMView from "../webgl/FEMView";
import { init } from "../webgl/GL";

export default function MeshView({ mesh }: {mesh: Mesh | undefined}) {
  const canvasRef = useRef(null);
  const [femView, setFemView] = useState<FEMView | undefined>(undefined);

  useEffect(() => {
    if(!canvasRef.current) return;
    init(canvasRef.current);
    let fView: FEMView = new FEMView(canvasRef.current);
    setFemView(fView);
  }, [canvasRef]);

  useEffect(() => {
    if (!mesh || !femView) return;
    femView.recalibrateCamera(mesh);
    femView.transformationController.zoomSpeed =
      Math.max(mesh.maxX - mesh.minX, mesh.maxY - mesh.minY) / 10;
    femView.draw(mesh);
  }, [mesh, femView]);

  return <canvas id="cvsFEM" ref={canvasRef}></canvas>;
}
