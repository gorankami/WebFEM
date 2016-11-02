function GL() {
  this.context = null;
}

GL.prototype.init = function (canvas) {
  try {
    this.context = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!this.context) {
      alert("Your browser does not support Webgl, the application will not work.");
    }
  } catch (e) {
    alert("Error in retreiving WebGL, your browser might not support Webgl.");
  }
};

module.exports = new GL();
