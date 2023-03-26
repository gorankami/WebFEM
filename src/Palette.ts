import { Color } from "three";

export type Palette = {
  id: number;
  name: string;
  steps: Step[];
};

export type PaletteResponse = {
  id: number;
  name: string;
  steps: StepResponse[];
};

export type StepResponse = {
  value: number;
  color: number[];
};

export type Step = {
  value: number;
  color: Color;
  scaledVal: number;
};
