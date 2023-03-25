import { Color } from "three";

export type Palette = {
  id: number;
  name: string;
  steps: Array<Step>;
};

export type Step = {
  value: number;
  color: Color | Array<number>;
  scaledVal: number
};
