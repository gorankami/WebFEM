let renderingContext: WebGL2RenderingContext;

export function init(canvas: HTMLCanvasElement) {
  try {
    renderingContext = (canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl")) as WebGL2RenderingContext;
    if (!renderingContext) {
      throw new Error(
        "Your browser does not support Webgl, the application will not work."
      );
    }
  } catch (e) {
    alert("Error in retrieving WebGL, your browser might not support Webgl.");
  }
}

export function getRenderingContext(): WebGL2RenderingContext {
  return renderingContext;
}
