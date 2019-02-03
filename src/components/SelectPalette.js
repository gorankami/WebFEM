import React from 'react';

//in:
  //palettes
  //selectedPalette
//out:
  //onPaletteChange

export default function (props){
  if(props.palettes && props.palettes.length){ 
      const options = props.palettes.map(item=>{
        return  (
          <option value={item.id} selected={props.selectedPalette && props.selectedPalette.id === item.id}>
              {item.name}
          </option>
        );
      });
      return (
        <select onChange={(e)=>props.onPaletteChange(e.target.value)}>
          {options}
        </select>
      );
  }
  return <select></select>
}
