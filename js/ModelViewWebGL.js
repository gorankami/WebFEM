/**
    Copyright 2014 Goran Antic

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/

ModelViewWebGL = function (canvas) {
    this.canvas = canvas;

    this.camera = new Camera(45, this.canvas.width / this.canvas.height, 1, 100.0,
        vec3.create([0, 0, -10]));

    this.shaderProgramColors = new ShaderProgram("Colors");
    this.shaderProgramUniform = new ShaderProgram("FEMWireframe");
    
    this.controls = new GControls(canvas, this.camera);
}

ModelViewWebGL.prototype = {
    canvas: null,
    controls: null,
    shaderProgramColors: null,
    shaderProgramUniform: null,

    mesh: null,
    modelLoaded: false,

    constructor: ModelViewWebGL,
    
    start: function () {
        this.animate();
    },

    resize: function (width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
        this.camera.changePerspective(width,height);
    },

    generateIndexWFData: function(modelId){
        var indexData = models[modelId].indexData;
        var indexWFData = [];
        for (var i = 0; i < indexData.length; i += 6) {
            indexWFData.push(
                indexData[i],
                indexData[i + 1],
                indexData[i + 1],
                indexData[i + 2],
                indexData[i + 3],
                indexData[i + 4],
                indexData[i + 4],
                indexData[i + 5]
            );
        }
        models[modelId].indexWFData = indexWFData;
    },

    displayModel: function (modelId, contourId) {
        this.modelLoaded = false;
        var modelData = models[modelId];
        var contourData = models[modelId].contours[contourId];

        var minimum = vec3.create([modelData.minX, modelData.minY, modelData.minZ]);
        var maximum = vec3.create([modelData.maxX, modelData.maxY, modelData.maxZ]);
        this.center = vec3.subtract(maximum,minimum);
        this.minValue = contourData.minValue;
        this.maxValue = contourData.maxValue;
        CMU.reset(contourData.minValue, contourData.maxValue);

        if (!modelData.indexWFData) {
            this.generateIndexWFData(modelId);
        }

        //colors
        GL.useProgram(this.shaderProgramColors);
        GL.bindBuffer(GL.ARRAY_BUFFER, this.shaderProgramColors.buffers.vertex);
        GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(modelData.vertexData), GL.DYNAMIC_DRAW);

        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.shaderProgramColors.buffers.index);
        GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(modelData.indexData), GL.DYNAMIC_DRAW);
        this.shaderProgramColors.buffers.index.arrayLength = modelData.indexData.length;

        GL.bindBuffer(GL.ARRAY_BUFFER, this.shaderProgramColors.buffers.color);
        GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(this.convertValuesToColors(contourData.valueData)), GL.DYNAMIC_DRAW);

        //uniform
        GL.useProgram(this.shaderProgramUniform);
        GL.bindBuffer(GL.ARRAY_BUFFER, this.shaderProgramUniform.buffers.vertex);
        GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(modelData.vertexData), GL.DYNAMIC_DRAW);
        
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.shaderProgramUniform.buffers.index);
        GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(modelData.indexWFData), GL.DYNAMIC_DRAW);
        this.shaderProgramUniform.buffers.index.arrayLength = modelData.indexWFData.length;

        this.modelLoaded = true;
    },

    convertValuesToColors: function (values) {
        var colors = [];
        for (var i = 0; i < values.length; i++) {
            var color = CMU.getColorFromArray(values[i]);
            colors[3 * i] = color.r;
            colors[3 * i + 1] = color.g;
            colors[3 * i + 2] = color.b;
        }
        return colors;
    },

    clearScene: function (modelLoaded) {
        GL.clearColor(0, 0, 0, 1.0);
        GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);
        GL.enable(GL.DEPTH_TEST);
    
        if (modelLoaded === true){
            this.modelLoaded = true;
        }
        else{
            this.modelLoaded = false;
        }
    },

    animate: function () {
        requestAnimationFrame(bind(this, this.animate), this.canvas);
        this.controls.update();
        this.render();
    },

    render: function () {
        this.clearScene(this.modelLoaded);
        if (this.modelLoaded) {
            GL.viewport(0, 0, this.canvas.width, this.canvas.height);
            
            //apply transformations
            var transformationMatrix = mat4.create();
            mat4.translate(this.camera.mvMatrix, this.controls.position, transformationMatrix);
            mat4.rotate(transformationMatrix, this.controls.rotation[0], [1.0, 0.0, 0.0]);
            mat4.rotate(transformationMatrix, this.controls.rotation[1], [0.0, 1.0, 0.0]);

            //COLORS
            GL.useProgram(this.shaderProgramColors);
            //Set matrix uniforms
            GL.uniformMatrix4fv(this.shaderProgramColors.uniforms.pMatrix, false, this.camera.pMatrix);
            GL.uniformMatrix4fv(this.shaderProgramColors.uniforms.mvMatrix, false, transformationMatrix);

            //Draw
            GL.enableVertexAttribArray(this.shaderProgramColors.attributes.position);
            GL.bindBuffer(GL.ARRAY_BUFFER, this.shaderProgramColors.buffers.vertex);
            GL.vertexAttribPointer(this.shaderProgramColors.attributes.position, 3, GL.FLOAT, false, 0, 0);
            
            
            GL.enableVertexAttribArray(this.shaderProgramColors.attributes.color);
            GL.bindBuffer(GL.ARRAY_BUFFER, this.shaderProgramColors.buffers.color);
            GL.vertexAttribPointer(this.shaderProgramColors.attributes.color, 3, GL.FLOAT, false, 0, 0);
            
            GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.shaderProgramColors.buffers.index);
            
            GL.polygonOffset(2.0, 2.0);
            GL.enable(GL.POLYGON_OFFSET_FILL);
            GL.drawElements(GL.TRIANGLES, this.shaderProgramColors.buffers.index.arrayLength, GL.UNSIGNED_SHORT, 0);
            GL.disable(GL.POLYGON_OFFSET_FILL);
            GL.flush();

            //WIREFRAME
            GL.useProgram(this.shaderProgramUniform);
            //Set matrix uniforms
            GL.uniformMatrix4fv(this.shaderProgramUniform.uniforms.pMatrix, false, this.camera.pMatrix);
            GL.uniformMatrix4fv(this.shaderProgramUniform.uniforms.mvMatrix, false, transformationMatrix);

            //Draw
            GL.enableVertexAttribArray(this.shaderProgramUniform.attributes.position);
            GL.bindBuffer(GL.ARRAY_BUFFER, this.shaderProgramUniform.buffers.vertex);
            GL.vertexAttribPointer(this.shaderProgramUniform.attributes.position, 3, GL.FLOAT, false, 0, 0);
            
            GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.shaderProgramUniform.buffers.index);
            
            GL.drawElements(GL.LINES, this.shaderProgramUniform.buffers.index.arrayLength, GL.UNSIGNED_SHORT, 0);
            GL.flush();
        }
    },

    resetTransformations: function () {
        this.mesh.rotation = this.mesh.position = { x: 0, y: 0, z: 0 };
    }
}