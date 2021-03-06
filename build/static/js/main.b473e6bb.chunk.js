(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{13:function(t,e,i){t.exports=i(25)},19:function(t,e,i){},21:function(t,e,i){},25:function(t,e,i){"use strict";i.r(e);var n=i(0),a=i.n(n),r=i(11),o=i.n(r),s=(i(19),i(7)),h=i(1),l=i(2),u=i(5),c=i(4),m=i(6),f=(i(21),function(t){if(t.palettes&&t.palettes.length){var e=t.palettes.map(function(e){return a.a.createElement("option",{value:e.id,selected:t.selectedPalette&&t.selectedPalette.id===e.id},e.name)});return a.a.createElement("select",{onChange:function(e){return t.onPaletteChange(e.target.value)}},e)}return a.a.createElement("select",null)}),v=function(t){function e(){return Object(h.a)(this,e),Object(u.a)(this,Object(c.a)(e).apply(this,arguments))}return Object(m.a)(e,t),Object(l.a)(e,[{key:"componentDidUpdate",value:function(){this.props.palette&&function(t,e,i){var n=e.steps.length,a=i?t.createLinearGradient(0,25,0,475):t.createLinearGradient(0,475,0,25),r=1/(n-1).toFixed(2),o=451/(n-1).toFixed(2);t.fillStyle="Black",t.fillRect(0,0,150,500),t.strokeStyle="White";for(var s=0;s<n;s++)a.addColorStop(s*r,e.steps[s].color.getStyle());t.fillStyle=a,t.fillRect(25,25,50,450),t.beginPath(),t.moveTo(24.5,24.5),t.lineTo(75.5,24.5),t.lineTo(75.5,475.5),t.lineTo(24.5,475.5),t.lineTo(24.5,24.5),t.stroke(),t.beginPath(),t.font="10px Verdana",t.fillStyle="White";for(var h=0;h<n;h++){var l=Math.round(25+o*(n-1-h))-.5;t.moveTo(69.5,l),t.lineTo(80.5,l),t.fillText(e.steps[h].scaledVal?e.steps[h].scaledVal.toFixed(4):0,85,l+4)}t.stroke()}(this.refs.canvas.getContext("2d"),this.props.palette,this.props.isInverted)}},{key:"render",value:function(t){return a.a.createElement("canvas",{width:"150",height:"500",ref:"canvas"})}}]),e}(n.Component),d=i(9),p=i.n(d),g=i(12),x=i.n(g),E=i(3),M=i.n(E),b=function(){function t(e,i,n,a,r){Object(h.a)(this,t),this.verFoV=e,this.horFoV=e*i,this.aspect=i,this.pMatrix=M.a.create(),this.mvMatrix=M.a.create(),M.a.identity(this.mvMatrix),this.recalibrate(n,a,r,[0,0,0])}return Object(l.a)(t,[{key:"changePerspective",value:function(t,e){this.aspect=t/e,M.a.perspective(this.pMatrix,this.verFoV,this.aspect,this.nearPlane,this.farPlane),this.horFoV=this.verFoV*this.aspect}},{key:"recalibrate",value:function(t,e,i,n){this.position=i,this.pivot=n,this.nearPlane=t,this.farPlane=e,M.a.perspective(this.pMatrix,this.verFoV,this.aspect,t,e)}},{key:"getClickVectorHorizontal",value:function(t,e,i){var n=t*this.horFoV/2,a=e*this.verFoV/2;n*=Math.PI/180,a*=Math.PI/180;var r=this.nearPlane*Math.sin(n)/Math.cos(n),o=-this.nearPlane*Math.sin(a)/Math.cos(a);return[r*(-this.position[2]-i),o*(-this.position[2]-i)]}}]),t}(),P={context:null,init:function(t){try{P.context=t.getContext("webgl")||t.getContext("experimental-webgl"),P.context||alert("Your browser does not support Webgl, the application will not work.")}catch(e){alert("Error in retrieving WebGL, your browser might not support Webgl.")}}};var F=P,w=function(t,e){var i=F.context,n=i.createShader(i.VERTEX_SHADER);i.shaderSource(n,t),i.compileShader(n),i.getShaderParameter(n,i.COMPILE_STATUS)||alert("Error compiling shader: "+i.getShaderInfoLog(n));var a=i.createShader(i.FRAGMENT_SHADER);i.shaderSource(a,e),i.compileShader(a),i.getShaderParameter(a,i.COMPILE_STATUS)||alert("Error compiling shader: "+i.getShaderInfoLog(a));var r=i.createProgram();if(i.attachShader(r,n),i.attachShader(r,a),i.linkProgram(r),i.getProgramParameter(r,i.LINK_STATUS))return r;alert("Unable to initialize the shader program.")},A="\n  varying lowp vec4 vColor;\n  varying highp float vPosX;\n  void main(void) {\n    gl_FragColor = vColor;\n  }\n  ",S="\n  attribute vec3 aVertexPosition;\n  attribute vec3 aVertexColor;\n  uniform mat4 uMVMatrix;\n  uniform mat4 uPMatrix;\n  varying lowp vec4 vColor;\n  varying highp float vPosX;\n  void main(void) {\n    vPosX = vec4(aVertexPosition , 1.0)[0];\n    gl_Position = uPMatrix * (uMVMatrix * vec4(aVertexPosition, 1.0));\n    vColor = vec4(aVertexColor, 1.0);\n  }\n",y=function(){function t(){Object(h.a)(this,t),this.program=null,this.aVertexPosition=null,this.aVertexColor=null,this.uMVMatrix=null,this.uPMatrix=null,this.vertexBuffer=null,this.indexBuffer=null,this.colorBuffer=null,this.enabled=!0;var e=F.context;this.program=w(S,A),e.useProgram(this.program),this.aVertexPosition=e.getAttribLocation(this.program,"aVertexPosition"),this.aVertexColor=e.getAttribLocation(this.program,"aVertexColor"),this.uMVMatrix=e.getUniformLocation(this.program,"uMVMatrix"),this.uPMatrix=e.getUniformLocation(this.program,"uPMatrix"),this.vertexBuffer=e.createBuffer(),this.indexBuffer=e.createBuffer(),this.colorBuffer=e.createBuffer()}return Object(l.a)(t,[{key:"prepareProgram",value:function(t){var e=F.context;e.useProgram(this.program),e.bindBuffer(e.ARRAY_BUFFER,this.vertexBuffer),e.bufferData(e.ARRAY_BUFFER,new Float32Array(t.vertexData),e.DYNAMIC_DRAW),e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,this.indexBuffer),e.bufferData(e.ELEMENT_ARRAY_BUFFER,new Uint16Array(t.indexData),e.DYNAMIC_DRAW),this.indexBuffer.arrayLength=t.indexData.length,e.bindBuffer(e.ARRAY_BUFFER,this.colorBuffer),e.bufferData(e.ARRAY_BUFFER,new Float32Array(t.colorData),e.DYNAMIC_DRAW)}},{key:"render",value:function(t,e){var i=F.context;i.useProgram(this.program),i.uniformMatrix4fv(this.uPMatrix,!1,t),i.uniformMatrix4fv(this.uMVMatrix,!1,e),i.enableVertexAttribArray(this.aVertexPosition),i.bindBuffer(i.ARRAY_BUFFER,this.vertexBuffer),i.vertexAttribPointer(this.aVertexPosition,3,i.FLOAT,!1,0,0),i.enableVertexAttribArray(this.aVertexColor),i.bindBuffer(i.ARRAY_BUFFER,this.colorBuffer),i.vertexAttribPointer(this.aVertexColor,3,i.FLOAT,!1,0,0),i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,this.indexBuffer),i.polygonOffset(2,2),i.enable(i.POLYGON_OFFSET_FILL),i.drawElements(i.TRIANGLES,this.indexBuffer.arrayLength,i.UNSIGNED_SHORT,0),i.disable(i.POLYGON_OFFSET_FILL),i.flush()}}]),t}(),R="\n  void main(void) {\n    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);\n  }\n  ",V="\n  attribute vec3 aVertexPosition;\n  uniform mat4 uMVMatrix;\n  uniform mat4 uPMatrix;\n  varying highp float vPosX;\n  void main(void) {\n    vPosX = vec4(aVertexPosition , 1.0)[0];\n    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);\n  }\n",C=function(){function t(){Object(h.a)(this,t),this.aVertexPosition=null,this.uMVMatrix=null,this.uPMatrix=null,this.vertexBuffer=null,this.indexBuffer=null,this.enabled=!0;var e=F.context;this.program=w(V,R),e.useProgram(this.program),this.aVertexPosition=e.getAttribLocation(this.program,"aVertexPosition"),this.uMVMatrix=e.getUniformLocation(this.program,"uMVMatrix"),this.uPMatrix=e.getUniformLocation(this.program,"uPMatrix"),this.vertexBuffer=e.createBuffer(),this.indexBuffer=e.createBuffer()}return Object(l.a)(t,[{key:"prepareProgram",value:function(t){var e=F.context;e.useProgram(this.program),e.bindBuffer(e.ARRAY_BUFFER,this.vertexBuffer),e.bufferData(e.ARRAY_BUFFER,new Float32Array(t.vertexData),e.DYNAMIC_DRAW),e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,this.indexBuffer),e.bufferData(e.ELEMENT_ARRAY_BUFFER,new Uint16Array(t.edgeData),e.DYNAMIC_DRAW),this.indexBuffer.arrayLength=t.edgeData.length}},{key:"render",value:function(t,e){var i=F.context;i.useProgram(this.program),i.uniformMatrix4fv(this.uPMatrix,!1,t),i.uniformMatrix4fv(this.uMVMatrix,!1,e),i.enableVertexAttribArray(this.aVertexPosition),i.bindBuffer(i.ARRAY_BUFFER,this.vertexBuffer),i.vertexAttribPointer(this.aVertexPosition,3,i.FLOAT,!1,0,0),i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,this.indexBuffer),i.drawElements(i.LINES,this.indexBuffer.arrayLength,i.UNSIGNED_SHORT,0),i.flush()}}]),t}(),B=function(){function t(){Object(h.a)(this,t),this.modelLoaded=!1,this.meshColoured=new y,this.meshWireframe=new C}return Object(l.a)(t,[{key:"prepare",value:function(t){this.modelLoaded=!1;var e=[];this.meshColoured.prepareProgram(t,null,e),this.meshWireframe.prepareProgram(t,null,e),this.modelLoaded=!0}},{key:"render",value:function(t,e,i,n,a){var r=F.context;if(function(){var t=F.context;t.clearColor(0,0,0,1),t.clear(t.COLOR_BUFFER_BIT|t.DEPTH_BUFFER_BIT),t.enable(t.DEPTH_TEST)}(),this.modelLoaded){r.viewport(0,0,e,i);var o=M.a.create(t.mvMatrix);M.a.translate(o,o,t.position),M.a.translate(o,o,[n[0]/10,n[1]/10,n[2]],o),M.a.translate(o,o,t.pivot),M.a.rotateX(o,o,a[0]),M.a.rotateY(o,o,a[1]),M.a.translate(o,o,[-t.pivot[0],-t.pivot[1],-t.pivot[2]]),this.meshColoured.render(t.pMatrix,o),this.meshWireframe.render(t.pMatrix,o)}}}]),t}();var L=function(){function t(e,i){Object(h.a)(this,t),this.rotation=null,this.position=null,this.mouseS=null,this.rotS=null,this.panS=null,this.mouse=null,this.rot=null,this.pan=null,this.zoom=0,this.rotationSensitivity=.01,this.zoomSpeed=1,this.rotationMomentum=1,this.canvas=e,this.camera=i,this.reset()}return Object(l.a)(t,[{key:"update",value:function(){this.rotation[0]+=(this.rot[1]-this.rotation[0])*this.rotationMomentum,this.rotation[1]+=(this.rot[0]-this.rotation[1])*this.rotationMomentum,this.position[0]=this.pan[0]-this.panS[0],this.position[1]=this.pan[1]-this.panS[1],this.position[2]=this.zoom}},{key:"startPan",value:function(t){var e=(t[0]-this.canvas.width/2)/(this.canvas.width/2),i=(t[1]-this.canvas.height/2)/(this.canvas.height/2);this.panS=this.camera.getClickVectorHorizontal(e,i,this.position[2]),this.pan=[this.panS[0],this.panS[1]],this.panS[0]-=this.position[0],this.panS[1]-=this.position[1]}},{key:"doPan",value:function(t){var e=(t[0]-this.canvas.width/2)/(this.canvas.width/2),i=(t[1]-this.canvas.height/2)/(this.canvas.height/2);this.pan=this.camera.getClickVectorHorizontal(e,i,this.position[2])}},{key:"startRotate",value:function(t){this.mouseS=t,this.rotS[0]=this.rot[0],this.rotS[1]=this.rot[1]}},{key:"doRotate",value:function(t){this.mouse=t,this.rot[1]=this.rot[1]+this.mouse[1]-this.mouseS[1],this.rot[1]*=this.rotationSensitivity,this.rot[1]+=this.rotS[1],this.rot[1]=k(this.rot[1]),this.rot[0]=this.rot[0]+this.mouse[0]-this.mouseS[0],this.rot[0]*=this.rotationSensitivity,this.rot[0]+=this.rotS[0],this.rot[0]=k(this.rot[0])}},{key:"doZoom",value:function(t){t>0?this.zoom+=this.zoomSpeed:this.zoom-=this.zoomSpeed}},{key:"reset",value:function(){this.rotation=[0,0,0],this.position=[0,0,0],this.startPos=[0,0],this.mouseS=[0,0],this.rotS=[0,0],this.panS=[0,0],this.mouse=[0,0],this.rot=[0,0],this.pan=[0,0],this.zoom=0}}]),t}();function k(t){return t>=2*Math.PI?t-2*Math.PI:t<=2*-Math.PI?t+2*Math.PI:t}var O=function(){function t(){Object(h.a)(this,t)}return Object(l.a)(t,[{key:"init",value:function(t){this.cvsFEM=t,this.camera=new b(45,this.cvsFEM.width/this.cvsFEM.height,1,100,x.a.create([0,0,-10])),this.transformationController=new L(this.cvsFEM,this.camera),this.renderer=new B,this.resize(window.innerWidth,window.innerHeight),this.initEvents(),this.animate()}},{key:"initEvents",value:function(){p()(window).resize(function(){this.resize(p()(document).width(),p()(document).height())}.bind(this)),this.cvsFEM.addEventListener("contextmenu",function(t){t.preventDefault()});var t=this,e=function(e){e.preventDefault();var i=t.cvsFEM.getBoundingClientRect(),n=[e.clientX-i.left,e.clientY-i.top];1===e.buttons?t.transformationController.doRotate(n):2===e.buttons&&t.transformationController.doPan(n),requestAnimationFrame(t.animate.bind(t),t.cvsFEM)},i=function i(){t.cvsFEM.removeEventListener("mousemove",e,!1),t.cvsFEM.removeEventListener("mouseup",i,!1),t.cvsFEM.removeEventListener("mouseout",i,!1),requestAnimationFrame(t.animate.bind(t),t.cvsFEM)},n=function(e){e.preventDefault(),e.stopPropagation(),void 0!==e.wheelDelta?t.transformationController.doZoom(e.wheelDelta):void 0!==e.detail&&t.transformationController.doZoom(-e.detail),requestAnimationFrame(t.animate.bind(t),t.cvsFEM)};this.cvsFEM.addEventListener("mousedown",function(n){n.preventDefault();var a=t.cvsFEM.getBoundingClientRect(),r=[n.clientX-a.left,n.clientY-a.top];1===n.buttons?t.transformationController.startRotate(r):2===n.buttons&&t.transformationController.startPan(r),t.cvsFEM.addEventListener("mousemove",e,!1),t.cvsFEM.addEventListener("mouseup",i,!1),t.cvsFEM.addEventListener("mouseout",i,!1),requestAnimationFrame(t.animate.bind(t),t.cvsFEM)},!1),this.cvsFEM.addEventListener("mousewheel",n,!1),this.cvsFEM.addEventListener("DOMMouseScroll",n,!1)}},{key:"resize",value:function(t,e){this.cvsFEM.width=t,this.cvsFEM.height=e,this.transformationController.camera.changePerspective(t,e),requestAnimationFrame(this.animate.bind(this),this.cvsFEM)}},{key:"draw",value:function(t,e){this.renderer.prepare(t,e),requestAnimationFrame(this.animate.bind(this),this.cvsFEM)}},{key:"unload",value:function(){this.renderer.modelLoaded=!1}},{key:"animate",value:function(){this.transformationController.update(),this.renderer.render(this.transformationController.camera,this.cvsFEM.width,this.cvsFEM.height,this.transformationController.position,this.transformationController.rotation)}},{key:"recalibrateCamera",value:function(t){var e=Math.max(t.maxX-t.minX,t.maxY-t.minY),i=[-t.maxX+(t.maxX-t.minX)/2,-t.maxY+(t.maxY-t.minY)/2,t.minZ-2*e],n=[t.maxX-(t.maxX-t.minX)/2,t.maxY-(t.maxY-t.minY)/2,t.maxZ-(t.maxZ-t.minZ)/2],a=e/100,r=10*e;this.camera.recalibrate(a,r,i,n),this.zoomSpeed=e/10}}]),t}(),D=function(t){function e(){return Object(h.a)(this,e),Object(u.a)(this,Object(c.a)(e).apply(this,arguments))}return Object(m.a)(e,t),Object(l.a)(e,[{key:"componentDidMount",value:function(){var t=this.refs.canvas;F.init(t),this.femView=new O,this.femView.init(t)}},{key:"componentDidUpdate",value:function(){this.props.mesh&&(this.femView.recalibrateCamera(this.props.mesh),this.femView.transformationController.zoomSpeed=Math.max(this.props.mesh.maxX-this.props.mesh.minX,this.props.mesh.maxY-this.props.mesh.minY)/10,this.femView.draw(this.props.mesh))}},{key:"render",value:function(t){return a.a.createElement("canvas",{id:"cvsFEM",ref:"canvas"})}}]),e}(n.Component);window.THREE={},i(23);var _=window.THREE.Color;i(24);function T(){return fetch("https://s3-eu-west-1.amazonaws.com/monolit-studio/webfem/palettes.json").then(j).then(Y)}function Y(t){return t.forEach(function(t){t.steps.forEach(function(t){t.color=new _(t.color[0],t.color[1],t.color[2])})}),t}function I(t){return fetch("https://s3-eu-west-1.amazonaws.com/monolit-studio/webfem/example1.json").then(j)}function j(t){if(t.ok)return t.json();throw new Error("Network response was not ok.")}function U(t,e,i,n){for(var a=[],r=0;r<t.vectorData.length;r++){var o=z(t.vectorData[r],e,i,n);a[3*r]=o?o.r:0,a[3*r+1]=o?o.g:0,a[3*r+2]=o?o.b:0}return a}function N(t,e,i,n,a){if(n-i===0)return[new _(0)];for(var r=[],o=(n-i)/(t||1024),s=i;s<=n;s+=o)for(var h=0;h<e.length-1;h++)if(s>=e[h].scaledVal&&s<e[h+1].scaledVal){var l=e[h].scaledVal,u=e[h+1].scaledVal,c=new _(16777215).setHex("0x"+e[h].color.getHexString()),m=new _(16777215).setHex("0x"+e[h+1].color.getHexString()),f=c.lerp(m,(s-l)/(u-l));a?r.unshift(f):r.push(f)}return r}function z(t,e,i,n){t=t<=e||e===i?e:t>=i?i:(t-e)/(i-e);var a=Math.round(t*n.length);return a===n.length&&(a-=1),n[a]}function X(t,e,i){for(var n=[],a=0;a<i.length;a++)n.push(Object(s.a)({},i[a],{scaledVal:t+a*(e-t)/(i.length-1)}));return n}function H(t){return a.a.createElement("button",{class:"btn",onClick:function(){return function(t){I().then(function(e){if(e.vertexData.length&&e.indexData.length&&e.vectorData.length)try{var i=t.data,n=i.selectedPalette,a=i.numSteps,r=i.isInverted,o=i.palettes,h=i.onApplyToMesh,l=X(e.minValue,e.maxValue,n.steps),u=N(a,l,e.minValue,e.maxValue,r);e.colorData=U(e,e.minValue,e.maxValue,u);var c=o.map(function(t){return t===n?Object(s.a)({},t,{steps:l}):t});h(e,c)}catch(m){alert("Error: "+m.message)}else alert("Cannot load model.")})}(t)}},"Apply to mesh")}var W=function(t){function e(){var t,i;Object(h.a)(this,e);for(var n=arguments.length,a=new Array(n),r=0;r<n;r++)a[r]=arguments[r];return(i=Object(u.a)(this,(t=Object(c.a)(e)).call.apply(t,[this].concat(a)))).state={toggleCurtain:!1,palettes:[],selectedPalette:void 0,isInverted:!1,numSteps:512,mesh:void 0},i.onPaletteChange=function(t){i.setState({selectedPalette:i.state.palettes.find(function(e){return e.id===+t})})},i.onStepsChange=function(t){i.setState({numSteps:t.target.value})},i.onInvertedChange=function(t){i.setState({isInverted:t.target.value})},i.onApplyToMesh=function(t,e){i.setState({mesh:t,palettes:e})},i}return Object(m.a)(e,t),Object(l.a)(e,[{key:"componentDidMount",value:function(){var t=this;T().then(function(e){t.setState({palettes:e,selectedPalette:e[0]})})}},{key:"render",value:function(){return a.a.createElement("div",null,this.state.toggleCurtain&&a.a.createElement("div",{className:"curtain"},a.a.createElement("p",null,"Downloading model, please wait...")),a.a.createElement("div",{className:"tool-panel right"},a.a.createElement("b",null,"Palettes:"),a.a.createElement("br",null),a.a.createElement(f,{palettes:this.state.palettes,selectedPalette:this.state.selectedPalette,onPaletteChange:this.onPaletteChange}),a.a.createElement("br",null),"Number of steps:",a.a.createElement("br",null),a.a.createElement("input",{type:"number",value:this.state.numSteps,onChange:this.onStepsChange}),a.a.createElement("br",null),a.a.createElement("input",{type:"checkbox",value:this.state.isInverted,onChange:this.onInvertedChange}),"Inverted",a.a.createElement("br",null),a.a.createElement(v,{palette:this.state.selectedPalette,isInverted:this.state.isInverted,steps:this.numSteps}),a.a.createElement("br",null),a.a.createElement(H,{data:Object(s.a)({},this.state,{onApplyToMesh:this.onApplyToMesh})})),a.a.createElement(D,{mesh:this.state.mesh}))}}]),e}(n.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));o.a.render(a.a.createElement(W,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(t){t.unregister()})}},[[13,2,1]]]);
//# sourceMappingURL=main.b473e6bb.chunk.js.map