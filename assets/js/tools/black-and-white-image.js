(function () {
  "use strict";
  var fileInput = document.getElementById("bw-file");
  if (!fileInput) return;

  var intensitySlider = document.getElementById("bw-intensity");
  var intensityVal = document.getElementById("bw-intensity-val");
  var downloadBtn = document.getElementById("bw-download");
  var canvas = document.getElementById("bw-canvas");
  var ctx = canvas.getContext("2d");

  var img = null;

  function draw() {
    if (!img) return;
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    ctx.drawImage(img, 0, 0);

    var amount = parseInt(intensitySlider.value, 10) / 100;
    if (amount <= 0) return;

    var frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
    var data = frame.data;
    for (var i = 0; i < data.length; i += 4) {
      var r = data[i], g = data[i + 1], b = data[i + 2];
      var gray = 0.299 * r + 0.587 * g + 0.114 * b;
      data[i] = r + (gray - r) * amount;
      data[i + 1] = g + (gray - g) * amount;
      data[i + 2] = b + (gray - b) * amount;
    }
    ctx.putImageData(frame, 0, 0);
  }

  fileInput.addEventListener("change", function () {
    var file = fileInput.files[0];
    if (!file) return;
    var url = URL.createObjectURL(file);
    img = new Image();
    img.onload = function () {
      draw();
      downloadBtn.disabled = false;
      URL.revokeObjectURL(url);
    };
    img.src = url;
  });

  intensitySlider.addEventListener("input", function () {
    intensityVal.textContent = intensitySlider.value;
    draw();
  });

  downloadBtn.addEventListener("click", function () {
    var link = document.createElement("a");
    link.download = "black-and-white.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  });
})();
