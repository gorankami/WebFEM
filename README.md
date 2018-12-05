# WebFEM
WebGL engine for FEM models viewing. A part of a master thesis project. It is designed to use NEU models converted to
custom json format. The conversion app is not included.

*Important note*: This project is not adapted for public use, nor it is easy to use a part of it for your WebGL projects.
It is created for personal shader study and WebGL library study. I suggest using existing tools that make things a
TON easier, like [Three.js](https://github.com/mrdoob/three.js/).

## Build intructions
Install dependencies by running
```npm install```

Build the project with 
```npm run build```

The project is being self-served with webpack by running
```npm run start```

But if you would like to use it with your own server, you can just build it with `gulp` and the built files will appear
in folder `www`

## Usage

### About missing FEM models
Due to the fact that the master thesis models were real world models but forbidden for public viewing, this github
project differs from master thesis project by a dropdown with available models on the servers. The model manager for
uploading, converting NEU files and downloading projets is not included on source control.

Instead, there is only one example located in `/data/examples/example1.json`, which represents a simple cube with randomly selected values on nodes.

### Models format
Below is a preview of an example provided on this project (`/data/examples/example1.json`)
```
{
  "clipArea": null,
  "id": 8,
  "maxValue": 100,
  "minValue": 1,
  "maxX": 100,
  "maxY": 100,
  "maxZ": 100,
  "minX": 0,
  "minY": 0,
  "minZ": 0,
  "name": "example1",
  "vectorData": [
    41,52,73,44,95,66,77,100
  ],
  "vertexData": [0,0,0,
    0,100,0,
    100,100,0,
    ...
  ],
  "indexData": [
    0, 1, 2,2, 3, 0,
    4,7,6,6,5,4,
    ...
  ],
  "edgeData": [
    0, 1, 1, 2, 2, 3, 3, 0,
    4, 7, 7, 6,6, 5, 5, 4,
    ...
  ]
}
```