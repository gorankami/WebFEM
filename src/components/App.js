import React, { Component } from 'react';
import './App.css';
import SelectPalette from "./SelectPalette";
import LegendView from "./LegendView";
import MeshView from "./MeshView";
import {getPalettes} from "../services/api";
import BtnApplyToMesh from './BtnApplyToMesh';

console.log("TEST");

class App extends Component {
  state = {
    toggleCurtain: false,
    palettes: [],
    selectedPalette: undefined,
    isInverted: false,
    numSteps: 512,
    mesh: undefined
  };
  componentDidMount(){
    getPalettes().then(palettes=>{
      this.setState({palettes, selectedPalette: palettes[0]})
    });
  }

  onPaletteChange = (id)=>{
    this.setState({selectedPalette: this.state.palettes.find(item=>item.id === +id)});
  }
  onStepsChange = (e)=>{
    this.setState({numSteps: e.target.value});
  }

  onInvertedChange = (e) =>{
    this.setState({isInverted: e.target.value});
  }

  
  onApplyToMesh = (mesh, palettes)=>{ 
    this.setState({mesh, palettes});
  }

  render() {
    return (
      <div>
        { this.state.toggleCurtain &&
          <div className="curtain"><p>Downloading model, please wait...</p></div>
        } 
        <div className="tool-panel right">
          <b>Palettes:</b><br/>
          <SelectPalette palettes={this.state.palettes} selectedPalette={this.state.selectedPalette} onPaletteChange={this.onPaletteChange} /><br/>
          Number of steps:<br/>
          <input type="number" value={this.state.numSteps} onChange={this.onStepsChange} /><br/>
          <input type="checkbox" value={this.state.isInverted} onChange={this.onInvertedChange}/>Inverted<br/>
          <LegendView palette={this.state.selectedPalette} isInverted={this.state.isInverted} steps={this.numSteps} /><br/>
          <BtnApplyToMesh data={{...this.state, onApplyToMesh: this.onApplyToMesh}} />
        </div>
        <MeshView mesh={this.state.mesh} />
      </div>
    );
  }
}


export default App;
