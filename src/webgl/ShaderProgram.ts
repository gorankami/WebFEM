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

import { getRenderingContext } from "./GL";

export const createShader = function (srcVertex: string, srcFragment: string): WebGLProgram {
  const renderingContext: WebGL2RenderingContext = getRenderingContext();

  //compile the vertex shader
  const vertexShader = renderingContext.createShader(
    renderingContext.VERTEX_SHADER
  );
  if (!vertexShader) throw new Error("Failed to create vertex shader");
  renderingContext.shaderSource(vertexShader, srcVertex);
  renderingContext.compileShader(vertexShader);
  if (
    !renderingContext.getShaderParameter(
      vertexShader,
      renderingContext.COMPILE_STATUS
    )
  ) {
    alert(
      "Error compiling shader: " +
        renderingContext.getShaderInfoLog(vertexShader)
    );
  }

  const fragmentShader = renderingContext.createShader(
    renderingContext.FRAGMENT_SHADER
  );
  if (!fragmentShader) throw new Error("Failed to create fragment shader");
  renderingContext.shaderSource(fragmentShader, srcFragment);
  renderingContext.compileShader(fragmentShader);
  if (
    !renderingContext.getShaderParameter(
      fragmentShader,
      renderingContext.COMPILE_STATUS
    )
  ) {
    throw new Error(
      "Error compiling shader: " +
        renderingContext.getShaderInfoLog(fragmentShader)
    );
  }

  const program = renderingContext.createProgram();
  if (!program) throw new Error("Failed to create renderingContext program");
  renderingContext.attachShader(program, vertexShader);
  renderingContext.attachShader(program, fragmentShader);
  renderingContext.linkProgram(program);
  if (
    !renderingContext.getProgramParameter(program, renderingContext.LINK_STATUS)
  ) {
    throw new Error("Unable to initialize the shader program.");
  }
  return program;
};
