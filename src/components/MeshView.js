import React, {Component} from "react";
import FEMView from "../webgl/FEMView";
import GLService from "../webgl/GL";

class MeshView extends Component {
  componentDidMount(){
    const canvas = this.refs.canvas;
    GLService.init(canvas);
    this.femView = new FEMView();
    this.femView.init(canvas);
  }
  componentDidUpdate(){
    if(this.props.mesh){
      this.femView.recalibrateCamera(this.props.mesh);
      this.femView.transformationController.zoomSpeed = Math.max(this.props.mesh.maxX - this.props.mesh.minX, this.props.mesh.maxY - this.props.mesh.minY) / 10;
      this.femView.draw(this.props.mesh);
    }
  }
  render(props){
    return (
      <canvas id='cvsFEM' ref="canvas"></canvas>
    )
  }
}

export default MeshView;