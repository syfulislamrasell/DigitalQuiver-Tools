(function () {
  "use strict";
  var fileInput = document.getElementById("att-file");
  if (!fileInput) return;

  var textInput = document.getElementById("att-text");
  var positionSelect = document.getElementById("att-position");
  var sizeSlider = document.getElementById("att-size");
  var sizeVal = document.getElementById("att-size-val");
  var colorInput = document.getElementById("att-color");
  var downloadBtn = document.getElementById("att-download");
  var canvas = document.getElementById("att-canvas");
  var ctx = canvas.getContext("2d");

  var img = null;

  function draw() {
    if (!img) return;
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    ctx.drawImage(img, 0, 0);

    var text = textInput.value;
    if (!text) return;

    var fontSize = parseInt(sizeSlider.value, 10);
    var margin = Math.max(12, fontSize * 0.4);
    ctx.font = "bold " + fontSize + "px sans-serif";

    var pos = positionSelect.value;
    var parts = pos.split("-");
    var vAlign = parts[0];
    var hAlign = parts[1];

    ctx.textBaseline = vAlign === "top" ? "top" : (vAlign === "middle" ? "middle" : "bottom");
    ctx.textAlign = hAlign === "left" ? "left" : (hAlign === "center" ? "center" : "right");

    var x = hAlign === "left" ? margin : (hAlign === "center" ? canvas.width / 2 : canvas.width - margin);
    var y = vAlign === "top" ? margin : (vAlign === "middle" ? canvas.height / 2 : canvas.height - margin);

    ctx.lineWidth = Math.max(2, fontSize * 0.08);
    ctx.strokeStyle = "rgba(0,0,0,0.65)";
    ctx.strokeText(text, x, y);
    ctx.fillStyle = colorInput.value;
    ctx.fillText(text, x, y);
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

  [textInput, positionSelect, colorInput].forEach(function (el) {
    el.addEventListener("input", draw);
  });
  sizeSlider.addEventListener("input", function () {
    sizeVal.textContent = sizeSlider.value;
    draw();
  });

  downloadBtn.addEventListener("click", function () {
    var link = document.createElement("a");
    link.download = "captioned.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  });
})();
