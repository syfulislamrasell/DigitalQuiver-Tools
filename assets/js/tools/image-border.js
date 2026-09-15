(function () {
  "use strict";
  var fileInput = document.getElementById("ibd-file");
  if (!fileInput) return;

  var widthSlider = document.getElementById("ibd-width");
  var widthVal = document.getElementById("ibd-width-val");
  var colorInput = document.getElementById("ibd-color");
  var downloadBtn = document.getElementById("ibd-download");
  var canvas = document.getElementById("ibd-canvas");
  var ctx = canvas.getContext("2d");

  var img = null;

  function draw() {
    if (!img) return;
    var border = parseInt(widthSlider.value, 10);
    canvas.width = img.naturalWidth + border * 2;
    canvas.height = img.naturalHeight + border * 2;
    ctx.fillStyle = colorInput.value;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, border, border);
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

  widthSlider.addEventListener("input", function () {
    widthVal.textContent = widthSlider.value;
    draw();
  });
  colorInput.addEventListener("input", draw);

  downloadBtn.addEventListener("click", function () {
    var link = document.createElement("a");
    link.download = "bordered.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  });
})();
