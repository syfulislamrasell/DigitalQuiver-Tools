(function () {
  "use strict";
  var fileInput = document.getElementById("ic-file");
  if (!fileInput) return;

  var formatSelect = document.getElementById("ic-format");
  var qualitySlider = document.getElementById("ic-quality");
  var qualityVal = document.getElementById("ic-quality-val");
  var compressBtn = document.getElementById("ic-compress");
  var downloadBtn = document.getElementById("ic-download");
  var errorMsg = document.getElementById("ic-error");
  var canvas = document.getElementById("ic-canvas");
  var ctx = canvas.getContext("2d");
  var originalSizeEl = document.getElementById("ic-original-size");
  var newSizeEl = document.getElementById("ic-new-size");
  var savingsEl = document.getElementById("ic-savings");

  var img = null;
  var originalSize = 0;
  var resultBlob = null;

  qualitySlider.addEventListener("input", function () {
    qualityVal.textContent = qualitySlider.value;
  });

  fileInput.addEventListener("change", function () {
    var file = fileInput.files[0];
    if (!file) return;
    errorMsg.classList.remove("show");
    originalSize = file.size;
    originalSizeEl.textContent = window.DQFormatBytes(originalSize);
    newSizeEl.textContent = "—";
    savingsEl.textContent = "—";
    downloadBtn.disabled = true;

    var url = URL.createObjectURL(file);
    img = new Image();
    img.onload = function () {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      ctx.drawImage(img, 0, 0);
      compressBtn.disabled = false;
      URL.revokeObjectURL(url);
    };
    img.onerror = function () {
      errorMsg.textContent = "Couldn't load that file as an image.";
      errorMsg.classList.add("show");
    };
    img.src = url;
  });

  compressBtn.addEventListener("click", function () {
    if (!img) return;
    var quality = parseInt(qualitySlider.value, 10) / 100;
    canvas.toBlob(function (blob) {
      if (!blob) {
        errorMsg.textContent = "Compression failed. Try a different format.";
        errorMsg.classList.add("show");
        return;
      }
      resultBlob = blob;
      newSizeEl.textContent = window.DQFormatBytes(blob.size);
      var reduction = originalSize > 0 ? Math.round((1 - blob.size / originalSize) * 100) : 0;
      savingsEl.textContent = (reduction >= 0 ? reduction : 0) + "%";
      downloadBtn.disabled = false;
    }, formatSelect.value, quality);
  });

  downloadBtn.addEventListener("click", function () {
    if (!resultBlob) return;
    var ext = formatSelect.value === "image/webp" ? "webp" : "jpg";
    var link = document.createElement("a");
    link.download = "compressed." + ext;
    link.href = URL.createObjectURL(resultBlob);
    link.click();
  });
})();
