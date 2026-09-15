(function () {
  "use strict";
  var fileInput = document.getElementById("px-file");
  if (!fileInput) return;

  var sizeSlider = document.getElementById("px-size");
  var sizeVal = document.getElementById("px-size-val");
  var downloadBtn = document.getElementById("px-download");
  var canvas = document.getElementById("px-canvas");
  var ctx = canvas.getContext("2d");

  var tmpCanvas = document.createElement("canvas");
  var tmpCtx = tmpCanvas.getContext("2d");

  var img = null;

  function draw() {
    if (!img) return;
    var w = img.naturalWidth;
    var h = img.naturalHeight;
    canvas.width = w;
    canvas.height = h;

    var block = parseInt(sizeSlider.value, 10);
    var smallW = Math.max(1, Math.round(w / block));
    var smallH = Math.max(1, Math.round(h / block));

    tmpCanvas.width = smallW;
    tmpCanvas.height = smallH;
    tmpCtx.imageSmoothingEnabled = true;
    tmpCtx.clearRect(0, 0, smallW, smallH);
    tmpCtx.drawImage(img, 0, 0, smallW, smallH);

    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(tmpCanvas, 0, 0, smallW, smallH, 0, 0, w, h);
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
    link.download = "pixelated.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  });
})();
