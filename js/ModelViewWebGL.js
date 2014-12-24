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

ModelViewWebGL = function (canvas, cmu) {
    this.cmu = cmu;

    this.canvas = canvas;
    this.canvas.width = window.innerWidth - 200;
    this.canvas.height = window.innerHeight - 50;

    this.camera = new Camera(45, this.canvas.width / this.canvas.height, 1, 100.0,
        vec3.create([0, 0, -10]));

    this.shaderProgramColors = new ShaderProgram("Colors");
    this.shaderProgramUniform = new ShaderProgram("FEMWireframe");
    
    this.controls = new GControls(canvas, this.camera);
}

ModelViewWebGL.prototype = {
    canvas: null,
    cmu: null,
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
        var indexData = models[modelId].modelData.indexData;
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
        models[modelId].modelData.indexWFData = indexWFData;
    },

    displayModel: function (modelId, contourId) {
        this.modelLoaded = false;
        var modelData = models[modelId].modelData;
        var contourData = models[modelId].contours[contourId].contourData;

        var minimum = vec3.create([modelData.minimum.x, modelData.minimum.y, modelData.minimum.z]);
        var maximum = vec3.create([modelData.maximum.x, modelData.maximum.y, modelData.maximum.z]);
        this.center = vec3.subtract(maximum,minimum);
        this.minValue = contourData.minValue;
        this.maxValue = contourData.maxValue;
        this.cmu.reset(contourData.minValue, contourData.maxValue);

        if (!modelData.indexWFData) {
            this.generateIndexWFData(modelId);
        }

        //colors
        gl.useProgram(this.shaderProgramColors);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.shaderProgramColors.buffers.vertex);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(modelData.vertexData), gl.DYNAMIC_DRAW);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.shaderProgramColors.buffers.index);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(modelData.indexData), gl.DYNAMIC_DRAW);
        this.shaderProgramColors.buffers.index.arrayLength = modelData.indexData.length;

        gl.bindBuffer(gl.ARRAY_BUFFER, this.shaderProgramColors.buffers.color);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.convertValuesToColors(contourData.valueData)), gl.DYNAMIC_DRAW);

        //uniform
        gl.useProgram(this.shaderProgramUniform);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.shaderProgramUniform.buffers.vertex);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(modelData.vertexData), gl.DYNAMIC_DRAW);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.shaderProgramUniform.buffers.index);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(modelData.indexWFData), gl.DYNAMIC_DRAW);
        this.shaderProgramUniform.buffers.index.arrayLength = modelData.indexWFData.length;

        this.modelLoaded = true;
    },

    convertValuesToColors: function (values) {
        var colors = [];
        for (var i = 0; i < values.length; i++) {
            var color = this.cmu.getColorFromArray(values[i]);
            colors[3 * i] = color.r;
            colors[3 * i + 1] = color.g;
            colors[3 * i + 2] = color.b;
        }
        return colors;
    },

    clearScene: function (modelLoaded) {
        gl.clearColor(0, 0, 0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.enable(gl.DEPTH_TEST);
    
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
            gl.viewport(0, 0, this.canvas.width, this.canvas.height);
            
            //apply transformations
            var transformationMatrix = mat4.create();
            mat4.translate(this.camera.mvMatrix, this.controls.position, transformationMatrix);
            mat4.rotate(transformationMatrix, this.controls.rotation[0], [1.0, 0.0, 0.0]);
            mat4.rotate(transformationMatrix, this.controls.rotation[1], [0.0, 1.0, 0.0]);

            //COLORS
            gl.useProgram(this.shaderProgramColors);
            //Set matrix uniforms
            gl.uniformMatrix4fv(this.shaderProgramColors.uniforms.pMatrix, false, this.camera.pMatrix);
            gl.uniformMatrix4fv(this.shaderProgramColors.uniforms.mvMatrix, false, transformationMatrix);

            //Draw
            gl.enableVertexAttribArray(this.shaderProgramColors.attributes.position);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.shaderProgramColors.buffers.vertex);
            gl.vertexAttribPointer(this.shaderProgramColors.attributes.position, 3, gl.FLOAT, false, 0, 0);


            gl.enableVertexAttribArray(this.shaderProgramColors.attributes.color);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.shaderProgramColors.buffers.color);
            gl.vertexAttribPointer(this.shaderProgramColors.attributes.color, 3, gl.FLOAT, false, 0, 0);

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.shaderProgramColors.buffers.index);

            gl.polygonOffset(2.0, 2.0);
            gl.enable(gl.POLYGON_OFFSET_FILL);
            gl.drawElements(gl.TRIANGLES, this.shaderProgramColors.buffers.index.arrayLength, gl.UNSIGNED_SHORT, 0);
            gl.disable(gl.POLYGON_OFFSET_FILL);
            gl.flush();

            //WIREFRAME
            gl.useProgram(this.shaderProgramUniform);
            //Set matrix uniforms
            gl.uniformMatrix4fv(this.shaderProgramUniform.uniforms.pMatrix, false, this.camera.pMatrix);
            gl.uniformMatrix4fv(this.shaderProgramUniform.uniforms.mvMatrix, false, transformationMatrix);

            //Draw
            gl.enableVertexAttribArray(this.shaderProgramUniform.attributes.position);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.shaderProgramUniform.buffers.vertex);
            gl.vertexAttribPointer(this.shaderProgramUniform.attributes.position, 3, gl.FLOAT, false, 0, 0);

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.shaderProgramUniform.buffers.index);

            gl.drawElements(gl.LINES, this.shaderProgramUniform.buffers.index.arrayLength, gl.UNSIGNED_SHORT, 0);
            gl.flush();
        }
    },

    resetTransformations: function () {
        this.mesh.rotation = this.mesh.position = { x: 0, y: 0, z: 0 };
    }
}