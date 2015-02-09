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

/**
 * ShaderProgram is a container of a openGL (WebGL) program with various utilites for creating a shader, using attributes, uniforms and buffers etc
 */


/**
 * ShaderProgram constructor. It creates and builds fragment and vertex shaders right away, then sets up attributes, 
 * uniforms and buffers that can be easily accessed while the program runs
 * @param {String} type - type of shader. For now "Color" and "FEMWireframe" are implemented for the use of a FEM application
 * @type {object} - returns a GL shader program object
 */
ShaderProgram = function ShaderProgram(type) {
    var vertexShader = null;
    var fragmentShader = null;
    var program = GL.createProgram();

    switch (type) {
        case "Colors":
            vertexShader = this.createShader(this.getVertexShaderColorsSource(), GL.VERTEX_SHADER);
            fragmentShader = this.createShader(this.getFragmentShaderColorsSource(), GL.FRAGMENT_SHADER);
            break;
        case "FEMWireframe":
            vertexShader = this.createShader(this.getVertexShaderUniformSource(), GL.VERTEX_SHADER);
            fragmentShader = this.createShader(this.getFragmentShaderUniformSource(), GL.FRAGMENT_SHADER);
            break;
        default:
            return null;
    }

    GL.attachShader(program, vertexShader);
    GL.attachShader(program, fragmentShader);
    GL.linkProgram(program);
    if (!GL.getProgramParameter(program, GL.LINK_STATUS)) {
        alert("Unable to initialize the shader program.");
    }
    GL.useProgram(program);

    program.attributes = {
        position: GL.getAttribLocation(program, "aVertexPosition")
    };
    if (type == "Colors"){
        program.attributes.color = GL.getAttribLocation(program, "aVertexColor");
    }
    
    program.uniforms = {
        mvMatrix: GL.getUniformLocation(program, "uMVMatrix"),
        pMatrix: GL.getUniformLocation(program, "uPMatrix")
    };

    program.buffers = {
        vertex: GL.createBuffer(),
        index: GL.createBuffer()
    };
    if (type == "Colors") {
        program.buffers.color = GL.createBuffer();
    }

    return program;
}

ShaderProgram.prototype = {
    constructor: ShaderProgram,
    program: null,

    /**
     * Creates a shader from source
     * @param {String} src - source code for shader
     * @param {Number} type - enumerated type of shader, can be gl.VERTEX_SHADER or gl.FRAGMENT_SHADER
     * @type {object}
     */
    createShader: function (src, type) {
        //compile the vertex shader
        var shader = GL.createShader(type);
        GL.shaderSource(shader, src);
        GL.compileShader(shader);

        if (!GL.getShaderParameter(shader, GL.COMPILE_STATUS)) {
            alert("Error compiling shader: " + GL.getShaderInfoLog(shader));
        }
        return shader;
    },

    //Color
    /**
     * Retreives a source for vertex shader for colored vertices material
     * @type {String} - source code
     */
    getVertexShaderColorsSource: function () {
        return [
            "attribute vec3 aVertexPosition;",
            "attribute vec3 aVertexColor;",
            "uniform mat4 uMVMatrix;",
            "uniform mat4 uPMatrix;",
            "varying highp vec4 vColor;",
            "void main(void) {",
            "  gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);",
            "  vColor = vec4(aVertexColor, 1.0);",
            "}"
        ].join("\n");
    },

    /**
     * Retreives a source for fragment shader for colored vertices material
     * @type {String} - source code
     */
    getFragmentShaderColorsSource: function () {
        return [
            "varying highp vec4 vColor;",
			"void main(void) {",
            "   gl_FragColor = vColor;",
            "}"
        ].join("\n");
    },

    //FEMWireframe
    /**
     * Retreives a source for vertex shader for wireframed vertices material
     * @type {String} - source code
     */
    getVertexShaderUniformSource: function () {
        return [
            "attribute vec3 aVertexPosition;",
            "uniform mat4 uMVMatrix;",
            "uniform mat4 uPMatrix;",
            "void main(void) {",
            "  gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);",
            "}"
        ].join("\n");
    },
    /**
     * Retreives a source for fragment shader for wireframed vertices material
     * @type {String} - source code
     */
    getFragmentShaderUniformSource: function () {
        return [
			"void main(void) {",
            "   gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);",
            "}"
        ].join("\n");
    }

}
