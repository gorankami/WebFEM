import React from 'react';
import { getMesh } from '../services/api';
import { scalePaletteColorValues, initColorArray, prepareVector } from '../services/utilities';

export default function BtnApplyToMesh(props) {
  return (
    <button class="btn" onClick={()=>applyToMesh(props)}>Apply to mesh</button>
  );
}

function applyToMesh(props){
  getMesh('example1')
    .then(mesh=>{
      if (!mesh.vertexData.length || !mesh.indexData.length || !mesh.vectorData.length){
        alert("Cannot load model.");
        return;
      }

      try { 
        const {selectedPalette, numSteps, isInverted, palettes, onApplyToMesh} = props.data;
        const steps = scalePaletteColorValues(mesh.minValue, mesh.maxValue, selectedPalette.steps);
  
        const colorArray = initColorArray(numSteps, steps, mesh.minValue, mesh.maxValue, isInverted);
        mesh.colorData = prepareVector(mesh, mesh.minValue, mesh.maxValue, colorArray);
        const palettesCopy = palettes.map(item=>{
          if(item === selectedPalette){
            return {...item, steps};
          }else{
            return item;
          }
        });
        onApplyToMesh(mesh, palettesCopy);
      } catch (ex) {
        alert("Error: " + ex.message);
      }
    });
}