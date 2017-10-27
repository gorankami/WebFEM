const GLService = {
  context: null,
  init: init
};

function init(canvas) {
  try {
    GLService.context = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!GLService.context) {
      alert("Your browser does not support Webgl, the application will not work.");
    }
  } catch (e) {
    alert("Error in retrieving WebGL, your browser might not support Webgl.");
  }
}

export default GLService;
