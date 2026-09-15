(function () {
  "use strict";
  var baseInput = document.getElementById("adi-base");
  if (!baseInput) return;
  var overlayInput = document.getElementById("adi-overlay");
  var positionSelect = document.getElementById("adi-position");
  var scaleSlider = document.getElementById("adi-scale");
  var scaleVal = document.getElementById("adi-scale-val");
  var opacitySlider = document.getElementById("adi-opacity");
  var opacityVal = document.getElementById("adi-opacity-val");
  var downloadBtn = document.getElementById("adi-download");
  var errorMsg = document.getElementById("adi-error");
  var canvas = document.getElementById("adi-canvas");
  var ctx = canvas.getContext("2d");

  var baseImg = null;
  var overlayImg = null;

  function draw() {
    if (!baseImg) return;
    canvas.width = baseImg.naturalWidth;
    canvas.height = baseImg.naturalHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(baseImg, 0, 0);

    if (!overlayImg) return;
    var scalePct = parseInt(scaleSlider.value, 10) / 100;
    var overlayW = canvas.width * scalePct;
    var overlayH = overlayW * (overlayImg.naturalHeight / overlayImg.naturalWidth);
    var margin = canvas.width * 0.03;

    var pos = positionSelect.value;
    var x, y;
    if (pos === "top-left") { x = margin; y = margin; }
    else if (pos === "top-right") { x = canvas.width - overlayW - margin; y = margin; }
    else if (pos === "bottom-left") { x = margin; y = canvas.height - overlayH - margin; }
    else if (pos === "center") { x = (canvas.width - overlayW) / 2; y = (canvas.height - overlayH) / 2; }
    else { x = canvas.width - overlayW - margin; y = canvas.height - overlayH - margin; }

    ctx.save();
    ctx.globalAlpha = parseInt(opacitySlider.value, 10) / 100;
    ctx.drawImage(overlayImg, x, y, overlayW, overlayH);
    ctx.restore();
  }

  function loadInto(input, setter) {
    input.addEventListener("change", function () {
      var file = input.files[0];
      if (!file) return;
      errorMsg.classList.remove("show");
      var url = URL.createObjectURL(file);
      var img = new Image();
      img.onload = function () {
        setter(img);
        URL.revokeObjectURL(url);
        draw();
        downloadBtn.disabled = !baseImg;
      };
      img.onerror = function () {
        errorMsg.textContent = "Could not read one of the chosen files as an image.";
        errorMsg.classList.add("show");
      };
      img.src = url;
    });
  }

  loadInto(baseInput, function (img) { baseImg = img; });
  loadInto(overlayInput, function (img) { overlayImg = img; });

  [positionSelect].forEach(function (el) { el.addEventListener("change", draw); });
  scaleSlider.addEventListener("input", function () {
    scaleVal.textContent = scaleSlider.value;
    draw();
  });
  opacitySlider.addEventListener("input", function () {
    opacityVal.textContent = opacitySlider.value;
    draw();
  });

  downloadBtn.addEventListener("click", function () {
    var link = document.createElement("a");
    link.download = "combined-overlay.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  });
})();
