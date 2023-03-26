import { Mesh } from "../Mesh";

const numX = 10;
const numY = 10;
const numZ = 1;
const maxCoordOffset = 10;

const stepVertexData: number[] = [
  0, 0, 0, 0, 100, 0, 100, 100, 0, 100, 0, 0, 0, 0, 100, 0, 100, 100, 100, 100,
  100, 100, 0, 100,
];

const stepIndexData = [
  0, 1, 2, 2, 3, 0, 4, 7, 6, 6, 5, 4, 0, 1, 5, 5, 4, 0, 2, 3, 7, 7, 6, 2, 4, 7,
  3, 3, 0, 4, 1, 2, 6, 6, 5, 1,
];

const stepEdgeData = [
  0, 1, 1, 2, 2, 3, 3, 0, 4, 7, 7, 6, 6, 5, 5, 4, 0, 1, 1, 5, 5, 4, 4, 0, 2, 3,
  3, 7, 7, 6, 6, 2, 4, 7, 7, 3, 3, 0, 0, 4, 1, 2, 2, 6, 6, 5, 5, 1,
];

// const stepVectorData = [41, 52, 73, 44, 95, 66, 77, 100];

const mesh: Mesh = {
  clipArea: null,
  id: 1,
  minValue: 0,
  maxValue: 8 * (numX + numY + numZ),
  maxX: 100 + numX * maxCoordOffset,
  maxY: 100 + numY * maxCoordOffset,
  maxZ: 100 + numZ * maxCoordOffset,
  minX: 0,
  minY: 0,
  minZ: 0,
  vertexData: [],
  indexData: [],
  vectorData: [],
  edgeData: [],
  name: "generatedExample1",
  colorData: [],
};

for (let x = 0; x < numX; x++) {
  for (let y = 0; y < numY; y++) {
    for (let z = 0; z < numZ; z++) {
      for (let i = 0; i < stepVertexData.length; i += 3) {
        mesh.vertexData.push(stepVertexData[i] + x * 100);
        mesh.vertexData.push(stepVertexData[i + 1] + y * 100);
        mesh.vertexData.push(stepVertexData[i + 2] + z * 100);
      }

      for (let index of stepIndexData) {
        mesh.indexData.push(index + 8 * (x + y + z));
      }

      for (let edge of stepEdgeData) {
        mesh.edgeData.push(edge + 8 * (x + y + z));
      }

      for (let vertex = 0; vertex < 8; vertex++) {
        mesh.vectorData.push(x + y + z);
      }
    }
  }
}

console.log(JSON.stringify(mesh, null, 2));
