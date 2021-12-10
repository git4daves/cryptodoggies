const doggyidparser = require("./lib/doggyidparser.js");

export function generateDoggyImage(doggyId, size, canvas) {
  size = size || 10;
  var data = doggyidparser(doggyId);
  // var canvas = document.getElementById(canvas);
  canvas.width = size * data.length;
  canvas.height = size * data[1].length;
  var ctx = canvas.getContext("2d");

  for (var i = 0; i < data.length; i++) {
    for (var j = 0; j < data[i].length; j++) {
      var color = data[i][j];
      if (color) {
        ctx.fillStyle = color;
        ctx.fillRect(i * size, j * size, size, size);
      }
    }
  }
  return canvas.toDataURL();
}
