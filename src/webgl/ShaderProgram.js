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

import GLService from './GL';

export const createShader = function (srcVertex, srcFragment) {
  const GL = GLService.context;

  //compile the vertex shader
  const vertexShader = GL.createShader(GL.VERTEX_SHADER);
  GL.shaderSource(vertexShader, srcVertex);
  GL.compileShader(vertexShader);
  if (!GL.getShaderParameter(vertexShader, GL.COMPILE_STATUS)) {
    alert("Error compiling shader: " + GL.getShaderInfoLog(vertexShader));
  }

  const fragmentShader = GL.createShader(GL.FRAGMENT_SHADER);
  GL.shaderSource(fragmentShader, srcFragment);
  GL.compileShader(fragmentShader);
  if (!GL.getShaderParameter(fragmentShader, GL.COMPILE_STATUS)) {
    alert("Error compiling shader: " + GL.getShaderInfoLog(fragmentShader));
  }

  const program = GL.createProgram();
  GL.attachShader(program, vertexShader);
  GL.attachShader(program, fragmentShader);
  GL.linkProgram(program);
  if (!GL.getProgramParameter(program, GL.LINK_STATUS)) {
    alert("Unable to initialize the shader program.");
    return;
  }
  return program;
};
