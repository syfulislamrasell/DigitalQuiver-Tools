(function () {
  "use strict";
  var widget = document.querySelector(".tool-widget[data-target-mime]");
  if (!widget) return;
  var fileInput = document.getElementById("fc-file");
  if (!fileInput) return;

  var targetMime = widget.getAttribute("data-target-mime");
  var targetExt = widget.getAttribute("data-target-ext");
  var qualitySlider = document.getElementById("fc-quality");
  var qualityVal = document.getElementById("fc-quality-val");
  var downloadBtn = document.getElementById("fc-download");
  var errorMsg = document.getElementById("fc-error");
  var canvas = document.getElementById("fc-canvas");
  var ctx = canvas.getContext("2d");

  var img = null;

  function draw() {
    if (!img) return;
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    if (targetMime === "image/jpeg") {
      // JPEG has no alpha channel; flatten transparency onto white first.
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    ctx.drawImage(img, 0, 0);
  }

  fileInput.addEventListener("change", function () {
    var file = fileInput.files[0];
    if (!file) return;
    errorMsg.classList.remove("show");
    var url = URL.createObjectURL(file);
    img = new Image();
    img.onload = function () {
      draw();
      downloadBtn.disabled = false;
      URL.revokeObjectURL(url);
    };
    img.onerror = function () {
      errorMsg.textContent = "Could not read this file as an image.";
      errorMsg.classList.add("show");
      downloadBtn.disabled = true;
    };
    img.src = url;
  });

  if (qualitySlider) {
    qualitySlider.addEventListener("input", function () {
      qualityVal.textContent = qualitySlider.value;
      draw();
    });
  }

  downloadBtn.addEventListener("click", function () {
    var quality = qualitySlider ? parseInt(qualitySlider.value, 10) / 100 : undefined;
    var link = document.createElement("a");
    link.download = "converted." + targetExt;
    link.href = canvas.toDataURL(targetMime, quality);
    link.click();
  });
})();
