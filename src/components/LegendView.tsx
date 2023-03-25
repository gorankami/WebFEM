import React, { useEffect, useRef } from "react";
import drawLegend from "../drawLegend";
import { Palette } from "../Palette";

export default function LegendView({ palette, isInverted }: { palette: Palette | undefined, isInverted: boolean }) {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!palette || !canvas.current) return;
    const context: CanvasRenderingContext2D | null = canvas.current.getContext("2d");
    if(!context) throw new Error("Could not create 2D rendering context")
    drawLegend(context, palette, isInverted);
  }, [palette, isInverted, canvas]);

  return <canvas width="150" height="500" ref={canvas}></canvas>;
}
