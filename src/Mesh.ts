export type MeshResponse = {
  clipArea: any;
  id: number;
  maxValue: number;
  minValue: number;
  maxX: number;
  maxY: number;
  maxZ: number;
  minX: number;
  minY: number;
  minZ: number;
  name: string;
  vectorData: number[];
  vertexData: number[];
  indexData: number[];
  edgeData: number[];
};

export type Mesh = MeshResponse & {
  colorData: number[];
};
