import React, {Component} from "react";
import drawLegend from "../drawLegend";

class LegendView extends Component {
  
  componentDidUpdate(){
    if(this.props.palette){
      const canvas = this.refs.canvas;
      const context = canvas.getContext("2d");
      drawLegend(context, this.props.palette, this.props.isInverted);
    }
  }
  render(props){
    return (
      <canvas width='150' height='500' ref="canvas"></canvas>
    )
  }
}

export default LegendView;