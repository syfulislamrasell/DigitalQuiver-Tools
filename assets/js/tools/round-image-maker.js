(function () {
  "use strict";
  var fileInput = document.getElementById("rim-file");
  if (!fileInput) return;

  var sizeSlider = document.getElementById("rim-size");
  var sizeVal = document.getElementById("rim-size-val");
  var downloadBtn = document.getElementById("rim-download");
  var canvas = document.getElementById("rim-canvas");
  var ctx = canvas.getContext("2d");

  var img = null;

  function draw() {
    if (!img) return;
    var size = parseInt(sizeSlider.value, 10);
    canvas.width = size;
    canvas.height = size;
    ctx.clearRect(0, 0, size, size);

    ctx.save();
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    var w = img.naturalWidth;
    var h = img.naturalHeight;
    var side = Math.min(w, h);
    var sx = (w - side) / 2;
    var sy = (h - side) / 2;
    ctx.drawImage(img, sx, sy, side, side, 0, 0, size, size);
    ctx.restore();
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

  sizeSlider.addEventListener("input", function () {
    sizeVal.textContent = sizeSlider.value;
    draw();
  });

  downloadBtn.addEventListener("click", function () {
    var link = document.createElement("a");
    link.download = "round-image.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  });
})();
